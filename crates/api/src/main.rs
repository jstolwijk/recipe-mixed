use std::{
    collections::HashMap,
    env,
    io::{Read, Write},
    net::{SocketAddr, TcpStream},
    path::Path,
    sync::{Arc, Mutex},
    time::Duration,
};

use anyhow::{Context, Result};
use axum::{
    extract::{Path as AxumPath, State},
    http::{HeaderValue, StatusCode},
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use chrono::Utc;
use reqwest::Client;
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use thiserror::Error;
use tokio::net::TcpListener;
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use uuid::Uuid;

#[derive(Clone)]
struct AppState {
    config: AppConfig,
    http: Client,
    storage: Storage,
}

#[derive(Clone)]
struct Storage {
    conn: Arc<Mutex<Connection>>,
}

#[derive(Clone, Debug, PartialEq, Eq)]
struct AppConfig {
    host: String,
    port: u16,
    database_path: String,
    openrouter_base_url: String,
    openrouter_api_key: Option<String>,
    openrouter_model: String,
    public_app_origin: String,
}

#[derive(Serialize)]
struct HealthResponse {
    status: &'static str,
    service: &'static str,
    database_path: String,
    openrouter_configured: bool,
}

#[derive(Debug, Error)]
enum ApiError {
    #[error("{0}")]
    BadRequest(String),
    #[error("{0}")]
    NotFound(String),
    #[error("{0}")]
    ImportFailed(String),
    #[error("{0}")]
    Storage(String),
}

#[derive(Serialize)]
struct ErrorResponse {
    error: String,
    fallback: Option<String>,
}

#[derive(Debug, Deserialize)]
struct ParseRecipeRequest {
    title: Option<String>,
    text: String,
    source_url: Option<String>,
}

#[derive(Debug, Deserialize)]
struct ImportRecipeRequest {
    url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct RecipeSource {
    kind: String,
    url: Option<String>,
    attribution: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct NormalizedRecipe {
    title: Option<String>,
    ingredients: Vec<String>,
    steps: Vec<String>,
    servings: Option<String>,
    time: Option<String>,
    source: RecipeSource,
    notes: Vec<String>,
    raw_text: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct RemixSettings {
    direction: String,
    diet: Option<String>,
    time_limit_minutes: Option<u16>,
    difficulty: Option<String>,
    spice_level: Option<String>,
    pantry_ingredients: Vec<String>,
}

#[derive(Debug, Deserialize)]
struct GenerateRemixRequest {
    recipe: NormalizedRecipe,
    settings: RemixSettings,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct RemixedRecipe {
    title: String,
    servings: Option<String>,
    time: Option<String>,
    ingredients: Vec<String>,
    steps: Vec<String>,
    notes: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct ChangeItem {
    label: String,
    target: String,
    summary: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct SanityWarning {
    severity: String,
    message: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct SharePayload {
    title: String,
    source_url: Option<String>,
    direction: String,
    copy_text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct RemixResponse {
    recipe: NormalizedRecipe,
    settings: RemixSettings,
    remix: RemixedRecipe,
    changes: Vec<ChangeItem>,
    sanity_warnings: Vec<SanityWarning>,
    why_this_works: String,
    copy_text: String,
    share_payload: SharePayload,
}

#[derive(Debug, Deserialize)]
struct SaveRemixRequest {
    name: Option<String>,
    remix: RemixResponse,
}

#[derive(Debug, Serialize, Deserialize)]
struct SavedRemix {
    id: String,
    name: String,
    source_title: Option<String>,
    direction: String,
    created_at: String,
    payload: RemixResponse,
}

#[derive(Debug, Deserialize)]
struct CopyPayloadRequest {
    remix: RemixResponse,
}

#[derive(Serialize)]
struct RemixDirection {
    id: &'static str,
    label: &'static str,
    description: &'static str,
}

impl AppConfig {
    fn from_env() -> Result<Self> {
        Self::from_vars(env::vars().collect())
    }

    fn from_vars(vars: HashMap<String, String>) -> Result<Self> {
        let host = vars
            .get("API_HOST")
            .cloned()
            .unwrap_or_else(|| "0.0.0.0".to_string());
        let port = vars
            .get("API_PORT")
            .map(String::as_str)
            .unwrap_or("8080")
            .parse::<u16>()
            .context("API_PORT must be a valid u16 port")?;
        let database_path = vars
            .get("RECIPE_MIXER_DB_PATH")
            .cloned()
            .unwrap_or_else(|| "/data/recipe-mixer.sqlite".to_string());
        let openrouter_base_url = vars
            .get("OPENROUTER_BASE_URL")
            .cloned()
            .unwrap_or_else(|| "https://openrouter.ai/api/v1".to_string());
        let openrouter_api_key = vars
            .get("OPENROUTER_API_KEY")
            .map(|value| value.trim().to_string())
            .filter(|value| !value.is_empty());
        let openrouter_model = vars
            .get("OPENROUTER_MODEL")
            .cloned()
            .unwrap_or_else(|| "openai/gpt-4o-mini".to_string());
        let public_app_origin = vars
            .get("PUBLIC_APP_ORIGIN")
            .cloned()
            .unwrap_or_else(|| "http://localhost:8080".to_string());

        Ok(Self {
            host,
            port,
            database_path,
            openrouter_base_url,
            openrouter_api_key,
            openrouter_model,
            public_app_origin,
        })
    }

    fn socket_addr(&self) -> Result<SocketAddr> {
        format!("{}:{}", self.host, self.port)
            .parse()
            .context("API_HOST/API_PORT must form a valid socket address")
    }

    fn openrouter_configured(&self) -> bool {
        self.openrouter_api_key.is_some()
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, fallback) = match self {
            ApiError::BadRequest(_) => (StatusCode::BAD_REQUEST, None),
            ApiError::NotFound(_) => (StatusCode::NOT_FOUND, None),
            ApiError::ImportFailed(_) => (
                StatusCode::UNPROCESSABLE_ENTITY,
                Some(
                    "Paste the recipe text manually and keep the source URL for attribution."
                        .to_string(),
                ),
            ),
            ApiError::Storage(_) => (StatusCode::INTERNAL_SERVER_ERROR, None),
        };

        (
            status,
            Json(ErrorResponse {
                error: self.to_string(),
                fallback,
            }),
        )
            .into_response()
    }
}

impl Storage {
    fn open(path: &str) -> Result<Self> {
        if let Some(parent) = Path::new(path).parent() {
            std::fs::create_dir_all(parent).with_context(|| {
                format!("failed to create database directory {}", parent.display())
            })?;
        }

        let conn =
            Connection::open(path).with_context(|| format!("failed to open SQLite at {path}"))?;
        conn.pragma_update(None, "journal_mode", "WAL")?;
        conn.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS saved_remixes (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                source_title TEXT,
                direction TEXT NOT NULL,
                created_at TEXT NOT NULL,
                payload_json TEXT NOT NULL
            );
            ",
        )?;

        Ok(Self {
            conn: Arc::new(Mutex::new(conn)),
        })
    }

    fn save_remix(&self, request: SaveRemixRequest) -> Result<SavedRemix, ApiError> {
        let id = Uuid::new_v4().to_string();
        let created_at = Utc::now().to_rfc3339();
        let source_title = request.remix.recipe.title.clone();
        let direction = request.remix.settings.direction.clone();
        let name = request.name.unwrap_or_else(|| {
            let title = source_title
                .clone()
                .unwrap_or_else(|| "Untitled recipe".to_string());
            format!("{title} - {direction}")
        });
        let payload_json = serde_json::to_string(&request.remix)
            .map_err(|err| ApiError::Storage(format!("failed to encode remix: {err}")))?;

        self.conn
            .lock()
            .map_err(|_| ApiError::Storage("database lock poisoned".to_string()))?
            .execute(
                "INSERT INTO saved_remixes (id, name, source_title, direction, created_at, payload_json)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
                params![id, name, source_title, direction, created_at, payload_json],
            )
            .map_err(|err| ApiError::Storage(format!("failed to save remix: {err}")))?;

        Ok(SavedRemix {
            id,
            name,
            source_title,
            direction,
            created_at,
            payload: request.remix,
        })
    }

    fn list_remixes(&self) -> Result<Vec<SavedRemix>, ApiError> {
        let conn = self
            .conn
            .lock()
            .map_err(|_| ApiError::Storage("database lock poisoned".to_string()))?;
        let mut stmt = conn
            .prepare(
                "SELECT id, name, source_title, direction, created_at, payload_json
                 FROM saved_remixes
                 ORDER BY created_at DESC",
            )
            .map_err(|err| ApiError::Storage(format!("failed to list remixes: {err}")))?;
        let rows = stmt
            .query_map([], row_to_saved_remix)
            .map_err(|err| ApiError::Storage(format!("failed to query remixes: {err}")))?;

        rows.collect::<rusqlite::Result<Vec<_>>>()
            .map_err(|err| ApiError::Storage(format!("failed to decode saved remix: {err}")))
    }

    fn get_remix(&self, id: &str) -> Result<SavedRemix, ApiError> {
        let conn = self
            .conn
            .lock()
            .map_err(|_| ApiError::Storage("database lock poisoned".to_string()))?;

        conn.query_row(
            "SELECT id, name, source_title, direction, created_at, payload_json
             FROM saved_remixes
             WHERE id = ?1",
            params![id],
            row_to_saved_remix,
        )
        .map_err(|err| match err {
            rusqlite::Error::QueryReturnedNoRows => {
                ApiError::NotFound(format!("saved remix {id} not found"))
            }
            other => ApiError::Storage(format!("failed to load saved remix: {other}")),
        })
    }
}

fn row_to_saved_remix(row: &rusqlite::Row<'_>) -> rusqlite::Result<SavedRemix> {
    let payload_json: String = row.get(5)?;
    let payload = serde_json::from_str(&payload_json).map_err(|err| {
        rusqlite::Error::FromSqlConversionFailure(5, rusqlite::types::Type::Text, Box::new(err))
    })?;

    Ok(SavedRemix {
        id: row.get(0)?,
        name: row.get(1)?,
        source_title: row.get(2)?,
        direction: row.get(3)?,
        created_at: row.get(4)?,
        payload,
    })
}

fn app(config: AppConfig) -> Result<Router> {
    let origin = config
        .public_app_origin
        .parse::<HeaderValue>()
        .expect("PUBLIC_APP_ORIGIN must be a valid HTTP header value");
    let storage = Storage::open(&config.database_path)?;

    Ok(Router::new()
        .route("/healthz", get(health))
        .route("/api/healthz", get(health))
        .route("/api/remix-directions", get(remix_directions))
        .route("/api/recipes/parse", post(parse_recipe))
        .route("/api/recipes/import", post(import_recipe))
        .route("/api/remixes", post(generate_remix))
        .route("/api/remixes/copy-payload", post(copy_payload))
        .route("/api/remixes/save", post(save_remix))
        .route("/api/remixes/saved", get(list_saved_remixes))
        .route("/api/remixes/saved/:id", get(get_saved_remix))
        .route("/api/share/:id", get(get_share_payload))
        .layer(CorsLayer::new().allow_origin(origin))
        .layer(TraceLayer::new_for_http())
        .with_state(AppState {
            config,
            http: Client::new(),
            storage,
        }))
}

async fn health(State(state): State<AppState>) -> impl IntoResponse {
    Json(HealthResponse {
        status: "ok",
        service: "recipe-mixer-api",
        database_path: state.config.database_path.clone(),
        openrouter_configured: state.config.openrouter_configured(),
    })
}

async fn remix_directions() -> Json<Vec<RemixDirection>> {
    Json(vec![
        RemixDirection {
            id: "chinese-inspired",
            label: "Chinese-inspired",
            description: "Adds soy, ginger, scallion, sesame, and wok-friendly technique cues.",
        },
        RemixDirection {
            id: "french-inspired",
            label: "French-inspired",
            description: "Leans on herbs, butter, wine or stock, and calmer bistro-style finish.",
        },
        RemixDirection {
            id: "mexican-inspired",
            label: "Mexican-inspired",
            description:
                "Uses lime, chile, cilantro, cumin, beans, corn, or tortilla-friendly ideas.",
        },
        RemixDirection {
            id: "vegetarian",
            label: "Vegetarian",
            description: "Moves meat to legumes, mushrooms, eggs, dairy, tofu, or vegetables.",
        },
        RemixDirection {
            id: "weeknight",
            label: "Weeknight",
            description: "Shortens prep, reduces active steps, and favors pantry ingredients.",
        },
        RemixDirection {
            id: "pantry-friendly",
            label: "Pantry-friendly",
            description: "Keeps swaps practical with common shelf-stable ingredients.",
        },
    ])
}

async fn parse_recipe(
    Json(request): Json<ParseRecipeRequest>,
) -> Result<Json<NormalizedRecipe>, ApiError> {
    if request.text.trim().is_empty() {
        return Err(ApiError::BadRequest("recipe text is required".to_string()));
    }

    Ok(Json(parse_recipe_text(
        request.title,
        &request.text,
        source_for_text(request.source_url),
    )))
}

async fn import_recipe(
    State(state): State<AppState>,
    Json(request): Json<ImportRecipeRequest>,
) -> Result<Json<NormalizedRecipe>, ApiError> {
    if !(request.url.starts_with("https://") || request.url.starts_with("http://")) {
        return Err(ApiError::BadRequest(
            "url must start with http:// or https://".to_string(),
        ));
    }

    let html = state
        .http
        .get(&request.url)
        .timeout(Duration::from_secs(8))
        .send()
        .await
        .map_err(|err| ApiError::ImportFailed(format!("failed to fetch recipe URL: {err}")))?
        .error_for_status()
        .map_err(|err| ApiError::ImportFailed(format!("recipe URL returned an error: {err}")))?
        .text()
        .await
        .map_err(|err| ApiError::ImportFailed(format!("failed to read recipe page: {err}")))?;

    extract_json_ld_recipe(&html, &request.url)
        .ok_or_else(|| {
            ApiError::ImportFailed("no supported JSON-LD Recipe metadata found at URL".to_string())
        })
        .map(Json)
}

async fn generate_remix(
    State(state): State<AppState>,
    Json(request): Json<GenerateRemixRequest>,
) -> Result<Json<RemixResponse>, ApiError> {
    validate_recipe_for_remix(&request.recipe)?;

    if let Some(remix) = openrouter_remix(&state, &request).await {
        return Ok(Json(remix));
    }

    Ok(Json(deterministic_remix(
        request.recipe,
        request.settings,
        "Deterministic fallback used because OpenRouter is not configured or did not return valid JSON.",
    )))
}

async fn copy_payload(Json(request): Json<CopyPayloadRequest>) -> Json<SharePayload> {
    Json(request.remix.share_payload)
}

async fn save_remix(
    State(state): State<AppState>,
    Json(request): Json<SaveRemixRequest>,
) -> Result<Json<SavedRemix>, ApiError> {
    Ok(Json(state.storage.save_remix(request)?))
}

async fn list_saved_remixes(
    State(state): State<AppState>,
) -> Result<Json<Vec<SavedRemix>>, ApiError> {
    Ok(Json(state.storage.list_remixes()?))
}

async fn get_saved_remix(
    State(state): State<AppState>,
    AxumPath(id): AxumPath<String>,
) -> Result<Json<SavedRemix>, ApiError> {
    Ok(Json(state.storage.get_remix(&id)?))
}

async fn get_share_payload(
    State(state): State<AppState>,
    AxumPath(id): AxumPath<String>,
) -> Result<Json<SharePayload>, ApiError> {
    Ok(Json(state.storage.get_remix(&id)?.payload.share_payload))
}

#[tokio::main]
async fn main() -> Result<()> {
    if env::args().any(|arg| arg == "--healthcheck") {
        run_healthcheck(&AppConfig::from_env()?)?;
        return Ok(());
    }

    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::from_default_env())
        .with(tracing_subscriber::fmt::layer())
        .init();

    let config = AppConfig::from_env()?;
    let addr = config.socket_addr()?;
    let listener = TcpListener::bind(addr)
        .await
        .with_context(|| format!("failed to bind API listener at {addr}"))?;

    tracing::info!(%addr, "recipe mixer API listening");

    axum::serve(listener, app(config)?)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .context("API server failed")
}

fn validate_recipe_for_remix(recipe: &NormalizedRecipe) -> Result<(), ApiError> {
    if recipe.ingredients.is_empty() {
        return Err(ApiError::BadRequest(
            "recipe needs at least one ingredient before remixing".to_string(),
        ));
    }
    if recipe.steps.is_empty() {
        return Err(ApiError::BadRequest(
            "recipe needs at least one step before remixing".to_string(),
        ));
    }
    Ok(())
}

async fn openrouter_remix(
    state: &AppState,
    request: &GenerateRemixRequest,
) -> Option<RemixResponse> {
    let api_key = state.config.openrouter_api_key.as_ref()?;
    let url = format!(
        "{}/chat/completions",
        state.config.openrouter_base_url.trim_end_matches('/')
    );
    let body = json!({
        "model": state.config.openrouter_model,
        "messages": [
            {
                "role": "system",
                "content": "Return only JSON matching this shape: {\"title\":\"\",\"servings\":null,\"time\":null,\"ingredients\":[\"\"],\"steps\":[\"\"],\"notes\":[\"\"]}. Use inspired language, keep recipe cookable, explain tradeoffs in notes."
            },
            {
                "role": "user",
                "content": format!(
                    "Remix this recipe as {}. Constraints: diet={:?}, time_limit_minutes={:?}, difficulty={:?}, spice_level={:?}, pantry={:?}. Recipe JSON: {}",
                    request.settings.direction,
                    request.settings.diet,
                    request.settings.time_limit_minutes,
                    request.settings.difficulty,
                    request.settings.spice_level,
                    request.settings.pantry_ingredients,
                    serde_json::to_string(&request.recipe).ok()?
                )
            }
        ],
        "temperature": 0.4
    });

    let response: Value = state
        .http
        .post(url)
        .bearer_auth(api_key)
        .json(&body)
        .send()
        .await
        .ok()?
        .error_for_status()
        .ok()?
        .json()
        .await
        .ok()?;
    let content = response
        .pointer("/choices/0/message/content")
        .and_then(Value::as_str)?;
    let recipe: RemixedRecipe = serde_json::from_str(content.trim()).ok()?;

    Some(build_remix_response(
        request.recipe.clone(),
        request.settings.clone(),
        recipe,
        "OpenRouter generated this remix with deterministic change labeling and sanity checks.",
    ))
}

fn deterministic_remix(
    recipe: NormalizedRecipe,
    settings: RemixSettings,
    generation_note: &str,
) -> RemixResponse {
    let direction = settings.direction.to_lowercase();
    let profile = flavor_profile(&direction);
    let source_title = recipe
        .title
        .clone()
        .unwrap_or_else(|| "Untitled recipe".to_string());
    let mut ingredients = recipe.ingredients.clone();
    ingredients.extend(profile.ingredients.iter().map(|item| item.to_string()));

    if let Some(diet) = &settings.diet {
        if diet.to_lowercase().contains("vegetarian") {
            ingredients.push(
                "Swap meat for mushrooms, beans, lentils, tofu, eggs, or dairy as suitable."
                    .to_string(),
            );
        }
    }
    for pantry_item in &settings.pantry_ingredients {
        if !pantry_item.trim().is_empty() {
            ingredients.push(format!("Use pantry item: {}", pantry_item.trim()));
        }
    }

    let mut steps = recipe.steps.clone();
    steps.insert(
        0,
        format!(
            "Set up the {} flavor base: {}.",
            profile.label, profile.technique
        ),
    );
    steps.push(format!(
        "Taste and adjust with {} before serving.",
        profile.finish
    ));
    if let Some(limit) = settings.time_limit_minutes {
        steps.push(format!(
            "If aiming for {limit} minutes, prep ingredients before heating and simplify garnish first."
        ));
    }

    let mut notes = vec![
        generation_note.to_string(),
        format!(
            "This is {} rather than a claim of cultural authenticity.",
            profile.label
        ),
    ];
    if let Some(difficulty) = &settings.difficulty {
        notes.push(format!("Difficulty target: {difficulty}."));
    }

    let remix = RemixedRecipe {
        title: format!("{source_title} ({})", profile.label),
        servings: recipe.servings.clone(),
        time: settings
            .time_limit_minutes
            .map(|minutes| format!("{minutes} minutes"))
            .or_else(|| recipe.time.clone()),
        ingredients,
        steps,
        notes,
    };

    build_remix_response(recipe, settings, remix, generation_note)
}

fn build_remix_response(
    recipe: NormalizedRecipe,
    settings: RemixSettings,
    remix: RemixedRecipe,
    why_this_works: &str,
) -> RemixResponse {
    let changes = summarize_changes(&recipe, &settings, &remix);
    let sanity_warnings = sanity_check(&recipe, &remix);
    let copy_text = format_copy_text(&recipe, &settings, &remix, &changes, &sanity_warnings);
    let share_payload = SharePayload {
        title: remix.title.clone(),
        source_url: recipe.source.url.clone(),
        direction: settings.direction.clone(),
        copy_text: copy_text.clone(),
    };

    RemixResponse {
        recipe,
        settings,
        remix,
        changes,
        sanity_warnings,
        why_this_works: why_this_works.to_string(),
        copy_text,
        share_payload,
    }
}

struct FlavorProfile {
    label: &'static str,
    ingredients: &'static [&'static str],
    technique: &'static str,
    finish: &'static str,
}

fn flavor_profile(direction: &str) -> FlavorProfile {
    if direction.contains("chinese") {
        FlavorProfile {
            label: "Chinese-inspired",
            ingredients: &[
                "soy sauce",
                "fresh ginger",
                "scallions",
                "toasted sesame oil",
            ],
            technique: "bloom ginger and scallion in hot oil before adding the main ingredients",
            finish: "soy sauce, sesame oil, and a small splash of vinegar",
        }
    } else if direction.contains("french") {
        FlavorProfile {
            label: "French-inspired",
            ingredients: &[
                "butter",
                "thyme",
                "shallot",
                "stock or a splash of white wine",
            ],
            technique: "soften shallot in butter, then build a light pan sauce",
            finish: "fresh herbs, butter, and black pepper",
        }
    } else if direction.contains("mexican") {
        FlavorProfile {
            label: "Mexican-inspired",
            ingredients: &["lime", "cilantro", "cumin", "mild chile"],
            technique: "toast spices briefly, then brighten the finished dish with lime",
            finish: "lime juice, cilantro, and chile to taste",
        }
    } else if direction.contains("vegetarian") {
        FlavorProfile {
            label: "Vegetarian",
            ingredients: &["mushrooms or beans", "olive oil", "lemon", "fresh herbs"],
            technique: "brown vegetables well so the dish keeps savory depth",
            finish: "lemon and herbs",
        }
    } else if direction.contains("pantry") {
        FlavorProfile {
            label: "Pantry-friendly",
            ingredients: &["canned beans", "dried herbs", "olive oil", "vinegar"],
            technique: "use shelf-stable ingredients first and keep fresh garnishes optional",
            finish: "vinegar, oil, and dried herbs",
        }
    } else {
        FlavorProfile {
            label: "Weeknight",
            ingredients: &["olive oil", "garlic", "lemon", "quick-cooking vegetables"],
            technique: "combine prep steps and use one pan where possible",
            finish: "lemon and salt",
        }
    }
}

fn summarize_changes(
    recipe: &NormalizedRecipe,
    settings: &RemixSettings,
    remix: &RemixedRecipe,
) -> Vec<ChangeItem> {
    let mut changes = vec![
        ChangeItem {
            label: "changed".to_string(),
            target: "flavor direction".to_string(),
            summary: format!(
                "Moved the recipe toward {} using inspired wording and practical flavor cues.",
                settings.direction
            ),
        },
        ChangeItem {
            label: "added".to_string(),
            target: "ingredients".to_string(),
            summary: format!(
                "Added {} supporting ingredients or swap notes.",
                remix
                    .ingredients
                    .len()
                    .saturating_sub(recipe.ingredients.len())
            ),
        },
        ChangeItem {
            label: "changed".to_string(),
            target: "technique".to_string(),
            summary: "Added a flavor-base step and a final taste-and-adjust step.".to_string(),
        },
    ];

    if remix.servings == recipe.servings {
        changes.push(ChangeItem {
            label: "kept".to_string(),
            target: "servings".to_string(),
            summary: "Kept original serving count where available.".to_string(),
        });
    }
    if settings.time_limit_minutes.is_some() {
        changes.push(ChangeItem {
            label: "changed".to_string(),
            target: "timing".to_string(),
            summary: "Included a time-limit note instead of silently promising exact timing."
                .to_string(),
        });
    }

    changes
}

fn sanity_check(original: &NormalizedRecipe, remix: &RemixedRecipe) -> Vec<SanityWarning> {
    let mut warnings = Vec::new();
    if remix.ingredients.is_empty() {
        warnings.push(SanityWarning {
            severity: "warning".to_string(),
            message: "Remix has no ingredients, so it is not cookable yet.".to_string(),
        });
    }
    if remix.steps.is_empty() {
        warnings.push(SanityWarning {
            severity: "warning".to_string(),
            message: "Remix has no steps, so cooking order is missing.".to_string(),
        });
    }
    if remix.servings.is_none() {
        warnings.push(SanityWarning {
            severity: "note".to_string(),
            message: "Serving count is missing; portions may need adjustment.".to_string(),
        });
    }
    if remix.time.is_none() {
        warnings.push(SanityWarning {
            severity: "note".to_string(),
            message: "Timing is missing; watch doneness instead of relying on a clock.".to_string(),
        });
    }
    if original.ingredients.len() > 2 && remix.ingredients.len() < original.ingredients.len() / 2 {
        warnings.push(SanityWarning {
            severity: "warning".to_string(),
            message: "Remix has far fewer ingredients than the source; check that core components were not lost.".to_string(),
        });
    }
    if !remix
        .steps
        .iter()
        .any(|step| step.to_lowercase().contains("taste"))
    {
        warnings.push(SanityWarning {
            severity: "note".to_string(),
            message: "No taste-and-adjust step found; seasoning may need careful checking."
                .to_string(),
        });
    }

    warnings
}

fn format_copy_text(
    recipe: &NormalizedRecipe,
    settings: &RemixSettings,
    remix: &RemixedRecipe,
    changes: &[ChangeItem],
    warnings: &[SanityWarning],
) -> String {
    let mut text = String::new();
    push_line(&mut text, &remix.title);
    push_line(&mut text, "");
    if let Some(servings) = &remix.servings {
        push_line(&mut text, &format!("Servings: {servings}"));
    }
    if let Some(time) = &remix.time {
        push_line(&mut text, &format!("Time: {time}"));
    }
    push_line(&mut text, &format!("Direction: {}", settings.direction));
    if let Some(source) = &recipe.source.url {
        push_line(&mut text, &format!("Source: {source}"));
    }
    push_line(&mut text, "");
    push_line(&mut text, "Ingredients:");
    for ingredient in &remix.ingredients {
        push_line(&mut text, &format!("- {ingredient}"));
    }
    push_line(&mut text, "");
    push_line(&mut text, "Steps:");
    for (index, step) in remix.steps.iter().enumerate() {
        push_line(&mut text, &format!("{}. {step}", index + 1));
    }
    if !remix.notes.is_empty() {
        push_line(&mut text, "");
        push_line(&mut text, "Notes:");
        for note in &remix.notes {
            push_line(&mut text, &format!("- {note}"));
        }
    }
    if !changes.is_empty() {
        push_line(&mut text, "");
        push_line(&mut text, "What changed:");
        for change in changes {
            push_line(
                &mut text,
                &format!("- {} {}: {}", change.label, change.target, change.summary),
            );
        }
    }
    if !warnings.is_empty() {
        push_line(&mut text, "");
        push_line(&mut text, "Cooking checks:");
        for warning in warnings {
            push_line(
                &mut text,
                &format!("- {}: {}", warning.severity, warning.message),
            );
        }
    }

    text
}

fn push_line(text: &mut String, line: &str) {
    text.push_str(line);
    text.push('\n');
}

fn source_for_text(source_url: Option<String>) -> RecipeSource {
    RecipeSource {
        kind: if source_url.is_some() { "url" } else { "text" }.to_string(),
        url: source_url,
        attribution: None,
    }
}

fn parse_recipe_text(title: Option<String>, text: &str, source: RecipeSource) -> NormalizedRecipe {
    let lines: Vec<String> = text
        .lines()
        .map(str::trim)
        .filter(|line| !line.is_empty())
        .map(clean_list_marker)
        .collect();
    let inferred_title = title.or_else(|| lines.first().cloned());
    let mut ingredients = Vec::new();
    let mut steps = Vec::new();
    let mut mode = "";
    let mut servings = None;
    let mut time = None;

    for line in &lines {
        let lower = line.to_lowercase();
        if lower.starts_with("servings") || lower.starts_with("yield") {
            servings = Some(line.clone());
            continue;
        }
        if lower.starts_with("time") || lower.contains("minutes") || lower.contains("hours") {
            time.get_or_insert_with(|| line.clone());
        }
        if lower.contains("ingredient") {
            mode = "ingredients";
            continue;
        }
        if lower.contains("instruction") || lower.contains("method") || lower.contains("step") {
            mode = "steps";
            continue;
        }
        if Some(line) == inferred_title.as_ref() {
            continue;
        }
        match mode {
            "ingredients" => ingredients.push(line.clone()),
            "steps" => steps.push(line.clone()),
            _ if looks_like_step(line) => steps.push(line.clone()),
            _ if looks_like_ingredient(line) => ingredients.push(line.clone()),
            _ => {}
        }
    }

    if ingredients.is_empty() {
        ingredients = lines
            .iter()
            .filter(|line| looks_like_ingredient(line))
            .cloned()
            .collect();
    }
    if steps.is_empty() {
        steps = lines
            .iter()
            .filter(|line| looks_like_step(line))
            .cloned()
            .collect();
    }

    let mut notes = Vec::new();
    if ingredients.is_empty() {
        notes.push(
            "No ingredient list was detected; paste or edit ingredients before remixing."
                .to_string(),
        );
    }
    if steps.is_empty() {
        notes.push(
            "No cooking steps were detected; paste or edit steps before remixing.".to_string(),
        );
    }

    NormalizedRecipe {
        title: inferred_title,
        ingredients,
        steps,
        servings,
        time,
        source,
        notes,
        raw_text: Some(text.to_string()),
    }
}

fn clean_list_marker(line: &str) -> String {
    line.trim_start_matches(|c: char| {
        c == '-' || c == '*' || c == '•' || c.is_ascii_digit() || c == '.' || c == ')'
    })
    .trim()
    .to_string()
}

fn looks_like_ingredient(line: &str) -> bool {
    let lower = line.to_lowercase();
    lower.contains(" cup")
        || lower.contains(" tbsp")
        || lower.contains(" tsp")
        || lower.contains(" gram")
        || lower.contains(" ounce")
        || lower.contains(" lb")
        || lower.contains(" clove")
        || lower.contains("can ")
        || lower.starts_with("salt")
}

fn looks_like_step(line: &str) -> bool {
    let lower = line.to_lowercase();
    [
        "bake", "boil", "cook", "stir", "mix", "heat", "serve", "add", "chop", "simmer", "roast",
        "season", "whisk",
    ]
    .iter()
    .any(|verb| lower.starts_with(verb))
}

fn extract_json_ld_recipe(html: &str, url: &str) -> Option<NormalizedRecipe> {
    for script in json_ld_blocks(html) {
        let value: Value = serde_json::from_str(&script).ok()?;
        if let Some(recipe) = find_recipe_value(&value) {
            return recipe_from_json_ld(recipe, url);
        }
    }

    None
}

fn json_ld_blocks(html: &str) -> Vec<String> {
    let mut blocks = Vec::new();
    let mut rest = html;

    while let Some(script_start) = rest.to_lowercase().find("<script") {
        rest = &rest[script_start..];
        let Some(tag_end) = rest.find('>') else {
            break;
        };
        let tag = &rest[..tag_end];
        let after_tag = &rest[tag_end + 1..];
        let Some(script_end) = after_tag.to_lowercase().find("</script>") else {
            break;
        };
        if tag.to_lowercase().contains("application/ld+json") {
            blocks.push(after_tag[..script_end].trim().to_string());
        }
        rest = &after_tag[script_end + "</script>".len()..];
    }

    blocks
}

fn find_recipe_value(value: &Value) -> Option<&Value> {
    match value {
        Value::Array(items) => items.iter().find_map(find_recipe_value),
        Value::Object(map) => {
            if is_recipe_type(map.get("@type")) {
                return Some(value);
            }
            map.get("@graph").and_then(find_recipe_value)
        }
        _ => None,
    }
}

fn is_recipe_type(value: Option<&Value>) -> bool {
    match value {
        Some(Value::String(kind)) => kind.eq_ignore_ascii_case("recipe"),
        Some(Value::Array(kinds)) => kinds
            .iter()
            .filter_map(Value::as_str)
            .any(|kind| kind.eq_ignore_ascii_case("recipe")),
        _ => false,
    }
}

fn recipe_from_json_ld(value: &Value, url: &str) -> Option<NormalizedRecipe> {
    let title = value
        .get("name")
        .and_then(Value::as_str)
        .map(str::to_string);
    let ingredients = string_array(value.get("recipeIngredient"));
    let steps = recipe_steps(value.get("recipeInstructions"));
    let servings = string_or_joined(value.get("recipeYield"));
    let time = value
        .get("totalTime")
        .or_else(|| value.get("cookTime"))
        .or_else(|| value.get("prepTime"))
        .and_then(Value::as_str)
        .map(str::to_string);
    let notes = if ingredients.is_empty() || steps.is_empty() {
        vec!["Imported JSON-LD was incomplete; review before remixing.".to_string()]
    } else {
        Vec::new()
    };

    Some(NormalizedRecipe {
        title,
        ingredients,
        steps,
        servings,
        time,
        source: RecipeSource {
            kind: "url".to_string(),
            url: Some(url.to_string()),
            attribution: value
                .get("author")
                .and_then(author_name)
                .or_else(|| value.get("publisher").and_then(author_name)),
        },
        notes,
        raw_text: None,
    })
}

fn string_array(value: Option<&Value>) -> Vec<String> {
    match value {
        Some(Value::Array(items)) => items
            .iter()
            .filter_map(Value::as_str)
            .map(str::trim)
            .filter(|item| !item.is_empty())
            .map(str::to_string)
            .collect(),
        Some(Value::String(item)) => vec![item.clone()],
        _ => Vec::new(),
    }
}

fn recipe_steps(value: Option<&Value>) -> Vec<String> {
    match value {
        Some(Value::Array(items)) => items.iter().filter_map(step_text).collect(),
        Some(value) => step_text(value).into_iter().collect(),
        None => Vec::new(),
    }
}

fn step_text(value: &Value) -> Option<String> {
    match value {
        Value::String(text) => Some(text.trim().to_string()),
        Value::Object(map) => map
            .get("text")
            .and_then(Value::as_str)
            .map(str::trim)
            .map(str::to_string)
            .or_else(|| recipe_steps(map.get("itemListElement")).into_iter().next()),
        _ => None,
    }
    .filter(|text| !text.is_empty())
}

fn string_or_joined(value: Option<&Value>) -> Option<String> {
    match value {
        Some(Value::String(text)) => Some(text.clone()),
        Some(Value::Array(items)) => {
            let parts: Vec<&str> = items.iter().filter_map(Value::as_str).collect();
            (!parts.is_empty()).then(|| parts.join(", "))
        }
        _ => None,
    }
}

fn author_name(value: &Value) -> Option<String> {
    match value {
        Value::String(text) => Some(text.clone()),
        Value::Object(map) => map.get("name").and_then(Value::as_str).map(str::to_string),
        _ => None,
    }
}

fn run_healthcheck(config: &AppConfig) -> Result<()> {
    let addr = SocketAddr::from(([127, 0, 0, 1], config.port));
    let mut stream = TcpStream::connect_timeout(&addr, Duration::from_secs(2))
        .with_context(|| format!("healthcheck failed to connect to {addr}"))?;
    stream
        .set_read_timeout(Some(Duration::from_secs(2)))
        .context("healthcheck failed to set read timeout")?;
    stream
        .write_all(b"GET /healthz HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n")
        .context("healthcheck failed to write request")?;

    let mut response = [0_u8; 64];
    let read = stream
        .read(&mut response)
        .context("healthcheck failed to read response")?;
    let status = std::str::from_utf8(&response[..read]).unwrap_or_default();

    if status.starts_with("HTTP/1.1 200") || status.starts_with("HTTP/1.0 200") {
        Ok(())
    } else {
        anyhow::bail!("healthcheck returned non-200 response");
    }
}

async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn config_defaults_keep_secrets_server_side() {
        let config = AppConfig::from_vars(HashMap::new()).expect("default config");

        assert_eq!(config.database_path, "/data/recipe-mixer.sqlite");
        assert_eq!(config.openrouter_base_url, "https://openrouter.ai/api/v1");
        assert_eq!(config.openrouter_model, "openai/gpt-4o-mini");
        assert!(!config.openrouter_configured());
        assert!(config.openrouter_api_key.is_none());
    }

    #[test]
    fn config_tracks_openrouter_presence_without_exposing_key() {
        let mut vars = HashMap::new();
        vars.insert("OPENROUTER_API_KEY".to_string(), "sk-test".to_string());

        let config = AppConfig::from_vars(vars).expect("config with key");

        assert!(config.openrouter_configured());
    }

    #[test]
    fn parse_recipe_text_finds_core_fields() {
        let recipe = parse_recipe_text(
            None,
            "Tomato Pasta\nServings: 2\nIngredients\n- 1 cup pasta\n- 1 cup tomato sauce\nSteps\n1. Boil pasta\n2. Stir with sauce",
            source_for_text(None),
        );

        assert_eq!(recipe.title.as_deref(), Some("Tomato Pasta"));
        assert_eq!(recipe.ingredients.len(), 2);
        assert_eq!(recipe.steps.len(), 2);
        assert_eq!(recipe.servings.as_deref(), Some("Servings: 2"));
    }

    #[test]
    fn json_ld_import_preserves_source_url() {
        let html = r#"
        <html><head><script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Recipe",
          "name": "Soup",
          "recipeIngredient": ["1 cup stock", "1 carrot"],
          "recipeInstructions": [{"text": "Simmer everything"}],
          "recipeYield": "2 servings",
          "totalTime": "PT30M"
        }
        </script></head></html>
        "#;

        let recipe = extract_json_ld_recipe(html, "https://example.test/soup").expect("recipe");

        assert_eq!(recipe.title.as_deref(), Some("Soup"));
        assert_eq!(
            recipe.source.url.as_deref(),
            Some("https://example.test/soup")
        );
        assert_eq!(recipe.ingredients.len(), 2);
        assert_eq!(recipe.steps, vec!["Simmer everything"]);
    }

    #[test]
    fn deterministic_remix_includes_copy_payload_and_checks() {
        let recipe = NormalizedRecipe {
            title: Some("Pasta".to_string()),
            ingredients: vec!["1 cup pasta".to_string()],
            steps: vec!["Boil pasta".to_string()],
            servings: Some("2 servings".to_string()),
            time: None,
            source: source_for_text(Some("https://example.test/pasta".to_string())),
            notes: Vec::new(),
            raw_text: None,
        };
        let settings = RemixSettings {
            direction: "French-inspired".to_string(),
            diet: None,
            time_limit_minutes: Some(25),
            difficulty: Some("easy".to_string()),
            spice_level: None,
            pantry_ingredients: vec!["peas".to_string()],
        };

        let remix = deterministic_remix(recipe, settings, "test fallback");

        assert!(remix
            .copy_text
            .contains("Source: https://example.test/pasta"));
        assert!(remix
            .changes
            .iter()
            .any(|change| change.label == "changed" && change.target == "flavor direction"));
        assert!(remix.sanity_warnings.is_empty());
    }

    #[test]
    fn storage_round_trips_saved_remix() {
        let storage = Storage::open(":memory:").expect("storage");
        let recipe = NormalizedRecipe {
            title: Some("Soup".to_string()),
            ingredients: vec!["1 cup stock".to_string()],
            steps: vec!["Simmer stock".to_string()],
            servings: Some("1 serving".to_string()),
            time: Some("10 minutes".to_string()),
            source: source_for_text(None),
            notes: Vec::new(),
            raw_text: None,
        };
        let settings = RemixSettings {
            direction: "Weeknight".to_string(),
            diet: None,
            time_limit_minutes: None,
            difficulty: None,
            spice_level: None,
            pantry_ingredients: Vec::new(),
        };
        let remix = deterministic_remix(recipe, settings, "test fallback");

        let saved = storage
            .save_remix(SaveRemixRequest { name: None, remix })
            .expect("saved");
        let loaded = storage.get_remix(&saved.id).expect("loaded");

        assert_eq!(loaded.id, saved.id);
        assert_eq!(storage.list_remixes().expect("list").len(), 1);
    }
}

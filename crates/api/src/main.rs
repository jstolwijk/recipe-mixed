use std::{
    collections::HashMap,
    env,
    io::{Read, Write},
    net::{SocketAddr, TcpStream},
    time::Duration,
};

use anyhow::{Context, Result};
use axum::{extract::State, http::HeaderValue, response::IntoResponse, routing::get, Json, Router};
use serde::Serialize;
use tokio::net::TcpListener;
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[derive(Clone, Debug)]
struct AppState {
    config: AppConfig,
}

#[derive(Clone, Debug, PartialEq, Eq)]
struct AppConfig {
    host: String,
    port: u16,
    database_path: String,
    openrouter_base_url: String,
    openrouter_api_key_configured: bool,
    public_app_origin: String,
}

#[derive(Serialize)]
struct HealthResponse {
    status: &'static str,
    service: &'static str,
    database_path: String,
    openrouter_configured: bool,
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
        let openrouter_api_key_configured = vars
            .get("OPENROUTER_API_KEY")
            .map(|value| !value.trim().is_empty())
            .unwrap_or(false);
        let public_app_origin = vars
            .get("PUBLIC_APP_ORIGIN")
            .cloned()
            .unwrap_or_else(|| "http://localhost:8080".to_string());

        Ok(Self {
            host,
            port,
            database_path,
            openrouter_base_url,
            openrouter_api_key_configured,
            public_app_origin,
        })
    }

    fn socket_addr(&self) -> Result<SocketAddr> {
        format!("{}:{}", self.host, self.port)
            .parse()
            .context("API_HOST/API_PORT must form a valid socket address")
    }
}

fn app(config: AppConfig) -> Router {
    let origin = config
        .public_app_origin
        .parse::<HeaderValue>()
        .expect("PUBLIC_APP_ORIGIN must be a valid HTTP header value");

    Router::new()
        .route("/healthz", get(health))
        .route("/api/healthz", get(health))
        .layer(CorsLayer::new().allow_origin(origin))
        .layer(TraceLayer::new_for_http())
        .with_state(AppState { config })
}

async fn health(State(state): State<AppState>) -> impl IntoResponse {
    Json(HealthResponse {
        status: "ok",
        service: "recipe-mixer-api",
        database_path: state.config.database_path,
        openrouter_configured: state.config.openrouter_api_key_configured,
    })
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

    axum::serve(listener, app(config))
        .with_graceful_shutdown(shutdown_signal())
        .await
        .context("API server failed")
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
        assert!(!config.openrouter_api_key_configured);
    }

    #[test]
    fn config_tracks_openrouter_presence_without_exposing_key() {
        let mut vars = HashMap::new();
        vars.insert("OPENROUTER_API_KEY".to_string(), "sk-test".to_string());

        let config = AppConfig::from_vars(vars).expect("config with key");

        assert!(config.openrouter_api_key_configured);
    }
}

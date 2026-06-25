# Backend API Contract

All endpoints are under `/api` except `/healthz`.

## Recipe Input

- `POST /api/recipes/parse`
  - Request: `{ "title": string | null, "text": string, "source_url": string | null }`
  - Response: normalized recipe with `title`, `ingredients`, `steps`, `servings`, `time`, `source`, `notes`, and `raw_text`.
- `POST /api/recipes/import`
  - Request: `{ "url": string }`
  - Response: normalized recipe extracted from JSON-LD Recipe metadata.
  - Failure: `422` with fallback text telling user to paste recipe text manually.

## Remix

- `GET /api/remix-directions`
  - Response: guided direction list using "inspired" wording.
- `POST /api/remixes`
  - Request: `{ "recipe": NormalizedRecipe, "settings": RemixSettings }`
  - Response: `RemixResponse` containing `remix`, `changes`, `sanity_warnings`, `why_this_works`, `copy_text`, and `share_payload`.
  - If `OPENROUTER_API_KEY` is configured, backend tries OpenRouter server-side. If no key or invalid model JSON response, backend uses deterministic fallback.

`RemixSettings` fields:

- `direction: string`
- `diet: string | null`
- `time_limit_minutes: number | null`
- `difficulty: string | null`
- `spice_level: string | null`
- `pantry_ingredients: string[]`

## Save And Share

- `POST /api/remixes/save`
  - Request: `{ "name": string | null, "remix": RemixResponse }`
  - Response: saved remix with generated `id`, `created_at`, source title, direction, and full payload.
- `GET /api/remixes/saved`
  - Response: saved remixes newest first.
- `GET /api/remixes/saved/:id`
  - Response: saved remix.
- `GET /api/share/:id`
  - Response: share payload for readable sharing/copy surfaces.
- `POST /api/remixes/copy-payload`
  - Request: `{ "remix": RemixResponse }`
  - Response: `share_payload`.

SQLite stores saved remix payload JSON at `RECIPE_MIXER_DB_PATH`; secrets never appear in responses.

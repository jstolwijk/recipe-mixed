# Recipe Mixer

Recipe Mixer is a recipe remixing website. The MVP stack is React, TypeScript, Vite, Rust, Axum, SQLite, Docker Compose, and Caddy.

## Local Development

```sh
make setup
make dev
```

`make dev` starts the Docker Compose stack with:

- `web`: Caddy serving the built React app and proxying `/api` to the backend.
- `api`: Rust Axum service with server-side OpenRouter configuration.

If port `8080` is already in use, run with another host port:

```sh
WEB_PORT=8081 make dev
```

For faster frontend iteration:

```sh
npm --prefix apps/web install
npm --prefix apps/web run dev
```

For backend iteration:

```sh
cargo run -p recipe-mixer-api
```

## Checks

```sh
make lint
make test
make build
make compose-build
```

OpenRouter keys and deployment secrets stay in server-side environment files. Do not put them in frontend code.

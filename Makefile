.PHONY: help check lint test build setup dev check-dev-port web-deps compose-build deploy deploy-api deploy-web backup

.DEFAULT_GOAL := check
WEB_PORT ?= 8080
PUBLIC_APP_ORIGIN ?= http://localhost:$(WEB_PORT)

help:
	@printf '%s\n' \
		'Targets:' \
		'  make check          Validate repo planning files and scaffold files' \
		'  make lint           Run frontend typecheck and backend lint checks' \
		'  make test           Run frontend and backend tests' \
		'  make build          Build frontend and backend artifacts' \
		'  make setup          Install/fetch local dependencies' \
		'  make dev            Start the local Docker Compose stack' \
		'  make compose-build  Build Docker images' \
		'  make deploy         Deploy all services' \
		'  make deploy-api     Deploy only the backend' \
		'  make deploy-web     Deploy only the frontend' \
		'  make backup         Backup SQLite once implemented'

check:
	@test -f AGENTS.md
	@test -f issues/README.md
	@test -f issues/stories/STORY-000-tech-stack-and-scaffolding.md
	@test -d issues/epics
	@test -d issues/stories
	@test -d issues/templates
	@test -f apps/web/package.json
	@test -f crates/api/Cargo.toml
	@test -f docker-compose.yml
	@test -f Dockerfile.api
	@test -f Dockerfile.web
	@test -f deploy/Caddyfile
	@printf '%s\n' 'check ok'

lint: check web-deps
	npm --prefix apps/web run lint
	cargo fmt --all --check
	cargo clippy --workspace --all-targets -- -D warnings

test: check web-deps
	npm --prefix apps/web run test
	cargo test --workspace

build: check web-deps
	npm --prefix apps/web run build
	cargo build --workspace

setup:
	npm --prefix apps/web install
	cargo fetch
	@printf '%s\n' 'setup ok'

dev: check-dev-port
	WEB_PORT=$(WEB_PORT) PUBLIC_APP_ORIGIN=$(PUBLIC_APP_ORIGIN) docker compose up --build

check-dev-port:
	@if command -v lsof >/dev/null 2>&1 && lsof -nP -iTCP:$(WEB_PORT) -sTCP:LISTEN >/dev/null 2>&1; then \
		printf '%s\n' 'Port $(WEB_PORT) already in use. Docker cannot bind web container.'; \
		lsof -nP -iTCP:$(WEB_PORT) -sTCP:LISTEN; \
		if command -v docker >/dev/null 2>&1; then \
			docker ps --format '{{.Names}}\t{{.Ports}}' 2>/dev/null \
				| awk -v port=':$(WEB_PORT)->' 'index($$0, port) { printf "Docker container using port: %s\n", $$0 }'; \
		fi; \
		printf '%s\n' 'Use another port: WEB_PORT=8081 make dev'; \
		exit 1; \
	fi

web-deps:
	@test -d apps/web/node_modules || npm --prefix apps/web ci

compose-build:
	docker compose build

deploy:
	scripts/deploy.sh all

deploy-api:
	scripts/deploy.sh api

deploy-web:
	scripts/deploy.sh web

backup:
	@test -x scripts/backup.sh || { printf '%s\n' 'scripts/backup.sh missing; backup pending STORY-013'; exit 1; }
	scripts/backup.sh

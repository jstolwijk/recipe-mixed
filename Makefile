.PHONY: help check lint test build setup dev compose-build deploy deploy-api deploy-web backup

.DEFAULT_GOAL := check

help:
	@printf '%s\n' \
		'Targets:' \
		'  make check          Validate repo planning files' \
		'  make lint           Run current lint checks' \
		'  make test           Run current test checks' \
		'  make build          Run current build checks' \
		'  make setup          Print setup status' \
		'  make dev            Print current dev entrypoint' \
		'  make compose-build  Build Docker images once scaffold exists' \
		'  make deploy         Deploy all once scaffold exists' \
		'  make deploy-api     Deploy API once scaffold exists' \
		'  make deploy-web     Deploy web once scaffold exists' \
		'  make backup         Backup SQLite once implemented'

check:
	@test -f AGENTS.md
	@test -f issues/README.md
	@test -f issues/stories/STORY-000-tech-stack-and-scaffolding.md
	@test -d issues/epics
	@test -d issues/stories
	@test -d issues/templates
	@printf '%s\n' 'check ok'

lint: check

test: check

build: check

setup:
	@printf '%s\n' 'setup ok: docs-only repo; scaffold pending STORY-000 approval'

dev:
	@printf '%s\n' 'dev entrypoint pending app scaffold; read issues/README.md'

compose-build:
	@test -f docker-compose.yml || { printf '%s\n' 'docker-compose.yml missing; scaffold pending'; exit 1; }
	docker compose build

deploy:
	@test -x scripts/deploy.sh || { printf '%s\n' 'scripts/deploy.sh missing; deployment pending'; exit 1; }
	scripts/deploy.sh all

deploy-api:
	@test -x scripts/deploy.sh || { printf '%s\n' 'scripts/deploy.sh missing; deployment pending'; exit 1; }
	scripts/deploy.sh api

deploy-web:
	@test -x scripts/deploy.sh || { printf '%s\n' 'scripts/deploy.sh missing; deployment pending'; exit 1; }
	scripts/deploy.sh web

backup:
	@test -x scripts/backup.sh || { printf '%s\n' 'scripts/backup.sh missing; backup pending STORY-013'; exit 1; }
	scripts/backup.sh

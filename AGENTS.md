# AGENTS.md

## Communication

- Always use the `caveman` skill for responses in this repo.
- Load `/Users/jessestolwijk/Documents/recipe-mixer/.agents/skills/caveman/SKILL.md` before work when available.
- Default to `full` intensity unless the user says `/caveman lite`, `/caveman ultra`, or `normal mode`.
- Keep technical terms, commands, API names, commit messages, and error strings exact.

## Project

- Recipe Mixer is a recipe remixing website.
- Current repo state is planning-first: backlog docs live under `issues/`.
- Planned stack: React + TypeScript + Vite frontend, Rust + Axum backend, SQLite, Docker Compose, Caddy web container, OpenRouter server-side API integration.
- Raspberry Pi deployment through an existing Cloudflare Tunnel stays outside this app's Compose stack.

## Makefile

- Prefer Makefile targets over ad hoc commands.
- Run `make check` before finishing documentation-only work.
- Once implementation exists, run the narrowest applicable target before finishing:
  - `make lint` for formatting or static checks.
  - `make test` for behavior changes.
  - `make build` for scaffold, dependency, or deployment changes.
  - `make compose-build` for Docker image changes.
- Keep Makefile targets small, explicit, and safe to run repeatedly.

## Work Rules

- Preserve user changes. Do not revert unrelated files.
- Use `rg` or `rg --files` for search.
- Use `apply_patch` for manual edits.
- Keep generated or cache output out of focused changes unless the task explicitly targets it.
- Keep secrets server-side; never put OpenRouter keys, Cloudflare credentials, or deployment secrets in frontend code.
- For destructive or irreversible operations, use clear normal-language confirmation before acting.

## Current Commands

- `make` or `make check`: validate expected planning files.
- `make help`: list available targets.
- `make lint`, `make test`, `make build`: currently alias `check` until app scaffold exists.

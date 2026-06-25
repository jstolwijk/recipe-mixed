# STORY-000: Tech Stack And Scaffolding

Status: Done

## User Story

As the product owner, I want the technical stack and deployment scaffold defined before implementation, so that the first build matches the intended Raspberry Pi, Docker, and Cloudflare Tunnel deployment model.

## Context

Recipe Mixer should be easy to run locally with Docker Compose and easy to deploy to a Raspberry Pi behind Cloudflare Tunnel. The app should prefer minimal or hardened containers, keep secrets server-side, and use a stack that remains pleasant to maintain as the product grows.

This story is a review checkpoint. It documents the proposed stack and scaffold only. Implementation should start after this story is approved.

## Proposed Stack

| Area | Choice | Notes |
| --- | --- | --- |
| Frontend | React + TypeScript + Vite | Fast local development, simple static build, works well with Docker and a Rust API. |
| Styling | Tailwind CSS | Utility-first styling with a mature ecosystem. |
| UI components | shadcn/ui | Use shadcn components where practical for forms, dialogs, tabs, buttons, inputs, cards, sheets, toasts, and layout primitives. |
| AI UI components | blocks.so registry, optional | Add `@blocks-so` registry only when an AI interaction component is useful enough to justify it. |
| Backend | Rust + Axum | Needed for AI provider calls, recipe URL import, server-side parsing, persistence, secrets, and rate limits. |
| Database | SQLite | Best default for a Raspberry Pi MVP: single file, simple backups, low operational overhead. |
| Object storage | MinIO, optional later | Only add when recipe images, attachments, exports, or generated assets need object storage. |
| AI provider | OpenRouter | Backend integrates with OpenRouter first, keeping provider keys server-side. |
| API format | JSON over HTTP | Keep the contract explicit and frontend-friendly. |
| Runtime | Docker Compose | One command for local development and Raspberry Pi deployment. |
| Deployment | Raspberry Pi behind existing Cloudflare Tunnel | No public inbound port required. The tunnel is already managed on the Pi and should stay outside this app's Compose stack. |
| Routing | Caddy in the `web` container | Serve the React build and reverse-proxy `/api` to the internal Rust API service. Traefik is not needed for MVP. |
| Container security | Distroless or hardened minimal image | Prefer distroless for the Rust API runtime. Use non-root users, read-only filesystems where practical, dropped capabilities, and explicit volume mounts. |

## Recommended Repository Shape

```text
recipe-mixer/
  apps/
    web/
      src/
      components/
      components/ui/
      package.json
      vite.config.ts
  crates/
    api/
      src/
      Cargo.toml
  deploy/
    cloudflared/
    compose.prod.yml
  data/
    .gitkeep
  docker-compose.yml
  Dockerfile.api
  Dockerfile.web
  Makefile
  scripts/
    deploy.sh
```

## Recommended Service Shape

### MVP Decision: Two Containers

- `web`: React static site served by a small web server container.
- `api`: Rust Axum backend running in a distroless or minimal runtime image.
- `sqlite`: no separate service; the API stores the SQLite file in a mounted volume.
- `cloudflared`: not part of this Compose stack; the Raspberry Pi already manages the tunnel.
- `traefik`: not part of this Compose stack for MVP.

This keeps frontend and backend concerns separate and matches the current deployment preference for independently deployable targets.

## Recommended Routing Shape

- Cloudflare Tunnel routes public traffic to the Raspberry Pi host port exposed by `web`.
- `web` serves the built React app.
- `web` reverse-proxies `/api/*` to `api:8080` on the internal Docker network.
- `api` is not exposed directly to the host or public internet.
- Local development can still expose Vite and the API separately when that is more convenient.

This gives the production app a single browser origin, avoids CORS complexity, and keeps the API private to the Compose network.

### Caddy Preference

Use Caddy for the production `web` container unless implementation reveals a better fit:

- Caddyfile configuration is small and readable.
- It can serve static files and proxy `/api` in the same container.
- It can listen on an unprivileged port such as `8080`, so the container can run as non-root.
- TLS does not need to be handled by Caddy because Cloudflare Tunnel is already the public edge.

### Rejected For MVP: Single App Container

- Rust Axum serves both the API and built frontend assets.
- Fewer moving parts on the Raspberry Pi.
- Less convenient for independent frontend and backend rollout.

Keep Option B as a possible simplification after the MVP shape is clearer.

### Rejected For MVP: Serving UI From MinIO

- MinIO can serve static files, but using it for the main UI adds another moving part without much benefit for the MVP.
- A dedicated `web` container is simpler to build, health-check, roll out, and route through the existing Cloudflare Tunnel.
- Defer MinIO until there is a concrete object-storage need such as recipe images, exports, attachments, or generated assets.

### Rejected For MVP: Traefik

- Traefik is useful when many services need dynamic host-based routing on the same Docker host.
- This MVP only needs one public web entrypoint and one private API service.
- Cloudflare Tunnel already handles the public ingress layer.
- Mounting `/var/run/docker.sock` gives the proxy broad visibility into Docker and should not be added unless it solves a real routing problem.
- The insecure dashboard pattern from prior projects should not be copied into production.
- Traefik labels spread routing configuration across services, which is more machinery than this app needs at the start.

Revisit Traefik later if the Raspberry Pi becomes a shared multi-app platform with many independently routed services.

## Docker And Hardening Requirements

- Build multi-architecture images that work on Raspberry Pi, especially `linux/arm64`.
- Run containers as non-root.
- Prefer distroless runtime for the Rust API.
- Use a read-only root filesystem where practical.
- Mount SQLite data explicitly, for example `/data/recipe-mixer.sqlite`.
- Store secrets in `.env` locally and server-side environment files on the Raspberry Pi.
- Do not put AI provider keys or Cloudflare credentials in the frontend.
- Add health checks for deploy and rollout confidence.
- Keep image layers small and avoid shipping build tools in runtime images.
- Do not mount the Docker socket into app containers unless a future reverse-proxy story explicitly requires it.

## Local Development Requirements

- `docker compose up` starts the full local stack.
- Frontend local development can run with Vite outside Docker when desired.
- Backend local development can run with Cargo outside Docker when desired.
- Compose should provide stable service names, ports, and environment variables.
- SQLite data should persist locally through a named volume or `./data` mount.

## Makefile Targets

Initial targets should include:

- `make setup`: install or verify local prerequisites where possible.
- `make dev`: start the local development stack.
- `make build`: build frontend and backend artifacts.
- `make test`: run frontend and backend tests.
- `make lint`: run formatting and lint checks.
- `make compose-build`: build Docker images.
- `make deploy`: push code and deploy the default target to the Raspberry Pi.
- `make deploy-api`: deploy only the backend.
- `make deploy-web`: deploy only the frontend.
- `make backup`: create a SQLite backup once STORY-013 is implemented.

## Deployment Script Shape

The deployment script should follow the existing personal pattern:

- Accept a target such as `all`, `api`, or `web`.
- Validate the target before doing work.
- Push local git changes.
- SSH into `jest@raspberrypi.local`.
- Run `git pull` in the app directory.
- Build the relevant Docker Compose service.
- Roll out the relevant service with `docker rollout`.
- Leave Cloudflare Tunnel management to the existing Raspberry Pi setup.
- Route production traffic through the `web` service, with `/api` proxied internally to `api`.
- Reboot only when explicitly deploying `all`, if still desired.

Exact script names and remote paths can be finalized during implementation.

## shadcn And blocks.so Setup

When implementation begins:

- Initialize shadcn with `npx shadcn@latest init` or the current project-appropriate command.
- If the shadcn MCP is useful in the active environment, initialize it with `npx shadcn@latest mcp init`.
- Add the blocks.so registry only if AI-specific blocks are selected:

```json
{
  "registries": {
    "@blocks-so": "https://blocks.so/r/{name}.json"
  }
}
```

- Add blocks with `npx shadcn@latest add @blocks-so/[component-name]` when needed.

## Initial Scaffold Acceptance Criteria

- Given the story is approved, when implementation starts, then the repo has a React/Vite frontend scaffold under `apps/web`.
- Given the story is approved, when implementation starts, then the repo has a Rust/Axum backend scaffold under `crates/api`.
- Given the scaffold is created, when `docker compose up` runs, then the local app starts with web and API services.
- Given the scaffold is created, when `make build` runs, then frontend and backend build successfully.
- Given the scaffold is created, when the Docker images are built, then they support Raspberry Pi deployment.
- Given the scaffold is created, when production Compose is reviewed, then containers use non-root execution and minimal runtime images where practical.
- Given the scaffold is created, when deployment docs are reviewed, then the Cloudflare Tunnel and Raspberry Pi deployment assumptions are visible.
- Given the scaffold is created, when API configuration is reviewed, then OpenRouter is the first AI provider integration target and secrets are server-side only.
- Given the scaffold is created, when routing is reviewed, then public traffic enters through the `web` container and the API remains private on the Docker network.

## Resolved Decisions

- The frontend should run in its own container.
- Cloudflare Tunnel is already running on the Raspberry Pi and should not be managed by this app.
- OpenRouter is the first AI provider target.
- MinIO is deferred until object storage is actually needed.
- SQLite backups are tracked separately in STORY-013.
- Traefik is not needed for MVP.
- Caddy is the preferred production static server and `/api` reverse proxy for the `web` container.

## Open Questions

- Which recipe extraction approach should be used first?
- Should the API use a fully distroless runtime from day one, or start with a hardened Debian slim runtime if SQLite/native dependency ergonomics require it?

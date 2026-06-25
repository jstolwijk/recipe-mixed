# Deployment Notes

Production traffic is expected to enter through an existing Cloudflare Tunnel on the Raspberry Pi. The tunnel points at the host port exposed by the `web` service. The tunnel itself is managed outside this Compose stack.

## Runtime Shape

- `web` serves the React build with Caddy on port `8080`.
- `web` reverse-proxies `/api/*` to `api:8080` on the internal Compose network.
- `api` is not exposed directly to the host.
- SQLite data lives at `/data/recipe-mixer.sqlite` in the `api` container.
- OpenRouter credentials are read only by the backend through environment variables.

## Raspberry Pi Deploy Assumptions

- Remote user: `jest`
- Remote host: `raspberrypi.local`
- Remote app path: `/srv/recipe-mixer`
- Docker Compose and `docker rollout` are available on the Pi.
- Cloudflare Tunnel lifecycle stays outside this repository.

Override these values with `RECIPE_MIXER_REMOTE`, `RECIPE_MIXER_REMOTE_PATH`, and `RECIPE_MIXER_COMPOSE`.


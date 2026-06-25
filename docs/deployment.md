# Deployment Notes

Production traffic is expected to enter through an existing Cloudflare Tunnel on the Raspberry Pi. The tunnel points at the host port exposed by the `web` service. The tunnel itself is managed outside this Compose stack.

## Runtime Shape

- `web` serves the React build with Caddy on port `8080`.
- `web` reverse-proxies `/api/*` to `api:8080` on the internal Compose network.
- `api` is not exposed directly to the host.
- SQLite data lives at `/data/recipe-mixer.sqlite` in the `api` container.
- OpenRouter credentials are read only by the backend through environment variables.
- Manual SQLite backups use `scripts/backup.sh`, which reads `RECIPE_MIXER_DB_PATH` and writes timestamped artifacts under `RECIPE_MIXER_BACKUP_DIR`.

## Raspberry Pi Deploy Assumptions

- Remote user: `jest`
- Remote host: `raspberrypi.local`
- Remote app path: `/srv/recipe-mixer`
- Docker Compose and `docker rollout` are available on the Pi.
- Cloudflare Tunnel lifecycle stays outside this repository.

Override these values with `RECIPE_MIXER_REMOTE`, `RECIPE_MIXER_REMOTE_PATH`, and `RECIPE_MIXER_COMPOSE`.

## SQLite Backups

Run a one-off backup on the Raspberry Pi host:

```sh
RECIPE_MIXER_DB_PATH=/srv/recipe-mixer/data/recipe-mixer.sqlite \
RECIPE_MIXER_BACKUP_DIR=/srv/recipe-mixer/backups \
make backup
```

The backup command requires `sqlite3` on the host and uses SQLite's `.backup` command rather than copying the active database file. Output files are named `recipe-mixer-YYYYMMDDTHHMMSSZ.sqlite`.

Restore procedure:

1. Stop the Compose stack so the app is not writing to SQLite.
2. Copy the desired backup over the configured `RECIPE_MIXER_DB_PATH`.
3. Start the Compose stack and check `/api/healthz`.

Keep backup artifacts outside git. The default local `data/` path is already ignored.

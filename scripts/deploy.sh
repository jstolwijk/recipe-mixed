#!/usr/bin/env sh
set -eu

target="${1:-all}"
remote="${RECIPE_MIXER_REMOTE:-jest@raspberrypi.local}"
remote_path="${RECIPE_MIXER_REMOTE_PATH:-/srv/recipe-mixer}"
compose_file="${RECIPE_MIXER_COMPOSE:-docker-compose.yml}"

case "$target" in
  all|api|web) ;;
  *)
    printf '%s\n' "usage: scripts/deploy.sh [all|api|web]" >&2
    exit 64
    ;;
esac

git push

ssh "$remote" "cd '$remote_path' && git pull --ff-only"

case "$target" in
  all)
    ssh "$remote" "cd '$remote_path' && docker compose -f '$compose_file' -f deploy/compose.prod.yml build && docker rollout api web"
    ;;
  api)
    ssh "$remote" "cd '$remote_path' && docker compose -f '$compose_file' -f deploy/compose.prod.yml build api && docker rollout api"
    ;;
  web)
    ssh "$remote" "cd '$remote_path' && docker compose -f '$compose_file' -f deploy/compose.prod.yml build web && docker rollout web"
    ;;
esac


#!/usr/bin/env sh
set -eu

db_path="${RECIPE_MIXER_DB_PATH:-/data/recipe-mixer.sqlite}"
backup_dir="${RECIPE_MIXER_BACKUP_DIR:-/data/backups}"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_path="${backup_dir}/recipe-mixer-${timestamp}.sqlite"

if ! command -v sqlite3 >/dev/null 2>&1; then
  printf '%s\n' 'sqlite3 is required for SQLite-aware backups' >&2
  exit 1
fi

if [ ! -f "$db_path" ]; then
  printf 'database not found: %s\n' "$db_path" >&2
  exit 1
fi

mkdir -p "$backup_dir"
sqlite3 "$db_path" ".backup '${backup_path}'"
printf 'backup created: %s\n' "$backup_path"

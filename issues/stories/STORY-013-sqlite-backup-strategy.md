# STORY-013: SQLite Backup Strategy

## User Story

As the product owner, I want a clear SQLite backup strategy, so that recipe data can be recovered if the Raspberry Pi storage, deploy process, or application data file fails.

## Context

SQLite is the right default database for the Raspberry Pi MVP, but the single database file needs an intentional backup path. This should be handled as its own infrastructure story rather than hidden inside the initial scaffold.

## Acceptance Criteria

- Given the app stores data in SQLite, when a backup is created, then it uses a safe SQLite-aware backup method rather than copying a potentially active database file directly.
- Given a backup is created, when it completes, then the output includes a timestamped backup artifact.
- Given the backup process runs on the Raspberry Pi, when storage paths are reviewed, then database and backup locations are explicit.
- Given backups exist, when a restore is needed, then there is a documented restore procedure.
- Given a backup command exists, when `make backup` runs, then it creates or triggers a backup using the documented process.

## Notes

- Candidate approaches: `sqlite3 .backup`, `VACUUM INTO`, or an application-level backup endpoint/command.
- Start with a manual `make backup` target, then consider a Raspberry Pi cron job once data becomes valuable.
- Keep backup artifacts out of git.
- Consider a retention policy before backups run automatically.

## Dependencies

- STORY-000: Tech Stack And Scaffolding
- STORY-012: MVP App Shell

---
name: implement-issue
description: >
  Implement backlog issues from local issue docs or user-provided issue references. Use when
  the user asks to implement an issue, work the next issue, pass an issue number such as
  STORY-012 or 12, or gives free text describing a backlog item to implement. If no issue is
  provided, select and implement the next suitable issue. Always commit completed changes.
---

# Implement Issue

Implement one issue end to end: select issue, understand context, edit code/docs, verify, commit.

## Inputs

- No argument: find next suitable issue.
- Issue id or number: resolve `STORY-012`, `EPIC-006`, `12`, `#12`, or similar.
- Free text: search issues and code for closest matching story or requirement.

## Select Issue

1. Read `AGENTS.md` first if present.
2. Inspect `issues/README.md`, then candidate files under `issues/stories/` and `issues/epics/`.
3. If no argument was passed, choose the lowest-numbered story that is not clearly complete and whose dependencies are satisfied by current repo state.
4. If an issue number was passed, prefer exact story id, then epic id, then textual match.
5. If free text was passed, use `rg` over `issues/` and choose the strongest match.
6. If multiple plausible issues tie or chosen issue is blocked by an explicit dependency, ask one concise question before editing.

## Implement

1. Read selected issue fully.
2. Read linked epic and neighboring stories only when needed for context.
3. Inspect current project files before choosing changes.
4. Make the smallest coherent implementation that satisfies acceptance criteria.
5. Preserve user changes; do not revert unrelated work.
6. Update docs or issue text only when it reflects implemented reality.
7. Prefer repo Makefile targets for setup, build, lint, test, and deploy checks.

## Verify

Run the narrowest relevant checks before commit:

- `make check` for docs-only or planning changes.
- `make lint` for formatting/static checks.
- `make test` for behavior changes.
- `make build` for scaffold, dependency, Docker, or deploy changes.

If checks cannot run, record the exact reason in final response and commit message body when relevant.

## Commit

Always commit completed changes unless the user explicitly says not to.

Commit workflow:

1. Inspect `git status --short`.
2. Stage only files changed for the selected issue.
3. Use a concise Conventional Commit message.
4. Include issue id in the commit body when one exists, for example `Refs STORY-012`.
5. Do not include AI attribution trailers unless repo rules require them.
6. After commit, report commit SHA, selected issue, and verification result.

If implementation is blocked before any useful change, do not create an empty commit. Explain blocker and next action.

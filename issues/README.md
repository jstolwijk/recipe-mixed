# Recipe Mixer Issues

This folder captures the product backlog for a recipe remixing website. It is organized around epics and implementation-sized stories.

## Structure

- `epics/`: larger product outcomes that group related work.
- `stories/`: tangible user-facing or technical slices that can be designed, built, and tested.
- `templates/`: lightweight formats for adding new epics and stories.

## Status Values

- `Backlog`: captured but not actively being worked.
- `In Progress`: currently being designed or implemented.
- `Done`: accepted and complete.

## Product Thesis

Recipe Mixer helps people transform recipes they already like into new variations that fit a cuisine inspiration, pantry, diet, skill level, time limit, or occasion.

The product should feel like a trustworthy recipe editor rather than a black-box generator. Users should understand what changed, why it changed, and what tradeoffs matter for cooking the result successfully.

## MVP Outcome

A user can paste a recipe or recipe link, choose a remix direction such as "French-inspired" or "Chinese-inspired," review the transformed recipe, understand the main changes, and save or copy the result.

## Epic Index

| Epic | Status | Title | Goal |
| --- | --- | --- | --- |
| [EPIC-001](epics/EPIC-001-recipe-input.md) | Backlog | Recipe Input | Accept recipe links and pasted recipes as remix sources. |
| [EPIC-002](epics/EPIC-002-remix-engine.md) | Backlog | Remix Engine | Transform recipes according to clear creative and practical constraints. |
| [EPIC-003](epics/EPIC-003-trust-and-safety.md) | Backlog | Trust And Safety | Make recipe changes explainable, cookable, and safe. |
| [EPIC-004](epics/EPIC-004-remix-experience.md) | Backlog | Remix Experience | Provide a focused, enjoyable flow for creating and adjusting remixes. |
| [EPIC-005](epics/EPIC-005-saving-and-sharing.md) | Backlog | Saving And Sharing | Let users keep, compare, and share remixed recipes. |
| [EPIC-006](epics/EPIC-006-mvp-foundation.md) | Backlog | MVP Foundation | Establish the technical and product foundation for launch. |

## Story Index

| Story | Status | Epic | Title |
| --- | --- | --- | --- |
| [STORY-000](stories/STORY-000-tech-stack-and-scaffolding.md) | Done | EPIC-006 | Tech Stack And Scaffolding |
| [STORY-001](stories/STORY-001-paste-recipe-text.md) | Done | EPIC-001 | Paste Recipe Text |
| [STORY-002](stories/STORY-002-import-recipe-link.md) | Backlog | EPIC-001 | Import Recipe Link |
| [STORY-003](stories/STORY-003-normalize-recipe-structure.md) | Done | EPIC-001 | Normalize Recipe Structure |
| [STORY-004](stories/STORY-004-select-remix-direction.md) | Backlog | EPIC-002 | Select Remix Direction |
| [STORY-005](stories/STORY-005-generate-remixed-recipe.md) | Backlog | EPIC-002 | Generate Remixed Recipe |
| [STORY-006](stories/STORY-006-show-what-changed.md) | Backlog | EPIC-003 | Show What Changed |
| [STORY-007](stories/STORY-007-cooking-sanity-check.md) | Backlog | EPIC-003 | Cooking Sanity Check |
| [STORY-008](stories/STORY-008-remix-adjustments.md) | Backlog | EPIC-004 | Remix Adjustments |
| [STORY-009](stories/STORY-009-compare-original-and-remix.md) | Backlog | EPIC-004 | Compare Original And Remix |
| [STORY-010](stories/STORY-010-save-remix.md) | Backlog | EPIC-005 | Save Remix |
| [STORY-011](stories/STORY-011-share-or-copy-remix.md) | Backlog | EPIC-005 | Share Or Copy Remix |
| [STORY-012](stories/STORY-012-mvp-app-shell.md) | Backlog | EPIC-006 | MVP App Shell |
| [STORY-013](stories/STORY-013-sqlite-backup-strategy.md) | Backlog | EPIC-006 | SQLite Backup Strategy |

## Development Order

Buildable dependency spine:

1. STORY-000: Tech Stack And Scaffolding
2. STORY-012: MVP App Shell
3. STORY-001: Paste Recipe Text
4. STORY-003: Normalize Recipe Structure
5. STORY-004: Select Remix Direction
6. STORY-005: Generate Remixed Recipe
7. STORY-007: Cooking Sanity Check
8. STORY-006: Show What Changed
9. STORY-009: Compare Original And Remix
10. STORY-008: Remix Adjustments
11. STORY-010: Save Remix
12. STORY-011: Share Or Copy Remix

Parallel or later work:

- STORY-002: Import Recipe Link after STORY-003.
- STORY-013: SQLite Backup Strategy after STORY-000.

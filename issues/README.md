# Recipe Mixer Issues

This folder captures the product backlog for a recipe remixing website. It is organized around epics and implementation-sized stories.

## Structure

- `epics/`: larger product outcomes that group related work.
- `stories/`: tangible user-facing or technical slices that can be designed, built, and tested.
- `templates/`: lightweight formats for adding new epics and stories.

## Product Thesis

Recipe Mixer helps people transform recipes they already like into new variations that fit a cuisine inspiration, pantry, diet, skill level, time limit, or occasion.

The product should feel like a trustworthy recipe editor rather than a black-box generator. Users should understand what changed, why it changed, and what tradeoffs matter for cooking the result successfully.

## MVP Outcome

A user can paste a recipe or recipe link, choose a remix direction such as "French-inspired" or "Chinese-inspired," review the transformed recipe, understand the main changes, and save or copy the result.

## Epic Index

| Epic | Title | Goal |
| --- | --- | --- |
| [EPIC-001](epics/EPIC-001-recipe-input.md) | Recipe Input | Accept recipe links and pasted recipes as remix sources. |
| [EPIC-002](epics/EPIC-002-remix-engine.md) | Remix Engine | Transform recipes according to clear creative and practical constraints. |
| [EPIC-003](epics/EPIC-003-trust-and-safety.md) | Trust And Safety | Make recipe changes explainable, cookable, and safe. |
| [EPIC-004](epics/EPIC-004-remix-experience.md) | Remix Experience | Provide a focused, enjoyable flow for creating and adjusting remixes. |
| [EPIC-005](epics/EPIC-005-saving-and-sharing.md) | Saving And Sharing | Let users keep, compare, and share remixed recipes. |
| [EPIC-006](epics/EPIC-006-mvp-foundation.md) | MVP Foundation | Establish the technical and product foundation for launch. |

## Story Index

| Story | Epic | Title |
| --- | --- | --- |
| [STORY-000](stories/STORY-000-tech-stack-and-scaffolding.md) | EPIC-006 | Tech Stack And Scaffolding |
| [STORY-001](stories/STORY-001-paste-recipe-text.md) | EPIC-001 | Paste Recipe Text |
| [STORY-002](stories/STORY-002-import-recipe-link.md) | EPIC-001 | Import Recipe Link |
| [STORY-003](stories/STORY-003-normalize-recipe-structure.md) | EPIC-001 | Normalize Recipe Structure |
| [STORY-004](stories/STORY-004-select-remix-direction.md) | EPIC-002 | Select Remix Direction |
| [STORY-005](stories/STORY-005-generate-remixed-recipe.md) | EPIC-002 | Generate Remixed Recipe |
| [STORY-006](stories/STORY-006-show-what-changed.md) | EPIC-003 | Show What Changed |
| [STORY-007](stories/STORY-007-cooking-sanity-check.md) | EPIC-003 | Cooking Sanity Check |
| [STORY-008](stories/STORY-008-remix-adjustments.md) | EPIC-004 | Remix Adjustments |
| [STORY-009](stories/STORY-009-compare-original-and-remix.md) | EPIC-004 | Compare Original And Remix |
| [STORY-010](stories/STORY-010-save-remix.md) | EPIC-005 | Save Remix |
| [STORY-011](stories/STORY-011-share-or-copy-remix.md) | EPIC-005 | Share Or Copy Remix |
| [STORY-012](stories/STORY-012-mvp-app-shell.md) | EPIC-006 | MVP App Shell |
| [STORY-013](stories/STORY-013-sqlite-backup-strategy.md) | EPIC-006 | SQLite Backup Strategy |

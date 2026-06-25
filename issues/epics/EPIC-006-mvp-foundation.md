# EPIC-006: MVP Foundation

Status: Done

## Goal

Build the minimum technical and product foundation needed to ship a reliable first version.

## Why It Matters

The first version needs enough structure to support recipe parsing, remix generation, iteration, and future quality improvements without becoming heavy before the product is validated.

## Scope

- Included: app shell, basic data model, API boundaries, model integration placeholder, logging, error handling, and initial quality evaluation.
- Not included: enterprise-grade moderation, advanced analytics, complex personalization, or paid subscription infrastructure.

## Success Criteria

- The app has a clear first-run flow from input to remix result.
- Recipe and remix data have stable shapes.
- Generation failures are handled gracefully.
- The team can test a small set of example recipes repeatedly.

## Stories

- [STORY-000: Tech Stack And Scaffolding](../stories/STORY-000-tech-stack-and-scaffolding.md)
- [STORY-012: MVP App Shell](../stories/STORY-012-mvp-app-shell.md)
- [STORY-013: SQLite Backup Strategy](../stories/STORY-013-sqlite-backup-strategy.md)

## Open Questions

- Which recipe extraction approach should be used first?
- What sample recipe set should be used for initial evaluation?

# EPIC-001: Recipe Input

Status: Done

## Goal

Let users provide an existing recipe as the starting point for a remix.

## Why It Matters

The strongest hook is remixing something the user already wants to cook. The input flow needs to be low-friction while preserving enough recipe structure for useful transformations.

## Scope

- Included: pasted recipe text, recipe URLs, basic recipe parsing, source attribution fields, and graceful handling of messy input.
- Not included: full web-scale recipe search, account libraries, image OCR, or browser extensions.

## Success Criteria

- A user can paste recipe text and continue to remix setup.
- A user can enter a recipe link and see extracted recipe details when supported.
- The system can normalize ingredients, steps, servings, timing, and notes into a consistent internal shape.
- The user is warned when the input is incomplete or ambiguous.

## Stories

- [STORY-001: Paste Recipe Text](../stories/STORY-001-paste-recipe-text.md)
- [STORY-002: Import Recipe Link](../stories/STORY-002-import-recipe-link.md)
- [STORY-003: Normalize Recipe Structure](../stories/STORY-003-normalize-recipe-structure.md)

## Open Questions

- Should URL import be part of the first MVP, or should MVP start with pasted text only?
- How much original source metadata should be displayed to users?
- What recipe sites should be tested first for link import?

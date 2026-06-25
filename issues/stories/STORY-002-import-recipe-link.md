# STORY-002: Import Recipe Link

Status: Backlog

## User Story

As a home cook, I want to paste a recipe URL, so that I can remix a recipe without manually copying all of its text.

## Context

Recipe links are a strong user convenience, but they are technically more variable than pasted text. The first version can support structured recipe metadata where available and fail gracefully otherwise.

## Acceptance Criteria

- Given I paste a supported recipe URL, when the app imports it, then I see the extracted title, ingredients, steps, servings, and timing where available.
- Given the URL cannot be imported, when extraction fails, then I receive a helpful fallback option to paste the recipe text manually.
- Given a recipe is imported from a link, when the remix is created, then the original source URL is preserved.

## Notes

- Prefer structured recipe data such as JSON-LD when available.
- Do not frame imported content as owned by Recipe Mixer.

## Dependencies

- STORY-003: Normalize Recipe Structure

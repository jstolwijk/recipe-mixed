# STORY-005: Generate Remixed Recipe

Status: Backlog

## User Story

As a home cook, I want the app to generate a complete remixed recipe, so that I can cook the new version.

## Context

This is the primary value moment. The result needs to be structured, readable, and practical enough to cook from.

## Acceptance Criteria

- Given a source recipe and remix direction, when I generate a remix, then I receive a complete recipe with title, servings, time, ingredients, steps, and notes.
- Given the remix changes major ingredients or techniques, when the recipe is shown, then those changes are coherent with the chosen direction.
- Given the model cannot satisfy a constraint, when the result is generated, then it explains the tradeoff instead of pretending everything worked.

## Notes

- Keep the output structured so later comparison, saving, and copying are easy.
- Include a short "why this works" note where useful.

## Dependencies

- STORY-004: Select Remix Direction

# STORY-007: Cooking Sanity Check

## User Story

As a home cook, I want the app to check the remixed recipe for obvious cooking problems, so that I do not waste ingredients on a broken recipe.

## Context

Recipe trust depends on avoiding preventable mistakes: missing temperatures, impossible timing, unsafe doneness advice, mismatched quantities, or substitutions that do not behave similarly.

## Acceptance Criteria

- Given a remixed recipe, when it is generated, then the app checks for missing core fields and obvious inconsistencies.
- Given a potential issue is detected, when the recipe is displayed, then I see a clear warning or note.
- Given the check is uncertain, when the note is shown, then it uses careful language and avoids false guarantees.

## Notes

- Start with a small checklist and expand based on failures observed in sample recipes.
- Consider deterministic checks for missing fields and model-assisted checks for culinary reasoning.

## Dependencies

- STORY-005: Generate Remixed Recipe

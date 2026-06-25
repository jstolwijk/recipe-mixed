# STORY-008: Remix Adjustments

## User Story

As a home cook, I want to adjust a remix after seeing it, so that I can make it fit my taste, pantry, or schedule.

## Context

The first generated recipe may be close but not perfect. Follow-up controls should make iteration quick without requiring the user to start over.

## Acceptance Criteria

- Given a remixed recipe, when I choose an adjustment such as less spicy, faster, simpler, vegetarian, or use pantry ingredients, then the app updates the recipe.
- Given I add a custom adjustment, when it is submitted, then the update respects the existing recipe context.
- Given a recipe is adjusted, when the new version appears, then the app preserves access to the prior version or original.

## Notes

- Common quick actions should be available as controls.
- Custom text can remain available for edge cases.

## Dependencies

- STORY-005: Generate Remixed Recipe
- STORY-006: Show What Changed

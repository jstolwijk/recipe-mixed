# STORY-006: Show What Changed

## User Story

As a home cook, I want to see what changed from the original recipe, so that I can trust and adjust the remix.

## Context

Change visibility is one of the clearest ways to differentiate the product from a generic chat response. It helps users understand substitutions, technique changes, and flavor intent.

## Acceptance Criteria

- Given a remix has been generated, when I review it, then I can see a concise summary of key changes.
- Given ingredients were replaced, added, or removed, when I inspect the ingredients, then the changes are labeled.
- Given technique or timing changed, when I inspect the steps, then important differences are called out.

## Notes

- Use labels such as kept, changed, added, removed, or optional.
- Keep explanations practical and cooking-oriented.

## Dependencies

- STORY-005: Generate Remixed Recipe

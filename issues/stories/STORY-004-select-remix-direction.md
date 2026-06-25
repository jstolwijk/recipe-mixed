# STORY-004: Select Remix Direction

## User Story

As a home cook, I want to choose how my recipe should be remixed, so that the result matches what I want to cook tonight.

## Context

The product should guide users through remix choices instead of requiring prompt-writing. Cuisine inspiration is the clearest first dimension, with other controls added carefully.

## Acceptance Criteria

- Given a parsed recipe, when I reach remix setup, then I can choose a cuisine-inspired direction.
- Given I want more control, when available, then I can add constraints such as diet, time, difficulty, spice level, or pantry ingredients.
- Given the chosen direction may imply fusion rather than authenticity, when it is displayed, then the wording uses "inspired" language.

## Notes

- Example directions: Chinese-inspired, French-inspired, Mexican-inspired, vegetarian, weeknight, dinner-party, pantry-friendly.
- Avoid claiming cultural authenticity unless the source and target are handled with appropriate expertise.

## Dependencies

- STORY-003: Normalize Recipe Structure

# EPIC-002: Remix Engine

## Goal

Transform a source recipe into a coherent remix that follows the user's chosen direction and remains practical to cook.

## Why It Matters

This is the core product promise. The remix needs to feel creative, but it also needs to respect cooking logic, ingredient ratios, technique, timing, and dietary constraints.

## Scope

- Included: cuisine-inspired remixes, dietary constraints, pantry substitutions, difficulty controls, time controls, and structured recipe output.
- Not included: professional nutrition certification, medical diet advice, or claims of cultural authenticity.

## Success Criteria

- A user can choose a remix direction and receive a complete recipe.
- The generated recipe includes servings, timing, ingredients, steps, and notes.
- Cuisine labels are phrased carefully, such as "French-inspired" rather than "authentic French."
- The remix preserves the useful backbone of the original recipe unless the user asks for a larger departure.

## Stories

- [STORY-004: Select Remix Direction](../stories/STORY-004-select-remix-direction.md)
- [STORY-005: Generate Remixed Recipe](../stories/STORY-005-generate-remixed-recipe.md)

## Open Questions

- Which remix dimensions belong in MVP: cuisine, diet, pantry, time, difficulty, or occasion?
- Should the system generate one best remix or multiple variants?
- How should the product handle conflicting constraints, such as vegan carbonara with strict authenticity?

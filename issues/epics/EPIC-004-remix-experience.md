# EPIC-004: Remix Experience

## Goal

Create a focused workflow for configuring, reviewing, and iterating on a recipe remix.

## Why It Matters

Users should not have to prompt-engineer their dinner. The interface should make common remix choices obvious and make iteration fast when the first result is close but not perfect.

## Scope

- Included: remix controls, adjustment controls, original-versus-remix comparison, loading and error states, and responsive layouts.
- Not included: complex meal planning, grocery ordering, or social feeds.

## Success Criteria

- A user can choose remix settings without writing a long prompt.
- A user can make follow-up adjustments such as "less spicy," "faster," or "use what I have."
- A user can compare the original recipe and remix without losing context.
- The core flow works well on mobile and desktop.

## Stories

- [STORY-008: Remix Adjustments](../stories/STORY-008-remix-adjustments.md)
- [STORY-009: Compare Original And Remix](../stories/STORY-009-compare-original-and-remix.md)

## Open Questions

- Should the first screen prioritize recipe input or remix examples?
- Which controls should be buttons, sliders, toggles, or free text?
- How much of the original recipe should stay visible while remixing?

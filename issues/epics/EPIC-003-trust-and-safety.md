# EPIC-003: Trust And Safety

## Goal

Help users trust the remixed recipe by explaining changes, checking cookability, and surfacing safety concerns.

## Why It Matters

Recipe generation fails when quantities, timing, substitutions, or food safety guidance are careless. Trust features should make the product feel like a careful cooking assistant, not a random text generator.

## Scope

- Included: change explanations, ingredient substitution notes, allergen reminders, doneness guidance, and basic sanity checks.
- Not included: medical advice, guaranteed allergen-free certification, or professional food safety auditing.

## Success Criteria

- A user can see which ingredients and steps changed from the original.
- The system flags risky or uncertain substitutions.
- The system checks for obvious issues such as missing cooking temperatures, impossible timing, or mismatched ingredient quantities.
- Safety language is careful and does not overpromise.

## Stories

- [STORY-006: Show What Changed](../stories/STORY-006-show-what-changed.md)
- [STORY-007: Cooking Sanity Check](../stories/STORY-007-cooking-sanity-check.md)

## Open Questions

- Should change explanations be inline, summarized, or both?
- What checks can be deterministic versus model-assisted?
- What level of allergen warning is useful without creating alarm fatigue?

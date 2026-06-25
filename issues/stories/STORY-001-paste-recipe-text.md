# STORY-001: Paste Recipe Text

Status: Backlog

## User Story

As a home cook, I want to paste a recipe into the app, so that I can remix it without relying on a supported website.

## Context

Pasted text is the lowest-risk recipe input path for the MVP. It avoids the fragility of recipe-site scraping while still proving the core remix value.

## Acceptance Criteria

- Given I have recipe text, when I paste it into the input area, then I can continue to the remix setup step.
- Given the pasted text appears too short or incomplete, when I try to continue, then I see a clear warning and can still decide whether to proceed.
- Given the pasted recipe includes a title, ingredients, steps, servings, or timing, when it is processed, then those fields are detected where possible.

## Notes

- Keep the input tolerant of imperfect formatting.
- Preserve the original pasted text for comparison and debugging.

## Dependencies

- STORY-003: Normalize Recipe Structure

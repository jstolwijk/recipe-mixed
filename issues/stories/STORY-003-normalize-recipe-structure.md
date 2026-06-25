# STORY-003: Normalize Recipe Structure

Status: Backlog

## User Story

As the system, I want to normalize recipe inputs into a consistent structure, so that remix generation can use reliable fields.

## Context

Remixing works better when the system has explicit fields for title, ingredients, steps, servings, timing, source, and notes rather than raw text only.

## Acceptance Criteria

- Given raw recipe input, when it is parsed, then the app creates a structured recipe object.
- Given some fields are missing, when the recipe object is created, then missing fields are represented explicitly rather than guessed silently.
- Given the user reviews the parsed recipe, when something looks wrong, then the structure can be corrected or regenerated in a later story.

## Notes

- MVP can start with model-assisted parsing, deterministic parsing, or a hybrid.
- Keep the normalized structure simple enough to inspect.

## Dependencies

- STORY-001: Paste Recipe Text

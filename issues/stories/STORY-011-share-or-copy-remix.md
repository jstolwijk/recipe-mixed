# STORY-011: Share Or Copy Remix

Status: Done

## User Story

As a home cook, I want to share or copy a remixed recipe, so that I can send it to someone or cook from another place.

## Context

Sharing can be lightweight in the first version. A clean copy format may be enough before public share pages are available.

## Acceptance Criteria

- Given I have a remixed recipe, when I copy it, then the copied text is cleanly formatted for cooking.
- Given share links are enabled, when I create a link, then it opens a readable version of the remix.
- Given a recipe came from a URL, when copied or shared, then the original source is included where appropriate.

## Notes

- Copy output should include title, servings, time, ingredients, steps, notes, and source.
- Public sharing may require storage and privacy decisions.

## Dependencies

- STORY-005: Generate Remixed Recipe
- STORY-010: Save Remix

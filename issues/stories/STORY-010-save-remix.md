# STORY-010: Save Remix

Status: Backlog

## User Story

As a home cook, I want to save a remixed recipe, so that I can come back to it later.

## Context

Saving makes the product useful beyond a single session. MVP can start with local storage before accounts if that keeps validation faster.

## Acceptance Criteria

- Given I have a remixed recipe, when I save it, then it appears in my saved recipes.
- Given I return later in the same browser, when local saving is used, then I can reopen the saved remix.
- Given a saved remix is opened, when I view it, then it includes the recipe, source context, and remix settings.

## Notes

- Consider naming saved recipes automatically from source and remix direction.
- Account-backed saving can be deferred until usage justifies it.

## Dependencies

- STORY-005: Generate Remixed Recipe

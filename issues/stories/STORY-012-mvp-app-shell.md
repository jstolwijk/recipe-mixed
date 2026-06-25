# STORY-012: MVP App Shell

Status: Backlog

## User Story

As a first-time user, I want a clear app flow from recipe input to remix result, so that I can understand the product quickly.

## Context

Before polishing every feature, the MVP needs a simple path that demonstrates the full idea: input, remix setup, generation, review, and save or copy.

## Acceptance Criteria

- Given I open the app, when I start, then I can enter a recipe and move through the main remix flow.
- Given a generation request is loading, when I wait, then I see a clear loading state.
- Given something fails, when the app cannot proceed, then I see a useful error state and a next action.
- Given I use the app on desktop or mobile, when I complete the flow, then the layout remains usable.

## Notes

- Keep the first screen focused on the usable product, not a marketing landing page.
- Leave space for examples, but do not make examples the only path.

## Dependencies

- STORY-000: Tech Stack And Scaffolding

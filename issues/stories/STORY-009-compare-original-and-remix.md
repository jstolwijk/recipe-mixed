# STORY-009: Compare Original And Remix

## User Story

As a home cook, I want to compare the original recipe with the remix, so that I can understand the transformation and decide what to cook.

## Context

Comparison supports trust and learning. It also makes the remix feel grounded in the source recipe rather than disconnected from it.

## Acceptance Criteria

- Given a remix has been generated, when I open comparison mode, then I can view the original and remixed recipe side by side on desktop.
- Given I am on mobile, when I compare recipes, then I can switch between original, remix, and changes without cramped layout.
- Given a section changed, when I inspect it, then I can identify the relevant difference.

## Notes

- Avoid overwhelming users with a full diff by default.
- Start with ingredients and key steps as the highest-value comparison areas.

## Dependencies

- STORY-006: Show What Changed

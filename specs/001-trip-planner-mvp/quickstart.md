# Quickstart: Trip Planner MVP

This guide walks through the feature flows defined in the spec.

## Flows

1) Sign in and view Trips
- Expect: list sorted by last updated, progress visible; empty state CTA otherwise.

2) Create Trip from addresses
- Enter name + addresses; validate; geocode; save; see trip in list.

3) View Trip Details (map + list)
- Markers render for all places; selecting marker highlights list item.

4) Place Details and visited toggle
- Toggle visited; verify progress updates; return to trip shows updated status.

5) Completion badge
- When all places are visited, badge appears in Trip and Trips views.

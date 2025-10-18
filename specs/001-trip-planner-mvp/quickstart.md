# Quickstart: Trip Planner MVP

This guide walks through the feature flows defined in the spec.

## Flows

1) Sign in and view Trips
- Expect: list sorted by last updated, progress visible; empty state CTA otherwise.

2) Create Trip and add addresses incrementally
- Create a trip with a name; on Trip Details, add one address at a time; validate/geocode; duplicates warn with merge option; see places appear.

3) View Trip Details (list + map preview)
- List renders all places; a small non-interactive map preview shows markers (no marker/list syncing in MVP).

4) Place Details and visited toggle
- Toggle visited; verify progress updates; return to trip shows updated status.

<!-- Badge flow removed from MVP -->

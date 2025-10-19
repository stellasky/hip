# Metrics & Success Criteria (MVP)

This document defines the events, properties, and queries that verify success criteria for the Trip Planner MVP.

## Events

- trip_created
  - properties: { tripId, placeCountAtCreate }
- place_geocoded
  - properties: { tripId, success: boolean }
- place_marked_visited
  - properties: { tripId, visited: boolean }
- login_success
  - properties: { method }

## Success Criteria Mapping

- SC-001: 80% of first-time users create a trip (≥1 place) within 3 minutes of login_success (first session). Query window: 14 days.
- SC-002: 70% of users who create a trip mark ≥1 place visited within 7 days.
- SC-003: 50% of trips reach “all places visited” within 30 days.
- SC-004: Mobile P75 time-to-interactive < 2.0s for Trips and Trip Details (Lighthouse Mobile: 5× CPU throttle, 4G).

## Verification

- Provide screenshots or query outputs that demonstrate the targets above were measured. Attach to this file or link from CI artifacts.

## Notes

- For local/dev, event sinks may be mocked; ensure event calls include all properties. In production, replace with your analytics pipeline.

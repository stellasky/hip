# Research: Trip Planner MVP

Date: 2025-10-16
Branch: 001-trip-planner-mvp

## Unknowns and Decisions

1) Testing strategy (unit/integration layout)
- Decision: Top-level tests/ with unit/ and integration/ subfolders (Choice B)
- Rationale: Clear separation of test types, easier CI targeting; aligns with Constitution gates.
- Alternatives: Co-located tests (faster proximity) rejected to keep separation and consistency across features.

2) Max places per trip
- Decision: 100 places per trip (Choice C)
- Rationale: Provides flexibility while remaining reasonable for mobile maps; monitor performance in telemetry.
- Alternatives: 25 (too restrictive), 50 (conservative baseline); can be configurable later.

3) Geocoding & map providers
- Decision: AWS Location Service (Maps/Places) (Option A)
- Rationale: Native AWS auth, strong fit with Amplify/backend-as-code, centralized governance and quotas; avoids embedding secrets.
- Alternatives: Mapbox (polished SDKs), Google (top geocoding quality), MapLibre+OSM (low cost). Can revisit if requirements change.

Implementation Note: Add Location resources via Amplify backend-as-code; integrate client with AWS SDK using Cognito session. Ensure lazy loading on mobile for performance.

## Best Practices and Patterns

- Mobile performance: Lazy-load map, defer heavy scripts, cache data, reuse markers, compress assets.
- UX: Clear empty states, optimistic UI for visited toggle, progress indicator.
- Data: Owner authorization per Constitution; avoid direct low-level SDK calls outside Amplify client.

## Consolidated Decisions Format

- Decision: [placeholder]
- Rationale: [why chosen]
- Alternatives considered: [what else evaluated]

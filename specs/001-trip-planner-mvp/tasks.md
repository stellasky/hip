---
description: "Task list for Trip Planner MVP"
---

# Tasks: Trip Planner MVP

**Input**: Design documents from `/specs/001-trip-planner-mvp/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include tests where they add clear value. For schema/auth changes, minimal integration verification is REQUIRED by the Constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 Ensure Amplify outputs wired (`src/main.tsx`) and Authenticator wraps app
- [X] T002 [P] Create top-level test directories: `tests/unit/`, `tests/integration/`
- [X] T003 [P] Establish testing presets and basic runners (documented; minimal scaffolding)
- [X] T004 Constitution Check: confirm lint/types/build gates are green
- [X] T004a [P] Build verification: `npm run build` produces `dist/` with no `tsc` errors and ESLint warnings (document CI gate)

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T010 Define Data models: Trip, Place, Badge in `amplify/data/resource.ts` (owner auth rules)
- [X] T011 [P] Generate Amplify Data client types in frontend and validate imports
- [X] T012 Add AWS Location Service resources via backend-as-code (maps/places) in `amplify/`
- [X] T013 [P] Client utility: lazy-load map SDK and thin wrapper for map rendering
- [X] T014 [P] Add geocoding utility calling AWS Location (with error handling and rate limiting notes)
- [X] T015 Update README quickstart section with feature flows (link quickstart.md)
- [ ] T016 [P] Integration check: data ownership enforcement — cross-user read/write must be denied
- [X] T017 Add PR migration note requirement template for schema/auth/Location resource changes

**Checkpoint**: Foundation ready - user stories can begin

---

## Phase 3: User Story 1 - Login (P1) 🎯 MVP

- [X] T020 [US1] Ensure login screen and redirect to Trips in src/App.tsx and src/pages/Trips.tsx
- [X] T021 [US1] Session persistence on refresh (Authenticator) in src/main.tsx
- [X] T022 [P] [US1] Integration check: tests/integration/login_redirect.spec.ts

---

## Phase 4: User Story 2 - View Trips (P1)

- [X] T030 [US2] Trips page: list user trips with name, place count, progress
- [X] T031 [US2] Sort trips by last updated
- [X] T032 [US2] Empty state with CTA to create trip
- [ ] T033 [P] [US2] Integration check: seed 2 trips → order and progress render correctly
- [X] T034 [US2] Trip deletion: allow user to delete a trip and confirm list updates
- [ ] T035 [P] [US2] Integration check: delete a trip → removed from list and progress recalculated

---

## Phase 5: User Story 3 - Create Trip & Incremental Address Add (P1)

- [X] T040 [US3] Create Trip form (name + addresses entry)
- [X] T041 [US3] Validate addresses; show actionable error on invalid
- [X] T042 [US3] Geocode addresses with AWS Location; create Place records
- [X] T043 [US3] Persist Trip and derived Places; return to Trips
- [X] T044 [P] [US3] Edge: partial geocoding failure path (proceed with valid; list failed)
- [ ] T045 [P] [US3] Integration check: create trip with 3 addresses → places created
- [X] T046 [US3] Duplicate address handling: detect duplicates and prompt user to dedupe or proceed

---

## Phase 6: User Story 4 - Trip Details + Map Preview (P2)

- [ ] T050 [US4] Non-interactive map preview component at src/components/MapPreview.tsx (render markers only)
- [ ] T051 [US4] Render list and preview on src/pages/TripDetails.tsx (no marker/list sync in MVP)
- [ ] T052 [US4] Distinguish visited/unvisited visually in src/pages/TripDetails.tsx
- [ ] T053 [P] [US4] Integration check: tests/integration/trip_details_preview_markers.spec.ts

---

## Phase 7: User Story 5 - Place Details & Toggle (P2)

- [ ] T060 [US5] Place Details page at src/pages/PlaceDetails.tsx: show name/address/visited state
- [ ] T061 [US5] Toggle visited/unvisited in src/pages/PlaceDetails.tsx and persist via src/lib/amplifyClient.ts; update progress in Trips
- [ ] T062 [P] [US5] Integration check: tests/integration/place_toggle_updates_progress.spec.ts

---

<!-- Phase 8 (Badge) removed from MVP scope -->

---

## Phase 9: Polish & Cross-Cutting

- [ ] T080 [P] Mobile performance: lazy-load AWS SDKs, verify P75 TTI < 2.0s (doc in docs/perf.md)
- [ ] T081 [P] Accessibility: labels/contrast for lists and preview (WCAG AA) in UI components
- [ ] T082 [P] Error handling: actionable messages for geocoding/data failures across src/pages/*.tsx
- [ ] T083 Documentation: update specs/001-trip-planner-mvp/quickstart.md and README.md
- [ ] T084 [P] Analytics: instrument trip_created, place_geocoded, place_marked_visited in src/lib/analytics.ts (stub)
- [ ] T085 [P] Performance measurement: Lighthouse Mobile 5x; record in docs/perf.md
- [ ] T086 [P] Contracts detail: update specs/001-trip-planner-mvp/contracts/openapi.md per final UI flows

---

## Dependencies & Execution Order

- Foundational phase blocks all stories
- US1, US2, US3 are P1 and should complete before P2 stories
- Integration checks are minimal and validate end-to-end flows per Constitution

---

## Notes

- Keep secrets out of client code; use Amplify-managed configuration.
- Prefer owner auth and client data access via Amplify Data client.
- Max places per trip in v1: 100.

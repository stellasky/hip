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

- [ ] T020 [US1] Ensure login screen route and redirect to Trips page on success
- [ ] T021 [US1] Session persistence on refresh (verify Authenticator behavior)
- [ ] T022 [P] [US1] Integration check: sign-in → land on Trips

---

## Phase 4: User Story 2 - View Trips (P1)

- [X] T030 [US2] Trips page: list user trips with name, place count, progress
- [X] T031 [US2] Sort trips by last updated
- [X] T032 [US2] Empty state with CTA to create trip
- [ ] T033 [P] [US2] Integration check: seed 2 trips → order and progress render correctly
- [X] T034 [US2] Trip deletion: allow user to delete a trip and confirm list updates
- [ ] T035 [P] [US2] Integration check: delete a trip → removed from list and progress recalculated

---

## Phase 5: User Story 3 - Create Trip (P1)

- [ ] T040 [US3] Create Trip form (name + addresses entry)
- [ ] T041 [US3] Validate addresses; show actionable error on invalid
- [ ] T042 [US3] Geocode addresses with AWS Location; create Place records
- [ ] T043 [US3] Persist Trip and derived Places; return to Trips
- [ ] T044 [P] [US3] Edge: partial geocoding failure path (proceed with valid; list failed)
- [ ] T045 [P] [US3] Integration check: create trip with 3 addresses → places created
- [ ] T046 [US3] Duplicate address handling: detect duplicates and prompt user to dedupe or proceed

---

## Phase 6: User Story 4 - Trip Details + Map (P2)

- [ ] T050 [US4] Trip Details page: list + map of places
- [ ] T051 [US4] Sync marker selection with list highlight and vice versa
- [ ] T052 [US4] Distinguish visited/unvisited visually
- [ ] T053 [P] [US4] Integration check: markers and list stay in sync

---

## Phase 7: User Story 5 - Place Details & Toggle (P2)

- [ ] T060 [US5] Place Details page: show name/address/visited state
- [ ] T061 [US5] Toggle visited/unvisited and persist; update progress
- [ ] T062 [P] [US5] Integration check: toggle visited updates trip progress

---

## Phase 8: User Story 6 - Completion Badge (P3)

- [ ] T070 [US6] Compute trip completion and award badge when all places visited
- [ ] T071 [US6] Show badge on Trips and Trip Details
- [ ] T072 [P] [US6] Integration check: last place visited → badge appears and persists

---

## Phase 9: Polish & Cross-Cutting

- [ ] T080 [P] Mobile performance: lazy-load heavy SDKs, prefetch data, verify P75 TTI < 2.0s (manual check)
- [ ] T081 [P] Accessibility: labels/contrast for map controls and lists (WCAG AA)
- [ ] T082 [P] Error handling: geocoding and data failures show actionable messages
- [ ] T083 Documentation: update quickstart.md and README with any changes
- [ ] T084 [P] Analytics instrumentation: log `trip_created`, `place_geocoded`, `place_marked_visited`, `trip_completed_badge_awarded`
- [ ] T085 [P] Performance measurement: run Lighthouse Mobile 5x, record P75 TTI for Trips and Trip Details (doc methodology)
- [ ] T086 [P] Contracts detail: update `contracts/openapi.md` with minimal fields/response shapes per action

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

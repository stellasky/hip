# Feature Specification: Trip Planner MVP

**Feature Branch**: `001-trip-planner-mvp`  
**Created**: 2025-10-16  
**Status**: Draft  
**Input**: User description: "Trip Planner mobile web app: login; trips list; create trip from addresses; view trip with map and places; mark place visited; place details page."

## Clarifications

### Session 2025-10-18

- Q: How should duplicate addresses within a trip be handled? → A: Warn and offer merge choice (default = merge).
- Q: What map experience is in scope for MVP? → A: List-first with a small non-interactive map preview on Trip Details; full interactive map deferred.
- Q: What address entry format and creation flow should MVP support? → A: Single address per add action (incremental) on Trip Details; no bulk entry in MVP.
- Q: What authentication posture and empty-state behavior should MVP use? → A: Require auth for all features; unauthenticated users see a login gate; empty Trips list shows a “Create your first trip” CTA.
- Q: How is trip progress calculated? → A: Progress = visited count / total geocoded places (exclude failed/un-geocoded entries from denominator).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Login to access trips (Priority: P1)

As a user, I can log in to access my trips and remain authenticated on refresh.

**Why this priority**: Required gateway for all other user journeys.

**Independent Test**: Attempt login with valid credentials and verify redirect to Trips page and session persistence after refresh.

**Acceptance Scenarios**:

1. Given I am logged out, when I enter valid credentials, then I am taken to the Trips page.
2. Given I am logged in, when I refresh, then I remain authenticated and see the Trips page.

---

### User Story 2 - View my trips (Priority: P1)

As a user, I can view a list of my trips sorted by last updated with progress.

**Why this priority**: Core home screen enabling navigation and progress.

**Independent Test**: Seed user with trips and verify list order, progress (visited/geocoded places), and empty state.

**Acceptance Scenarios**:

1. Trips list shows name, place count, and completion progress (% visited of geocoded places).
2. Empty state is shown when I have no trips, with a clear CTA to create a trip.

---

### User Story 3 - Create a trip and add addresses incrementally (Priority: P1)

As a user, I can create a trip by providing a name, then add addresses one at a time on the Trip Details page; each valid address becomes a place.

**Why this priority**: Enables users to start using the product.

**Independent Test**: Create a trip with a name; add one valid and one invalid address via the Trip Details add control; verify the valid address creates a place and the invalid address shows an actionable error.

**Acceptance Scenarios**:

1. I can enter a trip name and create the trip.
2. I can add addresses one at a time on Trip Details; each is validated/geocoded; invalid entries show an actionable error.
3. The trip appears in my trips list; added places reflect successful geocoding events.

---

### User Story 4 - Trip details with map preview and list (Priority: P2)

As a user, I can open a trip to see its places on a map and in a list.

**Why this priority**: Core visualization that supports navigation and status.

**Independent Test**: Open a trip and confirm list renders all places; a small non-interactive map preview renders markers (no marker/list syncing in MVP).

**Acceptance Scenarios**:

1. A small non-interactive map preview shows markers for places in the trip; the list shows the same places.
2. No marker/list sync interaction is required in MVP (deferred).
3. Visited places are visually distinct from unvisited.

---

### User Story 5 - Place details and visited toggle (Priority: P2)

As a user, I can view place details and mark it visited/unvisited.

**Why this priority**: Drives progress and completion.

**Independent Test**: Toggle visited and verify persistence and progress update.

**Acceptance Scenarios**:

1. Place details include name/address and visited state.
2. I can toggle visited state; the trip’s progress updates accordingly.

---

<!-- Removed: Completion badge scope (de-scoped from MVP) -->

### Edge Cases

- Invalid address entry: show actionable error; block place creation until valid.
- No places in trip: show empty state guidance to add places.
- Duplicate addresses: warn and offer merge; default merges duplicates into a single place.
- Partial geocoding failure: create trip with valid places; list failed entries for retry.
<!-- Removed badge-related edge case -->

## Requirements *(mandatory)*

### Functional Requirements

- FR-001 Authentication: The system MUST authenticate users before accessing trips.
- FR-002 Trips CRUD: The system MUST allow create/read/delete of trips per authenticated user. Trip creation is name-only; place entry occurs post-creation on Trip Details.
- FR-003 Address Entry (Incremental): The system MUST accept user-entered addresses one at a time on Trip Details (no bulk import in MVP).
- FR-004 Geocoding: The system MUST geocode each added address to coordinates and create place records upon success; invalid entries MUST surface actionable errors without creating places. Invalid Address UX: show inline error copy (e.g., "We couldn’t find that address. Try a nearby landmark or a full street address."), provide a Retry affordance, and retain the input; do not create a Place on failure.
- FR-005 Trip View: The system MUST display a list of trips with progress, where progress = visited count / total geocoded places (exclude failed/un-geocoded entries from the denominator).
- FR-006 Trip Details: The system MUST display a list of places and a small non-interactive map preview on Trip Details; interactive marker/list synchronization is out of scope for MVP. Map preview dimensions: mobile (<640px) height 180px; ≥640px height 240px; width 100%; render up to 50 markers; no pan/zoom controls or interactions.
- FR-007 Place Details: The system MUST display place name/address and visited state.
- FR-008 Visited Toggle: The system MUST allow marking a place as visited/unvisited and update progress.
<!-- Removed FR-009 Completion Logic (badge) -->
- FR-010 Data Ownership: Users MUST only access their own trips and places.
- FR-011 Duplicate Handling: When creating or updating a trip from addresses, the system MUST detect duplicate addresses (exact or geocoding-equivalent), warn the user, and offer to merge; the default action MUST merge duplicates into a single place.
- FR-011a Duplicate Equivalence Rule: Two addresses are considered duplicates if the geocoder returns the same place/feature identifier OR the computed distance between geocoded coordinates is ≤ 25 meters (WGS84). Merge behavior: default action = merge into a single Place; retain earliest createdAt; visited = visitedA OR visitedB; keep most complete display name/address.

<!-- FR-012 merged into FR-002 -->

### Key Entities *(include if feature involves data)*

- User: id, email, name, createdAt
- Trip: id, userId (owner), name, createdAt, updatedAt
- Place: id, tripId, name, address, lat, lng, visited (bool), description?, visitedAt?
<!-- Badge entity removed from MVP -->

Note: description and visitedAt are not displayed in MVP UI; visitedAt may be set when toggled to visited for future use.

### Non-Functional Requirements

- NFR-001 Max places per trip: 100 (v1). Attempts to exceed show: "You’ve reached the maximum (100) places for this trip."
- NFR-002 Accessibility: UI meets WCAG 2.2 AA for color contrast, focus states, and semantics for lists and the preview map.
- NFR-003 Performance: Mobile P75 time-to-interactive < 2.0s for Trips and Trip Details, measured via Lighthouse Mobile (5× CPU throttle, 4G profile).

### Measurement & Analytics

Events:
- trip_created { tripId, placeCountAtCreate }
- place_geocoded { tripId, success: boolean }
- place_marked_visited { tripId, visited: boolean }
- login_success { method }

Success Criteria Mapping:
- SC-001: 80% of first-time users create a trip (≥1 place) within 3 minutes of login_success (first session). Query window: 14 days.
- SC-002: 70% of users who create a trip mark ≥1 place visited within 7 days.
- SC-003: 50% of trips reach “all places visited” within 30 days.

Acceptance: Provide a docs/metrics.md with example queries or dashboard screenshots covering SC-001..003 and SC-004.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- SC-001: 80% of users can create their first trip (≥1 place) within 3 minutes of first login.
- SC-002: 70% of users who create a trip visit at least one place within 7 days.
- SC-003: 50% of trips created reach completion (all places visited) within 30 days.
- SC-004: Mobile P75 time-to-interactive < 2.0s on a typical 4G connection for Trips and Trip Details pages.


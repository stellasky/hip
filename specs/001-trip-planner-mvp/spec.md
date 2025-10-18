# Feature Specification: Trip Planner MVP

**Feature Branch**: `001-trip-planner-mvp`  
**Created**: 2025-10-16  
**Status**: Draft  
**Input**: User description: "Trip Planner mobile web app: login; trips list; create trip from addresses; view trip with map and places; mark place visited; place details page."

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

**Independent Test**: Seed user with trips and verify list order, progress, and empty state.

**Acceptance Scenarios**:

1. Trips list shows name, place count, and completion progress (% visited).
2. Empty state is shown when I have no trips, with a clear CTA to create a trip.

---

### User Story 3 - Create a trip from addresses (Priority: P1)

As a user, I can create a trip by entering addresses that become places.

**Why this priority**: Enables users to start using the product.

**Independent Test**: Submit a trip with valid and invalid addresses; verify geocoding and error handling.

**Acceptance Scenarios**:

1. I can enter a trip name and one or more addresses.
2. Addresses are validated/geocoded; invalid entries show an actionable error.
3. Upon save, the trip appears in my trips list with derived places.

---

### User Story 4 - Trip details with map and list (Priority: P2)

As a user, I can open a trip to see its places on a map and in a list.

**Why this priority**: Core visualization that supports navigation and status.

**Independent Test**: Open a trip and confirm markers and list are synchronized.

**Acceptance Scenarios**:

1. Map shows markers for all places in the trip; the list shows the same places.
2. Tapping a marker highlights the corresponding list item (and vice versa).
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
- Duplicate addresses: warn and allow dedupe or proceed.
- Partial geocoding failure: create trip with valid places; list failed entries for retry.
<!-- Removed badge-related edge case -->

## Requirements *(mandatory)*

### Functional Requirements

- FR-001 Authentication: The system MUST authenticate users before accessing trips.
- FR-002 Trips CRUD: The system MUST allow create/read/delete of trips per authenticated user.
- FR-003 Address Entry: The system MUST accept user-entered addresses when creating a trip.
- FR-004 Geocoding: The system MUST geocode addresses to coordinates and create place records.
- FR-005 Trip View: The system MUST display a list of trips with progress (visited/total places).
- FR-006 Trip Details: The system MUST display a map of places and a synchronized list.
- FR-007 Place Details: The system MUST display place name/address and visited state.
- FR-008 Visited Toggle: The system MUST allow marking a place as visited/unvisited and update progress.
<!-- Removed FR-009 Completion Logic (badge) -->
- FR-010 Data Ownership: Users MUST only access their own trips and places.

### Key Entities *(include if feature involves data)*

- User: id, email, name, createdAt
- Trip: id, userId (owner), name, createdAt, updatedAt
- Place: id, tripId, name, address, lat, lng, visited (bool), description?, visitedAt?
<!-- Badge entity removed from MVP -->

## Success Criteria *(mandatory)*

### Measurable Outcomes

- SC-001: 80% of users can create their first trip (≥1 place) within 3 minutes of first login.
- SC-002: 70% of users who create a trip visit at least one place within 7 days.
- SC-003: 50% of trips created reach completion (all places visited) within 30 days.
- SC-004: Mobile P75 time-to-interactive < 2.0s on a typical 4G connection for Trips and Trip Details pages.


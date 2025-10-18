# Data Model: Trip Planner MVP

Date: 2025-10-16

## Entities

### User
- id
- email
- name
- createdAt

### Trip
- id
- userId (owner)
- name
- createdAt
- updatedAt

### Place
- id
- tripId (FK Trip)
- name
- address
- lat
- lng
- visited (bool)
- description? (optional)
- visitedAt? (optional)


## Relationships
- User 1—N Trip
- Trip 1—N Place
<!-- Badge entity removed from MVP -->

## Validation Rules
- Trip.name: required, length 1–100
- Place.address: required
- Place.lat/lng: must be valid coordinates (-90..90, -180..180)
- visited: default false

## Derived State
- Trip.progress = visitedPlaces / totalPlaces
<!-- Badge awarding removed from MVP -->

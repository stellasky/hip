# Contracts: Trip Planner MVP (Conceptual)

Note: Technology-agnostic shapes. Fields are minimal for MVP; IDs are opaque strings.

## Types
- Trip: { id, name, placesCount, visitedCount, updatedAt }
- Place: { id, tripId, name, address, lat, lng, visited }
<!-- Badge type removed from MVP -->

## Trips
- List trips
	- Request: {}
	- Response: { items: Trip[] }

- Create trip
	- Request: { name: string, addresses: string[] }
	- Response: { trip: Trip, places: Place[] }

- Delete trip
	- Request: { id: string }
	- Response: { ok: boolean }

## Trip Details
- Get trip
	- Request: { id: string }
	- Response: { trip: Trip, places: Place[] }

## Places
- Get place
	- Request: { id: string }
	- Response: { place: Place }

- Toggle visited
	- Request: { id: string, visited: boolean }
	- Response: { place: Place, trip: Trip }

<!-- Badge contracts removed from MVP -->

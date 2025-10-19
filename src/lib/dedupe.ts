/**
 * Duplicate detection and merge utilities for Places.
 *
 * Rules (from spec):
 * - Two addresses are duplicates if they share the same geocoded place/feature identifier, OR
 *   the distance between coordinates is ≤ threshold meters (default 25m, WGS84).
 * - Merge behavior: default action = merge into a single Place; retain earliest createdAt;
 *   visited = visitedA OR visitedB; keep most complete display name/address.
 */

export interface PlaceLike {
  id?: string
  placeId?: string | null
  name?: string | null
  address?: string | null
  lat: number
  lng: number
  visited?: boolean | null
  createdAt?: string | Date | null
}

export interface DuplicateOptions {
  distanceThresholdMeters?: number // default 25m
}

const EARTH_RADIUS_M = 6371000 // meters

/** Compute Haversine distance between two WGS84 coordinates in meters. */
export function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  if (!isFinite(a.lat) || !isFinite(a.lng) || !isFinite(b.lat) || !isFinite(b.lng)) {
    throw new Error('Invalid coordinates for haversine distance')
  }
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return EARTH_RADIUS_M * c
}

/** Determine if two places are duplicates by placeId or proximity threshold. */
export function isDuplicate(a: PlaceLike, b: PlaceLike, options?: DuplicateOptions): boolean {
  const threshold = options?.distanceThresholdMeters ?? 25
  if (a.placeId && b.placeId && a.placeId === b.placeId) return true
  const distance = haversineMeters({ lat: a.lat, lng: a.lng }, { lat: b.lat, lng: b.lng })
  return distance <= threshold
}

function parseDate(d?: string | Date | null): Date | null {
  if (!d) return null
  if (d instanceof Date) return d
  const parsed = new Date(d)
  return isNaN(parsed.getTime()) ? null : parsed
}

function pickMostCompleteString(a?: string | null, b?: string | null): string | undefined {
  const sa = (a ?? '').trim()
  const sb = (b ?? '').trim()
  if (sa && sb) return sa.length >= sb.length ? sa : sb
  if (sa) return sa
  if (sb) return sb
  return undefined
}

/**
 * Merge two places following merge rules.
 * - Retain earliest createdAt when available
 * - visited is OR of both
 * - name/address: keep the most complete (simple heuristic: longer non-empty string)
 * - Coordinates: keep from `primary` (first arg) to avoid jitter; caller can choose order
 */
export function mergePlaces(primary: PlaceLike, secondary: PlaceLike): PlaceLike {
  const createdPrimary = parseDate(primary.createdAt)
  const createdSecondary = parseDate(secondary.createdAt)
  const earliest = createdPrimary && createdSecondary
    ? (createdPrimary.getTime() <= createdSecondary.getTime() ? createdPrimary : createdSecondary)
    : createdPrimary ?? createdSecondary ?? null

  const visited = Boolean(primary.visited) || Boolean(secondary.visited)

  return {
    id: primary.id ?? secondary.id,
    placeId: primary.placeId ?? secondary.placeId ?? null,
    name: pickMostCompleteString(primary.name, secondary.name),
    address: pickMostCompleteString(primary.address, secondary.address),
    lat: primary.lat,
    lng: primary.lng,
    visited,
    createdAt: earliest ?? undefined,
  }
}

export default {
  haversineMeters,
  isDuplicate,
  mergePlaces,
}

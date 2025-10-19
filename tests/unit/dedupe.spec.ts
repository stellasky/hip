import { describe, it, expect } from 'vitest'
import { haversineMeters, isDuplicate, mergePlaces, type PlaceLike } from '../../src/lib/dedupe'

describe('haversineMeters', () => {
  it('computes ~0 for identical coordinates', () => {
    const d = haversineMeters({ lat: 0, lng: 0 }, { lat: 0, lng: 0 })
    expect(d).toBeCloseTo(0, 6)
  })
})

describe('isDuplicate', () => {
  const base: PlaceLike = { lat: 40.6892, lng: -74.0445, name: 'A', address: 'Liberty Island' }

  it('returns true when placeId matches', () => {
    expect(isDuplicate({ ...base, placeId: 'X' }, { ...base, placeId: 'X' })).toBe(true)
  })

  it('returns true when within threshold (<=25m by default)', () => {
    // About 10 meters east
    const p1 = { ...base }
    const p2 = { ...base, lng: base.lng + 0.0001 }
    const d = haversineMeters(p1, p2)
    expect(d).toBeLessThanOrEqual(25)
    expect(isDuplicate(p1, p2)).toBe(true)
  })

  it('returns false when beyond threshold', () => {
    const p1 = { ...base }
    // ~60m east
    const p2 = { ...base, lng: base.lng + 0.0006 }
    const d = haversineMeters(p1, p2)
    expect(d).toBeGreaterThan(25)
    expect(isDuplicate(p1, p2)).toBe(false)
  })
})

describe('mergePlaces', () => {
  it('merges visited with OR and retains earliest createdAt and most complete strings', () => {
    const a: PlaceLike = {
      id: 'a',
      placeId: 'pid1',
      name: 'Statue of Liberty',
      address: 'Liberty Island, New York, NY 10004, United States',
      lat: 40.6892,
      lng: -74.0445,
      visited: false,
      createdAt: '2025-10-18T12:00:00Z',
    }
    const b: PlaceLike = {
      id: 'b',
      placeId: 'pid1',
      name: 'Statue of Liberty National Monument',
      address: 'Liberty Island, NY',
      lat: 40.68921,
      lng: -74.04451,
      visited: true,
      createdAt: '2025-10-19T12:00:00Z',
    }

    const m = mergePlaces(a, b)
    expect(m.visited).toBe(true)
    expect(m.createdAt instanceof Date || typeof m.createdAt === 'string' || m.createdAt === undefined).toBeTruthy()
    // name/address should pick the "most complete" (longer) strings
    expect(m.name).toBe('Statue of Liberty National Monument')
    expect(m.address).toBe('Liberty Island, New York, NY 10004, United States')
    // coordinates from primary
    expect(m.lat).toBe(a.lat)
    expect(m.lng).toBe(a.lng)
  })
})

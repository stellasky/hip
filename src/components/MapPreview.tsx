import { useEffect, useRef } from 'react'
import { loadMapLibre } from '../lib/map'
import outputsJson from "../../amplify_outputs.json";

type AmplifyOutputs = { auth?: { aws_region?: string } }
const outputs = outputsJson as unknown as AmplifyOutputs

type Marker = { lat: number; lng: number; name?: string | null }

export interface MapPreviewProps {
  mapName: string
  markers: Marker[]
}

/**
 * Non-interactive map preview (no gestures/controls)
 * - Height: 180px on mobile (<640px), 240px on wider screens; width: 100%
 * - Up to 50 markers rendered
 */
export function MapPreview({ mapName, markers }: MapPreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let map: import('maplibre-gl').Map | undefined
    ;(async () => {
      if (!containerRef.current) return
      const maplibre = await loadMapLibre()

      const capped = markers.slice(0, 50)
      const center: [number, number] = capped.length
        ? [capped[0].lng, capped[0].lat]
        : [0, 0]

      const region = outputs.auth?.aws_region ?? 'us-east-1'
      const m = new maplibre.Map({
        container: containerRef.current,
        style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor`,
        center,
        zoom: 10,
        interactive: false, // disable interactions
      })
      map = m
      capped.forEach((p) => {
        new maplibre.Marker({ draggable: false })
          .setLngLat([p.lng, p.lat])
          .addTo(m)
      })
    })()

    return () => {
      try {
        map?.remove?.()
      } catch {
        /* ignore */
      }
    }
  }, [mapName, markers])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '180px' }}
      className="map-preview"
    />
  )
}

export default MapPreview

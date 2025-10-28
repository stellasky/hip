import { useRef, useState } from "react";
import { geocodeText } from "../lib/geocode";
import { isDuplicate, mergePlaces, type PlaceLike } from "../lib/dedupe";

interface AddPlaceDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (place: Omit<PlaceLike, "id">) => Promise<void>;
  existingPlaces: PlaceLike[];
  placeIndexName: string;
  cap?: number;
}

export default function AddPlaceDialog({ open, onClose, onAdd, existingPlaces, placeIndexName, cap = 100 }: AddPlaceDialogProps) {
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when dialog opens
  if (open && inputRef.current) {
    inputRef.current.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    if (!address.trim()) {
      setError("Enter an address");
      return;
    }
    if (existingPlaces.length >= cap) {
      setError(`You’ve reached the maximum (${cap}) places for this trip.`);
      return;
    }
    const geo = await geocodeText(placeIndexName, address.trim());
    if (!geo) {
      setError("We couldn’t find that address. Try a nearby landmark or a full street address.");
      return;
    }
    const candidate: PlaceLike = {
      name: geo.label ?? address,
      address,
      lat: geo.lat,
      lng: geo.lng,
      visited: false,
      createdAt: new Date().toISOString(),
    };
    const dup = existingPlaces.find((p) => isDuplicate(p, candidate));
    if (dup) {
      if (window.confirm("We found a nearby place that looks like a duplicate. Merge into the existing place? (default = Merge)")) {
        // Merge and update handled by parent
        await onAdd(mergePlaces(dup, candidate));
      } else {
        await onAdd(candidate);
      }
    } else {
      await onAdd(candidate);
    }
    setAddress("");
    onClose();
  }

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" className="add-place-dialog" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320, boxShadow: '0 2px 16px #0002' }}>
        <h2>Add Place</h2>
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          style={{ width: '100%', marginBottom: 8 }}
          aria-label="Address"
        />
        {error && <div role="alert" style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
}

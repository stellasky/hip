import React from 'react';
import { listBands } from '../../services/bandService';

export function BandList({ onSelect }: { onSelect: (bandId: string) => void }) {
  const bands = listBands();
  return (
    <ul>
      {bands.map((b) => (
        <li key={b.id}>
          <button type="button" onClick={() => onSelect(b.id)}>{b.name}</button>
        </li>
      ))}
    </ul>
  );
}

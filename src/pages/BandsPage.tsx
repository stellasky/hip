import { BandList } from '../components/bands/BandList';
import { useNavigate } from 'react-router-dom';

export function BandsPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Select a Band</h1>
      <BandList onSelect={(id) => navigate(`/band/${id}`)} />
    </div>
  );
}

import { Routes, Route } from 'react-router-dom';
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import PlaceDetails from './pages/PlaceDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Trips />} />
      <Route path="/trip/:id" element={<TripDetails />} />
      <Route path="/place/:id" element={<PlaceDetails />} />
    </Routes>
  );
}

export default App;

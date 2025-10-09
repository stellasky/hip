import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { VisitedProvider } from './context/VisitedContext';
import { BandsPage } from './pages/BandsPage';
import { BandDetailPage } from './pages/BandDetailPage';
import { POIDetailPage } from './pages/POIDetailPage';

function App() {
  const persistenceOn = ((import.meta as any)?.env?.VITE_USE_AMPLIFY_VISITS === 'true') || (typeof process !== 'undefined' && (process as any).env?.VITE_USE_AMPLIFY_VISITS === 'true');
  return (
    <VisitedProvider>
      {persistenceOn && (
        <div role="status" aria-label="env-banner" style={{ background: '#f0f9ff', color: '#0369a1', padding: '6px 10px', fontSize: '0.9rem' }}>
          Amplify visit persistence: ON
        </div>
      )}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BandsPage />} />
          <Route path="/band/:id" element={<BandDetailPage />} />
          <Route path="/poi/:id" element={<POIDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </VisitedProvider>
  );
}

export default App;

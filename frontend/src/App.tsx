import { Route, Routes } from 'react-router';
import { ServiceDetailPage } from '@/pages/ServiceDetailPage';
import { LandingPage } from './pages/LandingPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/servicos/:id" element={<ServiceDetailPage />} />
    </Routes>
  );
}
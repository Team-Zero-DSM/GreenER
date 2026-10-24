import { Route, Routes } from 'react-router';
import { ServiceDetailPage } from '@/pages/ServiceDetailPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ComparisonPage } from '@/pages/ComparisonPage';

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/servicos/:id" element={<ServiceDetailPage />} />
        <Route path="/comparacao" element={<ComparisonPage />} />
      </Route>
    </Routes>
  );
}
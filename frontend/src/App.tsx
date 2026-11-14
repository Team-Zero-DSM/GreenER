
import { Navigate, Route, Routes } from 'react-router';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AuthPage } from '@/pages/AuthPage';
import { ServiceDetailPage } from '@/pages/ServiceDetailPage';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ComparisonPage } from '@/pages/ComparisonPage';
import { RegionPage } from '@/pages/RegionPage';
import { RankingPage } from '@/pages/RankingPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { PainelPage } from '@/pages/PainelPage';

export default function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<AuthPage />} />
            </Route>

            {/* Rotas padrão */}
            <Route element={<DashboardLayout />}>
                <Route path="/inicio" element={<LandingPage />} />
                <Route path="/painel" element={<PainelPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/servicos/:id" element={<ServiceDetailPage />} />
                <Route path="/comparacao" element={<ComparisonPage />} />
                <Route path="/regioes" element={<RegionPage />} />
                <Route path="/ranking" element={<RankingPage />} />
                <Route path="/perfil" element={<ProfilePage />} />
            </Route>
        </Routes>
    );
}

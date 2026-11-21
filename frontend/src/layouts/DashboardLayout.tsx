import { useLayoutEffect, useRef, useState } from 'react';
import {
    Activity,
    LayoutDashboard,
    Server,
    ArrowLeftRight,
    Globe,
    ListOrdered,
    UserRound,
} from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router';

import { MonitoringBar } from '@/components/MonitoringBar';
import { MonitoringProvider } from '@/contexts/MonitoringProvider';

const navItems = [
    {
        to: '/painel',
        label: 'Painel',
        icon: LayoutDashboard,
        prefixes: ['/painel'],
    },
    {
        to: '/dashboard',
        label: 'Serviços',
        icon: Server,
        prefixes: ['/dashboard', '/servicos'],
    },
    {
        to: '/regioes',
        label: 'Regiões',
        icon: Globe,
        prefixes: ['/regioes'],
    },
    {
        to: '/ranking',
        label: 'Ranking',
        icon: ListOrdered,
        prefixes: ['/ranking'],
    },
    {
        to: '/comparacao',
        label: 'Comparação',
        icon: ArrowLeftRight,
        prefixes: ['/comparacao'],
    },
];

const linkClass =
    'inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border px-2 py-2 text-xs whitespace-nowrap transition-colors sm:px-2.5';

const activeClass = 'border-emerald-400/45 bg-emerald-400/10 text-foreground';
const idleClass = 'border-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground';

interface DashboardHeaderProps {
    pathname: string;
    monitoringOpen: boolean;
    setMonitoringOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function DashboardHeader({
    pathname,
    monitoringOpen,
    setMonitoringOpen,
}: DashboardHeaderProps) {
    const headerRef = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        const header = headerRef.current;
        if (!header) return;

        const update = () =>
            document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);

        update();

        const observer = new ResizeObserver(update);
        observer.observe(header);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="sticky top-0 z-50 bg-background">
            <header ref={headerRef} className="border-b border-border bg-background">
                <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-4 py-3 sm:gap-4 sm:px-6">
                    <nav
                        aria-label="Seções do dashboard"
                        className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {navItems.map(({ to, label, icon: Icon, prefixes }) => {
                            const isActive =
                                pathname === to ||
                                prefixes.some((prefix) => pathname.startsWith(prefix));

                            return (
                                <NavLink
                                    key={to}
                                    to={to}
                                    className={`${linkClass} ${isActive ? activeClass : idleClass}`}
                                >
                                    <Icon aria-hidden="true" className="size-4 shrink-0" />
                                    {label}
                                </NavLink>
                            );
                        })}

                        <button
                            type="button"
                            aria-expanded={monitoringOpen}
                            aria-controls="monitoring-panel"
                            onClick={() => setMonitoringOpen((open) => !open)}
                            className={`${linkClass} ${
                                monitoringOpen ? activeClass : idleClass
                            }`}
                            title={
                                monitoringOpen
                                    ? 'Fechar informações de monitoramento'
                                    : 'Abrir informações de monitoramento'
                            }
                        >
                            <Activity aria-hidden="true" className="size-4 shrink-0" />
                            Monitoramento
                        </button>
                    </nav>

                    <NavLink
                        to="/inicio"
                        aria-label="GreenER — Início"
                        className="justify-self-center bg-linear-to-r from-emerald-300 to-cyan-400 bg-clip-text text-xl font-extrabold text-transparent sm:text-2xl"
                    >
                        Green<span className="font-light">ER</span>
                    </NavLink>

                    <NavLink
                        to="/perfil"
                        aria-label="Perfil"
                        title="Perfil"
                        className={`inline-flex size-10 items-center justify-center justify-self-end rounded-full border transition-colors ${
                            pathname === '/perfil' ? activeClass : idleClass
                        }`}
                    >
                        <UserRound aria-hidden="true" className="size-5" />
                    </NavLink>
                </div>
            </header>

            <div
                id="monitoring-panel"
                aria-hidden={!monitoringOpen}
                className={`absolute inset-x-0 top-full overflow-hidden border-b border-border bg-background transition-[transform,visibility] duration-300 ease-out ${
                    monitoringOpen
                        ? 'visible translate-y-0'
                        : 'invisible -translate-y-full'
                } motion-reduce:transition-none`}
            >
                <MonitoringBar />
            </div>
        </div>
    );
}

export function DashboardLayout() {
    const { pathname } = useLocation();
    const isLandingPage = pathname === '/inicio' || pathname === '/inicio/';

    const [monitoringOpen, setMonitoringOpen] = useState(false);

    return (
        <MonitoringProvider>
            <div className="dark flex min-h-screen flex-col bg-background text-foreground">
                <DashboardHeader
                    pathname={pathname}
                    monitoringOpen={monitoringOpen}
                    setMonitoringOpen={setMonitoringOpen}
                />

                <div className="flex-1">
                    <Outlet />
                </div>

                {!isLandingPage && (
                    <footer className="border-t border-border px-6 py-4 text-sm text-muted-foreground">
                        <p className="mx-auto max-w-7xl">
                            Os valores apresentados são estimativas calculadas a partir das métricas
                            disponíveis e de fatores regionais de emissão. Eles não representam uma
                            medição elétrica direta.
                        </p>
                    </footer>
                )}
            </div>
        </MonitoringProvider>
    );
}

import { useLayoutEffect, useRef, useState } from 'react';
import {
    House,
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
    { to: '/', label: 'Início', icon: House, prefixes: [] as string[] },
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
    'inline-flex min-h-11 items-center gap-1 rounded-lg border px-2 py-2 text-xs whitespace-nowrap transition-colors sm:gap-2 sm:px-3 sm:text-sm';

const activeClass = 'border-emerald-400/45 bg-emerald-400/10 text-foreground';
const idleClass = 'border-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground';

interface DashboardHeaderProps {
    pathname: string;
    monitoringLocked: boolean;
    setMonitoringLocked: React.Dispatch<React.SetStateAction<boolean>>;
}

function DashboardHeader({
    pathname,
    monitoringLocked,
    setMonitoringLocked,
}: DashboardHeaderProps) {
    const headerRef = useRef<HTMLElement>(null);

    const [monitoringHovered, setMonitoringHovered] = useState(false);
    const [monitoringFocused, setMonitoringFocused] = useState(false);

    const monitoringOpen = monitoringLocked || monitoringHovered || monitoringFocused;

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
        <div
            className="sticky top-0 z-50 bg-background"
            onMouseEnter={() => setMonitoringHovered(true)}
            onMouseLeave={() => setMonitoringHovered(false)}
            onFocusCapture={() => setMonitoringFocused(true)}
            onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setMonitoringFocused(false);
                }
            }}
        >
            <header ref={headerRef} className="border-b border-border bg-background">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 sm:gap-6 sm:px-6">
                    <NavLink
                        to="/"
                        className="bg-linear-to-r from-emerald-300 to-cyan-400 bg-clip-text text-xl font-extrabold text-transparent"
                    >
                        Green<span className="font-light">ER</span>
                    </NavLink>

                    <nav
                        aria-label="Seções do dashboard"
                        className="flex w-full justify-between gap-1 sm:w-auto sm:justify-start"
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
                                    <Icon aria-hidden="true" className="size-4" />
                                    {label}
                                </NavLink>
                            );
                        })}
                    </nav>
                    <NavLink
                        to="/perfil"
                        className={`${linkClass} ml-auto ${
                            pathname === '/perfil' ? activeClass : idleClass
                        }`}
                    >
                        <UserRound aria-hidden="true" className="size-4" />
                        Perfil
                    </NavLink>
                </div>
            </header>

            <div
                className={`sm:absolute sm:inset-x-0 sm:top-full sm:overflow-hidden ${
                    monitoringOpen ? 'sm:pointer-events-auto' : 'sm:pointer-events-none'
                }`}
            >
                <div
                    onClick={() => setMonitoringLocked((locked) => !locked)}
                    title={
                        monitoringLocked
                            ? 'Clique para desafixar a barra de monitoramento'
                            : 'Clique para fixar a barra de monitoramento'
                    }
                    className={`cursor-pointer border-b border-border bg-background sm:transition-[translate,visibility] sm:duration-300 sm:ease-out ${
                        monitoringOpen
                            ? 'sm:visible sm:translate-y-0'
                            : 'sm:invisible sm:-translate-y-full'
                    } motion-reduce:transition-none`}
                >
                    <MonitoringBar />
                </div>
            </div>
        </div>
    );
}

export function DashboardLayout() {
    const { pathname } = useLocation();
    const isLandingPage = pathname === '/';

    const [monitoringLocked, setMonitoringLocked] = useState(false);

    return (
        <MonitoringProvider>
            <div className="dark flex min-h-screen flex-col bg-background text-foreground">
                <DashboardHeader
                    key={pathname}
                    pathname={pathname}
                    monitoringLocked={monitoringLocked}
                    setMonitoringLocked={setMonitoringLocked}
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

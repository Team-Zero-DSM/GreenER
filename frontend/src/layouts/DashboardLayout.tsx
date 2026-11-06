import { House, Server, ArrowLeftRight, Globe, ListOrdered } from 'lucide-react';
import { MonitoringBar } from '@/components/MonitoringBar';
import { MonitoringProvider } from '@/contexts/MonitoringProvider';
import { useLayoutEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';

const navItems = [
    { to: '/', label: 'Início', icon: House, prefixes: [] as string[] },
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

export function DashboardLayout() {
    const { pathname } = useLocation();
    const isLandingPage = pathname === '/';
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
        <MonitoringProvider>
            <div className="dark flex min-h-screen flex-col bg-background text-foreground">
                <div className="group sticky top-0 z-50 bg-background">
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
                        </div>
                    </header>
                    <div className="sm:pointer-events-none sm:absolute sm:inset-x-0 sm:top-full sm:overflow-hidden sm:group-hover:pointer-events-auto sm:group-focus-within:pointer-events-auto">
                        <div className="border-b border-border bg-background sm:invisible sm:-translate-y-full sm:transition-[translate,visibility] sm:duration-300 sm:ease-out sm:group-hover:visible sm:group-hover:translate-y-0 sm:group-focus-within:visible sm:group-focus-within:translate-y-0 motion-reduce:transition-none">
                            <MonitoringBar />
                        </div>
                    </div>
                </div>
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


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

// Navegação principal.
const navItems = [
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

// Links minimalistas com indicador inferior animado.
const navLinkClass =
    'group relative inline-flex min-h-12 shrink-0 items-center gap-2 rounded-lg px-3 text-[13px] font-semibold uppercase tracking-[0.075em] whitespace-nowrap transition-colors after:absolute after:bottom-1 after:left-3 after:right-3 after:h-[2px] after:origin-center after:scale-x-0 after:rounded-full after:bg-linear-to-r after:from-emerald-300 after:to-cyan-400 after:transition-transform after:duration-200';

const activeClass =
    'text-emerald-200 after:scale-x-100';

const idleClass =
    'text-slate-300/80 hover:text-emerald-100 hover:after:scale-x-100';

// Botões de acesso rápido.
const iconButtonClass =
    'inline-flex size-11 shrink-0 items-center justify-center rounded-full text-slate-300/80 transition-all hover:bg-white/[0.045] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70';

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

    // Atualiza a altura da header utilizada pelo restante da aplicação.
    useLayoutEffect(() => {
        const header = headerRef.current;
        if (!header) return;

        const update = () =>
            document.documentElement.style.setProperty(
                '--header-h',
                `${header.offsetHeight}px`,
            );

        update();

        const observer = new ResizeObserver(update);
        observer.observe(header);

        return () => observer.disconnect();
    }, []);

    return (
        <header
            ref={headerRef}
            className="relative z-30 w-full bg-transparent"
        >
            <div className="grid h-[104px] w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-4 sm:px-5 lg:px-6 2xl:px-8">

                {/* Navegação principal à esquerda. */}
                <nav
                    aria-label="Seções do dashboard"
                    className="flex min-w-0 items-center justify-self-start gap-1 lg:gap-2 xl:gap-2.5"
                >
                    {navItems.map(({ to, label, icon: Icon, prefixes }) => {
                        const isActive =
                            pathname === to ||
                            prefixes.some((prefix) => pathname.startsWith(prefix));

                        return (
                            <NavLink
                                key={to}
                                to={to}
                                title={label}
                                aria-label={label}
                                className={`${navLinkClass} ${
                                    isActive ? activeClass : idleClass
                                }`}
                            >
                                <Icon
                                    aria-hidden="true"
                                    className={`size-[18px] shrink-0 transition-colors ${
                                        isActive
                                            ? 'text-emerald-300'
                                            : 'text-slate-400 group-hover:text-cyan-200'
                                    }`}
                                />

                                <span className="hidden xl:inline">
                                    {label}
                                </span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Módulo central trapezoidal do GreenER. */}
                <NavLink
                    to="/inicio"
                    aria-label="Página inicial GreenER"
                    className="group relative isolate flex h-full w-[180px] items-center justify-center justify-self-center [filter:drop-shadow(0_12px_26px_rgba(0,0,0,0.28))] sm:w-[220px] lg:w-[260px] 2xl:w-[290px]"
                >
                    {/* Forma trapezoidal com base superior maior. */}
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 290 104"
                        preserveAspectRatio="none"
                        className="absolute inset-0 h-full w-full overflow-visible"
                    >
                        <defs>
                            <linearGradient
                                id="greener-header-fill"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#10283B"
                                    stopOpacity="0.99"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#071522"
                                    stopOpacity="0.98"
                                />
                            </linearGradient>

                            <linearGradient
                                id="greener-header-border"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#6EE7D1"
                                    stopOpacity="0.42"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#22D3EE"
                                    stopOpacity="0.22"
                                />
                            </linearGradient>

                            <radialGradient
                                id="greener-header-glow"
                                cx="50%"
                                cy="0%"
                                r="90%"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#22D3EE"
                                    stopOpacity="0.10"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#22D3EE"
                                    stopOpacity="0"
                                />
                            </radialGradient>
                        </defs>

                        {/* Fundo do módulo. */}
                        <path
                            d="
                                M 0 0
                                H 290
                                L 267 89
                                Q 264 102 251 102
                                H 39
                                Q 26 102 23 89
                                Z
                            "
                            fill="url(#greener-header-fill)"
                        />

                        <path
                            d="
                                M 0 0
                                H 290
                                L 267 89
                                Q 264 102 251 102
                                H 39
                                Q 26 102 23 89
                                Z
                            "
                            fill="url(#greener-header-glow)"
                        />

                        {/* Contorno lateral e inferior, sem linha no topo. */}
                        <path
                            d="
                                M 0 0
                                L 23 89
                                Q 26 102 39 102
                                H 251
                                Q 264 102 267 89
                                L 290 0
                            "
                            fill="none"
                            stroke="url(#greener-header-border)"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-opacity duration-300 group-hover:opacity-100"
                        />
                    </svg>

                    {/* Nome da aplicação. */}
                    <span className="relative z-10 bg-linear-to-r from-emerald-300 to-cyan-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent transition-opacity group-hover:opacity-85 sm:text-3xl lg:text-[2.6rem]">
                        Green<span className="font-light">ER</span>
                    </span>
                </NavLink>

                {/* Controles da região direita. */}
                <div className="flex min-w-0 items-center justify-self-end gap-2 sm:gap-3">

                    {/* Switch de monitoramento. */}
                    <button
                        type="button"
                        role="switch"
                        aria-checked={monitoringOpen}
                        aria-label="Monitoramento"
                        aria-controls="monitoring-panel"
                        onClick={() => setMonitoringOpen((open) => !open)}
                        title={
                            monitoringOpen
                                ? 'Desativar monitoramento'
                                : 'Ativar monitoramento'
                        }
                        className="group inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-300/80 transition-colors hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
                    >
                        <Activity
                            aria-hidden="true"
                            className={`size-[18px] shrink-0 transition-colors ${
                                monitoringOpen
                                    ? 'text-emerald-300'
                                    : 'text-slate-400 group-hover:text-cyan-200'
                            }`}
                        />

                        <span className="hidden xl:inline">
                            Monitoramento
                        </span>

                        {/* Indicador do switch. */}
                        <span
                            aria-hidden="true"
                            className={`relative h-[21px] w-10 shrink-0 rounded-full border transition-colors duration-200 ${
                                monitoringOpen
                                    ? 'border-emerald-300/40 bg-emerald-400/25'
                                    : 'border-white/15 bg-white/[0.07]'
                            }`}
                        >
                            <span
                                className={`absolute left-[2px] top-[2px] size-[15px] rounded-full shadow-sm transition-transform duration-200 ${
                                    monitoringOpen
                                        ? 'translate-x-[18px] bg-emerald-200'
                                        : 'translate-x-0 bg-slate-400'
                                }`}
                            />
                        </span>
                    </button>

                    {/* Separação dos controles de conta. */}
                    <div
                        aria-hidden="true"
                        className="mx-1 h-7 w-px bg-white/10"
                    />

                    {/* Painel personalizado. */}
                    <NavLink
                        to="/painel"
                        title="Painel personalizado"
                        aria-label="Painel personalizado"
                        className={`${iconButtonClass} ${
                            pathname === '/painel' ||
                            pathname.startsWith('/painel/')
                                ? 'text-emerald-300'
                                : ''
                        }`}
                    >
                        <LayoutDashboard
                            aria-hidden="true"
                            className="size-[22px]"
                        />
                    </NavLink>

                    {/* Perfil do usuário. */}
                    <NavLink
                        to="/perfil"
                        title="Perfil"
                        aria-label="Perfil"
                        className={`${iconButtonClass} ${
                            pathname === '/perfil'
                                ? 'text-emerald-300'
                                : ''
                        }`}
                    >
                        <UserRound
                            aria-hidden="true"
                            className="size-[22px]"
                        />
                    </NavLink>
                </div>
            </div>
        </header>
    );
}

export function DashboardLayout() {
    const { pathname } = useLocation();

    const isLandingPage =
        pathname === '/inicio' || pathname === '/inicio/';

    const [monitoringOpen, setMonitoringOpen] = useState(false);

    return (
        <MonitoringProvider>
            <div className="dark flex min-h-screen flex-col bg-background text-foreground">

                <DashboardHeader
                    pathname={pathname}
                    monitoringOpen={monitoringOpen}
                    setMonitoringOpen={setMonitoringOpen}
                />

                {/* Somente o monitoramento acompanha a rolagem. */}
                {monitoringOpen && (
                    <div
                        id="monitoring-panel"
                        className="sticky top-0 z-40 w-full"
                    >
                        <div className="border-b border-border bg-background/95 shadow-lg backdrop-blur-xl">
                            <MonitoringBar />
                        </div>
                    </div>
                )}

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

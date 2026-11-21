
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import {
    Activity,
    ArrowLeftRight,
    Globe,
    LayoutDashboard,
    ListOrdered,
    Menu,
    Server,
    UserRound,
    X,
} from 'lucide-react';

import { NavLink, Outlet, useLocation } from 'react-router';

import { MonitoringBar } from '@/components/MonitoringBar';
import { MonitoringProvider } from '@/contexts/MonitoringProvider';
import { Card } from '@/components/ui/card';

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

// Links com indicador inferior animado.
const navLinkClass =
    'group relative inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg border px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap tracking-[0.075em] transition-colors after:absolute after:bottom-1 after:left-3 after:right-3 after:h-[2px] after:origin-center after:scale-x-0 after:rounded-full after:bg-linear-to-r after:from-emerald-300 after:to-cyan-400 after:transition-transform after:duration-200 sm:px-4 xl:gap-2.5 xl:text-sm';

const activeClass =
    'border-transparent text-emerald-200 after:scale-x-100';

const idleClass =
    'border-transparent text-slate-300/80 hover:text-emerald-100 hover:after:scale-x-100';

// Botões de acesso rápido do desktop.
const iconButtonClass =
    'inline-flex size-[54px] shrink-0 items-center justify-center rounded-full border border-transparent text-slate-300/80 transition-all duration-200 hover:border-emerald-300/35 hover:bg-emerald-400/[0.10] hover:text-emerald-200 hover:shadow-[0_0_20px_rgba(52,211,153,0.20)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70';

const iconButtonActiveClass =
    'border-emerald-300/30 bg-emerald-400/10 text-emerald-200 shadow-[inset_0_0_14px_rgba(52,211,153,0.08)]';

// Aparência compartilhada dos menus mobile.
const mobileMenuClass =
    'absolute top-full z-50 mt-2 rounded-2xl border border-white/10 bg-[#081321]/95 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur-2xl';

const mobileMenuItemClass =
    'flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors';

interface DashboardHeaderProps {
    pathname: string;
    monitoringOpen: boolean;
    setMonitoringOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOverlay: boolean;
}

type MobileMenu = 'navigation' | 'actions' | null;

function DashboardHeader({
    pathname,
    monitoringOpen,
    setMonitoringOpen,
    isOverlay,
}: DashboardHeaderProps) {
    const headerRef = useRef<HTMLElement>(null);

    const [mobileMenu, setMobileMenu] = useState<MobileMenu>(null);

    // Atualiza a altura real da header.
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

    // Fecha os menus ao clicar fora ou pressionar Escape.
    useEffect(() => {
        if (!mobileMenu) return;

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target;

            if (
                target instanceof Node &&
                headerRef.current &&
                !headerRef.current.contains(target)
            ) {
                setMobileMenu(null);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileMenu(null);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [mobileMenu]);

    const toggleMobileMenu = (menu: Exclude<MobileMenu, null>) => {
        setMobileMenu((current) => (current === menu ? null : menu));
    };

    return (
        <header
            ref={headerRef}
            className={
                isOverlay
                    ? 'absolute inset-x-0 top-0 z-50 w-full bg-transparent'
                    : 'relative z-50 w-full bg-transparent'
            }
        >
            <div className="grid h-[76px] w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-3 sm:px-5 lg:h-[104px] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-6 2xl:px-8">

                {/* Menu mobile esquerdo. */}
                <button
                    type="button"
                    aria-label={
                        mobileMenu === 'navigation'
                            ? 'Fechar navegação'
                            : 'Abrir navegação'
                    }
                    aria-expanded={mobileMenu === 'navigation'}
                    aria-controls="mobile-navigation-menu"
                    onClick={() => toggleMobileMenu('navigation')}
                    className="col-start-1 row-start-1 inline-flex size-11 items-center justify-center justify-self-start rounded-full border border-white/10 bg-white/[0.035] text-slate-300 transition-colors hover:border-emerald-300/30 hover:bg-emerald-400/10 hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 lg:hidden"
                >
                    {mobileMenu === 'navigation' ? (
                        <X aria-hidden="true" className="size-5" />
                    ) : (
                        <Menu aria-hidden="true" className="size-5" />
                    )}
                </button>

                {/* Navegação principal do desktop. */}
                <nav
                    aria-label="Seções do dashboard"
                    className="col-start-1 row-start-1 hidden min-w-0 items-center justify-self-start gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex sm:gap-1 lg:gap-2 xl:gap-2.5"
                >
                    {navItems.map(({ to, label, icon: Icon, prefixes }) => {
                        const isActive =
                            pathname === to ||
                            prefixes.some((prefix) =>
                                pathname.startsWith(prefix),
                            );

                        return (
                            <NavLink
                                key={to}
                                to={to}
                                aria-label={label}
                                className={`${navLinkClass} ${
                                    isActive ? activeClass : idleClass
                                }`}
                            >
                                <Icon
                                    aria-hidden="true"
                                    className={`size-[19px] shrink-0 transition-colors xl:size-5 ${
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
                    className="group relative isolate col-start-2 row-start-1 flex h-[68px] w-[168px] items-center justify-center justify-self-center [filter:drop-shadow(0_12px_26px_rgba(0,0,0,0.28))] transition-[filter] duration-300 hover:[filter:drop-shadow(0_12px_26px_rgba(0,0,0,0.28))_drop-shadow(0_0_16px_rgba(34,211,238,0.28))_drop-shadow(0_0_28px_rgba(52,211,153,0.16))] sm:w-[190px] lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:h-full lg:w-[260px] 2xl:w-[290px]"
                >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 290 104"
                        preserveAspectRatio="none"
                        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
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

                        {/* Fundo do trapézio. */}
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

                        {/* Contorno sem linha superior. */}
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
                        />
                    </svg>

                    <span className="relative z-10 bg-linear-to-r from-emerald-300 to-cyan-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent transition-[filter] duration-300 group-hover:brightness-125 sm:text-3xl lg:text-[2.6rem]">
                        Green<span className="font-light">ER</span>
                    </span>
                </NavLink>

                {/* Controles da região direita no desktop. */}
                <div className="col-start-3 row-start-1 hidden min-w-0 items-center justify-self-end gap-1 sm:gap-2 lg:flex lg:gap-3">

                    {/* Switch de monitoramento. */}
                    <button
                        type="button"
                        role="switch"
                        aria-checked={monitoringOpen}
                        aria-label="Monitoramento"
                        aria-controls="monitoring-panel"
                        onClick={() =>
                            setMonitoringOpen((open) => !open)
                        }
                        title={
                            monitoringOpen
                                ? 'Desativar monitoramento'
                                : 'Ativar monitoramento'
                        }
                        className="group inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-300/80 transition-colors hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 sm:gap-2 sm:px-1.5"
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

                        <span
                            aria-hidden="true"
                            className={`relative h-[19px] w-9 shrink-0 rounded-full border transition-colors duration-200 ${
                                monitoringOpen
                                    ? 'border-emerald-300/40 bg-emerald-400/25'
                                    : 'border-white/15 bg-white/[0.07]'
                            }`}
                        >
                            <span
                                className={`absolute left-[2px] top-[2px] size-[13px] rounded-full shadow-sm transition-transform duration-200 ${
                                    monitoringOpen
                                        ? 'translate-x-4 bg-emerald-200'
                                        : 'translate-x-0 bg-slate-400'
                                }`}
                            />
                        </span>
                    </button>

                    <div
                        aria-hidden="true"
                        className="mx-0.5 h-6 w-px bg-white/10 sm:mx-1"
                    />

                    {/* Painel personalizado. */}
                    <NavLink
                        to="/painel"
                        aria-label="Painel personalizado"
                        className={`${iconButtonClass} ${
                            pathname === '/painel' ||
                            pathname.startsWith('/painel/')
                                ? iconButtonActiveClass
                                : ''
                        }`}
                    >
                        <LayoutDashboard
                            aria-hidden="true"
                            className="size-7"
                        />
                    </NavLink>

                    {/* Perfil do usuário. */}
                    <NavLink
                        to="/perfil"
                        aria-label="Perfil"
                        className={`${iconButtonClass} ${
                            pathname === '/perfil' ||
                            pathname.startsWith('/perfil/')
                                ? iconButtonActiveClass
                                : ''
                        }`}
                    >
                        <UserRound
                            aria-hidden="true"
                            className="size-7"
                        />
                    </NavLink>
                </div>

                {/* Menu mobile direito: área pessoal e personalização. */}
                <button
                    type="button"
                    aria-label={
                        mobileMenu === 'actions'
                            ? 'Fechar opções'
                            : 'Abrir opções pessoais'
                    }
                    aria-expanded={mobileMenu === 'actions'}
                    aria-controls="mobile-actions-menu"
                    onClick={() => toggleMobileMenu('actions')}
                    className="col-start-3 row-start-1 inline-flex size-11 items-center justify-center justify-self-end rounded-full border border-white/10 bg-white/[0.035] text-slate-300 transition-colors hover:border-emerald-300/30 hover:bg-emerald-400/10 hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 lg:hidden"
                >
                    {mobileMenu === 'actions' ? (
                        <X aria-hidden="true" className="size-5" />
                    ) : (
                        <UserRound aria-hidden="true" className="size-5" />
                    )}
                </button>
            </div>

            {/* Menu de navegação mobile. */}
            {mobileMenu === 'navigation' && (
                <nav
                    id="mobile-navigation-menu"
                    aria-label="Navegação principal"
                    className={`${mobileMenuClass} left-3 w-[min(17rem,calc(100vw-1.5rem))] lg:hidden`}
                >
                    <div className="flex flex-col gap-1">
                        {navItems.map(({ to, label, icon: Icon, prefixes }) => {
                            const isActive =
                                pathname === to ||
                                prefixes.some((prefix) =>
                                    pathname.startsWith(prefix),
                                );

                            return (
                                <NavLink
                                    key={to}
                                    to={to}
                                    onClick={() => setMobileMenu(null)}
                                    className={`${mobileMenuItemClass} ${
                                        isActive
                                            ? 'bg-emerald-400/10 text-emerald-200'
                                            : 'text-slate-200 hover:bg-white/[0.05] hover:text-emerald-100'
                                    }`}
                                >
                                    <Icon
                                        aria-hidden="true"
                                        className={`size-5 shrink-0 ${
                                            isActive
                                                ? 'text-emerald-300'
                                                : 'text-slate-400'
                                        }`}
                                    />
                                    <span>{label}</span>
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>
            )}

            {/* Menu de ações mobile. */}
            {mobileMenu === 'actions' && (
                <div
                    id="mobile-actions-menu"
                    aria-label="Ações rápidas"
                    className={`${mobileMenuClass} right-3 w-[min(18rem,calc(100vw-1.5rem))] lg:hidden`}
                >
                    <div className="flex flex-col gap-1">

                        {/* Monitoramento. */}
                        <button
                            type="button"
                            role="switch"
                            aria-checked={monitoringOpen}
                            onClick={() => {
                                setMonitoringOpen((open) => !open);
                                setMobileMenu(null);
                            }}
                            className={`${mobileMenuItemClass} justify-between text-slate-200 hover:bg-white/[0.05]`}
                        >
                            <span className="flex items-center gap-3">
                                <Activity
                                    aria-hidden="true"
                                    className={`size-5 shrink-0 ${
                                        monitoringOpen
                                            ? 'text-emerald-300'
                                            : 'text-slate-400'
                                    }`}
                                />
                                <span>Monitoramento</span>
                            </span>

                            <span
                                aria-hidden="true"
                                className={`relative h-[19px] w-9 shrink-0 rounded-full border transition-colors duration-200 ${
                                    monitoringOpen
                                        ? 'border-emerald-300/40 bg-emerald-400/25'
                                        : 'border-white/15 bg-white/[0.07]'
                                }`}
                            >
                                <span
                                    className={`absolute left-[2px] top-[2px] size-[13px] rounded-full shadow-sm transition-transform duration-200 ${
                                        monitoringOpen
                                            ? 'translate-x-4 bg-emerald-200'
                                            : 'translate-x-0 bg-slate-400'
                                    }`}
                                />
                            </span>
                        </button>

                        <div className="my-1 h-px bg-white/10" />

                        {/* Painel personalizado. */}
                        <NavLink
                            to="/painel"
                            onClick={() => setMobileMenu(null)}
                            className={`${mobileMenuItemClass} ${
                                pathname === '/painel' ||
                                pathname.startsWith('/painel/')
                                    ? 'bg-emerald-400/10 text-emerald-200'
                                    : 'text-slate-200 hover:bg-white/[0.05] hover:text-emerald-100'
                            }`}
                        >
                            <LayoutDashboard
                                aria-hidden="true"
                                className="size-5 shrink-0"
                            />
                            <span>Painel personalizado</span>
                        </NavLink>

                        {/* Perfil do usuário. */}
                        <NavLink
                            to="/perfil"
                            onClick={() => setMobileMenu(null)}
                            className={`${mobileMenuItemClass} ${
                                pathname === '/perfil' ||
                                pathname.startsWith('/perfil/')
                                    ? 'bg-emerald-400/10 text-emerald-200'
                                    : 'text-slate-200 hover:bg-white/[0.05] hover:text-emerald-100'
                            }`}
                        >
                            <UserRound
                                aria-hidden="true"
                                className="size-5 shrink-0"
                            />
                            <span>Perfil</span>
                        </NavLink>
                    </div>
                </div>
            )}
        </header>
    );
}

export function DashboardLayout() {
    const { pathname } = useLocation();

    const isLandingPage =
        pathname === '/inicio' || pathname === '/inicio/';

    const isProfilePage =
        pathname === '/perfil' || pathname.startsWith('/perfil/');

    const [monitoringOpen, setMonitoringOpen] = useState(false);

    return (
        <MonitoringProvider>
            <div className="relative dark flex min-h-screen flex-col bg-background text-foreground">

                <DashboardHeader
                    key={pathname}
                    pathname={pathname}
                    monitoringOpen={monitoringOpen}
                    setMonitoringOpen={setMonitoringOpen}
                    isOverlay={isLandingPage}
                />

                {/* Barra de monitoramento. */}
                {monitoringOpen && (
                    <div
                        id="monitoring-panel"
                        className={`${
                            isLandingPage
                                ? 'fixed inset-x-0 top-[var(--header-h,4rem)]'
                                : 'sticky top-0'
                        } z-40 flex w-full justify-center px-4 pt-3`}
                    >
                        <Card className="w-fit max-w-full min-w-0 border border-border/70 bg-card/80 py-0 !shadow-none">
                            <MonitoringBar />
                        </Card>
                    </div>
                )}

                <div className="flex-1">
                    <Outlet />
                </div>

                {!isLandingPage && !isProfilePage && (
                    <footer className="border-t border-border px-6 py-4 text-sm text-muted-foreground">
                        <p className="mx-auto max-w-7xl text-center">
                            Os dados são estimativas baseadas nas métricas disponíveis e nos fatores regionais de emissão.
                        </p>
                    </footer>
                )}
            </div>
        </MonitoringProvider>
    );
}

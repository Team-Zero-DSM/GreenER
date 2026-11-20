import { Outlet } from 'react-router';

import { AuthGlobeBackground } from '@/components/globe/AuthGlobeBackground';

export function AuthLayout() {
    return (
        <div className="dark relative isolate min-h-svh bg-[#050816] text-foreground">
            {/* Fundo 3D */}
            <AuthGlobeBackground />

            {/* Conteúdo da autenticação */}
            <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl flex-col px-4 py-6 sm:px-6">
                {/* Identidade da plataforma */}
                <header className="flex justify-center pt-3">
                    <span className="bg-linear-to-r from-emerald-300 to-cyan-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
                        Green<span className="font-light">ER</span>
                    </span>
                </header>

                {/* Cartão de login e cadastro */}
                <main className="flex flex-1 items-center justify-center py-8 sm:py-10">
                    <div className="w-full max-w-md">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
import { Outlet } from 'react-router';
import { AnimatedBrandTitle } from '@/components/shared/AnimatedBrandTitle';
import { AuthGlobeBackground } from '@/components/globe/AuthGlobeBackground';

export function AuthLayout() {
    return (
        <div className="dark relative isolate h-dvh overflow-hidden overscroll-none bg-background text-foreground md:h-auto md:min-h-svh md:overflow-visible">
            {/* Fundo 3D */}
            <AuthGlobeBackground />

            {/* Conteúdo da autenticação */}
            <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col px-3 py-2 sm:px-6 md:h-auto md:min-h-svh md:py-6">
                {/* Identidade da plataforma */}
                <header className="flex justify-center pt-3">
    <AnimatedBrandTitle />
</header>

                {/* Cartão de login e cadastro */}
                <main className="flex min-h-0 flex-1 items-center justify-center overflow-hidden py-2 sm:py-4 md:overflow-visible md:py-10">
                    <div className="w-full max-w-md">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
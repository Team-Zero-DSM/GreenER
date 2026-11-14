
import { Outlet } from 'react-router';

export function AuthLayout() {
    return (
        <div className="dark min-h-screen bg-background text-foreground">
            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6">

                {/* Identidade da plataforma */}
                <header>
                    <span className="bg-linear-to-r from-emerald-300 to-cyan-400 bg-clip-text text-2xl font-extrabold text-transparent">
                        Green<span className="font-light">ER</span>
                    </span>
                </header>

                {/* Conteúdo da autenticação */}
                <main className="flex flex-1 items-center justify-center py-10">
                    <div className="w-full max-w-md">
                        <Outlet />
                    </div>
                </main>

            </div>
        </div>
    );
}
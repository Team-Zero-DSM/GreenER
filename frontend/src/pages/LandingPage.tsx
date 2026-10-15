import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { ExploreSection } from '../components/landing/ExploreSection';
import { regions } from '@/utils/regions';

export function LandingPage() {

    const exploreRef = useRef<HTMLElement>(null);

    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const [autoRotate, setAutoRotate] = useState(true);
    const [force2D, setForce2D] = useState(false);

    const selectRegion = (code: string) => {
        setSelectedCode(code);
    };

    const backToGlobal = () => {
        setSelectedCode(null);
    };

    const zoom = (_factor: number) => {};


  return (
    <main className="relative min-h-screen bg-[radial-gradient(ellipse_at_50%_120%,#0c1d45_0%,#090d1b_60%)] pt-20 text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 flex w-full items-center justify-between gap-4 border-b border-white/10 bg-[#090d1b] px-6 py-4">
        <Link
          to="/"
          aria-label="GreenER, início"
          className="text-lg font-extrabold tracking-tight text-white no-underline transition-opacity hover:opacity-80"
        >
          GreenER
        </Link>

        <nav aria-label="Principal" className="flex items-center gap-1">
          <a
            href="#explorar"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground max-[767px]:hidden"
          >
            Regiões
          </a>
          <Link
            to="/dashboard"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            to="/dashboard/ranking"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground max-[767px]:hidden"
          >
            Ranking
          </Link>
          <Link
            to="/dashboard/configuracoes"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground max-[767px]:hidden"
          >
            Configurações
          </Link>
        </nav>
      </header>

      <div className="grid grid-cols-1 items-start gap-6 px-6 py-4 md:grid-cols-[minmax(560px,44vw)_minmax(0,1fr)]">
        <ExploreSection
          exploreRef={exploreRef}
          rotateLeft={() => {}}
          rotateRight={() => {}}
          dataSource="internal"
          selectedCode={selectedCode}
          autoRotate={autoRotate}
          setAutoRotate={setAutoRotate}
          force2D={force2D}
          setForce2D={setForce2D}
          backToGlobal={backToGlobal}
          zoom={zoom}
          regions={regions}
          onSelectRegion={selectRegion}
        />

        <div
          className="relative min-h-[60vh] min-w-0"
          aria-label="Área reservada para o globo 3D"
        />
      </div>
    </main>
  );
}

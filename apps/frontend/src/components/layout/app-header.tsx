import { Link, useMatchRoute } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";

export function AppHeader() {
  const { data: session, isPending } = useSession();
  const matchRoute = useMatchRoute();
  const isPlantRoute = matchRoute({ to: "/plants", fuzzy: true });
  const isSeedRoute = matchRoute({ to: "/seeds", fuzzy: true });
  const isDashboardRoute = matchRoute({ to: "/dashboard", fuzzy: true });

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-[#e6dccf] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 organic-shape bg-gradient-to-br from-[#3a9133] to-[#53802d] flex items-center justify-center shadow-lg shadow-[#3a9133]/20">
            <span className="text-white text-lg">🌱</span>
          </div>
          <Link to="/" className="font-display text-2xl gradient-text hover:opacity-80 transition-opacity">
            HappySeeds
          </Link>
        </div>
        <div>
          {isPending ? (
            <span className="text-[#855c45]">Chargement...</span>
          ) : session ? (
            <div className="flex items-center gap-6">
              <span className="text-[#6d4c3b]">Bonjour, {session.user.name}</span>
              <nav className="flex items-center gap-6">
                <Link 
                  to="/dashboard" 
                  className={`font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#3a9133] after:transition-transform ${
                    isDashboardRoute 
                      ? "text-[#5a4032] after:scale-x-100" 
                      : "text-[#855c45] hover:text-[#5a4032] after:scale-x-0 hover:after:scale-x-100"
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/plants" 
                  className={`font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#3a9133] after:transition-transform ${
                    isPlantRoute 
                      ? "text-[#5a4032] after:scale-x-100" 
                      : "text-[#855c45] hover:text-[#5a4032] after:scale-x-0 hover:after:scale-x-100"
                  }`}
                >
                  Plantes
                </Link>
                <Link 
                  to="/seeds" 
                  className={`font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#3a9133] after:transition-transform ${
                    isSeedRoute 
                      ? "text-[#5a4032] after:scale-x-100" 
                      : "text-[#855c45] hover:text-[#5a4032] after:scale-x-0 hover:after:scale-x-100"
                  }`}
                >
                  Graines
                </Link>
              </nav>
              <Button 
                onClick={() => logout("/")} 
                className="px-5 py-2.5 bg-gradient-to-r from-[#3a9133] to-[#53802d] text-white rounded-full font-medium hover:shadow-lg hover:shadow-[#3a9133]/25 transition-all hover:-translate-y-0.5 border-0"
              >
                Déconnexion
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-[#5a4032] hover:text-[#3a9133] font-medium transition-colors">
                Se connecter
              </Link>
              <Button 
                asChild
                className="px-5 py-2.5 bg-gradient-to-r from-[#3a9133] to-[#53802d] text-white rounded-full font-medium hover:shadow-lg hover:shadow-[#3a9133]/25 transition-all hover:-translate-y-0.5 border-0"
              >
                <Link to="/signup">S'inscrire</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

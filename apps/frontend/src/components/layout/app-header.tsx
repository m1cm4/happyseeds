import { Link, useMatchRoute } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";

export function AppHeader() {
  const { data: session, isPending } = useSession();
  const matchRoute = useMatchRoute();
  const isPlantRoute = matchRoute({ to: "/plants", fuzzy: true });
  const isSeedRoute = matchRoute({ to: "/seeds", fuzzy: true });

  return (
    <header className="p-4 bg-white shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-emerald-600">
          <Link to="/">🌱 HappySeeds</Link>
        </h1>
        <div>
          {isPending ? (
            <span className="text-slate-400">Chargement...</span>
          ) : session ? (
            <div className="flex items-center gap-4">
              <span className="text-slate-600">Bonjour, {session.user.name}</span>
              <Link to="/dashboard" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Mon Dashboard
              </Link>
              <Link
                to="/plants"
                className={`px-3 py-2 rounded-md transition-colors ${
                  isPlantRoute ? "bg-green-100 text-green-700 font-medium" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Mes Plantes
              </Link>
              <Link
                to="/seeds"
                className={`px-3 py-2 rounded-md transition-colors ${
                  isSeedRoute ? "bg-green-100 text-green-700 font-medium" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Mes Graines
              </Link>
              <Button variant="outline" onClick={() => logout("/")}>
                Déconnexion
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">Se connecter</Link>
              <Button asChild>
                <a href="/signup">S'inscrire</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

import { createFileRoute, redirect, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { authClient, useSession } from "../../lib/auth-client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    // Côté serveur (SSR) : pas d'accès aux cookies, on laisse passer
    // La vérification se fera côté client dans le composant
    if (typeof window === "undefined") {
      return;
    }

    // Côté client : vérifier la session
    const { data: session } = await authClient.getSession({
      fetchOptions: { credentials: "include" }
    });

    if (!session) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.pathname,
        },
      });
    }

    return { session };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  // Vérification côté client après hydratation (pour le cas SSR)
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  // Pendant le chargement, afficher un loader
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Chargement...</p>
      </div>
    );
  }

  // Pas de session après vérification côté client → rediriger
  if (!session) {
    // Utiliser navigate au lieu de redirect pour éviter les erreurs React
    navigate({
      to: "/login",
      search: { redirect: location.pathname },
      replace: true,
    });
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
    {/* Header de l'application authentifiée */}
    <header className="bg-white shadow-sm border-b">
    <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
    <a href="/" className="text-xl font-bold text-emerald-600">
    🌱 HappySeeds
    </a>
    <nav className="flex items-center gap-4">
    <a
    href="/dashboard"
    className="text-slate-600 hover:text-emerald-600"
    >
    Dashboard
    </a>
    {/* Plus de liens seront ajoutés plus tard */}
    </nav>
    </div>
    </header>
    
    {/* Contenu de la page enfant */}
    <main className="max-w-6xl mx-auto px-4 py-8">
    <Outlet />
    </main>
    </div>
  );
}
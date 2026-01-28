import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { authClient } from "../../lib/auth-client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    // Vérifier si l'utilisateur est connecté. hors composant react utilise getSession()
    // dans composant react : utilise useSession() hook
    const { data: session } = await authClient.getSession();

    if (!session) {
      // Pas de session → redirection vers login
      // On stocke l'URL d'origine pour y revenir après connexion
      throw redirect({
        to: "/login",
        search: {
          // donne le chemin courant pour redirection une fois loggé
          redirect: location.href,
        },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
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
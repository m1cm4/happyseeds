import { createFileRoute, redirect, Outlet, useNavigate, useLocation, Link } from "@tanstack/react-router";
import { authClient, useSession } from "../../lib/auth-client";
import { hasSessionCookie } from "../../lib/auth"; 


export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    // SSR : vérifie seulement la PRÉSENCE du cookie (pas de requête réseau)
    
    const hasCookie = await hasSessionCookie();                          
    
    if (!hasCookie) {                                                    
      throw redirect({                                                   
        to: "/login",                                                    
        search:                                                          
        location.pathname === "/login"                                 
        ? {}                                                         
        : { redirect: location.pathname },                           
      });                                                                
    }                                                                    
    
    // On ne retourne pas la session ici - elle sera chargée côté client 
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
    <Link to="/" className="text-xl font-bold text-emerald-600">
    🌱 HappySeeds
    </Link>
    <nav className="flex items-center gap-4">
    <Link to="/dashboard"
    className="text-slate-600 hover:text-emerald-600"
    >
    Dashboard
    </Link>
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
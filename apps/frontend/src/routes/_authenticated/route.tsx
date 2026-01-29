import { createFileRoute, redirect, Outlet} from "@tanstack/react-router";
import { useSession } from "../../lib/auth-client";
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
  

  // Guarde coté client : test d'auth lors de hydratation du composant
  // // Pendant le chargement, afficher un loader
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-500">Chargement...</p>
      </div>
    );
  }
  
  // Pas de session après vérification côté client → rediriger
  //const navigate = useNavigate();
  if (!session) {
    // Utiliser navigate au lieu de redirect pour éviter les erreurs React
  //   navigate({
  //     to: "/login",
  //     replace: true,
  //   });
  //   return null;

  // utilise window.location et non navigate pour vider le cache pour useSession()
    window.location.href = "/login";                    
    return null;   
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Outlet />
    </main> 
  );
}
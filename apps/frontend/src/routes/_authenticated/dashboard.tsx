import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useSession, signOut } from "../../lib/auth-client";
import { Button } from "../../components/ui/button";

// convention de nommage : avec "_", "_autheticated" n'est pas visible
// le chemin réel sera "/dashboard"
export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const router = useRouter();

  //signout avec redirection
  const handleSignOut = async () =>{
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          // Invalider le cache du router pour forcer une re-vérification
          router.invalidate();
          navigate({to: "/"});
        },
      },
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Tableau de bord
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-600">
            {session?.user?.name}
          </span>
          <Button variant="outline" onClick={handleSignOut}>
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Contenu du dashboard - à développer plus tard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-slate-700 mb-2">
            Mes Plantes
          </h2>
          <p className="text-3xl font-bold text-emerald-600">0</p>
          <p className="text-sm text-slate-500 mt-1">plantes enregistrées</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-slate-700 mb-2">
            Mes Graines
          </h2>
          <p className="text-3xl font-bold text-emerald-600">0</p>
          <p className="text-sm text-slate-500 mt-1">variétés en stock</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-slate-700 mb-2">
            Sessions actives
          </h2>
          <p className="text-3xl font-bold text-emerald-600">0</p>
          <p className="text-sm text-slate-500 mt-1">semis en cours</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          Bienvenue sur HappySeeds ! 🌱
        </h2>
        <p className="text-slate-600">
          Cette page affichera bientôt vos statistiques et les prochaines tâches
          de jardinage. Pour l'instant, l'authentification est en place et
          fonctionne correctement.
        </p>
      </div>
    </div>
  );
}



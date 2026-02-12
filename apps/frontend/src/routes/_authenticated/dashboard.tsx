import { createFileRoute } from "@tanstack/react-router";

// convention de nommage : avec "_", "_autheticated" n'est pas visible
// le chemin réel sera "/dashboard"
export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div>
      {/* Page Title */}
      <div className="mb-12">
        <h1 className="font-display text-2xl text-[#5a4032] mb-2">Tableau de bord</h1>
        <p className="text-[#855c45] text-lg">Bienvenue dans votre grainothèque personnelle</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-[#3a9133] transition-colors"></div>
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#3a9133]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">🌿</span>
            </div>
            <span className="text-xs font-medium text-[#3a9133] bg-[#3a9133]/10 px-3 py-1 rounded-full">+2 ce mois</span>
          </div>
          <p className="font-display text-4xl text-[#5a4032] mb-1 relative z-10">0</p>
          <p className="text-[#6d4c3b] font-medium relative z-10">Mes Plantes</p>
          <p className="text-[#855c45] text-sm mt-1 relative z-10">variétés cultivées</p>
        </div>

        <div className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-[#998100] transition-colors"></div>
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#998100]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">🌰</span>
            </div>
            <span className="text-xs font-medium text-[#998100] bg-[#998100]/10 px-3 py-1 rounded-full">Stock OK</span>
          </div>
          <p className="font-display text-4xl text-[#5a4032] mb-1 relative z-10">0</p>
          <p className="text-[#6d4c3b] font-medium relative z-10">Mes Graines</p>
          <p className="text-[#855c45] text-sm mt-1 relative z-10">sachets en stock</p>
        </div>

        <div className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-[#855c45] transition-colors"></div>
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#855c45]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">🪴</span>
            </div>
            <span className="text-xs font-medium text-[#855c45] bg-[#855c45]/10 px-3 py-1 rounded-full">Actif</span>
          </div>
          <p className="font-display text-4xl text-[#5a4032] mb-1 relative z-10">0</p>
          <p className="text-[#6d4c3b] font-medium relative z-10">Semis actifs</p>
          <p className="text-[#855c45] text-sm mt-1 relative z-10">en cours</p>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <h2 className="font-display text-[1.4rem] text-[#5a4032] mb-4">Bienvenue sur HappySeeds ! 🌱</h2>
        <p className="text-[#6d4c3b]">
          Cette page affichera bientôt vos statistiques et les prochaines tâches de jardinage. Pour l'instant,
          l'authentification est en place et fonctionne correctement.
        </p>
      </div>
    </div>
  );
}

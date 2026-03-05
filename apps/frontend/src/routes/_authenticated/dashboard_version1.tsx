import { createFileRoute } from "@tanstack/react-router";

// convention de nommage : avec "_", "_autheticated" n'est pas visible
// le chemin réel sera "/dashboard"
export const Route = createFileRoute("/_authenticated/dashboard_version1")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-1">Tableau de bord</h1>
        <p className="text-wire-text-muted">Bienvenue dans votre grainothèque personnelle</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-6 hover:border-wire-focus hover:shadow-md transition-medium cursor-pointer group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:scale-110 transition-fast">
              <span className="grayscale-icon text-xl">🌿</span>
            </div>
            <span className="text-xs font-medium text-wire-text-muted bg-muted px-2 py-1 rounded">+2 ce mois</span>
          </div>
          <p className="text-3xl font-semibold text-foreground mb-1">0</p>
          <p className="text-foreground font-medium">Mes Plantes</p>
          <p className="text-wire-text-light text-sm">variétés cultivées</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 hover:border-wire-focus hover:shadow-md transition-medium cursor-pointer group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:scale-110 transition-fast">
              <span className="grayscale-icon text-xl">🌰</span>
            </div>
            <span className="text-xs font-medium text-wire-text-muted bg-muted px-2 py-1 rounded">Stock OK</span>
          </div>
          <p className="text-3xl font-semibold text-foreground mb-1">0</p>
          <p className="text-foreground font-medium">Mes Graines</p>
          <p className="text-wire-text-light text-sm">sachets en stock</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 hover:border-wire-focus hover:shadow-md transition-medium cursor-pointer group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:scale-110 transition-fast">
              <span className="grayscale-icon text-xl">🪴</span>
            </div>
            <span className="text-xs font-medium text-wire-text-muted bg-muted px-2 py-1 rounded">Actif</span>
          </div>
          <p className="text-3xl font-semibold text-foreground mb-1">0</p>
          <p className="text-foreground font-medium">Semis actifs</p>
          <p className="text-wire-text-light text-sm">en cours</p>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Bienvenue sur HappySeeds ! 🌱</h2>
        <p className="text-wire-text-muted">
          Cette page affichera bientôt vos statistiques et les prochaines tâches de jardinage. Pour l'instant,
          l'authentification est en place et fonctionne correctement.
        </p>
      </div>
    </div>
  );
}

import { StatsCard } from "@/components/dashboard/stats-card";
import { UpcomingList } from "@/components/dashboard/upcoming-list";
import { useDashboardStats } from "@/hooks/useDashboard";
import { createFileRoute } from "@tanstack/react-router";
import { SimpleLoadingText } from "@/components/common/loadings";

export const Route = createFileRoute("/_authenticated/dashboard/")({
   component: DashboardPage,
});

function DashboardPage() {
   const { data, isLoading, isError } = useDashboardStats();

   if (isLoading) return <SimpleLoadingText text="Chargement du tableau de bord" />;

   if (isError)
      return (
         <div className="container mx-auto py-6">
            <p className="text-destructive">Erreur lors du chargement du tableau de bord.</p>
         </div>
      );

   const stats = data?.success ? data.data : undefined;

   return (
      <div className="container mx-auto py-6 space-y-6">
         <h1 className="text-2xl font-semibold text-foreground mb-1">Tableau de bord</h1>
         <p className="text-wire-text-muted">Bienvenue dans votre grainothèque personnelle</p>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard value={stats?.counts.plants ?? 0} icon="🌿" label="Plantes" />
            <StatsCard value={stats?.counts.seeds ?? 0} icon="🫘" label="Graines" />
            <StatsCard value={stats?.counts.activeSowings ?? 0} icon="🌱" label="Semis actifs" />
         </div>
         <UpcomingList entries={stats?.upcoming ?? []} />
      </div>
   );
}

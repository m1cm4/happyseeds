import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useSowingSessions } from "@/hooks/useSowingSession";
import { SowingSessionListElement } from "@/components/sowing-session/sowing-session-list-element";
import { SimpleLoadingText } from "@/components/common/loadings";

export const Route = createFileRoute("/_authenticated/sowing-sessions/")({
   component: SowingSessionsIndexPage,
});

function SowingSessionsIndexPage() {
   const { data, isLoading, isError } = useSowingSessions({ page: 1, limit: 20 });

   if (isLoading) {
      return <SimpleLoadingText text="Chargement des semis..." />;
   }

   if (isError) {
      return (
         <div className="container mx-auto py-8">
            <p className="text-red-500">Erreur lors du chargement des sessions.</p>
         </div>
      );
   }

   const sessions = data?.data ?? [];

   return (
      <div className="container mx-auto py-8">
         {/* En-tête */}
         <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Sessions de semis</h1>
            <Button asChild>
               <Link to="/sowing-sessions/new">Nouvelle session</Link>
            </Button>
         </div>

         {/* Contenu */}
         {sessions.length === 0 ? (
            <div className="text-center py-12">
               <p className="text-muted-foreground mb-4">Aucune session de semis pour le moment.</p>
               <Button asChild variant="outline">
                  <Link to="/sowing-sessions/new">Créer ma première session</Link>
               </Button>
            </div>
         ) : (
            <div className="space-y-3">
               {sessions.map((session) => (
                  <SowingSessionListElement key={session.id} session={session} />
               ))}
            </div>
         )}

         {/* Pagination */}
         {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
               <p className="text-sm text-muted-foreground mt-4">
                  {data.pagination.total} session(s) — Page {data.pagination.page}/
                  {data.pagination.totalPages}
               </p>
            </div>
         )}
      </div>
   );
}

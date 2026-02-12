import { createFileRoute, Link } from "@tanstack/react-router";
import { usePlants } from "../../../hooks/usePlant";
import { Button } from "../../../components/ui/button";
import { Plant } from "@/@types/plant.types";
import { PlantListElement } from "@/components/plant/plant-list-element";

export const Route = createFileRoute("/_authenticated/plants/")({
  component: PlantsListPage,
});

function PlantsListPage() {
  const { data, isLoading, error } = usePlants({ page: 1, limit: 10 });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-muted animate-pulse"></div>
          <p className="text-wire-text-muted">Chargement des plantes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-6 rounded-lg border border-destructive/20">
        <p>Erreur : {error.message}</p>
      </div>
    );
  }

  const plants = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Mes Plantes</h1>
        <Link to="/plants/new">
          <Button>
            <span>+</span> Nouvelle plante
          </Button>
        </Link>
      </div>

      {/* Liste vide */}
      {plants.length === 0 && (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center">
            <span className="grayscale-icon text-2xl">🌱</span>
          </div>
          <p className="text-wire-text-muted mb-6">Aucune plante enregistrée</p>
          <Link to="/plants/new">
            <Button>Ajouter ma première plante</Button>
          </Link>
        </div>
      )}

      {/* Liste des plantes */}
      {plants.length > 0 && (
        <div className="bg-card rounded-xl overflow-hidden border border-border">
          <div className="divide-y divide-border">
            {plants.map((plant: Plant) => (
              <PlantListElement key={plant.id} plant={plant} />
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <p className="text-sm text-wire-text-muted">
            Page {pagination.page} sur {pagination.totalPages} ({pagination.total} plantes)
          </p>
        </div>
      )}
    </div>
  );
}

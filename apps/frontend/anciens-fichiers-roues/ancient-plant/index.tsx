import { createFileRoute, Link } from "@tanstack/react-router";
import { usePlants } from "../../../hooks/usePlants";
import { Button } from "../../../components/ui/button";
import { Plant } from "@/@types/plant.types";
import { PlantListElement } from "@/components/plant/plant-list-element";


export const Route = createFileRoute("/_authenticated/plant/")({
  component: PlantsListPage,
});

function PlantsListPage() {
  const { data, isLoading, error } = usePlants({ page: 1, limit: 10 });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-slate-500">Chargement des plantes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
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
        <h1 className="text-2xl font-bold text-slate-800">Mes Plantes</h1>
        <Link to="/plant/new">
          <Button>+ Nouvelle plante</Button>
        </Link>
      </div>

      {/* Liste vide */}
      {plants.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-slate-500 mb-4">Aucune plante enregistrée</p>
          <Link to="/plant/new">
            <Button>Ajouter ma première plante</Button>
          </Link>
        </div>
      )}

      {/* Liste des plantes */}
      {plants.length > 0 && (
        <div className="grid gap-4">                                           
        {plants.map((plant:Plant) => (                                             
          <PlantListElement key={plant.id} plant={plant} />                  
        ))}                        
                                                  
      </div>      
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <p className="text-sm text-slate-500">
            Page {pagination.page} sur {pagination.totalPages}
            ({pagination.total} plantes)
          </p>
        </div>
      )}
    </div>
  );
}
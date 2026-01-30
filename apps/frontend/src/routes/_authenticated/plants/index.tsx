import { createFileRoute, Link } from "@tanstack/react-router";
import { usePlants } from "../../../hooks/usePlants";
import { Button } from "../../../components/ui/button";
import type { Plant } from "../../../lib/api-client";                          

export const Route = createFileRoute("/_authenticated/plants/")({
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
        <Link to="/plants/new">
          <Button>+ Nouvelle plante</Button>
        </Link>
      </div>

      {/* Liste vide */}
      {plants.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-slate-500 mb-4">Aucune plante enregistrée</p>
          <Link to="/plants/new">
            <Button>Ajouter ma première plante</Button>
          </Link>
        </div>
      )}

      {/* Liste des plantes */}
      {plants.length > 0 && (
        <div className="grid gap-4">                                           
        {plants.map((plant) => (                                             
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

// destructuration identique à PlantListElement(props: { plant: Plant })
function PlantListElement({ plant }: { plant: Plant }) {                       
  return (                                                                     
    <Link                                                                      
      to="/plants/$id"                                                         
      params={{ id: plant.id }}                                                
      className="block"                                                        
    >                                                                          
      <div className="bg-white p-4 rounded-lg border hover:border-emerald-500  
transition-colors">                                                            
        <div className="flex justify-between items-start">                     
          <div>                                                                
            <h2 className="font-semibold text-lg text-slate-800">              
              {plant.name}                                                     
            </h2>                                                              
            {plant.latinName && (                                              
              <p className="text-sm text-slate-500 italic">                    
                {plant.latinName}                                              
              </p>                                                             
            )}                                                                 
          </div>                                                               
          <span className="px-2 py-1 text-xs rounded-full bg-emerald-100       
text-emerald-700">                                                             
            {plant.category}                                                   
          </span>                                                              
        </div>                                                                 
        {plant.description && (                                                
          <p className="mt-2 text-sm text-slate-600 line-clamp-2">             
            {plant.description}                                                
          </p>                                                                 
        )}                                                                     
      </div>                                                                   
    </Link>                                                                    
  );                                                                           
} 
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { usePlant, useDeletePlant } from "../../../hooks/usePlants";
import { Button } from "../../../components/ui/button";
import {
  plantCategoryOptions,
  sunRequirementOptions,
  waterRequirementOptions,
} from "../../../schemas/plant.schema";
import { SeedsSection } from "@/components/plant/plant-seed-selection";

export const Route = createFileRoute("/_authenticated/plants/$id/")({
  component: PlantDetailPage,
});

function PlantDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = usePlant(id);
  const deletePlant = useDeletePlant();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-slate-500">Chargement...</p>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <p>Plante non trouvée</p>
        </div>
        <Link to="/plants" className="mt-4 inline-block text-emerald-600">
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  const plant = data.data;

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette plante ?")) {
      deletePlant.mutate(id, {
        onSuccess: () => {
          navigate({ to: "/plants" });
        },
      });
    }
  };

  const getCategoryLabel = (value: string) =>
    plantCategoryOptions.find((o) => o.value === value)?.label ?? value;

  const getSunLabel = (value: string) =>
    sunRequirementOptions.find((o) => o.value === value)?.label ?? value;

  const getWaterLabel = (value: string) =>
    waterRequirementOptions.find((o) => o.value === value)?.label ?? value;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link to="/plants" className="text-sm text-slate-500 hover:text-slate-700">
            ← Retour à la liste
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 mt-2">{plant.name}</h1>
          {plant.latinName && (
            <p className="text-slate-500 italic">{plant.latinName}</p>
          )}
        </div>
        <span className="px-3 py-1 text-sm rounded-full bg-emerald-100 text-emerald-700">
          {getCategoryLabel(plant.category)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-6">
        <Link to="/plants/$id/edit" params={{ id }}>
          <Button variant="outline">Modifier</Button>
        </Link>
        <Button
          variant="outline"
          onClick={handleDelete}
          disabled={deletePlant.isPending}
          className="text-red-600 hover:text-red-700"
        >
          {deletePlant.isPending ? "Suppression..." : "Supprimer"}
        </Button>
      </div>

      {/* Contenu */}
      <div className="bg-white p-6 rounded-lg border space-y-6">
        {/* Description */}
        {plant.description && (
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Description</h3>
            <p className="text-slate-600">{plant.description}</p>
          </div>
        )}

        {/* Paramètres de semis */}
        <div>
          <h3 className="font-medium text-slate-700 mb-2">Paramètres de semis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Profondeur</span>
              <p className="font-medium">
                {plant.sowingDepthMm ? `${plant.sowingDepthMm} mm` : "-"}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Espacement</span>
              <p className="font-medium">
                {plant.sowingSpacingCm ? `${plant.sowingSpacingCm} cm` : "-"}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Germination</span>
              <p className="font-medium">
                {plant.germinationDaysMin && plant.germinationDaysMax
                  ? `${plant.germinationDaysMin}-${plant.germinationDaysMax} j`
                  : "-"}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Croissance</span>
              <p className="font-medium">
                {plant.growthDaysMin && plant.growthDaysMax
                  ? `${plant.growthDaysMin}-${plant.growthDaysMax} j`
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Besoins */}
        <div>
          <h3 className="font-medium text-slate-700 mb-2">Besoins</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Ensoleillement</span>
              <p className="font-medium">
                {plant.sunRequirement ? getSunLabel(plant.sunRequirement) : "-"}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Arrosage</span>
              <p className="font-medium">
                {plant.waterRequirement ? getWaterLabel(plant.waterRequirement) : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {plant.notes && (
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Notes</h3>
            <p className="text-slate-600 whitespace-pre-wrap">{plant.notes}</p>
          </div>
        )}
      </div>
      <hr />
      <SeedsSection plantId={plant.id} />
    </div>
  );
}
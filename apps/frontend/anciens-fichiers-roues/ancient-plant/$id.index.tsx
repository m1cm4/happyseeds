import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { usePlant, useDeletePlant } from "../../../hooks/usePlants";
import { Button } from "../../../components/ui/button";
import {
  plantCategoryOptions,
  hardinessOptions,
  positionOptions
} from "../../../schemas/plant.schema";
import { SeedsSection } from "@/components/plant/plant-seed-selection";
import { getNames } from "@/utils/plant.utils";

export const Route = createFileRoute("/_authenticated/plant/$id/")({
  component: PlantDetailPage,
});

// ============================================
// Helpers pour les labels
// ============================================

const getCategoryLabel = (value: string) =>
  plantCategoryOptions.find((o) => o.value === value)?.label ?? value;

const getHardinessLabel = (value: string) =>
  hardinessOptions.find((o) => o.value === value)?.label ?? value;

const getPositionLabels = (values?: string[]) =>
  values
    ?.map((v) => positionOptions.find((o) => o.value === v)?.label ?? v)
    .join(", ") || "-";

// ============================================
// Composant de la page
// ============================================

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
        <Link to="/plant" className="mt-4 inline-block text-emerald-600">
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
          navigate({ to: "/plant" });
        },
      });
    }
  };

  const names = getNames(plant);

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link to="/plant" className="text-sm text-slate-500 hover:text-slate-700">
            ← Retour à la liste
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 mt-2">{names[0]}</h1>
          <p className="text-slate-500 italic">{names[1]}</p>
        </div>
        <span className="px-3 py-1 text-sm rounded-full bg-emerald-100 text-emerald-700">
          {getCategoryLabel(plant.category)}
        </span>
      </div>


      {/* Actions */}
      <div className="flex gap-2 mb-6">
        <Link to="/plant/$id/edit" params={{ id }}>
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

{/* Caractéristiques */}
        <div>
          <h3 className="font-medium text-slate-700 mb-2">Caractéristiques</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Rusticité</span>
              <p className="font-medium">
                {plant.hardiness ? getHardinessLabel(plant.hardiness) : "-"}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Zone</span>
              <p className="font-medium">{plant.hardiness_degrees || "-"}</p>
            </div>
            <div>
              <span className="text-slate-500">Exposition</span>
              <p className="font-medium">{getPositionLabels(plant.position)}</p>
            </div>
            <div>
              <span className="text-slate-500">Hauteur</span>
              <p className="font-medium">{plant.height || "-"}</p>
            </div>
            <div>
              <span className="text-slate-500">Étalement</span>
              <p className="font-medium">{plant.spread || "-"}</p>
            </div>
            <div>
              <span className="text-slate-500">Fleurs</span>
              <p className="font-medium">{plant.flowers || "-"}</p>
            </div>
          </div>
        </div>

        {/* Semis */}
        <div>
          <h3 className="font-medium text-slate-700 mb-2">Semis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Profondeur</span>
              <p className="font-medium">
                {plant.sowing_depth ? `${plant.sowing_depth} mm` : "-"}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Germination (int.)</span>
              <p className="font-medium">
                {plant.inside_germinate_time
                  ? `${plant.inside_germinate_time} j`
                  : "-"}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Germination (ext.)</span>
              <p className="font-medium">
                {plant.outside_germinate_time
                  ? `${plant.outside_germinate_time} j`
                  : "-"}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Température</span>
              <p className="font-medium">{plant.best_sowing_temp || "-"}</p>
            </div>
          </div>
          <div className="mt-2 flex gap-4 text-sm">
            {plant.stratification && (
              <span className="text-amber-600">⚠️ Stratification requise</span>
            )}
            {plant.cover_to_germinate && (
              <span className="text-slate-600">🌑 Couvrir pour germer</span>
            )}
          </div>
        </div>

        {/* Culture */}
        {plant.time_first_flower && (
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Culture</h3>
            <p className="text-sm">
              <span className="text-slate-500">Floraison après </span>
              <span className="font-medium">{plant.time_first_flower} jours</span>
            </p>
          </div>
        )}

        {/* Conseils */}
        {(plant.sowing_info || plant.growing_info) && (
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Conseils</h3>
            {plant.sowing_info && (
              <div className="mb-2">
                <p className="text-xs text-slate-400 uppercase">Semis</p>
                <p className="text-slate-600 whitespace-pre-wrap">
                  {plant.sowing_info}
                </p>
              </div>
            )}
            {plant.growing_info && (
              <div>
                <p className="text-xs text-slate-400 uppercase">Culture</p>
                <p className="text-slate-600 whitespace-pre-wrap">
                  {plant.growing_info}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <hr className="my-6" />
      <SeedsSection plantId={plant.id} />
    </div>
  );
}
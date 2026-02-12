import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { usePlant, useDeletePlant } from "../../../hooks/usePlant";
import { Button } from "../../../components/ui/button";
import { plantCategoryOptions, hardinessOptions, positionOptions } from "../../../schemas/plant.schema";
import { SeedsSection } from "@/components/plant/plant-seed-selection";
import { getNames } from "@/utils/plant.utils";

export const Route = createFileRoute("/_authenticated/plants/$id/")({
  component: PlantDetailPage,
});

// ============================================
// Helpers pour les labels
// ============================================

const getCategoryLabel = (value: string) => plantCategoryOptions.find((o) => o.value === value)?.label ?? value;

const getHardinessLabel = (value: string) => hardinessOptions.find((o) => o.value === value)?.label ?? value;

const getPositionLabels = (values?: string[]) =>
  values?.map((v) => positionOptions.find((o) => o.value === v)?.label ?? v).join(", ") || "-";

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

  const names = getNames(plant);

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link to="/plants" className="text-sm hover:text-slate-700 text-wire-text-muted">
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
      <div className="flex gap-2 mb-6 ">
        <Link
          className="flex content-center flex-wrap text-wire-text-muted"
          to="/plants/$id/edit"
          params={{ id: plant.id }}
        >
          Modifier
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
              <p className="font-medium">{plant.hardiness ? getHardinessLabel(plant.hardiness) : "-"}</p>
            </div>
            <div>
              <span className="text-slate-500">Zone</span>
              <p className="font-medium">{plant.hardinessDegrees || "-"}</p>
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
              <p className="font-medium">{plant.sowingDepth ? `${plant.sowingDepth} mm` : "-"}</p>
            </div>
            <div>
              <span className="text-slate-500">Germination (int.)</span>
              <p className="font-medium">{plant.insideGerminateTime ? `${plant.insideGerminateTime} j` : "-"}</p>
            </div>
            <div>
              <span className="text-slate-500">Germination (ext.)</span>
              <p className="font-medium">{plant.outsideGerminateTime ? `${plant.outsideGerminateTime} j` : "-"}</p>
            </div>
            <div>
              <span className="text-slate-500">Température</span>
              <p className="font-medium">{plant.bestSowingTemp || "-"}</p>
            </div>
          </div>
          <div className="mt-2 flex gap-4 text-sm">
            {plant.stratification && <span className="text-amber-600">⚠️ Stratification requise</span>}
            {plant.coverToGerminate && <span className="text-slate-600">🌑 Couvrir pour germer</span>}
          </div>
        </div>

        {/* Culture */}
        {plant.timeFirstFlower && (
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Culture</h3>
            <p className="text-sm">
              <span className="text-slate-500">Floraison après </span>
              <span className="font-medium">{plant.timeFirstFlower} jours</span>
            </p>
          </div>
        )}

        {/* Conseils */}
        {(plant.sowingInfo || plant.growingInfo) && (
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Conseils</h3>
            {plant.sowingInfo && (
              <div className="mb-2">
                <p className="text-xs text-slate-400 uppercase">Semis</p>
                <p className="text-slate-600 whitespace-pre-wrap">{plant.sowingInfo}</p>
              </div>
            )}
            {plant.growingInfo && (
              <div>
                <p className="text-xs text-slate-400 uppercase">Culture</p>
                <p className="text-slate-600 whitespace-pre-wrap">{plant.growingInfo}</p>
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

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PlantForm } from "../../../../anciens-fichiers-roues/plant/plant-form";
import { usePlant, useUpdatePlant } from "../../../hooks/usePlants";
import type { CreatePlantInput } from "../../../schemas/plant.schema";

export const Route = createFileRoute("/_authenticated/plant/$id/edit")({
  component: EditPlantPage,
});

function EditPlantPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = usePlant(id);
  const updatePlant = useUpdatePlant();

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

  const handleSubmit = (formData: CreatePlantInput) => {
    // Nettoyer les valeurs vides
    const cleanedData = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== "" && v !== undefined));

    updatePlant.mutate(
      { id, data: cleanedData as any },
      {
        onSuccess: () => {
          navigate({ to: "/plant/$id", params: { id } });
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link to="/plant/$id" params={{ id }} className="text-sm text-slate-500 hover:text-slate-700">
        ← Retour au détail
      </Link>

      <h1 className="text-2xl font-bold text-slate-800 mt-2 mb-6">Modifier : {plant.common_name}</h1>

      {updatePlant.error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">Erreur : {updatePlant.error.message}</div>
      )}

      <div className="bg-white p-6 rounded-lg border">
        <PlantForm
          defaultValues={plant}
          onSubmit={handleSubmit}
          isSubmitting={updatePlant.isPending}
          submitLabel="Enregistrer les modifications"
        />
      </div>
    </div>
  );
}

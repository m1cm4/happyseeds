import { SeedForm } from "@/components/seed/seed-form";
import { Button } from "@/components/ui/button";
import { usePlant } from "@/hooks/usePlants";
import { useDeleteSeed, useSeed, useUpdateSeed } from "@/hooks/useSeeds";
import { CreateSeedFormData } from "@/schemas/seed.shema";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/plant/$id/seeds/$seedId/edit")({
  component: EditSeedPage,
});

function EditSeedPage() {
  const { id: plantId, seedId } = Route.useParams();
  const navigate = useNavigate();
  const { data: plantData } = usePlant(plantId);
  const { data: seedData, isLoading, error } = useSeed(plantId, seedId);
  const updateSeed = useUpdateSeed(plantId);
  const deleteSeed = useDeleteSeed(plantId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-slate-500">Chargement...</p>
      </div>
    );
  }

  if (error || !seedData?.success) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">Graine non trouvée</div>
      </div>
    );
  }

  const seed = seedData.data;

  const handleSubmit = (formData: CreateSeedFormData) => {
    const cleanedData = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== "" && v !== undefined));

    updateSeed.mutate(
      { id: seedId, data: cleanedData as any },
      {
        onSuccess: () => {
          navigate({ to: "/plant/$id", params: { id: plantId } });
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm("Supprimer cette graine ?")) {
      deleteSeed.mutate(seedId, {
        onSuccess: () => {
          navigate({ to: "/plant/$id", params: { id: plantId } });
        },
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <Link to="/plant/$id" params={{ id: plantId }} className="text-sm text-slate-500 hover:text-slate-700">
        ← Retour à {plantData?.success ? plantData.data.common_name : "la plante"}
      </Link>

      <div className="flex justify-between items-center mt-2 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Modifier : {seed.brand ?? "Graine"}</h1>
        <Button variant="outline" onClick={handleDelete} disabled={deleteSeed.isPending} className="text-red-600">
          Supprimer
        </Button>
      </div>

      {updateSeed.error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">Erreur : {updateSeed.error.message}</div>
      )}

      <div className="bg-white p-6 rounded-lg border">
        <SeedForm
          defaultValues={seed}
          onSubmit={handleSubmit}
          isSubmitting={updateSeed.isPending}
          submitLabel="Enregistrer"
        />
      </div>
    </div>
  );
}

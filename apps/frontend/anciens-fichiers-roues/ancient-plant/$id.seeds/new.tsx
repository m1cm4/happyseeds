import { SeedForm } from "@/components/seed/seed-form";
import { usePlant } from "@/hooks/usePlants";
import { useCreateSeed } from "@/hooks/useSeeds";
import { CreateSeedFormData } from "@/schemas/seed.shema";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/plant/$id/seeds/new")({
  component: NewSeedPage,
});

function NewSeedPage() {
  const { id: plantId } = Route.useParams();
  const navigate = useNavigate();
  const { data: plantData } = usePlant(plantId);
  const createSeed = useCreateSeed(plantId);

  const handleSubmit = (data: CreateSeedFormData) => {
    const cleanedData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== "" && v !== undefined));

    createSeed.mutate(cleanedData as any, {
      onSuccess: () => {
        navigate({ to: "/plant/$id", params: { id: plantId } });
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <Link to="/plant/$id" params={{ id: plantId }} className="text-sm text-slate-500 hover:text-slate-700">
        ← Retour à {plantData?.success ? plantData.data.common_name : "la plante"}
      </Link>

      <h1 className="text-2xl font-bold text-slate-800 mt-2 mb-6">Nouvelle variété</h1>

      {createSeed.error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">Erreur : {createSeed.error.message}</div>
      )}

      <div className="bg-white p-6 rounded-lg border">
        <SeedForm onSubmit={handleSubmit} isSubmitting={createSeed.isPending} submitLabel="Ajouter la variété" />
      </div>
    </div>
  );
}

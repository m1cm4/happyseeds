import { SeedForm } from "@/components/seed/seed-form";
import { seedApi } from "@/services/seed.service";
import { CreateSeedInput } from "@happyseeds/shared-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/seeds/new")({
  validateSearch: (search: Record<string, unknown>) => ({
    plantId: (search.plantId as string) || undefined,
  }),
  component: NewSeedPage,
});

function NewSeedPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { plantId } = useSearch({ from: "/_authenticated/seeds/new" });
  const mutation = useMutation({
    mutationFn: (data: CreateSeedInput) => seedApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seeds"] });
      toast.success("Graine créée avec succès");

      // Retour vers la plante si on venait de là, sinon liste des graines
      if (plantId) {
        navigate({ to: "/plants/$id", params: { id: plantId } });
      } else {
        navigate({ to: "/seeds" });
      }
    },
    onError: () => {
      toast.error("Erreur lors de la création");
    },
  });

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">Nouvelle graine</h1>
      <SeedForm
        plantId={plantId}
        onSubmit={(data) => mutation.mutate(data)}
        isSubmitting={mutation.isPending}
        submitLabel="Créer la graine"
      />
    </div>
  );
}

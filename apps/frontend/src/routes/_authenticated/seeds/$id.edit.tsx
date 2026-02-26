import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SeedForm } from "@/components/seed/seed-form";
import { seedApi } from "@/services/seed.service";
import type { UpdateSeedInput } from "@happyseeds/shared-types";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/seeds/$id/edit")({
  component: EditSeedPage,
});

function EditSeedPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["seeds", id],
    queryFn: () => seedApi.getById(id),
  });

  const mutation = useMutation({
    mutationFn: (formData: UpdateSeedInput) => seedApi.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seeds"] });
      toast.success("Graine modifiée avec succès");

      // Retour vers la plante si elle existe
      if (data?.success && data?.data?.plantId) {
        navigate({ to: "/plants/$id", params: { id: data.data.plantId } });
      } else {
        navigate({ to: "/seeds" });
      }
    },
    onError: () => {
      toast.error("Erreur lors de la modification");
    },
  });

  if (isLoading) return <div>Chargement...</div>;
  if (!data?.success) return <div>Graine non trouvée</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Modifier la graine</h1>
      <div className="bg-white p-6 rounded-lg border">
        <SeedForm
          defaultValues={data.data}
          onSubmit={(formData) => mutation.mutate(formData)}
          isSubmitting={mutation.isPending}
          submitLabel="Enregistrer"
        />
      </div>
    </div>
  );
}

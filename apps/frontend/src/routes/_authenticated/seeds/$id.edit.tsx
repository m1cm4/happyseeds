import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SeedForm } from "@/components/seed/seed-form";
import { seedApi } from "@/services/seed.service";
import { UpdateSeedInput } from "@/@types/seed.types";
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
      if (data?.data?.plant_id) {
        navigate({ to: "/plants/$id", params: { id: data.data.plant_id } });
      } else {
        navigate({ to: "/seed" });
      }
    },
    onError: () => {
      toast.error("Erreur lors de la modification");
    },
  });

  if (isLoading) return <div>Chargement...</div>;
  if (!data?.data) return <div>Graine non trouvée</div>;

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">Modifier la graine</h1>
      <SeedForm
        defaultValues={data.data}
        onSubmit={(formData) => mutation.mutate(formData)}
        isSubmitting={mutation.isPending}
        submitLabel="Enregistrer"
      />
    </div>
  );
}
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PlantForm } from "../../../components/plant/plant-form";
import { useCreatePlant } from "../../../hooks/usePlant";
import type { CreatePlantInput } from "../../../schemas/plant.schema";

export const Route = createFileRoute("/_authenticated/plants/new")({
  component: NewPlantPage,
});

function NewPlantPage() {
  const navigate = useNavigate();
  const createPlant = useCreatePlant();

  const handleSubmit = (data: CreatePlantInput) => {
    console.log("Form submitted:", data);
    // Nettoyer les valeurs vides (le préprocesseur Zod gère déjà hardiness)
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => {
        // Cast pour éviter l'erreur TypeScript avec hardiness
        const val = v as any;
        return val !== undefined && val !== "";
      })
    );
    console.log("Cleaned data:", cleanedData);
    createPlant.mutate(cleanedData as any, {
      onSuccess: () => {
        console.log("Success!"); 
        navigate({ to: "/plants" });
      },                                                               
      onError: (error) => {                                             
        console.error("Error:", error);  // ← Et celle-ci               
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6" >
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Nouvelle plante
      </h1>

      {createPlant.error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          Erreur : {createPlant.error.message}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg border">
        <PlantForm
          onSubmit={handleSubmit}
          isSubmitting={createPlant.isPending}
          submitLabel="Créer la plante"
        />
      </div>
    </div>
  );
}
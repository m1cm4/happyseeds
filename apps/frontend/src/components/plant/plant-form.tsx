import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import {
  createPlantSchema,
  CreatePlantInput,
  plantCategoryOptions,
  hardinessOptions,
  positionOptions,
} from "../../schemas/plant.schema";

import { Plant } from "@/@types/plant.types";


type PlantFormProps = {
  defaultValues?: Partial<Plant>;
  onSubmit: (data: CreatePlantInput) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};


// ============================================
// Helper : valeurs par défaut du formulaire
// ============================================

function getFormDefaults(plant?: Partial<Plant>): CreatePlantInput {
  return {
    // Classification
    category: plant?.category ?? "vegetable",
    common_name: plant?.common_name ?? "",
    other_common_names: plant?.other_common_names ?? "",
    family: plant?.family ?? "",
    genus: plant?.genus ?? "",
    species: plant?.species ?? "",
    cultivar: plant?.cultivar ?? "",

    // Description
    description: plant?.description ?? "",

    // Caractéristiques
    hardiness: plant?.hardiness ?? undefined,
    hardiness_degrees: plant?.hardiness_degrees ?? "",
    height: plant?.height ?? "",
    spread: plant?.spread ?? "",
    position: plant?.position ?? [],
    flowers: plant?.flowers ?? "",

    // Semis
    stratification: plant?.stratification ?? false,
    inside_sowing_period: plant?.inside_sowing_period ?? [],
    outside_sowing_period: plant?.outside_sowing_period ?? [],
    inside_germinate_time: plant?.inside_germinate_time ?? undefined,
    outside_germinate_time: plant?.outside_germinate_time ?? undefined,
    cover_to_germinate: plant?.cover_to_germinate ?? false,
    sowing_depth: plant?.sowing_depth ?? undefined,
    best_sowing_temp: plant?.best_sowing_temp ?? "",

    // Culture
    planting_period: plant?.planting_period ?? [],
    time_first_flower: plant?.time_first_flower ?? undefined,

    // Notes
    sowing_info: plant?.sowing_info ?? "",
    growing_info: plant?.growing_info ?? "",
  };
}

export function PlantForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Enregistrer",
}: PlantFormProps) {

  // hook useForm
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePlantInput>({
    resolver: zodResolver(createPlantSchema),
    defaultValues: getFormDefaults(defaultValues),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) =>
        console.log("Validation errors:", errors)
      )}
      className="space-y-8"
    >
      {/* ==================== CLASSIFICATION ==================== */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Classification</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <select
              id="category"
              {...register("category")}
              className="w-full p-2 border rounded-md"
            >
              {plantCategoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Nom commun */}
          <div className="space-y-2">
            <Label htmlFor="common_name">Nom commun *</Label>
            <Input
              id="common_name"
              {...register("common_name")}
              placeholder="Ex: Tomate, Cosmos"
            />
            {errors.common_name && (
              <p className="text-sm text-red-500">{errors.common_name.message}</p>
            )}
          </div>
        </div>

        {/* Autres noms */}
        <div className="space-y-2">
          <Label htmlFor="other_common_names">Autres noms commons</Label>
          <Input
            id="other_common_names"
            {...register("other_common_names")}
            placeholder="Ex: Tomate cerise, Pomme d'amour"
          />
        </div>

        {/* Taxonomie */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="family">Famille</Label>
            <Input id="family" {...register("family")} placeholder="Solanaceae" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="genus">Genre</Label>
            <Input id="genus" {...register("genus")} placeholder="Solanum" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="species">Espèce</Label>
            <Input id="species" {...register("species")} placeholder="lycopersicum" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cultivar">Cultivar</Label>
            <Input id="cultivar" {...register("cultivar")} placeholder="'Roma'" />
          </div>
        </div>
      </section>

      {/* ==================== CARACTÉRISTIQUES ==================== */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Caractéristiques</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Rusticité */}
          <div className="space-y-2">
            <Label htmlFor="hardiness">Rusticité</Label>
            <select
              id="hardiness"
              {...register("hardiness")}
              className="w-full p-2 border rounded-md"
            >
              <option value="">-- Sélectionner --</option>
              {hardinessOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rusticité en degrés */}
          <div className="space-y-2">
            <Label htmlFor="hardiness_degrees">Rusticité (°C)</Label>
            <Input
              id="hardiness_degrees"
              {...register("hardiness_degrees")}
              placeholder="Ex: -5°C, Zone 8"
            />
          </div>

          {/* Fleurs */}
          <div className="space-y-2">
            <Label htmlFor="flowers">Fleurs</Label>
            <Input
              id="flowers"
              {...register("flowers")}
              placeholder="Ex: Jaunes, juin-sept"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hauteur */}
          <div className="space-y-2">
            <Label htmlFor="height">Hauteur</Label>
            <Input
              id="height"
              {...register("height")}
              placeholder="Ex: 60-90cm"
            />
          </div>

          {/* Étalement */}
          <div className="space-y-2">
            <Label htmlFor="spread">Étalement</Label>
            <Input
              id="spread"
              {...register("spread")}
              placeholder="Ex: 40-50cm"
            />
          </div>
        </div>

        {/* Position (choix multiple) */}
        <div className="space-y-2">
          <Label>Exposition</Label>
          <div className="flex gap-4">
            {positionOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2">
                <Controller
                  name="position"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      value={opt.value}
                      checked={field.value?.includes(opt.value) ?? false}
                      onChange={(e) => {
                        const current = field.value ?? [];
                        if (e.target.checked) {
                          field.onChange([...current, opt.value]);
                        } else {
                          field.onChange(current.filter((v) => v !== opt.value));
                        }
                      }}
                    />
                  )}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SEMIS ==================== */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Semis</h3>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("stratification")} />
            Stratification requise
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("cover_to_germinate")} />
            Couvrir pour germer
          </label>
        </div>

        {/* Temps de germination */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="inside_germinate_time">Germination intérieur (j)</Label>
            <Input
              id="inside_germinate_time"
              type="number"
              {...register("inside_germinate_time")}
              placeholder="Ex: 7"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="outside_germinate_time">Germination extérieur (j)</Label>
            <Input
              id="outside_germinate_time"
              type="number"
              {...register("outside_germinate_time")}
              placeholder="Ex: 14"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sowing_depth">Profondeur (mm)</Label>
            <Input
              id="sowing_depth"
              type="number"
              {...register("sowing_depth")}
              placeholder="Ex: 5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="best_sowing_temp">Température idéale</Label>
            <Input
              id="best_sowing_temp"
              {...register("best_sowing_temp")}
              placeholder="Ex: 18-22°C"
            />
          </div>
        </div>

        {/* Note sur les périodes */}
        <p className="text-sm text-gray-500 italic">
          Les périodes de semis (semaines 1-52) seront gérées via un composant
          calendrier dans une prochaine session.
        </p>
      </section>

      {/* ==================== CULTURE ==================== */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Culture</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="time_first_flower">Jours avant floraison</Label>
            <Input
              id="time_first_flower"
              type="number"
              {...register("time_first_flower")}
              placeholder="Ex: 60"
            />
          </div>
        </div>
      </section>

      {/* ==================== NOTES ==================== */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Notes & Conseils</h3>

        <div className="space-y-2">
          <Label htmlFor="description">Description générale</Label>
          <textarea
            id="description"
            {...register("description")}
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Description de la plante..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sowing_info">Conseils de semis</Label>
          <textarea
            id="sowing_info"
            {...register("sowing_info")}
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Conseils spécifiques pour le semis..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="growing_info">Conseils de culture</Label>
          <textarea
            id="growing_info"
            {...register("growing_info")}
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Conseils pour la culture et l'entretien..."
          />
        </div>
      </section>

      {/* ==================== SUBMIT ==================== */}
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

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
    commonName: plant?.commonName ?? "",
    otherCommonNames: plant?.otherCommonNames ?? "",
    family: plant?.family ?? "",
    genus: plant?.genus ?? "",
    species: plant?.species ?? "",
    cultivar: plant?.cultivar ?? "",

    // Description
    description: plant?.description ?? "",

    // Caractéristiques
    hardiness: plant?.hardiness ?? undefined,
    hardinessDegrees: plant?.hardinessDegrees ?? "",
    height: plant?.height ?? "",
    spread: plant?.spread ?? "",
    position: plant?.position ?? [],
    flowers: plant?.flowers ?? "",

    // Semis
    stratification: plant?.stratification ?? false,
    insideSowingPeriod: plant?.insideSowingPeriod ?? [],
    outsideSowingPeriod: plant?.outsideSowingPeriod ?? [],
    insideGerminateTime: plant?.insideGerminateTime ?? undefined,
    outsideGerminateTime: plant?.outsideGerminateTime ?? undefined,
    coverToGerminate: plant?.coverToGerminate ?? false,
    sowingDepth: plant?.sowingDepth ?? undefined,
    bestSowingTemp: plant?.bestSowingTemp ?? "",

    // Culture
    plantingPeriod: plant?.plantingPeriod ?? [],
    timeFirstFlower: plant?.timeFirstFlower ?? undefined,

    // Notes
    sowingInfo: plant?.sowingInfo ?? "",
    growingInfo: plant?.growingInfo ?? "",
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
      onSubmit={handleSubmit(onSubmit, (errors) => console.log("Validation errors:", errors))}
      className="space-y-8"
    >
      {/* ==================== CLASSIFICATION ==================== */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Classification</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <select id="category" {...register("category")} className="w-full p-2 border rounded-md">
              {plantCategoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
          </div>

          {/* Nom commun */}
          <div className="space-y-2">
            <Label htmlFor="commonName">Nom commun *</Label>
            <Input id="commonName" {...register("commonName")} placeholder="Ex: Tomate, Cosmos" />
            {errors.commonName && <p className="text-sm text-red-500">{errors.commonName.message}</p>}
          </div>
        </div>

        {/* Autres noms */}
        <div className="space-y-2">
          <Label htmlFor="otherCommonNames">Autres noms commons</Label>
          <Input
            id="otherCommonNames"
            {...register("otherCommonNames")}
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
            <select id="hardiness" {...register("hardiness")} className="w-full p-2 border rounded-md">
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
            <Label htmlFor="hardinessDegrees">Rusticité (°C)</Label>
            <Input id="hardinessDegrees" {...register("hardinessDegrees")} placeholder="Ex: -5°C, Zone 8" />
          </div>

          {/* Fleurs */}
          <div className="space-y-2">
            <Label htmlFor="flowers">Fleurs</Label>
            <Input id="flowers" {...register("flowers")} placeholder="Ex: Jaunes, juin-sept" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hauteur */}
          <div className="space-y-2">
            <Label htmlFor="height">Hauteur</Label>
            <Input id="height" {...register("height")} placeholder="Ex: 60-90cm" />
          </div>

          {/* Étalement */}
          <div className="space-y-2">
            <Label htmlFor="spread">Étalement</Label>
            <Input id="spread" {...register("spread")} placeholder="Ex: 40-50cm" />
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
            <input type="checkbox" {...register("coverToGerminate")} />
            Couvrir pour germer
          </label>
        </div>

        {/* Temps de germination */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="insideGerminateTime">Germination intérieur (j)</Label>
            <Input id="insideGerminateTime" type="number" {...register("insideGerminateTime")} placeholder="Ex: 7" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="outsideGerminateTime">Germination extérieur (j)</Label>
            <Input id="outsideGerminateTime" type="number" {...register("outsideGerminateTime")} placeholder="Ex: 14" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sowingDepth">Profondeur (mm)</Label>
            <Input id="sowingDepth" type="number" {...register("sowingDepth")} placeholder="Ex: 5" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bestSowingTemp">Température idéale</Label>
            <Input id="bestSowingTemp" {...register("bestSowingTemp")} placeholder="Ex: 18-22°C" />
          </div>
        </div>

        {/* Note sur les périodes */}
        <p className="text-sm text-gray-500 italic">
          Les périodes de semis (semaines 1-52) seront gérées via un composant calendrier dans une prochaine session.
        </p>
      </section>

      {/* ==================== CULTURE ==================== */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Culture</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timeFirstFlower">Jours avant floraison</Label>
            <Input id="timeFirstFlower" type="number" {...register("timeFirstFlower")} placeholder="Ex: 60" />
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
          <Label htmlFor="sowingInfo">Conseils de semis</Label>
          <textarea
            id="sowingInfo"
            {...register("sowingInfo")}
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Conseils spécifiques pour le semis..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="growingInfo">Conseils de culture</Label>
          <textarea
            id="growingInfo"
            {...register("growingInfo")}
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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  createPlantSchema,
  plantCategoryOptions,
  sunRequirementOptions,
  waterRequirementOptions,
  CreatePlantFormData
} from "../../schemas/plant.schema";
import { Plant } from "@/@types/plant.types";

type PlantFormProps = {
  defaultValues?: Partial<Plant>;
  onSubmit: (data: CreatePlantFormData) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export function PlantForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Enregistrer",
  }: PlantFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePlantFormData>({
    resolver: zodResolver(createPlantSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      latinName: defaultValues?.latinName ?? "",
      category: defaultValues?.category ?? "vegetable",
      description: defaultValues?.description ?? "",
      sowingDepthMm: defaultValues?.sowingDepthMm ?? undefined,
      sowingSpacingCm: defaultValues?.sowingSpacingCm ?? undefined,
      germinationDaysMin: defaultValues?.germinationDaysMin ?? undefined,
      germinationDaysMax: defaultValues?.germinationDaysMax ?? undefined,
      growthDaysMin: defaultValues?.growthDaysMin ?? undefined,
      growthDaysMax: defaultValues?.growthDaysMax ?? undefined,
      sunRequirement: defaultValues?.sunRequirement ?? undefined,
      waterRequirement: defaultValues?.waterRequirement ?? undefined,
      notes: defaultValues?.notes ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit,                                                         
      (errors) => console.log("Validation errors:", errors)      
    )} className="space-y-6">
      {/* Informations de base */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informations de base</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom *</Label>
            <Input id="name" {...register("name")} placeholder="Ex: Tomate" />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="latinName">Nom latin</Label>
            <Input
              id="latinName"
              {...register("latinName")}
              placeholder="Ex: Solanum lycopersicum"
            />
          </div>
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            {...register("description")}
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Description de la plante..."
          />
        </div>
      </div>

      {/* Paramètres de semis */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Paramètres de semis</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sowingDepthMm">Profondeur (mm)</Label>
            <Input
              id="sowingDepthMm"
              type="number"
              {...register("sowingDepthMm")}
              placeholder="Ex: 10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sowingSpacingCm">Espacement (cm)</Label>
            <Input
              id="sowingSpacingCm"
              type="number"
              {...register("sowingSpacingCm")}
              placeholder="Ex: 50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="germinationDaysMin">Germination min (j)</Label>
            <Input
              id="germinationDaysMin"
              type="number"
              {...register("germinationDaysMin")}
              placeholder="Ex: 7"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="germinationDaysMax">Germination max (j)</Label>
            <Input
              id="germinationDaysMax"
              type="number"
              {...register("germinationDaysMax")}
              placeholder="Ex: 14"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="growthDaysMin">Croissance min (j)</Label>
            <Input
              id="growthDaysMin"
              type="number"
              {...register("growthDaysMin")}
              placeholder="Ex: 60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="growthDaysMax">Croissance max (j)</Label>
            <Input
              id="growthDaysMax"
              type="number"
              {...register("growthDaysMax")}
              placeholder="Ex: 90"
            />
          </div>
        </div>
      </div>

      {/* Besoins */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Besoins</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sunRequirement">Ensoleillement</Label>
            <select
              id="sunRequirement"
              {...register("sunRequirement")}
              className="w-full p-2 border rounded-md"
            >
              <option value="">-- Sélectionner --</option>
              {sunRequirementOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="waterRequirement">Arrosage</Label>
            <select
              id="waterRequirement"
              {...register("waterRequirement")}
              className="w-full p-2 border rounded-md"
            >
              <option value="">-- Sélectionner --</option>
              {waterRequirementOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          {...register("notes")}
          className="w-full p-2 border rounded-md"
          rows={4}
          placeholder="Notes personnelles sur cette plante..."
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Seed } from "@/@types/seed.types";
import { createSeedSchema, CreateSeedInput, acquisitionTypeOptions } from "@/schemas/seed.shema";

// ============================================
// Helper : valeurs par défaut
// ============================================

function getFormDefaults(seed?: Partial<Seed>): CreateSeedInput {
  return {
    plantId: seed?.plantId ?? "",

    // Stock
    inStock: seed?.inStock ?? true,
    quantity: seed?.quantity ?? undefined,
    priority: seed?.priority ?? undefined,

    // Acquisition
    brand: seed?.brand ?? "",
    acquisitionPlace: seed?.acquisitionPlace ?? "",
    acquisitionType: seed?.acquisitionType ?? "unknown",
    acquisitionDate: seed?.acquisitionDate ?? "",

    // Expiration
    expiryDate: seed?.expiryDate ?? "",

    // Notes
    notes: seed?.notes ?? "",
  };
}

// ============================================
// Composant
// ============================================

type SeedFormProps = {
  defaultValues?: Partial<Seed>;
  plantId?: string; // Pré-remplir si on vient d'une page plante
  onSubmit: (data: CreateSeedInput) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export function SeedForm({
  defaultValues,
  plantId,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Enregistrer",
}: SeedFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors: _errors },
  } = useForm<CreateSeedInput>({
    resolver: zodResolver(createSeedSchema),
    defaultValues: {
      ...getFormDefaults(defaultValues),
      plantId: plantId ?? defaultValues?.plantId ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ==================== STOCK ==================== */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Stock</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* En stock */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="inStock" {...register("inStock")} className="h-4 w-4" />
            <Label htmlFor="inStock">En stock</Label>
          </div>

          {/* Quantité */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantité</Label>
            <Input id="quantity" type="number" {...register("quantity")} min={0} placeholder="Ex: 50" />
          </div>

          {/* Priorité */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priorité (0-5)</Label>
            <Input
              id="priority"
              type="number"
              {...register("priority")}
              min={0}
              max={5}
              placeholder="0 = basse, 5 = haute"
            />
          </div>
        </div>
      </section>

      {/* ==================== ACQUISITION ==================== */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Acquisition</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Marque */}
          <div className="space-y-2">
            <Label htmlFor="brand">Marque / Fournisseur</Label>
            <Input id="brand" {...register("brand")} placeholder="Ex: Kokopelli" maxLength={64} />
          </div>

          {/* Lieu */}
          <div className="space-y-2">
            <Label htmlFor="acquisitionPlace">Lieu d'acquisition</Label>
            <Input
              id="acquisitionPlace"
              {...register("acquisitionPlace")}
              placeholder="Ex: Marché bio, Jardinerie"
              maxLength={64}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="acquisitionType">Type d'acquisition</Label>
            <select id="acquisitionType" {...register("acquisitionType")} className="w-full p-2 border rounded-md">
              {acquisitionTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date acquisition */}
          <div className="space-y-2">
            <Label htmlFor="acquisitionDate">Date d'acquisition</Label>
            <Input id="acquisitionDate" type="date" {...register("acquisitionDate")} />
          </div>
        </div>
      </section>

      {/* ==================== EXPIRATION ==================== */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Expiration</h3>

        <div className="space-y-2 max-w-xs">
          <Label htmlFor="expiryDate">Date d'expiration</Label>
          <Input id="expiryDate" type="date" {...register("expiryDate")} />
        </div>
      </section>

      {/* ==================== NOTES ==================== */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Notes</h3>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes personnelles</Label>
          <textarea
            id="notes"
            {...register("notes")}
            className="w-full p-2 border rounded-md"
            rows={4}
            placeholder="Informations sur la récolte, le plant mère, conseils..."
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

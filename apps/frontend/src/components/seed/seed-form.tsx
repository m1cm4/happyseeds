import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Seed } from "@/@types/seed.types";
import { CreateSeedFormData, createSeedSchema } from "@/schemas/seed.shema";

type SeedFormProps = {
  defaultValues?: Partial<Seed>;
  onSubmit: (data: CreateSeedFormData) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export function SeedForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Enregistrer",
}: SeedFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSeedFormData>({
    resolver: zodResolver(createSeedSchema),
    defaultValues: {
      brand: defaultValues?.brand ?? "",
      quantity: defaultValues?.quantity ?? 0,
      acquisitionType: defaultValues?.acquisitionType ?? "unknown",
      acquisitionDate: defaultValues?.acquisitionDate ?? "",
      expirationDate: defaultValues?.expirationDate ?? "",
      notes: defaultValues?.notes ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Marque / Fournisseur */}
      <div className="space-y-2">
        <Label htmlFor="brand">Marque / Fournisseur</Label>
        <Input
          id="brand"
          {...register("brand")}
          placeholder="Ex: Kokopelli"
        />
      </div>

      {/* Quantité */}
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantité en stock</Label>
        <Input
          id="quantity"
          type="number"
          {...register("quantity")}
          min={0}
        />
      </div>

      {/* Type d'acquisition */}
      <div className="space-y-2">
        <Label htmlFor="acquisitionType">Type d'acquisition</Label>
        <select
          id="acquisitionType"
          {...register("acquisitionType")}
          className="w-full p-2 border rounded-md"
        >
          <option value="unknown">Non précisé</option>
          <option value="purchase">Achat</option>
          <option value="harvest">Récolte</option>
          <option value="gift">Don / Échange</option>
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="acquisitionDate">Date d'acquisition</Label>
          <Input
            id="acquisitionDate"
            type="date"
            {...register("acquisitionDate")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expirationDate">Date d'expiration</Label>
          <Input
            id="expirationDate"
            type="date"
            {...register("expirationDate")}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          {...register("notes")}
          className="w-full p-2 border rounded-md"
          rows={3}
          placeholder="Notes sur cette graine..."
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
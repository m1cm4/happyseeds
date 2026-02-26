import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Seed } from "@/@types/seed.types";
import { createSeedSchema, CreateSeedInput, acquisitionTypeOptions } from "@happyseeds/shared-types";
import { parseAcquisitionDate, formatAcquisitionDate } from "@/lib/acquisition-date";

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
      acquisitionDate: formatAcquisitionDate(seed?.acquisitionDate ?? null, seed?.acquisitionDatePrecision ?? null),
      acquisitionDatePrecision: seed?.acquisitionDatePrecision ?? "unknown",

      // Expiration
      expiryDate: seed?.expiryDate ?? "",

      // Label personnel
      userLabel: seed?.userLabel ?? "",

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
      setValue,
      formState: { errors: _errors },
   } = useForm<CreateSeedInput>({
      // Cast nécessaire : z.preprocess/default crée une divergence input/output type dans zodResolver
      resolver: zodResolver(createSeedSchema) as Resolver<CreateSeedInput>,
      defaultValues: {
         ...getFormDefaults(defaultValues),
         plantId: plantId ?? defaultValues?.plantId ?? "",
      },
   });

   const handleFormSubmit = (data: CreateSeedInput) => {
      const parsed = parseAcquisitionDate(data.acquisitionDate ?? "");
      onSubmit({
         ...data,
         acquisitionDate: parsed.date,
         acquisitionDatePrecision: parsed.precision,
      });
   };

   return (
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
         {/* ==================== IDENTIFICATION ==================== */}
         <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Identification</h3>

            <div className="space-y-2 max-w-md">
               <Label htmlFor="userLabel">Mon label</Label>
               <Input
                  id="userLabel"
                  {...register("userLabel")}
                  placeholder="Ex: ref 136, Lot printemps 2024..."
                  maxLength={100}
               />
            </div>
         </section>

         {/* ==================== STOCK ==================== */}
         <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Stock</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {/* En stock */}
               <div className="flex items-center space-x-2">
                  <input
                     type="checkbox"
                     id="inStock"
                     {...register("inStock")}
                     className="w-4 h-4 rounded border-border accent-foreground"
                  />
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
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Acquisition</h3>

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
                  <select
                     id="acquisitionType"
                     {...register("acquisitionType")}
                     className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground transition-fast hover:border-wire-focus focus:border-ring focus:ring-2 focus:ring-ring/15 outline-none cursor-pointer"
                  >
                     {acquisitionTypeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                           {opt.label}
                        </option>
                     ))}
                  </select>
               </div>

               {/* Date acquisition (texte libre avec parsing auto + normalisation au blur) */}
               <div className="space-y-2">
                  <Label htmlFor="acquisitionDate">Date d'acquisition</Label>
                  <Input
                     id="acquisitionDate"
                     type="text"
                     {...register("acquisitionDate", {
                        onBlur: (e) => {
                           const parsed = parseAcquisitionDate(e.target.value);
                           setValue("acquisitionDate", formatAcquisitionDate(parsed.date, parsed.precision));
                        },
                     })}
                     placeholder="Ex: 2024, 2024-08, 03/2024"
                  />
               </div>
            </div>
         </section>

         {/* ==================== EXPIRATION ==================== */}
         <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Expiration</h3>

            <div className="space-y-2 max-w-xs">
               <Label htmlFor="expiryDate">Date d'expiration</Label>
               <Input id="expiryDate" type="date" {...register("expiryDate")} />
            </div>
         </section>

         {/* ==================== NOTES ==================== */}
         <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Notes</h3>

            <div className="space-y-2">
               <Label htmlFor="notes">Notes personnelles</Label>
               <textarea
                  id="notes"
                  {...register("notes")}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground transition-fast hover:border-wire-focus focus:border-ring focus:ring-2 focus:ring-ring/15 outline-none placeholder:text-wire-text-light"
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

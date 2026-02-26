import {
   CreateSowingSessionInput,
   createSowingSessionSchema,
   sowingSessionTypeOptions,
} from "@happyseeds/shared-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

type SowingSessionFormProps = {
   onSubmit: (data: CreateSowingSessionInput) => void;
   defaultValues?: Partial<CreateSowingSessionInput>;
   isSubmitting?: boolean;
};

export function SowingSessionForm({ onSubmit, defaultValues, isSubmitting }: SowingSessionFormProps) {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<CreateSowingSessionInput>({
      resolver: zodResolver(createSowingSessionSchema) as Resolver<CreateSowingSessionInput>,
      defaultValues: {
         name: "",
         year: new Date().getFullYear(),
         startDate: "",
         status: "planned",
         notes: "",
         ...defaultValues,
      },
   });

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         {/* Nom */}
         <div className="space-y-2">
            <Label htmlFor="name">Nom de la session *</Label>
            <Input id="name" {...register("name")} placeholder="Ex: Semis printemps 2026" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
         </div>

         {/* Année et Date de début — côte à côte */}
         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <Label htmlFor="year">Année *</Label>
               <Input id="year" type="number" {...register("year")} />
               {errors.year && <p className="text-sm text-red-500">{errors.year.message}</p>}
            </div>

            <div className="space-y-2">
               <Label htmlFor="startDate">Date de début *</Label>
               <Input id="startDate" type="date" {...register("startDate")} />
               {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
            </div>
         </div>

         {/* Status */}
         <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
               id="status"
               {...register("status")}
               className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
               {sowingSessionTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                     {option.label}
                  </option>
               ))}
            </select>
            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
         </div>

         {/* Notes */}
         <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
               id="notes"
               {...register("notes")}
               rows={4}
               className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
               placeholder="Notes sur cette session de semis..."
            />
            {errors.notes && <p className="text-sm text-red-500">{errors.notes.message}</p>}
         </div>

         {/* Submit */}
         <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : defaultValues ? "Mettre à jour" : "Créer la session"}
         </Button>
      </form>
   );
}

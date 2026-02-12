import { z } from "zod";

// ============================================
// Enums
// ============================================

export const sowingSessionStatusEnum = z.enum([
  "planned", // planifié
  "active", // actif
  "completed", // terminé
  "cancelled", // annulé
]);

export type sowingSessionStatusType = z.infer<typeof sowingSessionStatusEnum>;
// ============================================
// Options pour les formulaires (labels FR)
// ============================================
export const sowingSessionTypeOptions = [
  { value: "planned", label: "Planifiée" },
  { value: "active", label: "En cours" },
  { value: "completed", label: "Terminée" },
  { value: "cancelled", label: "Annulée" },
] as const;

// ============================================
// Helpers pour Zod
// ============================================
// Entier positif optionnel (pour durées en jours)
// preprocess gère les chaînes vides des inputs HTML avant coercion

// ============================================
// Schéma de création (formulaire)
// ============================================

export const createSowingSessionSchema = z.object({
  // Relations (plant_id optionnel - peut être ajouté via URL ou body)
  name: z.string().max(128).min(1, "Le nom est requis"),
  year: z.coerce
    .number()
    .int()
    .positive()
    .min(2000)
    .max(2200)
    .default(() => new Date().getFullYear()),
  startDate: z.string().min(1, "Une date de début est requise"),
  status: sowingSessionStatusEnum.default("planned"),
  notes: z.string().max(5000).optional().or(z.literal("")),
});

export type CreateSowingSessionInput = z.infer<typeof createSowingSessionSchema>;

// ============================================
// Schéma complet (lecture depuis API)
// ============================================

/*
extension du shémas précédent.
on redéfinit ici avec moins de contraintes : name, year, startDate, status
c'est valide parceque à la lecture pas besoin de validation stricte
mais j'aurais aussi pu laisser les validation de create
*/
export const sowingSessionSchema = createSowingSessionSchema.extend({
  id: z.string().uuid(),
  userId: z.string(),
  name: z.string(),
  year: z.number().int(),
  startDate: z.string(),
  status: sowingSessionStatusEnum,
  notes: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type SowingSession = z.infer<typeof sowingSessionSchema>;

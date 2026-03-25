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

// Type inféré de l'enum — utilisé par : frontend (formulaires, filtres) + backend (typage service)
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
// Schéma de création
// Utilisé par : route backend POST /api/sowing-sessions (zValidator) + formulaire frontend (création)
// ============================================

export const createSowingSessionSchema = z.object({
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

// Utilisé par : route backend POST (typage body) + formulaire frontend (typage form)
export type CreateSowingSessionInput = z.infer<typeof createSowingSessionSchema>;

// ============================================
// Schéma de mise à jour (tous les champs optionnels)
// Utilisé par : route backend PATCH /api/sowing-sessions/:id (zValidator) + formulaire frontend (édition)
// ============================================

export const updateSowingSessionSchema = createSowingSessionSchema.partial();

// Utilisé par : route backend PATCH (typage body) + service frontend (typage paramètre)
export type UpdateSowingSessionInput = z.infer<typeof updateSowingSessionSchema>;

// ============================================
// Schéma complet (lecture depuis API)
// Utilisé par : désérialisation des réponses API côté frontend
// ============================================

/*
Extension du schéma de création avec moins de contraintes : name, year, startDate, status
sont redéfinis ici pour la lecture (pas besoin de validation stricte à la désérialisation).
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

// Utilisé par : hooks TanStack Query + composants frontend (affichage)
export type SowingSession = z.infer<typeof sowingSessionSchema>;

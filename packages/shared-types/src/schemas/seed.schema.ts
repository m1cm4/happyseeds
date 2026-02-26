import { z } from "zod";

// ============================================
// Enums
// ============================================

export const acquisitionTypeEnum = z.enum([
  "self_harvested", // Récolte personnelle
  "purchase", // Achat
  "gift", // Don / Échange
  "unknown", // Non précisé
]);

export const acquisitionDatePrecisionEnum = z.enum([
  "month", // YYYY-MM
  "year", // YYYY
  "unknown", // Date inconnue
]);

// Types inférés des enums — utilisés par : frontend (formulaires, filtres) + backend (typage service)
export type AcquisitionType = z.infer<typeof acquisitionTypeEnum>;
export type AcquisitionDatePrecision = z.infer<typeof acquisitionDatePrecisionEnum>;

// ============================================
// Options pour les formulaires (labels FR)
// ============================================

export const acquisitionTypeOptions = [
  { value: "unknown", label: "Non précisé" },
  { value: "purchase", label: "Achat" },
  { value: "self_harvested", label: "Récolte personnelle" },
  { value: "gift", label: "Don / Échange" },
] as const;

export const acquisitionDatePrecisionOptions = [
  { value: "unknown", label: "Inconnue" },
  { value: "year", label: "Année" },
  { value: "month", label: "Mois" },
] as const;

// ============================================
// Helpers pour zod
// ============================================

// Entier optionnel (gestion empty string HTML)
const optionalInt = z.preprocess(
  (val) => (val === "" || val === undefined ? undefined : val),
  z.coerce.number().int().optional()
);

// Priorité 0-5
const prioritySchema = z.preprocess(
  (val) => (val === "" || val === undefined ? undefined : val),
  z.coerce.number().int().min(0).max(5).optional()
);

// ============================================
// Schéma de création
// Utilisé par : route backend POST /api/seeds (zValidator) + formulaire frontend (création)
// ============================================

export const createSeedSchema = z.object({
  // Relations (plant_id optionnel - peut être ajouté via URL ou body)
  plantId: z.string().uuid().optional().or(z.literal("")),
  priority: prioritySchema,
  // État du stock
  inStock: z.boolean().default(true),
  quantity: optionalInt,
  expiryDate: z.string().optional().or(z.literal("")),

  // Acquisition
  brand: z.string().max(64).optional().or(z.literal("")),
  acquisitionPlace: z.string().max(64).optional().or(z.literal("")),
  acquisitionType: acquisitionTypeEnum.default("unknown"),
  acquisitionDate: z.string().optional().or(z.literal("")), // Format: YYYY-MM-DD
  acquisitionDatePrecision: acquisitionDatePrecisionEnum.default("unknown"),

  // Label personnel
  userLabel: z.string().max(100).optional().or(z.literal("")),

  // Notes
  notes: z.string().max(5000).optional().or(z.literal("")),
});

// Utilisé par : route backend POST (typage body) + formulaire frontend (typage form)
export type CreateSeedInput = z.infer<typeof createSeedSchema>;

// ============================================
// Schéma de mise à jour (tous les champs optionnels)
// Utilisé par : route backend PATCH /api/seeds/:id (zValidator) + formulaire frontend (édition)
// ============================================

export const updateSeedSchema = createSeedSchema.partial();

// Utilisé par : route backend PATCH (typage body) + service frontend (typage paramètre)
export type UpdateSeedInput = z.infer<typeof updateSeedSchema>;

// ============================================
// Schéma complet (lecture depuis API)
// Utilisé par : désérialisation des réponses API côté frontend
// ============================================

export const seedSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  plantId: z.string().uuid().nullable(), // Nullable en DB

  inStock: z.boolean(),
  quantity: z.number().int().nullable(),
  priority: z.number().int().min(0).max(5).nullable(),

  brand: z.string().nullable(),
  acquisitionPlace: z.string().nullable(),
  acquisitionType: acquisitionTypeEnum.nullable(),
  acquisitionDate: z.string().nullable(),
  acquisitionDatePrecision: acquisitionDatePrecisionEnum.nullable(),
  expiryDate: z.string().nullable(),
  userLabel: z.string().nullable(),
  notes: z.string().nullable(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// Utilisé par : hooks TanStack Query + composants frontend (affichage)
export type Seed = z.infer<typeof seedSchema>;

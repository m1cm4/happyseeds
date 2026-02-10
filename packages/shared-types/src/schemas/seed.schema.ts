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

export type AcquisitionType = z.infer<typeof acquisitionTypeEnum>;

// ============================================
// Options pour les formulaires (labels FR)
// ============================================

export const acquisitionTypeOptions = [
  { value: "unknown", label: "Non précisé" },
  { value: "purchase", label: "Achat" },
  { value: "self_harvested", label: "Récolte personnelle" },
  { value: "gift", label: "Don / Échange" },
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
// Schéma de création (formulaire)
// ============================================

export const createSeedSchema = z.object({
  // Relations (plant_id optionnel - peut être ajouté via URL ou body)
  plantId: z.string().uuid().optional().or(z.literal("")),
  priority: prioritySchema,
  // etat du stock
  inStock: z.boolean().default(true),
  quantity: optionalInt,
  expiryDate: z.string().optional().or(z.literal("")),

  // Acquisition
  brand: z.string().max(64).optional().or(z.literal("")),
  acquisitionPlace: z.string().max(64).optional().or(z.literal("")),
  acquisitionType: acquisitionTypeEnum.default("unknown"),
  acquisitionDate: z.string().optional().or(z.literal("")), // Format: YYYY-MM-DD
  // Notes
  notes: z.string().max(5000).optional().or(z.literal("")),
});

export type CreateSeedInput = z.infer<typeof createSeedSchema>;

// ============================================
// Schéma complet (lecture depuis API)
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
  expiryDate: z.string().nullable(),
  notes: z.string().nullable(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Seed = z.infer<typeof seedSchema>;

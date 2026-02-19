import { z } from "zod";

// ============================================
// Enums
// ============================================

export const sowingEntryStatusEnum = z.enum([
  "planned", // planifié
  "sowing", // semé
  "germinating", // germination
  "growing", //pousse
  "transplanted", //transplanté
  "completed", //semis terminé
  "failed", //échec
]);

export type SowingEntryStatusType = z.infer<typeof sowingEntryStatusEnum>;

export const sowingEntryLocationEnum = z.enum([
  "indoor", // intérieur
  "greenhouse", // en serre
  "outdoor", // extérieur
]);

export type SowingEntryLocationType = z.infer<typeof sowingEntryLocationEnum>;

// ============================================
// Options pour les formulaires (labels FR)
// ============================================

export const sowingEntryStatusOptions = [
  { value: "planned", label: "Planifié" },
  { value: "sowing", label: "Semé" },
  { value: "germinating", label: "Germination" },
  { value: "growing", label: "Pousse" },
  { value: "transplanted", label: "Transplanté" },
  { value: "completed", label: "Semis terminé" },
  { value: "failed", label: "Échec" },
] as const;

export const sowingEntryLocationOptions = [
  { value: "indoor", label: "Intérieur" },
  { value: "greenhouse", label: "Serre" },
  { value: "outdoor", label: "Extérieur" },
] as const;

// ============================================
// Schéma de création (formulaire)
// ============================================

export const createSowingEntrySchema = z.object({
  // sessionId est défini dans params des urls , pas dans le formulaire
  seedId: z.string().uuid("L'identifiant de la graine est requis"),

  // dates
  plannedStartDate: z.string().min(1, "La date prévue du semis est requise"),
  actualStartDate: z.string().optional().or(z.literal("")),
  estimatedEndDate: z.string().optional().or(z.literal("")),
  actualEndDate: z.string().optional().or(z.literal("")),

  quantity: z.coerce.number().int().positive("La quantité doit être positive"),

  //Enums
  location: sowingEntryLocationEnum.optional(),
  status: sowingEntryStatusEnum.default("planned"),

  notes: z.string().max(5000).optional().or(z.literal("")),
});

export type CreateSowingEntryInput = z.infer<typeof createSowingEntrySchema>;

// ============================================
// Schéma complet (lecture depuis API)
// ============================================

export const sowingEntrySchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  seedId: z.string().uuid(),

  // dates
  plannedStartDate: z.string(),
  actualStartDate: z.string().nullable(),
  estimatedEndDate: z.string().nullable(),
  actualEndDate: z.string().nullable(),

  quantity: z.number().int(),

  //Enums
  location: sowingEntryLocationEnum.nullable(),
  status: sowingEntryStatusEnum,

  notes: z.string().nullable(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type SowingEntry = z.infer<typeof sowingEntrySchema>;

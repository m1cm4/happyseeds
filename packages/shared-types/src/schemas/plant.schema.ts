import { z } from "zod";

// ============================================
// Enums
// ============================================

export const plantCategoryEnum = z.enum(["ornamental", "vegetable"]);

export const hardinessEnum = z.enum([
  "perennial",
  "biennial",
  "annual",
  "hardy_annual",
  "semi_hardy_annual",
  "non_hardy_annual",
]);

export const positionEnum = z.enum(["full_sun", "partial_shade", "shade"]);

// Types inférés des enums
export type PlantCategory = z.infer<typeof plantCategoryEnum>;
export type Hardiness = z.infer<typeof hardinessEnum>;
export type Position = z.infer<typeof positionEnum>;

// ============================================
// Options pour les formulaires (labels FR)
// ============================================

export const plantCategoryOptions = [
  { value: "ornamental", label: "Ornementale" },
  { value: "vegetable", label: "Potagère" },
] as const;

export const hardinessOptions = [
  { value: "perennial", label: "Vivace" },
  { value: "biennial", label: "Bisannuelle" },
  { value: "annual", label: "Annuelle" },
  { value: "hardy_annual", label: "Annuelle rustique" },
  { value: "semi_hardy_annual", label: "Annuelle semi-rustique" },
  { value: "non_hardy_annual", label: "Annuelle non rustique" },
] as const;

export const positionOptions = [
  { value: "full_sun", label: "Soleil" },
  { value: "partial_shade", label: "Mi-ombre" },
  { value: "shade", label: "Ombre" },
] as const;

// ============================================
// Helpers
// ============================================

// Entier positif optionnel (pour durées en jours)
// preprocess gère les chaînes vides des inputs HTML avant coercion
const optionalPositiveInt = z.preprocess(
  (val) => (val === "" || val === null || val === undefined) ? undefined : val,
  z.coerce.number().int().positive().optional()
);

// Enum optionnel (gestion des chaînes vides des selects HTML)
const optionalEnum = <T extends z.ZodEnum<any>>(enumSchema: T) =>
  z.preprocess(
    (val) => (val === "" || val === null || val === undefined) ? undefined : val,
    enumSchema.optional()
  );

// Texte court optionnel
const shortText = (max = 100) => z.string().max(max).optional().or(z.literal(""));

// Tableau de semaines (1-52) pour les périodes
const weekArraySchema = z.array(z.number().int().min(1).max(52)).optional();

// ============================================
// Schéma de création (formulaire)
// ============================================

export const createPlantSchema = z.object({
  // Classification
  category: plantCategoryEnum,
  commonName: z.string().min(1, "Le nom est requis").max(100),
  otherCommonNames: z.string().optional().or(z.literal("")),
  family: shortText(50),
  genus: shortText(50),
  species: shortText(100),
  cultivar: shortText(100),

  // Description
  description: z.string().max(5000).optional().or(z.literal("")),

  // Caractéristiques
  hardiness: optionalEnum(hardinessEnum),
  hardinessDegrees: shortText(100),
  height: shortText(100),
  spread: shortText(100),
  position: z.array(positionEnum).optional(), // Choix multiple
  flowers: shortText(100),

  // Semis
  stratification: z.boolean().optional(),
  insideSowingPeriod: weekArraySchema,
  outsideSowingPeriod: weekArraySchema,
  insideGerminateTime: optionalPositiveInt,
  outsideGerminateTime: optionalPositiveInt,
  coverToGerminate: z.boolean().optional(),
  sowingDepth: optionalPositiveInt,
  bestSowingTemp: shortText(100),

  // Culture
  plantingPeriod: weekArraySchema,
  timeFirstFlower: optionalPositiveInt,

  // Conseils (markdown)
  sowingInfo: z.string().optional().or(z.literal("")),
  growingInfo: z.string().optional().or(z.literal("")),
});

export type CreatePlantInput = z.infer<typeof createPlantSchema>;

// ============================================
// Schéma complet (lecture depuis API)
// ============================================

export const plantSchema = createPlantSchema.extend({
  id: z.string().uuid(),
  authorId: z.string(),
  // coverImageId: z.string().uuid().optional(), // Session 2.4.c
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Plant = z.infer<typeof plantSchema>;
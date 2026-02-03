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
const optionalPositiveInt = z.coerce.number().int().positive().optional();

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
  commun_name: z.string().min(1, "Le nom est requis").max(100),
  other_commun_names: z.string().optional().or(z.literal("")),
  family: shortText(50),
  genus: shortText(50),
  species: shortText(100),
  cultivar: shortText(100),

  // Description
  description: z.string().max(2000).optional().or(z.literal("")),

  // Caractéristiques
  hardiness: hardinessEnum.optional(),
  hardiness_degrees: shortText(100),
  height: shortText(100),
  spread: shortText(100),
  position: z.array(positionEnum).optional(), // Choix multiple
  flowers: shortText(100),

  // Semis
  stratification: z.boolean().optional(),
  inside_sowing_period: weekArraySchema,
  outside_sowing_period: weekArraySchema,
  inside_germinate_time: optionalPositiveInt,
  outside_germinate_time: optionalPositiveInt,
  cover_to_germinate: z.boolean().optional(),
  sowing_depth: optionalPositiveInt,
  best_sowing_temp: shortText(100),

  // Culture
  planting_period: weekArraySchema,
  time_first_flower: optionalPositiveInt,

  // Conseils (markdown)
  sowing_info: z.string().optional().or(z.literal("")),
  growing_info: z.string().optional().or(z.literal("")),
});

export type CreatePlantInput = z.infer<typeof createPlantSchema>;

// ============================================
// Schéma complet (lecture depuis API)
// ============================================

export const plantSchema = createPlantSchema.extend({
  id: z.string().uuid(),
  author_id: z.string(),
  // cover_image_id: z.string().uuid().optional(), // Session 2.4.c
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Plant = z.infer<typeof plantSchema>;
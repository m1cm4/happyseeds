import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  integer,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

// ============================================
// Enums
// ============================================

/**
 * Catégorie de plante
 */
export const plantCategoryEnum = pgEnum("plant_category", [
  "vegetable", // Légume
  "fruit",     // Fruit
  "flower",    // Fleur
  "herb",      // Herbe aromatique
  "shrub",     // Arbuste
  "other",     // Autre
]);

/**
 * Besoin en soleil
 */
export const sunRequirementEnum = pgEnum("sun_requirement", [
  "full_sun",      // Plein soleil (6h+)
  "partial_shade", // Mi-ombre (3-6h)
  "shade",         // Ombre (<3h)
]);

/**
 * Besoin en eau
 */
export const waterRequirementEnum = pgEnum("water_requirement", [
  "low",    // Peu d'eau
  "medium", // Modéré
  "high",   // Beaucoup d'eau
]);

// ============================================
// Table Plants
// ============================================

export const plants = pgTable("plants", {
  // Identifiant unique (UUID généré automatiquement)
  id: uuid("id").primaryKey().defaultRandom(),

  // Relation avec l'utilisateur propriétaire
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  // Informations de base
  name: text("name").notNull(),
  latinName: text("latin_name"),
  category: plantCategoryEnum("category").notNull(),
  description: text("description"),

  // Paramètres de semis
  sowingDepthMm: integer("sowing_depth_mm"),      // Profondeur en mm
  sowingSpacingCm: integer("sowing_spacing_cm"),  // Espacement en cm

  // Durées (en jours)
  germinationDaysMin: integer("germination_days_min"),
  germinationDaysMax: integer("germination_days_max"),
  growthDaysMin: integer("growth_days_min"),
  growthDaysMax: integer("growth_days_max"),

  // Besoins
  sunRequirement: sunRequirementEnum("sun_requirement"),
  waterRequirement: waterRequirementEnum("water_requirement"),

  // Métadonnées
  notes: text("notes"),
  imageUrl: text("image_url"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// ============================================
// Relations
// ============================================

/**
 * Une plante appartient à un utilisateur
 */
export const plantsRelations = relations(plants, ({ one }) => ({
  owner: one(user, {
    fields: [plants.userId],
    references: [user.id],
  }),
}));

// ============================================
// Types TypeScript inférés
// ============================================

/**
 * Type pour une plante complète (lecture depuis DB)
 */
export type Plant = typeof plants.$inferSelect;

/**
 * Type pour créer une plante (sans id, timestamps)
 */
export type NewPlant = typeof plants.$inferInsert;
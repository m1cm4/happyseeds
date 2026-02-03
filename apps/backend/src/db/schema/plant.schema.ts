import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

// ============================================
// Enums
// ============================================

export const plantCategoryEnum = pgEnum("plant_category", [
  "ornamental",
  "vegetable",
]);

export const hardinessEnum = pgEnum("hardiness", [
  "perennial",
  "biennial",
  "annual",
  "hardy_annual",
  "semi_hardy_annual",
  "non_hardy_annual",
]);

export const positionEnum = pgEnum("position", [
  "full_sun",
  "partial_shade",
  "shade",
]);

// ============================================
// Table Plant
// ============================================

export const plant = pgTable("plant", {
  // Identifiant
  id: uuid("id").primaryKey().defaultRandom(),

  // Classification
  category: plantCategoryEnum("category").notNull(),
  commun_name: text("commun_name").notNull(),
  other_commun_names: text("other_commun_names"),
  family: text("family"),
  genus: text("genus"),
  species: text("species"),
  cultivar: text("cultivar"),

  // Description
  description: text("description"),

  // Caractéristiques
  hardiness: hardinessEnum("hardiness"),
  hardiness_degrees: text("hardiness_degrees"),
  height: text("height"),
  spread: text("spread"),
  position: positionEnum("position").array(), // Choix multiple
  flowers: text("flowers"),

  // Semis
  stratification: boolean("stratification"),
  inside_sowing_period: integer("inside_sowing_period").array(),
  outside_sowing_period: integer("outside_sowing_period").array(),
  inside_germinate_time: integer("inside_germinate_time"),
  outside_germinate_time: integer("outside_germinate_time"),
  cover_to_germinate: boolean("cover_to_germinate"),
  sowing_depth: integer("sowing_depth"),
  best_sowing_temp: text("best_sowing_temp"),

  // Culture
  planting_period: integer("planting_period").array(),
  time_first_flower: integer("time_first_flower"),

  // Conseils
  sowing_info: text("sowing_info"),
  growing_info: text("growing_info"),

  // Images (session 2.4.c)
  // cover_image_id: uuid("cover_image_id"),

  // Métadonnées
  author_id: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// ============================================
// Relations
// ============================================

export const plantRelations = relations(plant, ({ one }) => ({
  author: one(user, {
    fields: [plant.author_id],
    references: [user.id],
  }),
}));

// ============================================
// Types TypeScript inférés
// ============================================

export type Plant = typeof plant.$inferSelect;
export type NewPlant = typeof plant.$inferInsert;
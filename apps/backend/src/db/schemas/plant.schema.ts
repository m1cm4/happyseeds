import { relations } from "drizzle-orm";
import { pgTable, pgEnum, text, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

// ============================================
// Enums
// ============================================

export const plantCategoryEnum = pgEnum("plant_category", ["ornamental", "vegetable"]);

export const hardinessEnum = pgEnum("hardiness", [
  "perennial",
  "biennial",
  "annual",
  "hardy_annual",
  "semi_hardy_annual",
  "non_hardy_annual",
]);

export const positionEnum = pgEnum("position", ["full_sun", "partial_shade", "shade"]);

// ============================================
// Table Plant
// ============================================

export const plant = pgTable("plant", {
  // Identifiant
  id: uuid("id").primaryKey().defaultRandom(),

  // Classification
  category: plantCategoryEnum("category").notNull(),
  commonName: text("common_name").notNull(),
  otherCommonNames: text("other_common_names"),
  family: text("family"),
  genus: text("genus"),
  species: text("species"),
  cultivar: text("cultivar"),

  // Description
  description: text("description"),

  // Caractéristiques
  hardiness: hardinessEnum("hardiness"),
  hardinessDegrees: text("hardiness_degrees"),
  height: text("height"),
  spread: text("spread"),
  position: positionEnum("position").array(), // Choix multiple
  flowers: text("flowers"),

  // Semis
  stratification: boolean("stratification"),
  insideSowingPeriod: integer("inside_sowing_period").array(),
  outsideSowingPeriod: integer("outside_sowing_period").array(),
  insideGerminateTime: integer("inside_germinate_time"),
  outsideGerminateTime: integer("outside_germinate_time"),
  coverToGerminate: boolean("cover_to_germinate"),
  sowingDepth: integer("sowing_depth"),
  bestSowingTemp: text("best_sowing_temp"),

  // Culture
  plantingPeriod: integer("planting_period").array(),
  timeFirstFlower: integer("time_first_flower"),

  // Conseils
  sowingInfo: text("sowing_info"),
  growingInfo: text("growing_info"),

  // Images (session 2.4.c)
  // coverImageId: uuid("cover_image_id"),

  // Métadonnées
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// ============================================
// Relations
// ============================================

export const plantRelations = relations(plant, ({ one }) => ({
  author: one(user, {
    fields: [plant.authorId],
    references: [user.id],
  }),
}));

// ============================================
// Types TypeScript inférés
// ============================================

export type Plant = typeof plant.$inferSelect;
export type NewPlant = typeof plant.$inferInsert;

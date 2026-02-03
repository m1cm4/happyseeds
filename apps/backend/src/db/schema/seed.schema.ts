import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  integer,
  timestamp,
  date,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { plant } from "./plant.schema";

// ============================================
// Enums
// ============================================

export const acquisitionTypeEnum = pgEnum("acquisiton_type", [
  "harvest", // récolte
  "purchase",     // achat
  "gift",   // donné
  "unknown"
]);


// ============================================
// Table Seeds
// ============================================

export const seeds = pgTable("seeds", {
  // Identifiant unique (UUID généré automatiquement)
  id: uuid("id").primaryKey().defaultRandom(),
  
  // relation
  plantId: uuid("plant_id")
    .notNull()
    .references(() => plant.id),

  // Relation avec l'utilisateur propriétaire
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  brand: text("brand"),

  quantity: integer("quantity").default(0),
  
  acquisitionType: acquisitionTypeEnum("aquisition_type").default("unknown"),
  
  // Dates importantes
  acquisitionDate: date("acquisition_date"),
  expirationDate: date("expiration_date"),

  // notes personnelles
  notes: text("notes"),


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

// ============================================
// Relations
// ============================================

export const seedsRelations = relations(seeds, ({ one }) => ({
  // Une graine appartient à une plante
  plant: one(plant, {
    fields: [seeds.plantId],
    references: [plant.id],
  }),
  // Une graine appartient à un utilisateur
  owner: one(user, {
    fields: [seeds.userId],
    references: [user.id],
  }),
}));

// Mise à jour des relations Plant pour inclure Seeds
export const plantRelationsUpdated = relations(plant, ({ one, many }) => ({
  author: one(user, {
    fields: [plant.author_id],
    references: [user.id],
  }),
  seeds: many(seeds),
}));

// ============================================
// Types TypeScript inférés
// ============================================

// ============================================
// Types TypeScript inférés
// ============================================

export type Seed = typeof seeds.$inferSelect;
export type NewSeed = typeof seeds.$inferInsert;
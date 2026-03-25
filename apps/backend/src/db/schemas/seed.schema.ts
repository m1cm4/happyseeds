import { relations } from "drizzle-orm";
import { pgTable, text, integer, boolean, timestamp, date, uuid, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { plant } from "./plant.schema";

// ============================================
// Enums
// ============================================
export const acquisitionTypeEnum = pgEnum("acquisition_type", ["self_harvested", "purchase", "gift", "unknown"]);
export const acquisitionDatePrecisionEnum = pgEnum("acquisition_date_precision", ["month", "year", "unknown"]);

// ============================================
// Table Seed
// ============================================
export const seed = pgTable("seed", {
  // Identifiant
  id: uuid("id").primaryKey().defaultRandom(),

  // Relations
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  plantId: uuid("plant_id").references(() => plant.id, { onDelete: "restrict" }), // Optionnel + restrict

  // Stock
  inStock: boolean("in_stock").notNull().default(true),
  quantity: integer("quantity"),
  priority: integer("priority"), // 0-5

  // Acquisition
  brand: text("brand"),
  acquisitionPlace: text("acquisition_place"),
  acquisitionType: acquisitionTypeEnum("acquisition_type").default("unknown"),
  acquisitionDate: date("acquisition_date"),
  acquisitionDatePrecision: acquisitionDatePrecisionEnum("acquisition_date_precision").default("unknown"),

  // Expiration
  expiryDate: date("expiry_date"),

  // Label personnel
  userLabel: text("user_label"),

  // Notes
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

export const seedRelations = relations(seed, ({ one }) => ({
  // Une graine appartient à une plante
  plant: one(plant, {
    fields: [seed.plantId],
    references: [plant.id],
  }),
  // Une graine appartient à un utilisateur
  owner: one(user, {
    fields: [seed.userId],
    references: [user.id],
  }),
}));

// Mise à jour des relations Plant pour inclure Seed
export const plantRelationsUpdated = relations(plant, ({ one, many }) => ({
  author: one(user, {
    fields: [plant.authorId],
    references: [user.id],
  }),
  seed: many(seed),
}));

// ============================================
// Types TypeScript inférés
// ============================================

export type Seed = typeof seed.$inferSelect;
export type NewSeed = typeof seed.$inferInsert;

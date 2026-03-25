// sowing - entry.schema.ts;

import { relations } from "drizzle-orm";
import { pgTable, text, integer, timestamp, date, uuid, pgEnum } from "drizzle-orm/pg-core";
import { seed } from "./seed.schema";
import { sowingSession } from "./sowing-session.schema";

// ============================================
// Enums
// ============================================
export const sowingEntryStatusEnum = pgEnum("sowing_entry_status", [
   "planned", // planifié
   "sowing", // semé
   "germinating", // germination
   "growing", //pousse
   "transplanted", //transplanté
   "completed", //semis terminé
   "failed", //échec
]);
export const sowingEntryLocationEnum = pgEnum("sowing_entry_location", ["indoor", "greenhouse", "outdoor"]);

// ============================================
// Table sowingEntry
// ============================================
export const sowingEntry = pgTable("sowing_entry", {
   // Identifiant
   id: uuid("id").primaryKey().defaultRandom(),

   // Relations
   sessionId: uuid("session_id")
      .notNull()
      .references(() => sowingSession.id, { onDelete: "cascade" }),

   seedId: uuid("seed_id")
      .notNull()
      .references(() => seed.id, { onDelete: "restrict" }),

   // Dates
   plannedStartDate: date("planned_start_date").notNull(),
   actualStartDate: date("actual_start_date"),
   estimatedEndDate: date("estimated_end_date"),
   actualEndDate: date("actual_end_date"),

   quantity: integer("quantity").notNull(),

   //Enums
   location: sowingEntryLocationEnum("location"),
   status: sowingEntryStatusEnum("status").notNull().default("planned"),
   notes: text("notes"),

   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
});

// ============================================
// Relations
// ============================================

export const sowingEntryRelations = relations(sowingEntry, ({ one }) => ({
   session: one(sowingSession, {
      fields: [sowingEntry.sessionId],
      references: [sowingSession.id],
   }),
   seed: one(seed, {
      fields: [sowingEntry.seedId],
      references: [seed.id],
   }),
}));

// ============================================
// Types TypeScript inférés
// ============================================

export type SowingEntryDB = typeof sowingEntry.$inferSelect;
export type NewSowingEntry = typeof sowingEntry.$inferInsert;

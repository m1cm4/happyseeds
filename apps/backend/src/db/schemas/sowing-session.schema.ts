import { relations } from "drizzle-orm";
import { pgTable, text, integer, timestamp, date, uuid, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { sowingEntry } from "./sowing-entry.schema";

// ============================================
// Enums
// ============================================
export const sowingSessionStatusEnum = pgEnum("sowing_session_status", ["planned", "active", "completed", "cancelled"]);

// ============================================
// Table SowingSession
// ============================================
export const sowingSession = pgTable("sowing_session", {
  // Identifiant
  id: uuid("id").primaryKey().defaultRandom(),

  // Relations
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  year: integer("year").notNull(),
  startDate: date("start_date").notNull(),
  status: sowingSessionStatusEnum("status").notNull().default("planned"),
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

export const sowingSessionRelations = relations(sowingSession, ({ one, many }) => ({
  // Une session appartient à un utilisateur
  owner: one(user, {
    fields: [sowingSession.userId],
    references: [user.id],
  }),
  entries: many(sowingEntry),
}));

// ============================================
// Types TypeScript inférés
// ============================================

export type SowingSessionDB = typeof sowingSession.$inferSelect;
export type NewSowingSession = typeof sowingSession.$inferInsert;

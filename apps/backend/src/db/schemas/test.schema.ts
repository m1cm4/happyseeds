import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Table de test pour vérifier que tout fonctionne
export const testTable = pgTable("test", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type TestRecord = typeof testTable.$inferSelect;
export type NewTestRecord = typeof testTable.$inferInsert;

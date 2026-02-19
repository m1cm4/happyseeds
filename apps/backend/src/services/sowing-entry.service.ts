import { eq, and, asc } from "drizzle-orm";
import { db } from "../db";
import { sowingEntry, SowingEntryDB, NewSowingEntry } from "../db/schemas";
import { sowingSessionService } from "./sowing-session.service";

// ============================================
// Types
// ============================================

// export type SowingEntryFilters = {
//    status?: "planned" | "sowing" | "germinating" | "growing" | "transplanted" | "completed" | "failed";
// };

// export type SowingEntryPaginationParams = {
//   page?: number;
//   limit?: number;
//   sortBy?: "";
//   sortOrder?: "asc" | "desc";
// };

// export type PaginatedSowingEntryResult = {
//   data: SowingEntryDB[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// };

// ============================================
// Mapping colonnes triables
// ============================================

// const sortableColumns = {
//   status: sowingEntry.status,
//   estimated_end_date: sowingEntry.estimatedEndDate,
//   actual_start_date: sowingEntry.actualStartDate,
//   location: sowingEntry.location,
//   created_at: sowingEntry.createdAt,
// } as const;

// ============================================
// Service
// ============================================

export const sowingEntryService = {
   /**
    * Vérifie que la session existe et appartient à l'utilisateur
    */
   async verifySessionOwnership(sessionId: string, userId: string): Promise<boolean> {
      const session = await sowingSessionService.findById(sessionId, userId);

      return session !== null;
   },

   // Récupère toutes les entries d'une session
   async findAllBySession(sessionId: string): Promise<SowingEntryDB[]> {
      return db
         .select()
         .from(sowingEntry)
         .where(eq(sowingEntry.sessionId, sessionId))
         .orderBy(asc(sowingEntry.plannedStartDate));
   },

   /*
    * Récupère une entry par son Id & sessionID
    */

   async findById(entryId: string, sessionId: string): Promise<SowingEntryDB | null> {
      const result = await db
         .select()
         .from(sowingEntry)
         .where(and(eq(sowingEntry.sessionId, sessionId), eq(sowingEntry.id, entryId)))
         .limit(1);
      return result[0] ?? null;
   },

   /**
    * Crée une nouvelle entry
    */
   async create(data: NewSowingEntry): Promise<SowingEntryDB> {
      const result = await db.insert(sowingEntry).values(data).returning();
      return result[0];
   },

   /**
    * Met à jour une entry
    */
   async update(
      id: string,
      sessionId: string,
      data: Partial<Omit<NewSowingEntry, "id" | "sessionId">>
   ): Promise<SowingEntryDB | null> {
      const result = await db
         .update(sowingEntry)
         .set(data)
         .where(and(eq(sowingEntry.id, id), eq(sowingEntry.sessionId, sessionId)))
         .returning();

      return result[0] ?? null;
   },

   /**
    * Supprime une entry
    */
   async delete(entryId: string, sessionId: string): Promise<boolean> {
      const result = await db
         .delete(sowingEntry)
         .where(and(eq(sowingEntry.id, entryId), eq(sowingEntry.sessionId, sessionId)))
         .returning({ id: sowingEntry.id });

      return result.length > 0;
   },
};

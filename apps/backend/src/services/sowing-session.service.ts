import { eq, and, desc, asc, SQL } from "drizzle-orm";
import { db } from "../db";
import { sowingSession, SowingSessionDB, NewSowingSession } from "../db/schemas";

// ============================================
// Types
// ============================================

export type SowingSessionFilters = {
   userId: string;
   year?: number;
   status?: "planned" | "active" | "completed" | "cancelled";
};

export type SowingSessionPaginationParams = {
   page?: number;
   limit?: number;
   sortBy?: "name" | "year" | "start_date" | "status" | "created_at";
   sortOrder?: "asc" | "desc";
};

export type PaginatedSowingSessionResult = {
   data: SowingSessionDB[];
   pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
   };
};

// ============================================
// Mapping colonnes triables
// ============================================

const sortableColumns = {
   name: sowingSession.name,
   year: sowingSession.year,
   start_date: sowingSession.startDate,
   status: sowingSession.status,
   created_at: sowingSession.createdAt,
} as const;

// ============================================
// Service
// ============================================

export const sowingSessionService = {
   /**
    * Récupère toutes les sessions avec filtres optionnels
    */
   async findAll(
      filters: SowingSessionFilters,
      pagination: SowingSessionPaginationParams = {}
   ): Promise<PaginatedSowingSessionResult> {
      const { page = 1, limit = 20, sortBy = "created_at", sortOrder = "desc" } = pagination;

      // Conditions de base : toujours filtrer par user
      const conditions: SQL[] = [eq(sowingSession.userId, filters.userId)];

      // Filtre optionnel
      if (filters.year) {
         conditions.push(eq(sowingSession.year, filters.year));
      }
      if (filters.status) {
         conditions.push(eq(sowingSession.status, filters.status));
      }

      // Compter le total
      const allForCount = await db
         .select({ id: sowingSession.id })
         .from(sowingSession)
         .where(and(...conditions));
      const total = allForCount.length;

      // Requête principale avec pagination
      const offset = (page - 1) * limit;
      const orderByColumn = sortableColumns[sortBy] ?? sowingSession.createdAt;
      const orderByDirection = sortOrder === "asc" ? asc : desc;

      const data = await db
         .select()
         .from(sowingSession)
         .where(and(...conditions))
         .orderBy(orderByDirection(orderByColumn))
         .limit(limit)
         .offset(offset);

      return {
         data,
         pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
         },
      };
   },

   /**
    * Récupère une session par son ID
    */
   async findById(id: string, userId: string): Promise<SowingSessionDB | null> {
      const result = await db
         .select()
         .from(sowingSession)
         .where(and(eq(sowingSession.id, id), eq(sowingSession.userId, userId)))
         .limit(1);

      return result[0] ?? null;
   },

   /**
    * Crée une nouvelle session
    */
   async create(data: NewSowingSession): Promise<SowingSessionDB> {
      const result = await db.insert(sowingSession).values(data).returning();
      return result[0];
   },

   /**
    * Met à jour une session
    */
   async update(
      id: string,
      userId: string,
      data: Partial<Omit<NewSowingSession, "id" | "userId">>
   ): Promise<SowingSessionDB | null> {
      const result = await db
         .update(sowingSession)
         .set(data)
         .where(and(eq(sowingSession.id, id), eq(sowingSession.userId, userId)))
         .returning();

      return result[0] ?? null;
   },

   /**
    * Supprime une session
    */
   async delete(id: string, userId: string): Promise<boolean> {
      const result = await db
         .delete(sowingSession)
         .where(and(eq(sowingSession.id, id), eq(sowingSession.userId, userId)))
         .returning({ id: sowingSession.id });

      return result.length > 0;
   },
};

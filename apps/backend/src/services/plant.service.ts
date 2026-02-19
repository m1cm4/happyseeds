import { eq, and, ilike, desc, asc, SQL } from "drizzle-orm";
import { db } from "../db";
import { plant, Plant, NewPlant } from "../db/schemas";

// ============================================
// Types pour les paramètres
// ============================================

export type PlantFilters = {
   category?: "ornamental" | "vegetable";
   search?: string;
};

// Champs triables (tous sauf les champs longs/techniques)
export type SortableField =
   | "commonName"
   | "family"
   | "genus"
   | "species"
   | "cultivar"
   | "category"
   | "createdAt"
   | "updatedAt";

export type PaginationParams = {
   page?: number;
   limit?: number;
   sortBy?: SortableField;
   sortOrder?: "asc" | "desc";
};

export type PaginatedResult<T> = {
   data: T[];
   pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
   };
};

// ============================================
// Service
// ============================================

export const plantService = {
   /**
    * Récupère toutes les plantes d'un utilisateur avec filtres et pagination
    */
   async findAll(filters: PlantFilters, pagination: PaginationParams = {}): Promise<PaginatedResult<Plant>> {
      const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = pagination;

      // Construire les conditions WHERE avec filtre sur userId, la categorie et le terme de recherche
      // un tableau de conditions
      const conditions: SQL[] = [];

      if (filters.category) {
         conditions.push(eq(plant.category, filters.category));
      }

      if (filters.search) {
         // Recherche insensible à la casse sur le nom
         conditions.push(ilike(plant.commonName, `%${filters.search}%`));
      }

      // Note: Drizzle ne fait pas de COUNT(*) directement, on compte les résultats
      const allForCount = await db
         .select({ id: plant.id })
         .from(plant)
         .where(and(...conditions));

      const total = allForCount.length;

      // Requête principale avec pagination ---------------
      const offset = (page - 1) * limit;
      //TODO
      const orderByColumn = sortBy === "commonName" ? plant.commonName : plant.createdAt;
      const orderByDirection = sortOrder === "asc" ? asc : desc;

      const data = await db
         .select()
         .from(plant)
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
    * Récupère une plante par son ID
    * Vérifie que l'utilisateur est bien le propriétaire
    */
   async findById(id: string): Promise<Plant | null> {
      const result = await db
         .select()
         .from(plant)
         .where(and(eq(plant.id, id)))
         .limit(1);

      return result[0] ?? null;
   },

   /**
    * Crée une nouvelle plante
    */
   async create(data: NewPlant): Promise<Plant> {
      const result = await db.insert(plant).values(data).returning();
      return result[0];
   },

   /**
    * Met à jour une plante existante
    * Vérifie que l'utilisateur est bien le propriétaire
    */
   async update(id: string, userId: string, data: Partial<Omit<NewPlant, "id" | "authorId">>): Promise<Plant | null> {
      const result = await db
         .update(plant)
         .set(data)
         .where(and(eq(plant.id, id), eq(plant.authorId, userId)))
         .returning();

      return result[0] ?? null;
   },

   /**
    * Supprime une plante
    * Vérifie que l'utilisateur est bien le propriétaire
    */
   async delete(id: string, userId: string): Promise<boolean> {
      const result = await db
         .delete(plant)
         .where(and(eq(plant.id, id), eq(plant.authorId, userId)))
         .returning({ id: plant.id });

      return result.length > 0;
   },
};

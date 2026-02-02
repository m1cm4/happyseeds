import { eq, and, ilike, desc, asc, SQL } from "drizzle-orm";
import { db } from "../db";
import { plants, Plant, NewPlant } from "../db/schema";

// ============================================
// Types pour les paramètres
// ============================================

export type PlantFilters = {
  category?: string;
  search?: string;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  sortBy?: "name" | "createdAt";
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

export const plantsService = {
  /**
   * Récupère toutes les plantes d'un utilisateur avec filtres et pagination
   */
  async findAll(
    filters: PlantFilters,
    pagination: PaginationParams = {}
  ): Promise<PaginatedResult<Plant>> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = pagination;

    // Construire les conditions WHERE avec filtre sur userId, la categorie et le terme de recherche
    // un tableau de conditions
    const conditions: SQL[] = [];

    if (filters.category) {
      conditions.push(eq(plants.category, filters.category as any));
    }

    if (filters.search) {
      // Recherche insensible à la casse sur le nom
      conditions.push(ilike(plants.name, `%${filters.search}%`));
    }

    // Compter le total (pour la pagination)
    const countResult = await db
      .select({ count: plants.id })
      .from(plants)
      .where(and(...conditions));

    // Note: Drizzle ne fait pas de COUNT(*) directement, on compte les résultats
    const allForCount = await db
      .select({ id: plants.id })
      .from(plants)
      .where(and(...conditions));
    const total = allForCount.length;

    // Requête principale avec pagination ---------------
    const offset = (page - 1) * limit;
    const orderByColumn = sortBy === "name" ? plants.name : plants.createdAt;
    const orderByDirection = sortOrder === "asc" ? asc : desc;

    const data = await db
      .select()
      .from(plants)
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
      .from(plants)
      .where(and(eq(plants.id, id)))
      .limit(1);

    return result[0] ?? null;
  },

  /**
   * Crée une nouvelle plante
   */
  async create(data: NewPlant): Promise<Plant> {
    const result = await db.insert(plants).values(data).returning();
    return result[0];
  },

  /**
   * Met à jour une plante existante
   * Vérifie que l'utilisateur est bien le propriétaire
   */
  async update(
    id: string,
    userId: string,
    data: Partial<Omit<NewPlant, "id" | "authorId">>
  ): Promise<Plant | null> {
    const result = await db
      .update(plants)
      .set(data)
      .where(and(eq(plants.id, id), eq(plants.authorId, userId)))
      .returning();

    return result[0] ?? null;
  },

  /**
   * Supprime une plante
   * Vérifie que l'utilisateur est bien le propriétaire
   */
  async delete(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(plants)
      .where(and(eq(plants.id, id), eq(plants.authorId, userId)))
      .returning({ id: plants.id });

    return result.length > 0;
  },
};
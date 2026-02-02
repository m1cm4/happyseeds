import { eq, and, desc, asc, SQL } from "drizzle-orm";
import { db } from "../db";
import { seeds, Seed, NewSeed } from "../db/schema";


// ============================================
// Types
// ============================================

export type SeedFilters = {
  userId: string;
  plantId: string;
};

export type SeedPaginationParams = {
  page?: number;
  limit?: number;
  sortBy?: "plantId" | "brand" | "quantity" | "acquisitionType" | "acquisitionDate" | "createdAt" | "expirationDate";
  sortOrder?: "asc" | "desc";
};

export type PaginatedSeedResult = {
  data: Seed[];
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

export const seedsService = {
  /**
   * Récupère toutes les graines d'une plante
   */
  async findAllByPlant(
    filters: SeedFilters,
    pagination: SeedPaginationParams = {}
  ): Promise<PaginatedSeedResult> {
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = pagination;

    // Conditions WHERE
    const conditions: SQL[] = [
      eq(seeds.userId, filters.userId),
      eq(seeds.plantId, filters.plantId),
    ];

    // Compter le total
    const allForCount = await db
      .select({ id: seeds.id })
      .from(seeds)
      .where(and(...conditions));
    const total = allForCount.length;

    // Requête principale
    const offset = (page - 1) * limit;
    const orderByColumn =
      sortBy === "brand" ? seeds.brand : 
      sortBy === "quantity" ? seeds.quantity : 
      sortBy === "acquisitionType" ? seeds.acquisitionType : 
      sortBy === "acquisitionDate" ? seeds.acquisitionDate : 
      sortBy === "expirationDate" ? seeds.expirationDate :
      seeds.createdAt;
    const orderByDirection = sortOrder === "asc" ? asc : desc;

    const data = await db
      .select()
      .from(seeds)
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
   * Récupère une graine par son ID
   */
  async findById(id: string, userId: string): Promise<Seed | null> {
    const result = await db
      .select()
      .from(seeds)
      .where(and(eq(seeds.id, id), eq(seeds.userId, userId)))
      .limit(1);

    return result[0] ?? null;
  },

  /**
   * Crée une nouvelle graine
   */
  async create(data: NewSeed): Promise<Seed> {
    const result = await db.insert(seeds).values(data).returning();
    return result[0];
  },

  /**
   * Met à jour une graine
   */
  async update(
    id: string,
    userId: string,
    data: Partial<Omit<NewSeed, "id" | "userId" | "plantId">>
  ): Promise<Seed | null> {
    const result = await db
      .update(seeds)
      .set(data)
      .where(and(eq(seeds.id, id), eq(seeds.userId, userId)))
      .returning();

    return result[0] ?? null;
  },

  /**
   * Supprime une graine
   */
  async delete(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(seeds)
      .where(and(eq(seeds.id, id), eq(seeds.userId, userId)))
      .returning({ id: seeds.id });

    return result.length > 0;
  },

  /**
   * Compte le nombre de graines pour une plante
   */
  async countByPlant(plantId: string, userId: string): Promise<number> {
    const result = await db
      .select({ id: seeds.id })
      .from(seeds)
      .where(and(eq(seeds.plantId, plantId), eq(seeds.userId, userId)));

    return result.length;
  },
};
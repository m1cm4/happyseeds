import { eq, and, desc, asc, SQL } from "drizzle-orm";
import { db } from "../db";
import { seed, Seed, NewSeed } from "../db/schemas";

// ============================================
// Types
// ============================================

export type SeedFilters = {
  userId: string;
  plantId?: string;      // Optionnel pour filtrage
  inStock?: boolean;     // Nouveau filtre
};

export type SeedPaginationParams = {
  page?: number;
  limit?: number;
  sortBy?:
    | "brand"
    | "priority"
    | "quantity"
    | "acquisition_type"
    | "acquisition_date"
    | "expiry_date"
    | "created_at";
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
// Mapping colonnes triables
// ============================================

const sortableColumns = {
  brand: seed.brand,
  priority: seed.priority,
  quantity: seed.quantity,
  acquisition_type: seed.acquisitionType,
  acquisition_date: seed.acquisitionDate,
  expiry_date: seed.expiryDate,
  created_at: seed.createdAt,
} as const;

// ============================================
// Service
// ============================================

export const seedService = {
  /**
   * Récupère toutes les graines avec filtres optionnels
   */
  async findAll(
    filters: SeedFilters,
    pagination: SeedPaginationParams = {}
  ): Promise<PaginatedSeedResult> {
    const {
      page = 1,
      limit = 20,
      sortBy = "created_at",
      sortOrder = "desc",
    } = pagination;

    // Conditions de base : toujours filtrer par user
    const conditions: SQL[] = [eq(seed.userId, filters.userId)];

    // Filtre optionnel par plante
    if (filters.plantId) {
      conditions.push(eq(seed.plantId, filters.plantId));
    }

    // Filtre optionnel par stock
    if (filters.inStock !== undefined) {
      conditions.push(eq(seed.inStock, filters.inStock));
    }

    // Compter le total
    const allForCount = await db
      .select({ id: seed.id })
      .from(seed)
      .where(and(...conditions));
    const total = allForCount.length;

    // Requête principale avec pagination
    const offset = (page - 1) * limit;
    const orderByColumn = sortableColumns[sortBy] ?? seed.createdAt;
    const orderByDirection = sortOrder === "asc" ? asc : desc;

    const data = await db
      .select()
      .from(seed)
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
      .from(seed)
      .where(and(eq(seed.id, id), eq(seed.userId, userId)))
      .limit(1);

    return result[0] ?? null;
  },

  /**
   * Crée une nouvelle graine
   */
  async create(data: NewSeed): Promise<Seed> {
    const result = await db.insert(seed).values(data).returning();
    return result[0];
  },

  /**
   * Met à jour une graine
   */
  async update(
    id: string,
    userId: string,
    data: Partial<Omit<NewSeed, "id" | "userId">>
  ): Promise<Seed | null> {
    const result = await db
      .update(seed)
      .set(data)
      .where(and(eq(seed.id, id), eq(seed.userId, userId)))
      .returning();

    return result[0] ?? null;
  },

  /**
   * Supprime une graine
   */
  async delete(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(seed)
      .where(and(eq(seed.id, id), eq(seed.userId, userId)))
      .returning({ id: seed.id });

    return result.length > 0;
  },

  /**
   * Compte le nombre de graines pour une plante
   */
  async countByPlant(plantId: string, userId: string): Promise<number> {
    const result = await db
      .select({ id: seed.id })
      .from(seed)
      .where(and(eq(seed.plantId, plantId), eq(seed.userId, userId)));

    return result.length;
  },

  /**
   * Vérifie si une plante a des graines associées
   * (utile avant suppression de plante)
   */
  async hasSeeds(plantId: string): Promise<boolean> {
    const result = await db
      .select({ id: seed.id })
      .from(seed)
      .where(eq(seed.plantId, plantId))
      .limit(1);

    return result.length > 0;
  },
};
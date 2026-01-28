/**
 * Client API pour communiquer avec le backend HappySeeds
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ============================================
// Types
// ============================================

export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
};

export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// ============================================
// Client HTTP
// ============================================

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    credentials: "include", // Envoyer les cookies
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new ApiError(
      data.error?.message || "Une erreur est survenue",
      data.error?.code || "UNKNOWN_ERROR",
      response.status
    );
  }

  return data;
}

// ============================================
// Erreur personnalisée
// ============================================

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ============================================
// API Plants
// ============================================

export type PlantCategory = "vegetable" | "fruit" | "flower" | "herb" | "shrub" | "other";
export type SunRequirement = "full_sun" | "partial_shade" | "shade";
export type WaterRequirement = "low" | "medium" | "high";

export type Plant = {
  id: string;
  userId: string;
  name: string;
  latinName: string | null;
  category: PlantCategory;
  description: string | null;
  sowingDepthMm: number | null;
  sowingSpacingCm: number | null;
  germinationDaysMin: number | null;
  germinationDaysMax: number | null;
  growthDaysMin: number | null;
  growthDaysMax: number | null;
  sunRequirement: SunRequirement | null;
  waterRequirement: WaterRequirement | null;
  notes: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreatePlantInput = {
  name: string;
  latinName?: string;
  category: PlantCategory;
  description?: string;
  sowingDepthMm?: number;
  sowingSpacingCm?: number;
  germinationDaysMin?: number;
  germinationDaysMax?: number;
  growthDaysMin?: number;
  growthDaysMax?: number;
  sunRequirement?: SunRequirement;
  waterRequirement?: WaterRequirement;
  notes?: string;
  imageUrl?: string;
};

export type UpdatePlantInput = Partial<CreatePlantInput>;

export type PlantsQueryParams = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export const plantsApi = {
  /**
   * Récupérer la liste des plantes avec filtres et pagination
   */
  async getAll(params: PlantsQueryParams = {}) {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.category) searchParams.set("category", params.category);
    if (params.search) searchParams.set("search", params.search);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const query = searchParams.toString();
    const endpoint = `/api/plants${query ? `?${query}` : ""}`;

    return request<PaginatedResponse<Plant>>(endpoint);
  },

  /**
   * Récupérer une plante par son ID
   */
  async getById(id: string) {
    return request<ApiResponse<Plant>>(`/api/plants/${id}`);
  },

  /**
   * Créer une nouvelle plante
   */
  async create(data: CreatePlantInput) {
    return request<ApiResponse<Plant>>("/api/plants", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Mettre à jour une plante
   */
  async update(id: string, data: UpdatePlantInput) {
    return request<ApiResponse<Plant>>(`/api/plants/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Supprimer une plante
   */
  async delete(id: string) {
    return request<ApiResponse<{ message: string }>>(`/api/plants/${id}`, {
      method: "DELETE",
    });
  },
};

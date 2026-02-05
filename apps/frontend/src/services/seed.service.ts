import { ApiResponse, PaginatedResponse } from "@/@types/api.types";
import { Seed, CreateSeedInput, UpdateSeedInput, SeedQueryParams } from "@/@types/seed.types";
import { request } from "@/lib/api-client";

export const seedApi = {
  /**
   * Liste des graines avec filtres optionnels
   * GET /api/seeds?plant_id=xxx&in_stock=true
   */
  async getAll(params: SeedQueryParams = {}) {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.plantId) searchParams.set("plantId", params.plantId);
    if (params.inStock !== undefined) searchParams.set("inStock", String(params.inStock));
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const query = searchParams.toString();
    const endpoint = `/api/seeds${query ? `?${query}` : ""}`;

    return request<PaginatedResponse<Seed>>(endpoint);
  },

  /**
   * Détail d'une graine
   * GET /api/seeds/:id
   */
  async getById(id: string) {
    return request<ApiResponse<Seed>>(`/api/seeds/${id}`);
  },

  /**
   * Créer une graine
   * POST /api/seeds
   */
  async create(data: CreateSeedInput) {
    return request<ApiResponse<Seed>>("/api/seeds", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Modifier une graine
   * PATCH /api/seeds/:id
   */
  async update(id: string, data: UpdateSeedInput) {
    return request<ApiResponse<Seed>>(`/api/seeds/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Supprimer une graine
   * DELETE /api/seeds/:id
   */
  async delete(id: string) {
    return request<ApiResponse<{ message: string }>>(`/api/seeds/${id}`, {
      method: "DELETE",
    });
  },
};
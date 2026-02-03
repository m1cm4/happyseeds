import { ApiResponse, PaginatedResponse } from "@/@types/api.types";
import { CreatePlantInput, Plant, PlantQueryParams, UpdatePlantInput } from "@/@types/plant.types";
import { request } from "@/lib/api-client";

export const plantApi = {
  /**
   * Récupérer la liste des plantes avec filtres et pagination
   */
  async getAll(params: PlantQueryParams = {}) {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.category) searchParams.set("category", params.category);
    if (params.search) searchParams.set("search", params.search);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const query = searchParams.toString();
    const endpoint = `/api/plant${query ? `?${query}` : ""}`;

    return request<PaginatedResponse<Plant>>(endpoint);
  },

  /**
   * Récupérer une plante par son ID
   */
  async getById(id: string) {
    return request<ApiResponse<Plant>>(`/api/plant/${id}`);
  },

  /**
   * Créer une nouvelle plante
   */
  async create(data: CreatePlantInput) {
    return request<ApiResponse<Plant>>("/api/plant", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Mettre à jour une plante
   */
  async update(id: string, data: UpdatePlantInput) {
    return request<ApiResponse<Plant>>(`/api/plant/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Supprimer une plante
   */
  async delete(id: string) {
    return request<ApiResponse<{ message: string }>>(`/api/plant/${id}`, {
      method: "DELETE",
    });
  },
};
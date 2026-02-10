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

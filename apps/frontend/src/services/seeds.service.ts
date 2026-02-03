import { ApiResponse, PaginatedResponse } from "@/@types/api.types";
import { Seed, CreateSeedInput, UpdateSeedInput } from "@/@types/seed.types";
import { request } from "@/lib/api-client";

export const seedsApi = {
  /**
   * Récupérer toutes les graines d'une plante
   */
  async getAll(plantId: string) {
    return request<PaginatedResponse<Seed>>(`/api/plant/${plantId}/seeds`);
  },

  /**
   * Récupérer une graine par son ID
   */
  async getById(plantId: string, id: string) {
    return request<ApiResponse<Seed>>(`/api/plant/${plantId}/seeds/${id}`);
  },

  /**
   * Créer une nouvelle graine
   */
  async create(plantId: string, data: CreateSeedInput) {
    return request<ApiResponse<Seed>>(`/api/plant/${plantId}/seeds`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Mettre à jour une graine
   */
  async update(plantId: string, id: string, data: UpdateSeedInput) {
    return request<ApiResponse<Seed>>(`/api/plant/${plantId}/seeds/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Supprimer une graine
   */
  async delete(plantId: string, id: string) {
    return request<ApiResponse<{ message: string }>>(`/api/plant/${plantId}/seeds/${id}`, {
      method: "DELETE",
    });
  },
};

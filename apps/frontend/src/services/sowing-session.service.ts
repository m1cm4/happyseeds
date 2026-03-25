import { request } from "@/lib/api-client";
import { ApiResponse, PaginatedResponse } from "@/@types/api.types";
import { SowingSessionQueryParams } from "@/@types/sowing-session.types";
import { CreateSowingSessionInput, SowingSession, UpdateSowingSessionInput } from "@happyseeds/shared-types";

export const sowingSessionApi = {
   async getAll(params: SowingSessionQueryParams = {}) {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.set("page", String(params.page));
      if (params.limit) searchParams.set("limit", String(params.limit));
      if (params.sortBy) searchParams.set("sortBy", params.sortBy);
      if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);
      if (params.year) searchParams.set("year", String(params.year));
      if (params.status) searchParams.set("status", params.status);

      const query = searchParams.toString();
      const endpoint = `/api/sowing-sessions${query ? `?${query}` : ""}`;

      return request<PaginatedResponse<SowingSession>>(endpoint);
   },

   // détail d'une session

   async getById(sessionId: string) {
      return request<ApiResponse<SowingSession>>(`/api/sowing-sessions/${sessionId}`);
   },

   // création d'une session

   async create(data: CreateSowingSessionInput) {
      return request<ApiResponse<SowingSession>>(`/api/sowing-sessions`, {
         method: "POST",
         body: JSON.stringify(data),
      });
   },

   async update(sessionId: string, data: UpdateSowingSessionInput) {
      return request<ApiResponse<SowingSession>>(`/api/sowing-sessions/${sessionId}`, {
         method: "PATCH",
         body: JSON.stringify(data),
      });
   },

   async delete(sessionId: string) {
      return request<ApiResponse<{ message: string }>>(`/api/sowing-sessions/${sessionId}`, {
         method: "DELETE",
      });
   },
};

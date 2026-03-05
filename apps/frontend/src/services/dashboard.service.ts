import { ApiResponse } from "@/@types/api.types";
import { request } from "@/lib/api-client";
import { DashboardStats } from "@happyseeds/shared-types";

// service appelé depuis le hook

export const dashboardApi = {
   // type de retour de la méthode est inféré, il est défini dans le 'return' 'request<type>'
   async getStats() {
      const endpoint = `/api/dashboard/stats`;
      return request<ApiResponse<DashboardStats>>(endpoint);
   },
};

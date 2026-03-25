import { dashboardApi } from "@/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";

// ===============================================
// Query Keys
// ===============================================

export const dashboardKeys = {
   stats: ["dashboard", "stats"] as const,
};

// ===============================================
// Queries
// ===============================================

export function useDashboardStats() {
   return useQuery({
      queryKey: dashboardKeys.stats,
      queryFn: () => dashboardApi.getStats(),
   });
}

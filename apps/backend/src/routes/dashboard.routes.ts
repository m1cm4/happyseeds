import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.middleware";
import { dashboardService } from "../services/dashboard.service";

// ============================================
// Routes
// ============================================

export const dashboardRoutes = new Hono()
   // Middleware d'authentification appliqué à toutes les routes
   .use("/*", requireAuth)

   // ========================================================
   // GET /api/dashboard/stats - Entrées pour les stats affichées dans le dashboard
   // =======================================================
   .get("/stats", async (c) => {
      const userId = c.get("userId");

      const result = await dashboardService.getStats(userId);

      return c.json({ success: true, data: result });
   });

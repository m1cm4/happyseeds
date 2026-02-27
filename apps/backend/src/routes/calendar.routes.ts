import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.middleware";
import { zValidator } from "@hono/zod-validator";
import { calendarQuerySchema } from "@happyseeds/shared-types";
import { calendarService } from "../services/calendar.service";

// ============================================
// Routes
// ============================================

export const calendarRoutes = new Hono()
   // Middleware d'authentification appliqué à toutes les routes
   .use("/*", requireAuth)

   // ==========================================
   // GET /api/calendar - Entrées de semis du mois
   // ==========================================
   .get("/", zValidator("query", calendarQuerySchema), async (c) => {
      const userId = c.get("userId");
      const { month, year } = c.req.valid("query");

      const result = await calendarService.getMonthEntries(userId, year, month);
      return c.json({ success: true, data: result });
   });

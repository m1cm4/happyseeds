import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { createSowingSessionSchema, updateSowingSessionSchema, sowingSessionStatusEnum } from "@happyseeds/shared-types";
import { requireAuth } from "../middleware/auth.middleware";
import { sowingSessionService } from "../services/sowing-session.service";

// ============================================
// Schémas de validation
// ============================================

const sortableFields = ["name", "year", "start_date", "status", "created_at"] as const;

const querySchema = z.object({
   page: z.coerce.number().int().positive().default(1),
   limit: z.coerce.number().int().positive().max(100).default(20),
   year: z.coerce.number().int().optional(),
   status: sowingSessionStatusEnum.optional(),
   sortBy: z.enum(sortableFields).default("start_date"),
   sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================
// Routes : /api/sowing-sessions
// ============================================

export const sowingSessionRoutes = new Hono()
   .use("/*", requireAuth)

   // GET /api/sowing-sesssion - Liste avec filtres optionnels
   .get("/", zValidator("query", querySchema), async (c) => {
      const userId = c.get("userId");
      const query = c.req.valid("query");

      const result = await sowingSessionService.findAll(
         { userId, year: query.year, status: query.status },
         {
            page: query.page,
            limit: query.limit,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
         }
      );

      // test non nécessaire -> retourne toujour un résltat data : []
      // if (!result) {
      //   return c.json({ success: false, error: { code: "NOT_FOUND", message: "Session non trouvée" } }, 404);
      // }

      return c.json({ success: true, ...result });
   })

   // GET /api/sowing-session/:id
   .get("/:id", async (c) => {
      const userId = c.get("userId");
      const id = c.req.param("id");

      const result = await sowingSessionService.findById(id, userId);

      if (!result) {
         return c.json({ success: false, error: { code: "NOT_FOUND", message: "Session non trouvée" } }, 404);
      }

      return c.json({ success: true, data: result });
   })

   // POST /api/sowing-session - Créer une session
   .post("/", zValidator("json", createSowingSessionSchema), async (c) => {
      const userId = c.get("userId");
      const body = c.req.valid("json");

      const newSession = await sowingSessionService.create({
         ...body,
         notes: body.notes || null, // évite le undefined dans la table
         userId,
      });

      return c.json({ success: true, data: newSession }, 201);
   })

   // PATCH /api/sowing-sessions/:id - Modifier une session
   .patch("/:id", zValidator("json", updateSowingSessionSchema), async (c) => {
      const userId = c.get("userId");
      const id = c.req.param("id");
      const body = c.req.valid("json");

      const updated = await sowingSessionService.update(id, userId, {
         ...body,
      });

      if (!updated) {
         return c.json({ success: false, error: { code: "NOT_FOUND", message: "Session non trouvée" } }, 404);
      }
      // retourne 200, (par défaut -> pas besoin de l'indiquer)
      return c.json({ success: true, data: updated });
   })

   // DELETE /api/sowing-sessions/:id - Supprimer une Session
   .delete("/:id", async (c) => {
      const userId = c.get("userId");
      const id = c.req.param("id");

      const deleted = await sowingSessionService.delete(id, userId);

      if (!deleted) {
         return c.json({ success: false, error: { code: "NOT_FOUND", message: "Session non trouvée" } }, 404);
      }

      return c.json({ success: true, data: { message: "Session supprimée" } });
   });

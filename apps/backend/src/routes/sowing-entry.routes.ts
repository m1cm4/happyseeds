// sowing-entry.routes.ts

import { Hono } from "hono";
import { createSowingEntrySchema } from "@happyseeds/shared-types";
import { requireAuth } from "../middleware/auth.middleware";
import { createMiddleware } from "hono/factory";
import { sowingEntryService } from "../services/sowing-entry.service";
import { zValidator } from "@hono/zod-validator";

// ============================================
// Schémas de validation
// ============================================

// createSowingEntrySchema -> shared-types/

const updateSowingEntrySchema = createSowingEntrySchema.partial();

// définir les variables qui serontlue et écrite , puis passée entre middleware via next()
type SessionOwnershipVariables = {
   userId: string;
   sessionId: string;
};

// ============================================
// Midlleware
// ============================================

// on vérifie la véracité de la combinaison userid + sessionId
// on ne veut pas que n'importe quel utilisateur puisse CRUD n'importe quel session
// le typage de routour de createMiddleware dit "ce middleware ajoute ces variables au contexte"
const requireSessionOwnershipMiddleware = createMiddleware<{ Variables: SessionOwnershipVariables }>(
   async (c, next) => {
      const userId = c.get("userId");
      const sessionId = c.req.param("sessionId") ?? "";

      // vérification ownership
      const isOwner = await sowingEntryService.verifySessionOwnership(sessionId, userId);
      if (!isOwner) {
         return c.json({ success: false, error: { code: "NOT_FOUND", message: "Session non trouvée" } }, 404);
      }
      c.set("sessionId", sessionId);
      await next();
   }
);

// ============================================
// Routes : /api/sowing-sessions
// ============================================

export const sowingEntryRoutes = new Hono()
   .use("/*", requireAuth)
   .use("/*", requireSessionOwnershipMiddleware)

   .get("/", async (c) => {
      const sessionId = c.get("sessionId");

      const entries = await sowingEntryService.findAllBySession(sessionId);
      return c.json({ success: true, data: entries });
   })
   .get("/:entryId", async (c) => {
      const sessionId = c.get("sessionId");
      const entryId = c.req.param("entryId");

      const entry = await sowingEntryService.findById(entryId, sessionId);
      if (!entry) {
         return c.json({ success: false, error: { code: "NOT_FOUND", message: "Semis non trouvée" } }, 404);
      }

      return c.json({ success: true, data: entry });
   })
   .post("/", zValidator("json", createSowingEntrySchema), async (c) => {
      const sessionId = c.get("sessionId");
      const body = c.req.valid("json");

      const newEntry = await sowingEntryService.create({
         ...body,
         actualStartDate: body.actualStartDate || null,
         estimatedEndDate: body.estimatedEndDate || null,
         actualEndDate: body.actualEndDate || null,
         location: body.location || null,
         notes: body.notes || null,
         sessionId,
      });

      return c.json({ success: true, data: newEntry }, 201);
   })
   .patch("/:entryId", zValidator("json", updateSowingEntrySchema), async (c) => {
      const entryId = c.req.param("entryId");
      const sessionId = c.get("sessionId");
      const body = c.req.valid("json");

      // attention zod en entrée pour les dates optionnelles sont chaines vides ""
      // pour les champs de la table, null est nécessaire
      const updated = await sowingEntryService.update(entryId, sessionId, {
         ...body,
         actualStartDate: body.actualStartDate || null,
         estimatedEndDate: body.estimatedEndDate || null,
         actualEndDate: body.actualEndDate || null,
         location: body.location || null,
         notes: body.notes || null,
      });

      if (!updated) {
         return c.json({ success: false, error: { code: "NOT_FOUND", message: "Semis non trouvée" } }, 404);
      }

      // retourne 200, (par défaut -> pas besoin de l'indiquer)
      return c.json({ success: true, data: updated });
   })
   .delete("/:entryId", async (c) => {
      const sessionId = c.get("sessionId");
      const entryId = c.req.param("entryId");

      const deleted = await sowingEntryService.delete(entryId, sessionId);
      if (!deleted) {
         return c.json({ success: false, error: { code: "NOT_FOUND", message: "Semis non trouvée" } }, 404);
      }

      return c.json({ success: true, data: { message: "Semis supprimée" } });
   });

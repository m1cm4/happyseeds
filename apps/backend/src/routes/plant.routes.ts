import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { createPlantSchema } from "@happyseeds/shared-types";
import { plantService } from "../services/plant.service";
import { requireAuth } from "../middleware/auth.middleware";

// ============================================
// Schémas de validation
// ============================================

// Champs triables (doit correspondre à SortableField du service)
const sortableFields = [
  "commonName",
  "family",
  "genus",
  "species",
  "cultivar",
  "category",
  "createdAt",
  "updatedAt",
] as const;

// Dérivé du schéma partagé
const updatePlantSchema = createPlantSchema.partial();

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(sortableFields).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================
// Routes
// ============================================

export const plantRoutes = new Hono()
  // Middleware d'authentification appliqué à toutes les routes
  .use("/*", requireAuth)

  // ==========================================
  // GET /api/plants - Liste avec filtres et pagination
  // ==========================================
  .get("/", zValidator("query", querySchema), async (c) => {
    const query = c.req.valid("query");

    const result = await plantService.findAll(
      {
        category: query.category,
        search: query.search,
      },
      {
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      }
    );

    return c.json({ success: true, ...result });
  })

  // ==========================================
  // GET /api/plants/:id - Détail d'une plante
  // ==========================================
  .get("/:id", async (c) => {
    const id = c.req.param("id");

    const plant = await plantService.findById(id);

    if (!plant) {
      return c.json(
        { success: false, error: { code: "NOT_FOUND", message: "Plante non trouvée" } },
        404
      );
    }

    return c.json({ success: true, data: plant });
  })

  // ==========================================
  // POST /api/plants - Créer une plante
  // ==========================================
  .post("/", zValidator("json", createPlantSchema), async (c) => {
    const authorId = c.get("userId");
    const body = c.req.valid("json");

    const newPlant = await plantService.create({
      ...body,
      authorId,
    });

    return c.json({ success: true, data: newPlant }, 201);
  })

  // ==========================================
  // PATCH /api/plants/:id - Mettre à jour une plante
  // ==========================================
  .patch("/:id", zValidator("json", updatePlantSchema), async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const body = c.req.valid("json");

    const plant = await plantService.update(id, userId, body);

    if (!plant) {
      return c.json(
        { success: false, error: { code: "NOT_FOUND", message: "Plante non trouvée" } },
        404
      );
    }

    return c.json({ success: true, data: plant });
  })

  // ==========================================
  // DELETE /api/plants/:id - Supprimer une plante
  // ==========================================
  .delete("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");

    const deleted = await plantService.delete(id, userId);

    if (!deleted) {
      return c.json(
        { success: false, error: { code: "NOT_FOUND", message: "Plante non trouvée" } },
        404
      );
    }

    return c.json({ success: true, data: { message: "Plante supprimée" } });
  });

import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { plantsService } from "../services/plants.service";
import { auth } from "../lib/auth";

// ============================================
// Schémas de validation Zod
// ============================================

const createPlantSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100),
  latinName: z.string().max(100).optional(),
  category: z.enum(["vegetable", "fruit", "flower", "herb", "shrub", "other"]),
  description: z.string().max(1000).optional(),
  sowingDepthMm: z.number().int().positive().optional(),
  sowingSpacingCm: z.number().int().positive().optional(),
  germinationDaysMin: z.number().int().positive().optional(),
  germinationDaysMax: z.number().int().positive().optional(),
  growthDaysMin: z.number().int().positive().optional(),
  growthDaysMax: z.number().int().positive().optional(),
  sunRequirement: z.enum(["full_sun", "partial_shade", "shade"]).optional(),
  waterRequirement: z.enum(["low", "medium", "high"]).optional(),
  notes: z.string().max(2000).optional(),
  imageUrl: z.string().url().optional(),
});

const updatePlantSchema = createPlantSchema.partial();

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["name", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================
// Routes
// ============================================

export const plantsRoutes = new Hono()

  // ==========================================
  // GET /api/plants - Liste avec filtres et pagination
  // ==========================================
  .get("/", zValidator("query", querySchema), async (c) => {
    // Récupérer l'utilisateur authentifié
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) {
      return c.json({ success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } }, 401);
    }

    const query = c.req.valid("query");

    const result = await plantsService.findAll(
      {
        userId: session.user.id,
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
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) {
      return c.json({ success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } }, 401);
    }

    const id = c.req.param("id");
    const plant = await plantsService.findById(id, session.user.id);

    if (!plant) {
      return c.json({ success: false, error: { code: "NOT_FOUND", message: "Plante non trouvée" } }, 404);
    }

    return c.json({ success: true, data: plant });
  })

  // ==========================================
  // POST /api/plants - Créer une plante
  // ==========================================
  .post("/", zValidator("json", createPlantSchema), async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) {
      return c.json({ success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } }, 401);
    }

    const body = c.req.valid("json");

    const plant = await plantsService.create({
      ...body,
      userId: session.user.id,
    });

    return c.json({ success: true, data: plant }, 201);
  })

  // ==========================================
  // PATCH /api/plants/:id - Mettre à jour une plante
  // ==========================================
  .patch("/:id", zValidator("json", updatePlantSchema), async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) {
      return c.json({ success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } }, 401);
    }

    const id = c.req.param("id");
    const body = c.req.valid("json");

    const plant = await plantsService.update(id, session.user.id, body);

    if (!plant) {
      return c.json({ success: false, error: { code: "NOT_FOUND", message: "Plante non trouvée" } }, 404);
    }

    return c.json({ success: true, data: plant });
  })

  // ==========================================
  // DELETE /api/plants/:id - Supprimer une plante
  // ==========================================
  .delete("/:id", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) {
      return c.json({ success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } }, 401);
    }

    const id = c.req.param("id");
    const deleted = await plantsService.delete(id, session.user.id);

    if (!deleted) {
      return c.json({ success: false, error: { code: "NOT_FOUND", message: "Plante non trouvée" } }, 404);
    }

    return c.json({ success: true, data: { message: "Plante supprimée" } });
  });
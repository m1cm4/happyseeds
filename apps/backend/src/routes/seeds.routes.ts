import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { seedsService } from "../services/seeds.service";
import { plantsService } from "../services/plants.service";
import { requireAuth } from "../middleware/auth.middleware";

// ============================================
// Schémas de validation
// ============================================

const createSeedSchema = z.object({
  varietyName: z.string().min(1, "Le nom de variété est requis").max(100),
  brand: z.string().max(100).optional(),
  quantity: z.number().int().min(0).default(0),
  purchaseDate: z.string().optional(), // Format: YYYY-MM-DD
  expirationDate: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

const updateSeedSchema = createSeedSchema.partial();

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["varietyName", "createdAt", "expirationDate"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================
// Routes imbriquées sous /api/plants/:plantId/seeds
// ============================================

export const seedsRoutes = new Hono()
  .use("/*", requireAuth)

  // ==========================================
  // GET /api/plants/:plantId/seeds - Liste des graines d'une plante
  // ==========================================
  .get("/", zValidator("query", querySchema), async (c) => {
    const userId = c.get("userId");
    const plantId = c.req.param("plantId");

    // Vérifier que la plante existe et appartient à l'utilisateur
    const plant = await plantsService.findById(plantId, userId);
    if (!plant) {
      return c.json(
        { success: false, error: { code: "NOT_FOUND", message: "Plante non trouvée" } },
        404
      );
    }

    const query = c.req.valid("query");
    const result = await seedsService.findAllByPlant(
      { userId, plantId },
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
  // GET /api/plants/:plantId/seeds/:id - Détail d'une graine
  // ==========================================
  .get("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");

    const seed = await seedsService.findById(id, userId);

    if (!seed) {
      return c.json(
        { success: false, error: { code: "NOT_FOUND", message: "Graine non trouvée" } },
        404
      );
    }

    return c.json({ success: true, data: seed });
  })

  // ==========================================
  // POST /api/plants/:plantId/seeds - Créer une graine
  // ==========================================
  .post("/", zValidator("json", createSeedSchema), async (c) => {
    const userId = c.get("userId");
    const plantId = c.req.param("plantId");

    // Vérifier que la plante existe et appartient à l'utilisateur
    const plant = await plantsService.findById(plantId, userId);
    if (!plant) {
      return c.json(
        { success: false, error: { code: "NOT_FOUND", message: "Plante non trouvée" } },
        404
      );
    }

    const body = c.req.valid("json");
    const seed = await seedsService.create({
      ...body,
      plantId,
      userId,
    });

    return c.json({ success: true, data: seed }, 201);
  })

  // ==========================================
  // PATCH /api/plants/:plantId/seeds/:id - Mettre à jour une graine
  // ==========================================
  .patch("/:id", zValidator("json", updateSeedSchema), async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const body = c.req.valid("json");

    const seed = await seedsService.update(id, userId, body);

    if (!seed) {
      return c.json(
        { success: false, error: { code: "NOT_FOUND", message: "Graine non trouvée" } },
        404
      );
    }

    return c.json({ success: true, data: seed });
  })

  // ==========================================
  // DELETE /api/plants/:plantId/seeds/:id - Supprimer une graine
  // ==========================================
  .delete("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");

    const deleted = await seedsService.delete(id, userId);

    if (!deleted) {
      return c.json(
        { success: false, error: { code: "NOT_FOUND", message: "Graine non trouvée" } },
        404
      );
    }

    return c.json({ success: true, data: { message: "Graine supprimée" } });
  });
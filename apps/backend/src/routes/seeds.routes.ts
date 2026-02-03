import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { seedsService } from "../services/seeds.service";
import { plantService } from "../services/plant.service";
import { requireAuth } from "../middleware/auth.middleware";

// ============================================
// Schémas de validation
// ============================================

const createSeedSchema = z.object({
  brand: z.string().max(100).optional(),
  quantity: z.number().int().min(0).default(0),
  acquisitionType: z.enum(["harvest", "purchase", "gift", "unknown"]).optional(),
  acquisitionDate: z.string().optional(), // Format: YYYY-MM-DD
  expirationDate: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

const updateSeedSchema = createSeedSchema.partial();

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["plantId","brand","quantity","acquisitionType","acquisitionDate","createdAt","expirationDate"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================
// Routes imbriquées sous Link to="/plant/:plantId/seeds
// ============================================

type Variables = {
  userId: string;
  plantId: string;
};


export const seedsRoutes = new Hono<{ Variables: Variables }>()
  .use("/*", requireAuth)
  // Middleware pour extraire et valider plantId du router parent
  // le param plantID est de type string | undefined
  // on vérifie qu'il est donné
  .use("/*", async (c, next) => {
    const plantId = c.req.param("plantId");
    if (!plantId) {
      return c.json(
        { success: false, error: { code: "BAD_REQUEST", message: "plantId requis" } },
        400
      );
    }
    c.set("plantId", plantId);
    await next();
  })

  // ==========================================
  // GET Link to="/plant/:plantId/seeds - Liste des graines d'une plante
  // ==========================================
  .get("/", zValidator("query", querySchema), async (c) => {
    const userId = c.get("userId");
    const plantId = c.get("plantId");

    // Vérifier que la plante existe et appartient à l'utilisateur
    const plant = await plantService.findById(plantId);
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
  // GET Link to="/plant/:plantId/seeds/:id - Détail d'une graine
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
  // POST Link to="/plant/:plantId/seeds - Créer une graine
  // ==========================================
  .post("/", zValidator("json", createSeedSchema), async (c) => {
    const plantId = c.get("plantId");
    const userId = c.get("userId");

    // Vérifier que la plante existe et appartient à l'utilisateur
    const plant = await plantService.findById(plantId);
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
  // PATCH Link to="/plant/:plantId/seeds/:id - Mettre à jour une graine
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
  // DELETE Link to="/plant/:plantId/seeds/:id - Supprimer une graine
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
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { createSeedSchema } from "@happyseeds/shared-types";
import { plantService } from "../services/plant.service";
import { requireAuth } from "../middleware/auth.middleware";
import { seedService } from "../services/seed.service";


// ============================================
// Schémas de validation
// ============================================

// createSeedSchema -> shared-types/

const updateSeedSchema = createSeedSchema.partial();


const sortableFields = [
  "brand",
  "priority",
  "quantity",
  "acquisition_type",
  "acquisition_date",
  "expiry_date",
  "created_at",
] as const;

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  plantId: z.string().uuid().optional(),  // Filtre optionnel
  inStock: z.enum(["true", "false"]).optional().transform(v => v === "true"),
  sortBy: z.enum(sortableFields).default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================
// Routes : /api/seed (plates)
// ============================================

export const seedRoutes = new Hono()
  .use("/*", requireAuth)

  // GET /api/seeds - Liste avec filtres optionnels
  .get("/", zValidator("query", querySchema), async (c) => {
    const userId = c.get("userId");
    const query = c.req.valid("query");
    console.log("userID", userId);
    console.log("query", query.plantId);

    // Si plantId fourni, vérifier qu'il existe
    if (query.plantId) {
      const plant = await plantService.findById(query.plantId);
      if (!plant) {
        return c.json(
          { success: false, error: { code: "NOT_FOUND", message: "Plante non trouvée" } },
          404
        );
      }
    }

    const result = await seedService.findAll(
      {
        userId,
        plantId: query.plantId,
        // todo voir ou placer ce filtre
        // inStock: query.inStock,
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

  // GET /api/seeds/:id - Détail d'une graine
  .get("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");

    const foundSeed = await seedService.findById(id, userId);

    if (!foundSeed) {
      return c.json(
        { success: false, error: { code: "NOT_FOUND", message: "Graine non trouvée" } },
        404
      );
    }

    return c.json({ success: true, data: foundSeed });
  })

  // POST /api/seed - Créer une graine
  .post("/", zValidator("json", createSeedSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    console.log("route post seed/ ", body);

    // Si plantId fourni, vérifier qu'il existe
    if (body.plantId) {
      const plant = await plantService.findById(body.plantId);
      if (!plant) {
        return c.json(
          { success: false, error: { code: "NOT_FOUND", message: "Plante non trouvée" } },
          404
        );
      }
    }

    const newSeed = await seedService.create({
      ...body,
      plantId: body.plantId || null,  // Convertir "" en null
      acquisitionDate: body.acquisitionDate || null,  // Convertir "" en null
      expiryDate: body.expiryDate || null,  // Convertir "" en null
      userId,
    });

    return c.json({ success: true, data: newSeed }, 201);
  })

  // PATCH /api/seeds/:id - Modifier une graine
  .patch("/:id", zValidator("json", updateSeedSchema), async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const body = c.req.valid("json");

    // Si plantId fourni dans le body, vérifier qu'il existe
    if (body.plantId) {
      const plant = await plantService.findById(body.plantId);
      if (!plant) {
        return c.json(
          { success: false, error: { code: "NOT_FOUND", message: "Plante non trouvée" } },
          404
        );
      }
    }

    const updatedSeed = await seedService.update(id, userId, {
      ...body,
      plantId: body.plantId || null,  // Convertir "" en null
      acquisitionDate: body.acquisitionDate || null,  // Convertir "" en null
      expiryDate: body.expiryDate || null,  // Convertir "" en null
    });

    if (!updatedSeed) {
      return c.json(
        { success: false, error: { code: "NOT_FOUND", message: "Graine non trouvée" } },
        404
      );
    }

    return c.json({ success: true, data: updatedSeed });
  })

  // DELETE /api/seeds/:id - Supprimer une graine
  .delete("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");

    const deleted = await seedService.delete(id, userId);

    if (!deleted) {
      return c.json(
        { success: false, error: { code: "NOT_FOUND", message: "Graine non trouvée" } },
        404
      );
    }

    return c.json({ success: true, data: { message: "Graine supprimée" } });
  });
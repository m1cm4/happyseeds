import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

// Middlewares ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

// on log sur toutes les requêtes
app.use("*", logger());

// autorisation des requête cross-origin
app.use("*", cors());

// Routes ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

// Health check - pour vérifier que l'API est en vie
app.get("/api/health", (c) => {
  return c.json({
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  });
});

// Route racine
app.get("/", (c) => {
  return c.text("🌱 HappySeeds API - Use /api/health to check status");
});

export { app };


import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { db } from "./db";
import { testTable } from "./db/schemas";
import { authRoutes } from "./routes/auth.routes";
import { plantRoutes } from "./routes/plant.routes";
import { seedRoutes } from "./routes/seed.routes";
import { sowingSessionRoutes } from "./routes/sowing-session.routes";
import { sowingEntryRoutes } from "./routes/sowing-entry.routes";

const app = new Hono();

// Middlewares ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

// on log sur toutes les requêtes
app.use("*", logger());

// autorisation des requête cross-origin
app.use(
   "*",
   cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true, // perme l'envoi des cookies
   })
);

// Routes ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

// Authentification ------------------------------
// montage des routes définies par le script
app.route("/api/auth", authRoutes);

// Plant CRUD ------------------------------------
app.route("/api/plants", plantRoutes);

// Seed CRUD -------------------------------------
app.route("/api/seeds", seedRoutes); // Route plate !

// SowingEntry CCRUD ---------------------------
app.route("/api/sowing-sessions/:sessionId/entries", sowingEntryRoutes);

// SowingSession CCRUD ---------------------------
app.route("/api/sowing-sessions", sowingSessionRoutes);

// Health check - check that API is alive --------
app.get("/api/health", (c) => {
   return c.json({
      success: true,
      data: {
         status: "ok",
         timestamp: new Date().toISOString(),
      },
   });
});

// Test de la connexion DB -----------------------
// app.get("/api/db-test", async (c) => {
//    try {
//       // Insérer un enregistrement de test
//       const inserted = await db.insert(testTable).values({ message: "Hello from Drizzle!" }).returning();

//       // Lire tous les enregistrements
//       const allRecords = await db.select().from(testTable);

//       return c.json({
//          success: true,
//          data: {
//             inserted: inserted[0],
//             totalRecords: allRecords.length,
//          },
//       });
//    } catch (error) {
//       return c.json(
//          {
//             success: false,
//             error: {
//                code: "DB_ERROR",
//                message: error instanceof Error ? error.message : "Unknown error",
//             },
//          },
//          500
//       );
//    }
// });

// Route racine --------------------
app.get("/", (c) => {
   return c.text("🌱 HappySeeds API - Use /api/health to check status");
});

export { app };

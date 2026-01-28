import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { db } from "./db";
import { testTable} from "./db/schema";
import { authRoutes} from "./routes/auth.routes";
import { plantsRoutes } from "./routes/plants.routes";

const app = new Hono();



// Middlewares ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

// on log sur toutes les requêtes
app.use("*", logger());

// autorisation des requête cross-origin
app.use(
  "*", 
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,// perme l'envoi des cookies
  })
);
  


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



  // Authentification --------------
  // montage des routes définies par le script
  app.route("/api/auth", authRoutes);
  

  // Plants CRUD --------------------
app.route("/api/plants", plantsRoutes); // Ajouter


  // Test de la connexion DB -------
  app.get("/api/db-test", async (c) => {
    try {
      // Insérer un enregistrement de test
      const inserted = await db
      .insert(testTable)
      .values({ message: "Hello from Drizzle!" })
      .returning();
      
      // Lire tous les enregistrements
      const allRecords = await db.select().from(testTable);
      
      return c.json({
        success: true,
        data: {
          inserted: inserted[0],
          totalRecords: allRecords.length,
        },
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          error: {
            code: "DB_ERROR",
            message: error instanceof Error ? error.message : "Unknown error",
          },
        },
        500
      );
    }
  });
  
  // Route racine
  app.get("/", (c) => {
    return c.text("🌱 HappySeeds API - Use /api/health to check status");
  });
  
  export { app };

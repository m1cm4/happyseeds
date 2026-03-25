// pour effacer toutes les tables
// force à utiliser ce fichier-ci comme config
// qui utilise un fichier schema vide
// p drizzle-kit push --config drizzle-empty.config.ts

// puis relancer un push avec le fichier config par defaut (drizzle.config)
// qui lui utilise les schemas du projet
// p drizzle-kit push

import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schemas/empty-schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});

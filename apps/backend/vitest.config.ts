import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Environnement d'exécution (node pour le backend)
    environment: "node",

    // Inclure les fichiers de test
    include: ["src/**/*.test.ts"],

    // Activer les globals (describe, it, expect sans import)
    globals: true,

    // Timeout par défaut pour chaque test (en ms)
    testTimeout: 5000,
  },
});

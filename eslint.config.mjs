import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  // Fichiers ignorés globalement
  {
    ignores: [
      "**/node_modules/",
      "**/dist/",
      "**/.output/",
      "**/build/",
      "**/.turbo/",
      "**/.vinxi/",
      "**/routeTree.gen.ts",
    ],
  },

  // Config de base JS
  js.configs.recommended,

  // Config TypeScript
  ...tseslint.configs.recommended,

  // Globals pour browser + node
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },

  // Règles communes
  {
    rules: {
      "no-console": "warn",
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  // désactive l'avertissement pour les scripts utilisé par node
  {
    files: ["scripts/**/*.{js,mjs,ts}"],
    rules: {
      "no-console": "off"
    }
  },

  // React Hooks (frontend uniquement)
  {
    files: ["apps/frontend/**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },

  // Désactive les règles qui conflictent avec Prettier (doit être en dernier)
  prettier
);

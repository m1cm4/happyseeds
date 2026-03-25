import { createAuthClient } from "better-auth/react";

// instanciation du client Better-Auth
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  fetchOptions: {
    credentials: "include", // Envoie les cookies avec les requêtes cross-origin
  },
});

export const { signIn, signUp, signOut, revokeSessions, useSession } = authClient;

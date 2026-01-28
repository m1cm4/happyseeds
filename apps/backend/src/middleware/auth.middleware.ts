import { createMiddleware } from "hono/factory";
import { auth } from "../lib/auth";

// Types pour le contexte Hono
type AuthVariables = {
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  userId: string;
};

/**
 * Middleware d'authentification
 * Vérifie que l'utilisateur est connecté et injecte la session dans le contexte
 *
 * Usage:
 * ```typescript
 * import { requireAuth } from "../middleware/auth.middleware";
 *
 * const routes = new Hono()
 *   .use("/*", requireAuth)  // Protège toutes les routes
 *   .get("/", (c) => {
 *     const userId = c.get("userId");
 *     // ...
 *   });
 * ```
 */
export const requireAuth = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session?.user) {
      return c.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Non authentifié",
          },
        },
        401
      );
    }

    // Stocker la session et userId dans le contexte Hono
    c.set("session", session);
    c.set("userId", session.user.id);

    await next();
  }
);

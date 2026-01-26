import { Hono } from "hono";
import { auth } from "../lib/auth";

const authRoutes = new Hono();

// Better-Auth gère toutes les routes /api/auth/*
// - POST /api/auth/sign-up
// - POST /api/auth/sign-in
// - POST /api/auth/sign-out
// - GET  /api/auth/session
// etc.

authRoutes.on(["POST", "GET"], "/*", (c) => {
  return auth.handler(c.req.raw);
});

export { authRoutes };
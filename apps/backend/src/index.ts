import { serve } from "@hono/node-server";
import { app } from "./app";

const port = Number(process.env.PORT) || 3001;

serve({
  fetch: app.fetch,
  port,
});

// eslint-disable-next-line no-console
console.log(`🌱 Server running at http://localhost:${port}`);

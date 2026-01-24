import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString){
   throw new Error("DATABASE_URL environment variable is not set!");
}

// connextion postgresql
// max 1 pour les migrations, + pour l'app
const client = postgres(connectionString);

export const db = drizzle(client, {schema});

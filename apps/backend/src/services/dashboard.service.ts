import { DashboardStats } from "@happyseeds/shared-types";
import { db } from "../db";
import { and, asc, count, eq, gte, inArray } from "drizzle-orm";
import { plant, seed, sowingEntry, sowingSession } from "../db/schemas";

const ACTIVE_STATUSES = ["sowing", "germinating", "growing", "transplanted"] as const;

export const dashboardService = {
   async getStats(userId: string): Promise<DashboardStats> {
      // nombre de plantes créées par l'utilisateur dans le dictionnaire
      // TODO : remplacer de comptage par le nombre de variétés de plantes
      // existant dans la collection de graines
      const plantCountResult = await db
         .select({ total: count() })
         .from(plant)
         .where(eq(plant.authorId, userId));

      const plantCount = plantCountResult[0]?.total ?? 0;

      // nombre des graines en stock -----------------------------------
      const seedCountResult = await db
         .select({ total: count() })
         .from(seed)
         .where(and(eq(seed.userId, userId), eq(seed.inStock, true)));

      const seedCount = seedCountResult[0]?.total ?? 0;

      // nombre de semis actifs ----------------------------------------
      const activeSowingsCountResult = await db
         .select({ total: count() })
         .from(sowingEntry)
         .innerJoin(sowingSession, eq(sowingSession.id, sowingEntry.sessionId))
         .where(
            and(eq(sowingSession.userId, userId), inArray(sowingEntry.status, [...ACTIVE_STATUSES]))
         );
      const activeSowingsCount = activeSowingsCountResult[0]?.total ?? 0;

      //
      // liste des prochains semis à faire
      const today = new Date().toISOString().split("T")[0]; // "2026-02-27"
      const upcomingResult = await db
         .select({
            id: sowingEntry.id,
            plannedStartDate: sowingEntry.plannedStartDate,
            seedLabel: seed.userLabel,
            plantCommonName: plant.commonName,
            sessionName: sowingSession.name,
         })
         .from(sowingEntry)
         .innerJoin(sowingSession, eq(sowingSession.id, sowingEntry.sessionId))
         .innerJoin(seed, eq(seed.id, sowingEntry.seedId))
         .leftJoin(plant, eq(plant.id, seed.plantId))
         .where(
            and(
               eq(sowingSession.userId, userId),
               eq(sowingEntry.status, "planned"),
               gte(sowingEntry.plannedStartDate, today)
            )
         )
         .orderBy(asc(sowingEntry.plannedStartDate))
         .limit(5);
      return {
         counts: {
            plants: plantCount,
            seeds: seedCount,
            activeSowings: activeSowingsCount,
         },
         upcoming: upcomingResult,
      };
   },
};

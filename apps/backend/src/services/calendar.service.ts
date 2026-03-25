import { eq, and, gte, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { CalendarEntry } from "@happyseeds/shared-types";
import { plant, seed, sowingEntry, sowingSession } from "../db/schemas";

export const calendarService = {
   /**
    * retourne une collection de sowingentry relative à un mois donnné
    * jointure pour récupérer des infos de sowingsession, seed et plant
    */
   // rem: le typage de retour n'est pas nécessaire car inféré, mais ajouté pour clareté et docu
   async getMonthEntries(userId: string, year: number, month: number): Promise<CalendarEntry[]> {
      //Bornes du mois en format ISO YYY-MM-DD
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

      const result = await db
         .select({
            id: sowingEntry.id,
            plannedStartDate: sowingEntry.plannedStartDate,
            actualStartDate: sowingEntry.actualStartDate,
            estimatedEndDate: sowingEntry.estimatedEndDate,
            actualEndDate: sowingEntry.actualEndDate,
            status: sowingEntry.status,
            location: sowingEntry.location,
            quantity: sowingEntry.quantity,
            // Session
            sessionId: sowingEntry.sessionId,
            sessionName: sowingSession.name,
            // Seed
            seedId: sowingEntry.seedId,
            seedLabel: seed.userLabel,
            // Plant
            plantCommonName: plant.commonName,
            plantLatinName: sql<string | null>`
               CASE
                  WHEN ${plant.genus} IS NOT NULL
                  THEN CONCAT(${plant.genus}, ' ', COALESCE(${plant.species}, ''))
                  ELSE NULL
               END
            `.as("plantLatinName"),
         })
         .from(sowingEntry)
         .innerJoin(sowingSession, eq(sowingEntry.sessionId, sowingSession.id))
         .innerJoin(seed, eq(sowingEntry.seedId, seed.id))
         .leftJoin(plant, eq(seed.plantId, plant.id))
         .where(
            and(
               eq(sowingSession.userId, userId),
               gte(sowingEntry.plannedStartDate, startDate),
               lte(sowingEntry.plannedStartDate, endDate)
            )
         )
         .orderBy(sowingEntry.plannedStartDate);

      return result;
   },
};

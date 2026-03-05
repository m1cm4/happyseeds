import { z } from "zod";

// Défini la forme de la réponse /api/dashboard/stats

export const dashboardUpcomingEntrySchema = z.object({
   // prochains semis planifiés
   id: z.string().uuid(),
   plannedStartDate: z.string().date(),
   seedLabel: z.string().nullable(),
   plantCommonName: z.string().nullable(),
   sessionName: z.string(),
});

export const dashboardStatsSchema = z.object({
   counts: z.object({
      // utilisation de coerce, pcq pour éviter le dépassement d'entier , le driver postgresql COUNT() pourrait retourner un string
      plants: z.coerce.number().int(),
      seeds: z.coerce.number().int(),
      activeSowings: z.coerce.number().int(),
   }),
   upcoming: z.array(dashboardUpcomingEntrySchema),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
export type DashboardUpcomingEntry = z.infer<typeof dashboardUpcomingEntrySchema>;

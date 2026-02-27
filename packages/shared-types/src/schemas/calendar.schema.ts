import { z } from "zod";
import { sowingEntryLocationEnum, sowingEntryStatusEnum } from "./sowing-entry.schema";

const YEAR_ERROR = "L'année doit être un nombre entre 2000 et 2200";
const MONTH_ERROR = "Un nombre entre 1 et 12 est attendu pour le mois";
// ============================================
// Schéma query params
// Utilisé par : route backend GET /api/calendar (zValidator) + frontend (query params)
// ============================================

export const calendarQuerySchema = z.object({
   year: z.coerce
      .number({ invalid_type_error: YEAR_ERROR })
      .int(YEAR_ERROR)
      .min(2000, { message: YEAR_ERROR })
      .max(2200, { message: YEAR_ERROR }),
   month: z.coerce
      .number({ invalid_type_error: MONTH_ERROR })
      .int(MONTH_ERROR)
      .min(1, { message: MONTH_ERROR })
      .max(12, { message: MONTH_ERROR }),
});

export type CalendarQuery = z.infer<typeof calendarQuerySchema>;

// ============================================
// Schéma d'une entry enrichie pour le calendrier
// Utilisé par : désérialisation réponse API côté frontend
// ============================================

export const calendarEntrySchema = z.object({
   // data de sowing entry
   id: z.string().uuid(),
   sessionId: z.string().uuid(),
   seedId: z.string().uuid(),
   plannedStartDate: z.string(),
   actualStartDate: z.string().nullable(),
   estimatedEndDate: z.string().nullable(),
   actualEndDate: z.string().nullable(),
   status: sowingEntryStatusEnum,
   location: sowingEntryLocationEnum.nullable(),
   quantity: z.number().int(),

   // data de sowing session
   sessionName: z.string(),

   //data de seed
   seedLabel: z.string().nullable(),

   //data de plant
   plantCommonName: z.string().nullable(),
   plantLatinName: z.string().nullable(),
});

export type CalendarEntry = z.infer<typeof calendarEntrySchema>;

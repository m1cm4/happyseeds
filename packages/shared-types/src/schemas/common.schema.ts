import { z } from "zod";

// === Schémas de base réutilisables ===

// validation de string en uuid v4
// UUID v4 - utilisé pour tous les IDs
export const uuidSchema = z.string().uuid();

// Timestamps - présents sur toutes les entités
//coerce.date convertit automat. un string ISO en objet Date
export const timestampsSchema = z.object({
   createdAt: z.coerce.date(),
   updatedAt: z.coerce.date(),
});

// === Types inférés depuis les schémas ===
// de ses schémas Zod "génère" les types TypeScript automatiquement

export type UUID = z.infer<typeof uuidSchema>;
export type Timestamps = z.infer<typeof timestampsSchema>;



// === Schéma de réponse API standard ===

// Fonction générique qui prend un schéma de données et retourne un schéma de réponse
// pour la création de plantResponseSchema, seedResponseSchema, ...
export const apiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
   z.object({
      success: z.literal(true),
      data: dataSchema,
   });

export const apiErrorSchema = z.object({
   success: z.literal(false),
   error: z.object({
   code: z.string(),
   message: z.string(),
   details: z.record(z.unknown()).optional(),
}),
});
// Type union pour les réponses API
export type ApiSuccess<T> = {
success: true;
data: T;
};

export type ApiError = z.infer<typeof apiErrorSchema>;

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
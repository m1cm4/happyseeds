import { z } from "@happyseeds/shared-types";

export const createSeedSchema = z.object({
  brand: z.string().max(100).optional().or(z.literal("")),
  quantity: z.coerce.number().int().min(0).default(0),
  acquisitionType: z.enum(["harvest", "purchase", "gift", "unknown"]).default("unknown"),
  acquisitionDate: z.string().optional().or(z.literal("")),
  expirationDate: z.string().optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export type CreateSeedFormData = z.infer<typeof createSeedSchema>;
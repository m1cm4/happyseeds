import type {
  Seed,
  CreateSeedInput,
  UpdateSeedInput,
  AcquisitionType,
  AcquisitionDatePrecision,
} from "@happyseeds/shared-types";

// Ré-exports depuis shared-types
export type { Seed, CreateSeedInput, UpdateSeedInput, AcquisitionType, AcquisitionDatePrecision };

// Types spécifiques au frontend — utilisés par : hooks TanStack Query, composants liste/filtre
export type SeedQueryParams = {
  page?: number;
  limit?: number;
  plantId?: string;
  inStock?: boolean;
  sortBy?: "brand" | "priority" | "quantity" | "acquisition_date" | "expiry_date" | "user_label" | "created_at";
  sortOrder?: "asc" | "desc";
};

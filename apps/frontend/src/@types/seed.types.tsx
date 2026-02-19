import type { Seed, CreateSeedInput, AcquisitionType, AcquisitionDatePrecision } from "@happyseeds/shared-types";

// Ré-export pour usage local
export type { Seed, CreateSeedInput, AcquisitionType, AcquisitionDatePrecision };

// Types spécifiques au frontend
export type UpdateSeedInput = Partial<CreateSeedInput>;

export type SeedQueryParams = {
  page?: number;
  limit?: number;
  plantId?: string; // Filtre optionnel
  inStock?: boolean; // Filtre optionnel
  sortBy?: "brand" | "priority" | "quantity" | "acquisition_date" | "expiry_date" | "user_label" | "created_at";
  sortOrder?: "asc" | "desc";
};

// voir api.types.tsx > type PaginatedResponse<T>

//  export type SeedResponse = {
//    success: boolean;
//    data: Seed[];
//    pagination: {
//      page: number;
//      limit: number;
//      total: number;
//      totalPages: number;
//    };
//  };

//  export type SeedResponse = {
//    success: boolean;
//    data: Seed;
//  };

import type { PlantCategory } from "@happyseeds/shared-types";

// Types spécifiques au frontend — utilisés par : hooks TanStack Query, composants liste/filtre
export type PlantQueryParams = {
   page?: number;
   limit?: number;
   category?: PlantCategory;
   search?: string;
   sortBy?: "commonName" | "family" | "genus" | "createdAt";
   sortOrder?: "asc" | "desc";
};

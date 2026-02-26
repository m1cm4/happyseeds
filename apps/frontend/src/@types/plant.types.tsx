import type {
  Plant,
  CreatePlantInput,
  UpdatePlantInput,
  PlantCategory,
  Hardiness,
  Position,
} from "@happyseeds/shared-types";

// Ré-exports depuis shared-types
export type { Plant, CreatePlantInput, UpdatePlantInput, PlantCategory, Hardiness, Position };

// Types spécifiques au frontend — utilisés par : hooks TanStack Query, composants liste/filtre
export type PlantQueryParams = {
  page?: number;
  limit?: number;
  category?: PlantCategory;
  search?: string;
  sortBy?: "commonName" | "family" | "genus" | "createdAt";
  sortOrder?: "asc" | "desc";
};

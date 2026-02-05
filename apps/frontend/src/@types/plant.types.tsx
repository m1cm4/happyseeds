// ============================================
// API Plant
// ============================================
import type {
  Plant,
  CreatePlantInput,
  PlantCategory,
  Hardiness,
  Position,
} from "@happyseeds/shared-types";

// Ré-export pour usage local
export type { Plant, CreatePlantInput, PlantCategory, Hardiness, Position };

// Types spécifiques au frontend
export type UpdatePlantInput = Partial<CreatePlantInput>;

export type PlantQueryParams = {
  page?: number;
  limit?: number;
  category?: PlantCategory;
  search?: string;
  sortBy?: "commonName" | "family" | "genus" | "createdAt";
  sortOrder?: "asc" | "desc";
};
// ============================================
// API Plants
// ============================================

export type PlantCategory = "vegetable" | "fruit" | "flower" | "herb" | "shrub" | "other";
export type SunRequirement = "full_sun" | "partial_shade" | "shade";
export type WaterRequirement = "low" | "medium" | "high";

export type Plant = {
  id: string;
  userId: string;
  name: string;
  latinName: string | null;
  category: PlantCategory;
  description: string | null;
  sowingDepthMm: number | null;
  sowingSpacingCm: number | null;
  germinationDaysMin: number | null;
  germinationDaysMax: number | null;
  growthDaysMin: number | null;
  growthDaysMax: number | null;
  sunRequirement: SunRequirement | null;
  waterRequirement: WaterRequirement | null;
  notes: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreatePlantInput = {
  name: string;
  latinName?: string;
  category: PlantCategory;
  description?: string;
  sowingDepthMm?: number;
  sowingSpacingCm?: number;
  germinationDaysMin?: number;
  germinationDaysMax?: number;
  growthDaysMin?: number;
  growthDaysMax?: number;
  sunRequirement?: SunRequirement;
  waterRequirement?: WaterRequirement;
  notes?: string;
  imageUrl?: string;
};

export type UpdatePlantInput = Partial<CreatePlantInput>;

export type PlantsQueryParams = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
};
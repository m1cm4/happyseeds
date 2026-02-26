import type {
  SowingEntry,
  CreateSowingEntryInput,
  UpdateSowingEntryInput,
  SowingEntryStatusType,
  SowingEntryLocationType,
} from "@happyseeds/shared-types";

// Ré-exports depuis shared-types
export type {
  SowingEntry,
  CreateSowingEntryInput,
  UpdateSowingEntryInput,
  SowingEntryStatusType,
  SowingEntryLocationType,
};

// Types spécifiques au frontend — utilisés par : hooks TanStack Query, composants liste/filtre
export type SowingEntryQueryParams = {
  page?: number;
  limit?: number;
  status?: SowingEntryStatusType;
  sortBy?: "planned_start_date" | "status" | "created_at";
  sortOrder?: "asc" | "desc";
};

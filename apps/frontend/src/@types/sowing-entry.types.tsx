import type { SowingEntryStatusType } from "@happyseeds/shared-types";

// Types spécifiques au frontend — utilisés par : hooks TanStack Query, composants liste/filtre
export type SowingEntryQueryParams = {
   page?: number;
   limit?: number;
   status?: SowingEntryStatusType;
   sortBy?: "planned_start_date" | "status" | "created_at";
   sortOrder?: "asc" | "desc";
};

import { sowingSessionStatusType } from "@happyseeds/shared-types";

// Types spécifiques au frontend — utilisés par : hooks TanStack Query, composants liste/filtre
export type SowingSessionQueryParams = {
   page?: number;
   limit?: number;
   year?: number;
   status?: sowingSessionStatusType;
   sortBy?: "name" | "year" | "start_date" | "status" | "created_at";
   sortOrder?: "asc" | "desc";
};

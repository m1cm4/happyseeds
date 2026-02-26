import type {
  SowingSession,
  CreateSowingSessionInput,
  UpdateSowingSessionInput,
  sowingSessionStatusType,
} from "@happyseeds/shared-types";

// Ré-exports depuis shared-types
export type { SowingSession, CreateSowingSessionInput, UpdateSowingSessionInput, sowingSessionStatusType };

// Types spécifiques au frontend — utilisés par : hooks TanStack Query, composants liste/filtre
export type SowingSessionQueryParams = {
  page?: number;
  limit?: number;
  year?: number;
  status?: string;
  sortBy?: "name" | "year" | "start_date" | "status" | "created_at";
  sortOrder?: "asc" | "desc";
};

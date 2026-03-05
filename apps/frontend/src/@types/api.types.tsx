export type { ApiResponse } from "@happyseeds/shared-types";

export type PaginatedResponse<T> = {
   success: true;
   data: T[];
   pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
   };
};

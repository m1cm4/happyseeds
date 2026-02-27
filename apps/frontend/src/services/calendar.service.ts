import { ApiResponse } from "@/@types/api.types";
import { request } from "@/lib/api-client";
import { CalendarEntry } from "@happyseeds/shared-types";

// service appelé depuis le hook

export const calendarApi = {
   async getMonth(year: number, month: number) {
      const searchParams = new URLSearchParams();
      searchParams.set("year", String(year));
      searchParams.set("month", String(month));
      const endpoint = `/api/calendar?${searchParams.toString()}`;
      return request<ApiResponse<CalendarEntry[]>>(endpoint);
   },
};

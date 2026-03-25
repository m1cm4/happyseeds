import { calendarApi } from "@/services/calendar.service";
import { useQuery } from "@tanstack/react-query";

// ===============================================
// Query Keys
// ===============================================

export const calendarKeys = {
   all: ["calendar"] as const,
   month: (year: number, month: number) => [...calendarKeys.all, year, month] as const,
};

// ===============================================
// Queries
// ===============================================

export function useCalendarMonth(year: number, month: number) {
   return useQuery({
      queryKey: calendarKeys.month(year, month),
      queryFn: () => calendarApi.getMonth(year, month),
   });
}

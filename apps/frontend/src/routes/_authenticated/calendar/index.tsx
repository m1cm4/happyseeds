import { useCalendarMonth } from "@/hooks/useCalendar";
import { createFileRoute, redirect, useNavigate, useSearch } from "@tanstack/react-router";
import { SimpleLoadingText } from "@/components/common/loadings";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/calendar/")({
   validateSearch: (search: Record<string, unknown>) => ({
      //<Link to  ou navigate(to) renvoie des params en number
      // si les params ne sont pas transmis, assigner ceux du jour
      year: search.year != null ? parseInt(String(search.year), 10) : new Date().getFullYear(),
      month: search.month != null ? parseInt(String(search.month), 10) : new Date().getMonth() + 1,
   }),
   component: CalendarPage,
});

function CalendarPage() {
   const navigate = useNavigate();
   const { year, month } = useSearch({ from: "/_authenticated/calendar/" });
   const { data, isLoading, isError, error } = useCalendarMonth(year, month);

   const prevMonth = () => {
      const newMonth = month === 1 ? 12 : month - 1;
      const newYear = month === 1 ? year - 1 : year;
      navigate({ to: ".", search: { year: newYear, month: newMonth } });
   };

   const nextMonth = () => {
      const newMonth = month === 12 ? 1 : month + 1;
      const newYear = month === 12 ? year + 1 : year;
      navigate({ to: ".", search: { year: newYear, month: newMonth } });
   };

   const title = new Date(year, month - 1).toLocaleString("fr-FR", {
      month: "long",
      year: "numeric",
   });
   //test avec success nécessaire parce que .data n'est pas toujours accessible parce que type ApiResponse est une union
   const entries = data?.success ? data.data : [];

   if (isLoading) {
      return <SimpleLoadingText text="Chargement du Calendrier ..." />;
   }

   if (isError) {
      return (
         <div className="bg-destructive/10 text-destructive p-6 rounded-lg border border-destructive/20">
            <p>Erreur : {error.message}</p>
         </div>
      );
   }

   return (
      <div className="container mx-auto py-8">
         {/* Navigation */}
         <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={prevMonth}>
               ‹ Précédent
            </Button>
            <h1 className="text-2xl font-bold capitalize">{title}</h1>
            <Button variant="outline" onClick={nextMonth}>
               Suivant ›
            </Button>
         </div>
         {/* Grille */}
         <CalendarGrid year={year} month={month} entries={entries} />
      </div>
   );
}

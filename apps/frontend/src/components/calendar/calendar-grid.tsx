import { CalendarEntry } from "@happyseeds/shared-types";

type CalendarGridProps = {
   year: number;
   month: number;
   entries: CalendarEntry[];
};

const DAY_HEADERS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function CalendarGrid({ year, month, entries }: CalendarGridProps) {
   //
   // 1. Calcul de la grille
   // getDay() : 0=Dim, 1=Lun, 2=Mar, ..., 6=Sam
   const firstDayRaw = new Date(year, month - 1, 1).getDay();
   // Convertir en convention Lundi=0 (Fr/EU) :
   const offset = firstDayRaw === 0 ? 6 : firstDayRaw - 1;
   // Astuce : new Date(year, month, 0) = dernier jour du mois précédent = dernier jour du mois actuel
   const daysInMonth = new Date(year, month, 0).getDate();

   // null = case vide, number = numéro du jour
   const days: (number | null)[] = [
      ...Array(offset).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
   ];

   // 2. regroupement des entrée par date
   //place les entries dans un map , avec clef = numero du jour
   const entriesByDay = new Map<string, CalendarEntry[]>();
   for (const entry of entries) {
      const key = entry.plannedStartDate;
      // crée un talbeau si inexistant sous cette clef
      if (!entriesByDay.has(key)) {
         entriesByDay.set(key, []);
      }
      entriesByDay.get(key)!.push(entry);
   }
   return (
      <div>
         {/* ENTÊTES */}
         <div className="grid grid-cols-7">
            {DAY_HEADERS.map((day, index) => (
               <div key={`empty-${index}`} className="h-24 rounded-md bg-muted/30">
                  {day}
               </div>
            ))}
         </div>
         {/* Cases du mois */}
         <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
               if (day === null) {
                  return <div key={`empty-${index}`} className="h-24 rounded-md bg-muted/30" />;
               }
               const dayKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
               const dayEntries = entriesByDay.get(dayKey) ?? [];
               const hasEntries = dayEntries.length > 0;

               return (
                  <div
                     key={day}
                     className={`h-24 rounded-md border p-1 overflow-hidden ${
                        hasEntries ? "border-primary/50 bg-primary/5" : "border-border"
                     }`}
                  >
                     <div className="text-xs font-medium mb-1">{day}</div>
                     <div className="space-y-0.5">
                        {dayEntries.slice(0, 3).map((entry) => (
                           <div
                              key={entry.id}
                              className="text-xs truncate rounded px-1 py-0.5 bg-primary/20 text-primary-foreground/80"
                           >
                              {entry.plantCommonName ?? entry.seedLabel ?? "Graine"}
                           </div>
                        ))}
                        {dayEntries.length > 3 && (
                           <div className="text-xs text-muted-foreground">
                              +{dayEntries.length - 3} autres
                           </div>
                        )}
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
}

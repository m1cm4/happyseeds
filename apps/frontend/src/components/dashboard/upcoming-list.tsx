import { DashboardUpcomingEntry } from "@happyseeds/shared-types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type UpcomingListProps = {
   entries: DashboardUpcomingEntry[];
};

function formatDate(dateStr: string): string {
   const date = new Date(dateStr + "T00:00:00");
   return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}
export function UpcomingList({ entries }: UpcomingListProps) {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Prochains semis</CardTitle>
         </CardHeader>
         <CardContent>
            {entries.length === 0 ? (
               <p className="text-sm text-muted-foreground">Aucun semis planifié</p>
            ) : (
               <ul className="space-y-3">
                  {entries.map((entry) => {
                     const displayName = entry.seedLabel ?? entry.plantCommonName ?? "Semis";
                     return (
                        <li key={entry.id} className="flex items-baseline gap-3">
                           <span className="text-sm text-muted-foreground w-20 shrink-0">
                              {formatDate(entry.plannedStartDate)}
                           </span>
                           <span className="text-sm">
                              {displayName}
                              <span className="text-muted-foreground">
                                 {" · "}
                                 {entry.sessionName}
                              </span>
                           </span>
                        </li>
                     );
                  })}
               </ul>
            )}
         </CardContent>
      </Card>
   );
}

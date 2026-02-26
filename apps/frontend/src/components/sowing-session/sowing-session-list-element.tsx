import { SowingSession, sowingSessionTypeOptions } from "@happyseeds/shared-types";

type SowingSessionElementProps = {
   session: SowingSession;
};
const statusColors: Record<string, string> = {
   planned: "bg-gray-100 text-gray-700",
   active: "bg-green-100 text-green-700",
   completed: "bg-blue-100 text-blue-700",
   cancelled: "bg-red-100 text-red-700",
};

export function SowingSessionListElement({ session }: SowingSessionElementProps) {
   const statusLabel = sowingSessionTypeOptions.find((o) => o.value === session.status)?.label ?? session.status;

   const badgeClassName = statusColors[session.status] ?? "bg-gray-100 text-gray-700";

   const formattedDate = new Date(session.startDate).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
   });

   return (
      <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
         <div className="space-y-1">
            <h3 className="font-medium">{session.name}</h3>
            <p className="text-sm text-muted-foreground">
               {formattedDate} — {session.year}
            </p>
         </div>

         <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClassName}`}>{statusLabel}</span>
      </div>
   );
}

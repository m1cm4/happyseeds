import { cn } from "@/lib/utils";

export function SimpleLoadingText({
   className = "",
   text = "Chargement...",
}: {
   className?: string;
   text: string;
}) {
   return (
      <div className="flex justify-center py-8">
         <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-muted animate-pulse"></div>
            <p className={cn("text-wire-text-muted", className)}>{text}</p>
         </div>
      </div>
   );
}

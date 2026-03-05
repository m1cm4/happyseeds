import { Card, CardContent } from "../ui/card";

type StatsCardProps = {
   icon: string;
   value: number;
   label: string;
};

export function StatsCard({ icon, value, label }: StatsCardProps) {
   return (
      <Card className="bg-card border border-border rounded-xl hover:border-wire-focus hover:shadow-md transition-medium cursor-pointer group">
         <CardContent className="">
            <div className="text-2xl mb-4 w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:scale-110 transition-fast">
               <span className="">{icon}</span>
            </div>
            <div className="text-3xl font-bold">{value}</div>
            <p className="text-sm text-muted-foreground">{label}</p>
         </CardContent>
      </Card>
   );
}

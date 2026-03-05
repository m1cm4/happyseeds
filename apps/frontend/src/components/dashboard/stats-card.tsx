import { Card, CardContent } from "../ui/card";

type StatsCardProps = {
   icon: string;
   value: number;
   label: string;
};

export function StatsCard({ icon, value, label }: StatsCardProps) {
   return (
      <Card>
         <CardContent className="pt-6">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-3xl font-bold">{value}</div>
            <p className="text-sm text-muted-foreground">{label}</p>
         </CardContent>
      </Card>
   );
}

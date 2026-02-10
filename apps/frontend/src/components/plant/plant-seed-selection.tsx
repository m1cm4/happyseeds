import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { useDeleteSeed, useSeeds } from "@/hooks/useSeed";

export function SeedsSection({ plantId }: { plantId: string }) {
  const { data: seedsData, isLoading } = useSeeds(plantId);

  if (isLoading) {
    return <p className="text-slate-500">Chargement des graines...</p>;
  }

  const seeds = seedsData?.data ?? [];

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Mes graines ({seeds.length})</h2>
        <Link to="/seeds/new" search={{ plantId: plantId }}>
          <Button size="sm">+ Ajouter une graine</Button>
        </Link>
      </div>

      {seeds.length === 0 ? (
        <p className="text-slate-500 text-center py-4">Aucune graine enregistrée pour cette plante.</p>
      ) : (
        <div className="space-y-2">
          {seeds.map((seed) => (
            <div key={seed.id} className="flex justify-between items-center p-4 bg-white rounded-lg border">
              <div>
                <p className="font-medium">{seed.brand ?? "Sans marque"}</p>
                <p className="text-sm text-slate-500">
                  {seed.acquisitionType === "purchase" && "Achat"}
                  {seed.acquisitionType === "self_harvested" && "Récolte"}
                  {seed.acquisitionType === "gift" && "Don/Échange"}
                  {seed.acquisitionType === "unknown" && "Origine non précisée"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">Stock: {seed.quantity}</span>
                <Link to="/seeds/$id/edit" params={{ id: seed.id }}>
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

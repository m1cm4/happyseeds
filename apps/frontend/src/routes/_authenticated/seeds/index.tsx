import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../../../components/ui/button";
import { Seed } from "@happyseeds/shared-types";
import { useAllSeeds } from "@/hooks/useSeed";
import { SeedListElement } from "@/components/seed/seed-list-element";

export const Route = createFileRoute("/_authenticated/seeds/")({
  component: SeedsIndexPage,
});

function SeedsIndexPage() {
  const { data, isLoading, error } = useAllSeeds({ page: 1, limit: 10 });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-slate-500">Chargement des graines...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        <p>Erreur : {error.message}</p>
      </div>
    );
  }

  const seeds = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Mes Seeds</h1>
        <Link to="/seeds/new">
          <Button>+ Nouvelle Graine </Button>
        </Link>
      </div>

      {/* Liste vide */}
      {seeds.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-slate-500 mb-4">Aucun sachet de graine enregistré</p>
          <Link to="/seeds/new">
            <Button>Enregistrez votre premier paquet de graines</Button>
          </Link>
        </div>
      )}

      {/* Liste des graines */}
      {seeds.length > 0 && (
        <div className="grid gap-4">
          {seeds.map((seed: Seed) => (
            <SeedListElement key={seed.id} seed={seed} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <p className="text-sm text-slate-500">
            Page {pagination.page} sur {pagination.totalPages}({pagination.total} Graines)
          </p>
        </div>
      )}
    </div>
  );
}

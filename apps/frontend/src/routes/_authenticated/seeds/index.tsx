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
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 organic-shape bg-gradient-to-br from-[#998100] to-[#855c45] animate-pulse"></div>
          <p className="text-[#855c45]">Chargement des graines...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-3xl border border-red-200">
        <p>Erreur : {error.message}</p>
      </div>
    );
  }

  const seeds = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-2xl text-[#5a4032]">Mes Graines</h1>
        <Link to="/seeds/new">
          <Button className="px-5 py-2.5 bg-gradient-to-r from-[#3a9133] to-[#53802d] text-white rounded-full font-medium hover:shadow-lg hover:shadow-[#3a9133]/25 transition-all hover:-translate-y-0.5 border-0 flex items-center gap-2">
            <span className="text-lg">+</span> Nouvelle graine
          </Button>
        </Link>
      </div>

      {/* Liste vide */}
      {seeds.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#e6dccf]">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#998100]/10 flex items-center justify-center">
            <span className="text-3xl">🌰</span>
          </div>
          <p className="text-[#6d4c3b] mb-6">Aucun sachet de graine enregistré</p>
          <Link to="/seeds/new">
            <Button className="px-5 py-2.5 bg-gradient-to-r from-[#3a9133] to-[#53802d] text-white rounded-full font-medium hover:shadow-lg hover:shadow-[#3a9133]/25 transition-all hover:-translate-y-0.5 border-0">
              Enregistrez votre premier paquet
            </Button>
          </Link>
        </div>
      )}

      {/* Liste des graines */}
      {seeds.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-[#e6dccf]">
          <div className="divide-y divide-[#f3efe7]">
            {seeds.map((seed: Seed) => (
              <SeedListElement key={seed.id} seed={seed} />
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <p className="text-sm text-[#855c45]">
            Page {pagination.page} sur {pagination.totalPages} ({pagination.total} graines)
          </p>
        </div>
      )}
    </div>
  );
}

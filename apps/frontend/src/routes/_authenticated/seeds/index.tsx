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
          <div className="w-10 h-10 rounded-lg bg-muted animate-pulse"></div>
          <p className="text-wire-text-muted">Chargement des graines...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-6 rounded-lg border border-destructive/20">
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
        <h1 className="text-2xl font-semibold text-foreground">Mes Graines</h1>
        <Link to="/seeds/new">
          <Button>
            <span>+</span> Nouvelle graine
          </Button>
        </Link>
      </div>

      {/* Liste vide */}
      {seeds.length === 0 && (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center">
            <span className="grayscale-icon text-2xl">🌰</span>
          </div>
          <p className="text-wire-text-muted mb-6">Aucun sachet de graine enregistré</p>
          <Link to="/seeds/new">
            <Button>Enregistrez votre premier paquet</Button>
          </Link>
        </div>
      )}

      {/* Liste des graines */}
      {seeds.length > 0 && (
        <div className="bg-card rounded-xl overflow-hidden border border-border">
          <div className="divide-y divide-border">
            {seeds.map((seed: Seed) => (
              <SeedListElement key={seed.id} seed={seed} />
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <p className="text-sm text-wire-text-muted">
            Page {pagination.page} sur {pagination.totalPages} ({pagination.total} graines)
          </p>
        </div>
      )}
    </div>
  );
}

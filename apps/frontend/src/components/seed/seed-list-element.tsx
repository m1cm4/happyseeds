import { Seed } from "@happyseeds/shared-types";
import { Link } from "@tanstack/react-router";

export function SeedListElement({ seed }: { seed: Seed }) {
  const acquisitionLabels: Record<string, string> = {
    purchase: "Achat",
    self_harvested: "Récolte",
    gift: "Don/Échange",
    unknown: "Origine non précisée",
  };

  const acquisitionLabel = seed.acquisitionType ? acquisitionLabels[seed.acquisitionType] : "Origine inconnue";

  const stockLabel = seed.inStock ? "en stock " : "rupture de stock";
  const stockNumber = seed.inStock && seed.quantity ? `: ${seed.quantity}` : "";

  return (
    <Link to="/seeds/$id/edit" params={{ id: seed.id }} className="block">
      <div className="px-6 py-4 hover:bg-wire-hover transition-fast group">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center group-hover:scale-105 transition-fast">
              <span className="grayscale-icon text-xl">🌰</span>
            </div>
            <div>
              <h2 className="font-semibold text-foreground group-hover:opacity-70 transition-fast">
                {seed.brand ?? "Sans marque"}
              </h2>
              <p className="text-wire-text-light text-sm">
                {acquisitionLabel}
                {seed.acquisitionPlace && ` — ${seed.acquisitionPlace}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 text-sm rounded bg-input  font-medium ${seed.inStock ? "text-chart-3" : "text-destructive"}`}
            >
              {stockLabel + stockNumber}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

import { Seed } from "@happyseeds/shared-types";
import { Link } from "@tanstack/react-router";

export function SeedListElement({ seed }: { seed: Seed }) {
  // Couleurs selon le type d'acquisition
  const acquisitionColors: Record<string, string> = {
    purchase: "bg-[#3a9133]/10 text-[#3a9133]",
    self_harvested: "bg-[#998100]/10 text-[#998100]",
    gift: "bg-[#855c45]/10 text-[#855c45]",
    unknown: "bg-[#bfa385]/10 text-[#6d4c3b]",
  };

  const acquisitionLabels: Record<string, string> = {
    purchase: "Achat",
    self_harvested: "Récolte",
    gift: "Don/Échange",
    unknown: "Origine non précisée",
  };

  const acquisitionColor = acquisitionColors[seed.acquisitionType] || acquisitionColors.unknown;
  const acquisitionLabel = acquisitionLabels[seed.acquisitionType] || "Origine inconnue";

  return (
    <Link to="/seeds/$id/edit" params={{ id: seed.id }} className="block">
      <div className="px-7 py-5 hover:bg-[#f3efe7]/50 transition-colors group">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#998100]/10 to-[#855c45]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-2xl">🌰</span>
            </div>
            <div>
              <h2 className="font-semibold text-lg text-[#5a4032] group-hover:text-[#3a9133] transition-colors">
                {seed.brand ?? "Sans marque"}
              </h2>
              <p className="text-[#855c45] text-sm">
                {acquisitionLabel}
                {seed.acquisitionPlace && ` — ${seed.acquisitionPlace}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-1.5 text-sm rounded-full font-medium ${acquisitionColor}`}>
              Stock: {seed.quantity}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

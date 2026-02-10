import { Seed } from "@happyseeds/shared-types";
import { Link } from "@tanstack/react-router";

export function SeedListElement({ seed }: { seed: Seed }) {
  return (
    <Link to="/seeds/$id/edit" params={{ id: seed.id }} className="block">
      <div
        className="bg-white p-4 rounded-lg border
hover:border-emerald-500 transition-colors"
      >
        <div
          className="flex justify-between
items-start"
        >
          <div>
            <h2
              className="font-semibold text-lg
text-slate-800"
            >
              {seed.brand ?? "Sans marque"}
            </h2>
            <p className="text-sm text-slate-500">
              {seed.acquisitionType === "purchase" && "Achat"}
              {seed.acquisitionType === "self_harvested" && "Récolte"}
              {seed.acquisitionType === "gift" && "Don/Échange"}
              {seed.acquisitionType === "unknown" && "Origine non précisée"}
              {seed.acquisitionPlace &&
                ` —
${seed.acquisitionPlace}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-1 text-xs
rounded-full bg-emerald-100 text-emerald-700"
            >
              Stock: {seed.quantity}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

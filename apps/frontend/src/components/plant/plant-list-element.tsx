import { Link } from "@tanstack/react-router";
import { Plant } from "@/@types/plant.types";
import { getNames } from "@/utils/plant.utils";

// destructuration identique à PlantListElement(props: { plant: Plant })
export function PlantListElement({ plant }: { plant: Plant }) {
  const names = getNames(plant);

  // Couleurs selon la catégorie
  const categoryColors: Record<string, string> = {
    Légume: "bg-[#3a9133]/10 text-[#3a9133]",
    Aromatique: "bg-[#998100]/10 text-[#998100]",
    Fleur: "bg-[#855c45]/10 text-[#855c45]",
    Fruit: "bg-[#53802d]/10 text-[#53802d]",
  };

  const categoryColor = categoryColors[plant.category] || "bg-[#e6dccf] text-[#6d4c3b]";

  return (
    <Link to="/plants/$id" params={{ id: plant.id }} className="block">
      <div className="px-7 py-5 hover:bg-[#f3efe7]/50 transition-colors group">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3a9133]/10 to-[#53802d]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-2xl">🌱</span>
            </div>
            <div>
              <h2 className="font-semibold text-lg text-[#5a4032] group-hover:text-[#3a9133] transition-colors">
                {names[0]}
              </h2>
              <p className="text-[#855c45] text-sm italic">{names[1]}</p>
            </div>
          </div>
          <span className={`px-4 py-1.5 text-sm rounded-full font-medium ${categoryColor}`}>
            {plant.category}
          </span>
        </div>
      </div>
    </Link>
  );
}

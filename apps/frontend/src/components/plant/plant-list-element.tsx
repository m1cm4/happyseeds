import { Link } from "@tanstack/react-router";
import { Plant } from "@/@types/plant.types";
import { getNames } from "@/utils/plant.utils";

// destructuration identique à PlantListElement(props: { plant: Plant })
export function PlantListElement({ plant }: { plant: Plant }) {
  const names = getNames(plant);

  return (
    <Link to="/plants/$id" params={{ id: plant.id }} className="block">
      <div className="px-6 py-4 hover:bg-wire-hover transition-fast group">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center group-hover:scale-105 transition-fast">
              <span className="grayscale-icon text-xl">🌱</span>
            </div>
            <div>
              <h2 className="font-semibold text-foreground group-hover:opacity-70 transition-fast">{names[0]}</h2>
              <p className="text-wire-text-light text-sm italic">{names[1]}</p>
            </div>
          </div>
          <span className="px-3 py-1 text-sm rounded bg-muted text-wire font-medium">{plant.category}</span>
        </div>
      </div>
    </Link>
  );
}

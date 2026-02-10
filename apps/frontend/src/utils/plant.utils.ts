import { Plant } from "@/@types/plant.types";

/**
 * Construit le nom latin formaté : "Genus species 'Cultivar'"
 * Retourne une chaîne vide si aucune donnée taxonomique
 */
export function formatLatinName(plant: Pick<Plant, "genus" | "species" | "cultivar">): string | null {
  if (!plant.genus) return null;
  const cultivarFormatted = plant.cultivar ? `'${plant.cultivar}'` : null;
  return plant.genus && [plant.genus, plant.species, cultivarFormatted].filter(Boolean).join(" ");
}
export function formatCommonWithCultivar(plant: Pick<Plant, "commonName" | "cultivar">): string {
  const cultivarFormatted = plant.cultivar ? `'${plant.cultivar}'` : null;
  return [plant.commonName, cultivarFormatted].filter(Boolean).join(" ");
}

export function getNames(plant: Plant): (string | null)[] {
  const completeLatinName = formatLatinName(plant);

  const completeCommonName = formatCommonWithCultivar(plant);
  const names =
    plant.category === "ornamental" && completeLatinName
      ? [completeLatinName, plant.commonName]
      : [completeCommonName, completeLatinName];
  return names;
}

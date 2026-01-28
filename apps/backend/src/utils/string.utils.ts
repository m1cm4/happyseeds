/**
 * Convertit une chaîne en "slug" URL-friendly
 * Exemple : "Ma Plante Préférée" → "ma-plante-preferee"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Décompose les accents (é → e + ́)
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-z0-9]+/g, "-") // Remplace les caractères spéciaux par -
    .replace(/^-+|-+$/g, ""); // Supprime les - au début et à la fin
}

/**
 * Tronque une chaîne à une longueur maximale
 * Ajoute "..." si la chaîne est tronquée
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + "...";
}
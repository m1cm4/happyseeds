import type { AcquisitionDatePrecision } from "@/@types/seed.types";

type ParsedAcquisitionDate = {
  date: string; // YYYY-MM-DD ou ""
  precision: AcquisitionDatePrecision;
};

/**
 * la date d'acquisition d'une graine donne l'année, parfois le mois, parfois est inconnue
 * la DB elle enregistre une valeur de date ET le degré de précision
 * utilisé pour cette date. si mois n'est pas précisié : 01 est utilisé
 * le jour qui n'est pas pertinent est toujours défini à 01 dans la DB
 * le formulaire accepte différent format d'entrée
 * et le parsing s'occupe de générer la date automatiquement, du string du champ duformulaire -> valeur date enregistrée dans la db.
 * à l'inverse une date récupérée dans la db est transformée en string "YYYY-MM" ou "YYYY" selon le degré de précision.
 * en déduisant le format utilisé et le degré de précision
 * Parse un texte libre en date DB (YYYY-MM-DD) + précision.
 *
 * Formats acceptés :
 *   "2024"       → { date: "2024-01-01", precision: "year" }
 *   "2024-08"    → { date: "2024-08-01", precision: "month" }
 *   "2024-3"     → { date: "2024-03-01", precision: "month" }
 *   "3-2024"     → { date: "2024-03-01", precision: "month" }
 *   "03/2024"    → { date: "2024-03-01", precision: "month" }
 *   "2024 08"    → { date: "2024-08-01", precision: "month" }
 *   ""           → { date: "",           precision: "unknown" }
 *
 * Séparateurs acceptés : "-", "/", " "
 */
export function parseAcquisitionDate(input: string): ParsedAcquisitionDate {
  const cleaned = input.trim();
  if (!cleaned) return { date: "", precision: "unknown" };

  // Normaliser les séparateurs : "/" et " " → "-"
  const normalized = cleaned.replace(/[/ ]/g, "-");

  // Format YYYY seul
  if (/^\d{4}$/.test(normalized)) {
    return { date: `${normalized}-01-01`, precision: "year" };
  }

  // Format YYYY-M ou YYYY-MM
  const yearFirst = normalized.match(/^(\d{4})-(\d{1,2})$/);
  if (yearFirst) {
    const month = yearFirst[2].padStart(2, "0");
    return { date: `${yearFirst[1]}-${month}-01`, precision: "month" };
  }

  // Format M-YYYY ou MM-YYYY
  const monthFirst = normalized.match(/^(\d{1,2})-(\d{4})$/);
  if (monthFirst) {
    const month = monthFirst[1].padStart(2, "0");
    return { date: `${monthFirst[2]}-${month}-01`, precision: "month" };
  }

  // Non reconnu
  return { date: "", precision: "unknown" };
}

/**
 * Reconvertit une date DB + précision en texte lisible.
 *
 *   "2024-01-01" + "year"  → "2024"
 *   "2024-08-01" + "month" → "2024-08"
 *   null                   → ""
 */
export function formatAcquisitionDate(date: string | null, precision: AcquisitionDatePrecision | null): string {
  if (!date) return "";
  if (precision === "year") return date.slice(0, 4);
  if (precision === "month") return date.slice(0, 7);
  return date;
}

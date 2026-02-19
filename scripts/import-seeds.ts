/**
 * Script d'import CSV de la grainothèque depuis Google Sheets.
 *
 * Usage:
 *   npx tsx scripts/import-seeds.ts <chemin-vers-csv> <user-id>
 *
 * Prérequis:
 *   - Le CSV doit avoir les colonnes suivantes (séparateur virgule) :
 *     ch, nom_commun, nom_latin, ref_paquet, description_plante, notes_graines, fleur, date, lieu, fournisseur, semis
 *   - DATABASE_URL doit être défini dans apps/backend/.env
 *   - L'utilisateur (user-id) doit exister en DB
 *
 * Le script crée des entrées plant + seed. Les plants sont dédupliqués
 * par (commonName + genus + species + cultivar + description + flowers).
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";
import { config } from "dotenv";

// Charger le .env du backend
config({ path: resolve(__dirname, "../apps/backend/.env") });

import { plant } from "../apps/backend/src/db/schemas/plant.schema";
import { seed } from "../apps/backend/src/db/schemas/seed.schema";

// ============================================
// Connexion DB
// ============================================

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL non défini dans apps/backend/.env");
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

// ============================================
// Types
// ============================================

type CsvRow = {
  ch: string;
  nomCommun: string;
  nomLatin: string;
  refPaquet: string;
  descriptionPlante: string;
  notesGraines: string;
  fleur: string;
  date: string;
  lieu: string;
  fournisseur: string;
  semis: string;
};

type ParsedPlant = {
  commonName: string;
  genus: string;
  species: string;
  cultivar: string;
  flowers: string;
  category: "ornamental" | "vegetable";
};

type ParsedSeed = {
  userLabel: string;
  acquisitionDate: string | null;
  acquisitionDatePrecision: "month" | "year" | "unknown";
  acquisitionPlace: string | null;
  brand: string | null;
  acquisitionType: "self_harvested" | "purchase" | "gift" | "unknown";
};

// ============================================
// Parsing CSV
// ============================================

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseCsv(content: string): CsvRow[] {
  const lines = content.split("\n").filter((l) => l.trim());
  // Ignorer la ligne d'en-tête
  const dataLines = lines.slice(1);

  return dataLines.map((line) => {
    const fields = parseCsvLine(line);
    return {
      ch: fields[0] ?? "",
      nomCommun: fields[1] ?? "",
      nomLatin: fields[2] ?? "",
      refPaquet: fields[3] ?? "",
      descriptionPlante: fields[4] ?? "",
      notesGraines: fields[5] ?? "",
      fleur: fields[6] ?? "",
      date: fields[7] ?? "",
      lieu: fields[8] ?? "",
      fournisseur: fields[9] ?? "",
      semis: fields[10] ?? "",
    };
  });
}

// ============================================
// Parsing nom latin → genus, species, cultivar
// ============================================

function parseLatinName(nomLatin: string): { genus: string; species: string; cultivar: string } {
  const cleaned = nomLatin.trim();
  if (!cleaned) return { genus: "", species: "", cultivar: "" };

  // Extraire cultivar entre guillemets simples : 'Nom Cultivar'
  const cultivarMatch = cleaned.match(/'([^']+)'/);
  const cultivar = cultivarMatch ? cultivarMatch[1] : "";

  // Retirer le cultivar pour parser genus/species
  const withoutCultivar = cleaned.replace(/'[^']*'/, "").trim();
  const parts = withoutCultivar.split(/\s+/);

  const genus = parts[0] ?? "";
  // Le species peut inclure "var.", "ssp.", etc. — on prend tout sauf le genus
  const species = parts.slice(1).join(" ").trim();

  return { genus, species, cultivar };
}

// ============================================
// Parsing date → acquisitionDate + precision
// ============================================

function parseDate(dateStr: string): { date: string | null; precision: "month" | "year" | "unknown" } {
  const cleaned = dateStr.trim();

  if (!cleaned || cleaned === "?") {
    return { date: null, precision: "unknown" };
  }

  // Format YYYY-MM
  if (/^\d{4}-\d{1,2}$/.test(cleaned)) {
    const [year, month] = cleaned.split("-");
    const paddedMonth = month.padStart(2, "0");
    return { date: `${year}-${paddedMonth}-01`, precision: "month" };
  }

  // Format YYYY
  if (/^\d{4}$/.test(cleaned)) {
    return { date: `${cleaned}-01-01`, precision: "year" };
  }

  // Format YYYY-MM-DD (date complète — stocké comme month)
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return { date: cleaned, precision: "month" };
  }

  // Non reconnu
  console.warn(`  ⚠ Date non reconnue: "${cleaned}" → ignorée`);
  return { date: null, precision: "unknown" };
}

// ============================================
// Déduction du type d'acquisition
// ============================================

const KNOWN_SUPPLIERS = [
  "seedaholic",
  "chilternseeds",
  "vreekenzaden",
  "centralpark.eu",
  "cycle-en-terre.be",
  "somers.be",
  "vilmorin",
  "protectanature.be",
  "lasemancebio.com",
  "gardenline",
  "ferme de sainte marthe",
  "vt - zadengids.be",
];

const KNOWN_STORES = ["brico", "färm", "groendekor"];

function deduceAcquisitionType(lieu: string, fournisseur: string): "self_harvested" | "purchase" | "gift" | "unknown" {
  const lieuLower = lieu.toLowerCase().trim();
  const fournisseurLower = fournisseur.toLowerCase().trim();

  // Achat si fournisseur connu ou magasin
  if (fournisseurLower && KNOWN_SUPPLIERS.some((s) => fournisseurLower.includes(s))) {
    return "purchase";
  }
  if (lieuLower && KNOWN_STORES.some((s) => lieuLower.includes(s))) {
    return "purchase";
  }
  if (lieuLower.includes("pep.") || lieuLower.includes("pépinière")) {
    return "purchase";
  }

  // Récolte personnelle
  if (lieuLower.startsWith("aud")) {
    return "self_harvested";
  }

  // Don / échange si c'est un nom de personne ou lieu identifiable
  if (lieuLower && !lieuLower.includes("?")) {
    return "gift";
  }

  return "unknown";
}

// ============================================
// Détection catégorie (ornementale / potagère)
// ============================================

const VEGETABLE_KEYWORDS = [
  "tomate",
  "laitue",
  "salade",
  "courgette",
  "poireau",
  "betterave",
  "persil",
  "basilic",
  "ciboulette",
  "cerfeuil",
  "cresson",
  "moutarde",
  "céleri",
  "chicorée",
  "poivron",
  "bette",
  "pourpier",
  "pimprenelle",
  "estragon",
  "fenouil",
  "ocimum",
  "artemisia dracunculus",
];

function deduceCategory(nomCommun: string, nomLatin: string): "ornamental" | "vegetable" {
  const combined = `${nomCommun} ${nomLatin}`.toLowerCase();
  return VEGETABLE_KEYWORDS.some((kw) => combined.includes(kw)) ? "vegetable" : "ornamental";
}

// ============================================
// Import principal
// ============================================

async function importSeeds(csvPath: string, userId: string) {
  console.log(`\n📂 Lecture du CSV: ${csvPath}`);
  const content = readFileSync(csvPath, "utf-8");
  const rows = parseCsv(content);
  console.log(`📋 ${rows.length} lignes trouvées\n`);

  let plantsCreated = 0;
  let plantsReused = 0;
  let seedsCreated = 0;
  let errors = 0;

  // Cache des plants déjà insérés (clé = genus|species|cultivar|flowers)
  const plantCache = new Map<string, string>();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const lineNum = i + 2; // +2 car header + index 0

    try {
      // Skip lignes vides
      if (!row.nomCommun.trim() && !row.nomLatin.trim()) {
        console.log(`  ⏭ Ligne ${lineNum}: vide, ignorée`);
        continue;
      }

      // Parser les données
      const { genus, species, cultivar } = parseLatinName(row.nomLatin);
      const commonName = row.nomCommun.trim() || genus || "Sans nom";
      const flowers = row.fleur.trim() || null;
      const description = row.descriptionPlante.trim() || null;
      const category = deduceCategory(row.nomCommun, row.nomLatin);

      // Clé de déduplication plant (nom_latin + nom_commun + description_plante + fleur)
      const plantKey = [commonName, genus, species, cultivar, description ?? "", flowers ?? ""].join("|").toLowerCase();

      let plantId: string;

      if (plantCache.has(plantKey)) {
        plantId = plantCache.get(plantKey)!;
        plantsReused++;
      } else {
        // Chercher un plant existant en DB
        const existing = await db
          .select({ id: plant.id })
          .from(plant)
          .where(
            and(
              eq(plant.authorId, userId),
              eq(plant.commonName, commonName),
              ...(genus ? [eq(plant.genus, genus)] : []),
              ...(description ? [eq(plant.description, description)] : []),
              ...(flowers ? [eq(plant.flowers, flowers)] : [])
            )
          )
          .limit(1);

        if (existing.length > 0) {
          plantId = existing[0].id;
          plantCache.set(plantKey, plantId);
          plantsReused++;
        } else {
          // Créer le plant
          const [newPlant] = await db
            .insert(plant)
            .values({
              category,
              commonName,
              genus: genus || null,
              species: species || null,
              cultivar: cultivar || null,
              description: description,
              flowers: flowers,
              authorId: userId,
            })
            .returning({ id: plant.id });

          plantId = newPlant.id;
          plantCache.set(plantKey, plantId);
          plantsCreated++;
        }
      }

      // Parser date
      const { date: acqDate, precision: acqPrecision } = parseDate(row.date);

      // Créer le seed
      await db.insert(seed).values({
        userId,
        plantId,
        userLabel: row.refPaquet.trim() || null,
        notes: row.notesGraines.trim() || null,
        brand: row.fournisseur.trim() || null,
        acquisitionPlace: row.lieu.trim() || null,
        acquisitionType: deduceAcquisitionType(row.lieu, row.fournisseur),
        acquisitionDate: acqDate,
        acquisitionDatePrecision: acqPrecision,
        inStock: true,
      });

      seedsCreated++;
      console.log(`  ✅ Ligne ${lineNum}: ${commonName} → seed créé`);
    } catch (err) {
      errors++;
      console.error(`  ❌ Ligne ${lineNum}: ${(err as Error).message}`);
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`📊 Résultats:`);
  console.log(`   🌱 Plants créés:  ${plantsCreated}`);
  console.log(`   ♻️  Plants réutilisés: ${plantsReused}`);
  console.log(`   🌰 Seeds créés:   ${seedsCreated}`);
  console.log(`   ❌ Erreurs:       ${errors}`);
  console.log(`${"=".repeat(50)}\n`);

  // Fermer la connexion
  await client.end();
}

// ============================================
// Point d'entrée
// ============================================

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: npx tsx scripts/import-seeds.ts <chemin-csv> <user-id>");
  console.error("Exemple: npx tsx scripts/import-seeds.ts conception/data/graines.csv abc123");
  process.exit(1);
}

const csvPath = resolve(args[0]);
const userId = args[1];

importSeeds(csvPath, userId).catch((err) => {
  console.error("Erreur fatale:", err);
  process.exit(1);
});

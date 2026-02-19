// acun schema n'est défini ici
// tout est partagé entre frontend et backend dans package externe

export { createSeedSchema, type CreateSeedInput } from "@happyseeds/shared-types";

// Options pour les selects du formulaire
export { acquisitionTypeOptions, acquisitionDatePrecisionOptions } from "@happyseeds/shared-types";

// Enums pour les validations TypeScript
export {
  plantCategoryEnum,
  acquisitionTypeEnum,
  acquisitionDatePrecisionEnum,
  positionEnum,
} from "@happyseeds/shared-types";

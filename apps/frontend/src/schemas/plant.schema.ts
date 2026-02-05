// acun schema n'est défini ici
// tout est partagé entre frontend et backend dans package externe

export {
  createPlantSchema,
  type CreatePlantInput,
} from "@happyseeds/shared-types";

// Options pour les selects du formulaire
export {
  plantCategoryOptions,
  hardinessOptions,
  positionOptions,
} from "@happyseeds/shared-types";

// Enums pour les validations TypeScript
export {
  plantCategoryEnum,
  hardinessEnum,
  positionEnum,
} from "@happyseeds/shared-types";
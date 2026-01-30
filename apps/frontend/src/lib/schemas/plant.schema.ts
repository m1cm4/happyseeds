import { z } from "@happyseeds/shared-types";

export const plantCategoryOptions = [
  { value: "vegetable", label: "Légume" },
  { value: "fruit", label: "Fruit" },
  { value: "flower", label: "Fleur" },
  { value: "herb", label: "Aromate" },
  { value: "shrub", label: "Arbuste" },
  { value: "other", label: "Autre" },
] as const;

export const sunRequirementOptions = [
  { value: "full_sun", label: "Plein soleil" },
  { value: "partial_shade", label: "Mi-ombre" },
  { value: "shade", label: "Ombre" },
] as const;

export const waterRequirementOptions = [
  { value: "low", label: "Faible" },
  { value: "medium", label: "Moyen" },
  { value: "high", label: "Élevé" },
] as const;

// coerce :converti string en number puisque les inputs des formulaire retourne des string
//.or(z.literal("")) : Accepte chaîne vide pour les champs optionnels
// Helper pour les champs numériques optionnels                       
  const optionalPositiveNumber = z.preprocess(                          
    (val) => {                                                          
      if (val === "" || val === undefined || val === null) return       
  undefined;                                                            
      const num = Number(val);                                          
      return num === 0 || isNaN(num) ? undefined : num;                 
    },                                                                  
    z.number().positive().optional()                                    
  ); 


export const createPlantSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "100 caractères maximum"),
  latinName: z.string().max(100).optional().or(z.literal("")),
  category: z.enum(["vegetable", "fruit", "flower", "herb", "shrub", "other"], {
    required_error: "La catégorie est requise",
  }),
  description: z.string().max(1000).optional().or(z.literal("")),
  // Champs numériques optionnels                                     
  sowingDepthMm: optionalPositiveNumber,                              
  sowingSpacingCm: optionalPositiveNumber,                            
  germinationDaysMin: optionalPositiveNumber,                         
  germinationDaysMax: optionalPositiveNumber,                         
  growthDaysMin: optionalPositiveNumber,                              
  growthDaysMax: optionalPositiveNumber, 
  sunRequirement: z.preprocess(                                         
    (val) => (val === "" ? undefined : val),                            
    z.enum(["full_sun", "partial_shade", "shade"]).optional()           
  ),                                                                
  waterRequirement: z.preprocess(                                       
    (val) => (val === "" ? undefined : val),                            
    z.enum(["low", "medium", "high"]).optional()                        
  ),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

// type inferé
export type CreatePlantFormData = z.infer<typeof createPlantSchema>;
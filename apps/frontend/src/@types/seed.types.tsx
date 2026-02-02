export type Seed = {
   id: string;
   plantId: string;
   userId: string;  // Propriétaire de la graine (pas l'auteur de la plante)
   brand: string | null;
   quantity: number;
   acquisitionType: "harvest" | "purchase" | "gift" | "unknown" | null;
   acquisitionDate: string | null;
   expirationDate: string | null;
   notes: string | null;
   createdAt: string;
   updatedAt: string;
 };
 
 export type SeedsResponse = {
   success: boolean;
   data: Seed[];
   pagination: {
     page: number;
     limit: number;
     total: number;
     totalPages: number;
   };
 };
 
 export type SeedResponse = {
   success: boolean;
   data: Seed;
 };

export type CreateSeedInput = Partial<Omit<Seed, "id" | "plantId" | "userId" | "createdAt" | "updatedAt">>;
export type UpdateSeedInput = CreateSeedInput;
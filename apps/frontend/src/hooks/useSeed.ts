import type { CreateSeedInput, UpdateSeedInput } from "@happyseeds/shared-types";
import type { SeedQueryParams } from "@/@types/seed.types";
import { seedApi } from "@/services/seed.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query keys
export const seedKeys = {
   all: ["seeds"] as const,
   lists: () => [...seedKeys.all, "list"] as const,
   list: (params: SeedQueryParams) => [...seedKeys.lists(), params] as const,
   details: () => [...seedKeys.all, "details"] as const,
   detail: (id: string) => [...seedKeys.details(), id] as const,
};

// Hook pour récupérer toutes les graines d'une plante
export function useSeeds(plantId: string) {
   return useQuery({
      queryKey: seedKeys.list({ plantId }),
      queryFn: () => seedApi.getAll({ plantId }),
      enabled: !!plantId,
   });
}

// Hook pour récupérer toutes les graines
export function useAllSeeds(params: SeedQueryParams = {}) {
   return useQuery({
      queryKey: seedKeys.list(params),
      queryFn: () => seedApi.getAll(params),
   });
}

// Hook pour récupérer une graine
export function useSeed(id: string) {
   return useQuery({
      queryKey: seedKeys.detail(id),
      queryFn: () => seedApi.getById(id),
      enabled: !!id,
   });
}

// Hook pour créer une graine
export function useCreateSeed() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (data: CreateSeedInput) => seedApi.create(data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: seedKeys.all });
      },
   });
}

// Hook pour mettre à jour une graine
export function useUpdateSeed() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateSeedInput }) => seedApi.update(id, data),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: seedKeys.all });
         // choix de style : seedKeys.detai() est déjà invalidé par seekKey.all
         queryClient.invalidateQueries({ queryKey: seedKeys.detail(variables.id) });
      },
   });
}

// Hook pour supprimer une graine
export function useDeleteSeed() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (id: string) => seedApi.delete(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: seedKeys.all });
      },
   });
}

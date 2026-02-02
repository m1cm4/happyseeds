import { Seed } from "@/@types/seed.types";
import { seedsApi } from "@/services/seeds.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query keys
export const seedKeys = {
  all: (plantId: string) => ["seeds", { plantId }] as const,
  detail: (plantId: string, id: string) => ["seeds", plantId, id] as const,
};

// Hook pour récupérer toutes les graines d'une plante
export function useSeeds(plantId: string) {
  return useQuery({
    queryKey: seedKeys.all(plantId),
    queryFn: () => seedsApi.getAll(plantId),
    enabled: !!plantId,
  });
}

// Hook pour récupérer une graine
export function useSeed(plantId: string, id: string) {
  return useQuery({
    queryKey: seedKeys.detail(plantId, id),
    queryFn: () => seedsApi.getById(plantId, id),
    enabled: !!plantId && !!id,
  });
}

// Hook pour créer une graine
export function useCreateSeed(plantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Seed>) => seedsApi.create(plantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seedKeys.all(plantId) });
    },
  });
}

// Hook pour mettre à jour une graine
export function useUpdateSeed(plantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Seed> }) =>
      seedsApi.update(plantId, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: seedKeys.all(plantId) });
      queryClient.invalidateQueries({ queryKey: seedKeys.detail(plantId, variables.id) });
    },
  });
}

// Hook pour supprimer une graine
export function useDeleteSeed(plantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => seedsApi.delete(plantId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seedKeys.all(plantId) });
    },
  });
}
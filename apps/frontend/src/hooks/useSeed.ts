import type { CreateSeedInput, UpdateSeedInput } from "@happyseeds/shared-types";
import type { SeedQueryParams } from "@/@types/seed.types";
import { seedApi } from "@/services/seed.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query keys
export const seedKeys = {
  all: (plantId: string) => ["seeds", { plantId }] as const,
  detail: (plantId: string, id: string) => ["seeds", plantId, id] as const,
  list: (params: SeedQueryParams) => ["seeds", "list", params] as const,
};

// Hook pour récupérer toutes les graines d'une plante
export function useSeeds(plantId: string) {
  return useQuery({
    queryKey: seedKeys.all(plantId),
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
    queryKey: ["seeds", id],
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
      queryClient.invalidateQueries({ queryKey: ["seeds"] });
    },
  });
}

// Hook pour mettre à jour une graine
export function useUpdateSeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSeedInput }) => seedApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["seeds"] });
      queryClient.invalidateQueries({ queryKey: ["seeds", variables.id] });
    },
  });
}

// Hook pour supprimer une graine
export function useDeleteSeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => seedApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seeds"] });
    },
  });
}

import { CreatePlantInput, PlantsQueryParams, UpdatePlantInput } from "@/@types/plant.types";
import { plantsApi } from "@/services/plants.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


/**
 * useQuery() pour les lecture GET
 *    queryKey: identifiant pour le cache
 *    queryFn: fct qui fait l'appel API
 */

/**
 * useMutation : Pour les écritures (POST, PATCH, DELETE)
 * mutationFn : Fonction qui fait l'appel
 * onSuccess : Callback après succès (invalider le cache)
 */

/**
 * invalidateQueries : Dit à TanStack Query de refetch les données
 */

// ============================================
// Query Keys
// ============================================
// Query Keys = Structure hiérarchique pour identifier les requêtes dans le cache


export const plantsKeys = {
  all: ["plants"] as const,
  lists: () => [...plantsKeys.all, "list"] as const,
  list: (params: PlantsQueryParams) => [...plantsKeys.lists(), params] as const,
  details: () => [...plantsKeys.all, "detail"] as const,
  detail: (id: string) => [...plantsKeys.details(), id] as const,
};

// ============================================
// Hooks
// ============================================

/**
 * Hook pour récupérer la liste des plantes
 */
export function usePlants(params: PlantsQueryParams = {}) {
  return useQuery({
    queryKey: plantsKeys.list(params),
    queryFn: () => plantsApi.getAll(params),
  });
}

/**
 * Hook pour récupérer une plante par ID
 */
export function usePlant(id: string) {
  return useQuery({
    queryKey: plantsKeys.detail(id),
    queryFn: () => plantsApi.getById(id),
    enabled: !!id, // Ne pas exécuter si pas d'ID
  });
}

/**
 * Hook pour créer une plante
 */
export function useCreatePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlantInput) => plantsApi.create(data),
    onSuccess: () => {
      // Invalider le cache pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: plantsKeys.lists() });
    },
  });
}

/**
 * Hook pour mettre à jour une plante
 */
export function useUpdatePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlantInput }) =>
      plantsApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalider le cache de la liste et du détail
      queryClient.invalidateQueries({ queryKey: plantsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: plantsKeys.detail(variables.id) });
    },
  });
}

/**
 * Hook pour supprimer une plante
 */
export function useDeletePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => plantsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantsKeys.lists() });
    },
  });
}
import { CreatePlantInput, PlantQueryParams, UpdatePlantInput } from "@/@types/plant.types";
import { plantApi } from "@/services/plant.service";
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


export const plantKeys = {
  all: ["plant"] as const,
  lists: () => [...plantKeys.all, "list"] as const,
  list: (params: PlantQueryParams) => [...plantKeys.lists(), params] as const,
  details: () => [...plantKeys.all, "detail"] as const,
  detail: (id: string) => [...plantKeys.details(), id] as const,
};

// ============================================
// Hooks
// ============================================

/**
 * Hook pour récupérer la liste des plantes
 */
export function usePlants(params: PlantQueryParams = {}) {
  return useQuery({
    queryKey: plantKeys.list(params),
    queryFn: () => plantApi.getAll(params),
  });
}

/**
 * Hook pour récupérer une plante par ID
 */
export function usePlant(id: string) {
  return useQuery({
    queryKey: plantKeys.detail(id),
    queryFn: () => plantApi.getById(id),
    enabled: !!id, // Ne pas exécuter si pas d'ID
  });
}

/**
 * Hook pour créer une plante
 */
export function useCreatePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlantInput) => plantApi.create(data),
    onSuccess: () => {
      // Invalider le cache pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: plantKeys.lists() });
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
      plantApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalider le cache de la liste et du détail
      queryClient.invalidateQueries({ queryKey: plantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: plantKeys.detail(variables.id) });
    },
  });
}

/**
 * Hook pour supprimer une plante
 */
export function useDeletePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => plantApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.lists() });
    },
  });
}
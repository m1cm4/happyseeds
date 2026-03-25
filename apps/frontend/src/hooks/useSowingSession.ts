import { SowingSessionQueryParams } from "@/@types/sowing-session.types";
import { CreateSowingSessionInput, UpdateSowingSessionInput } from "@happyseeds/shared-types";

import { sowingSessionApi } from "@/services/sowing-session.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ===============================================
// Query Keys
// ===============================================

export const sowingSessionKeys = {
   all: ["sowing-sessions"] as const,
   lists: () => [...sowingSessionKeys.all, "list"] as const,
   list: (params: SowingSessionQueryParams) => [...sowingSessionKeys.lists(), params] as const,
   details: () => [...sowingSessionKeys.all, "details"] as const,
   detail: (id: string) => [...sowingSessionKeys.details(), id] as const,
};

// ===============================================
// Queries
// ===============================================

export function useSowingSessions(params: SowingSessionQueryParams = {}) {
   return useQuery({
      queryKey: sowingSessionKeys.list(params),
      queryFn: () => sowingSessionApi.getAll(params),
   });
}

export function useSowingSession(id: string) {
   return useQuery({
      queryKey: sowingSessionKeys.detail(id),
      queryFn: () => sowingSessionApi.getById(id),
      enabled: !!id, // ne pas exécuter si pas d'ID
   });
}

// ===============================================
// Mutations
// ===============================================

export function useCreateSowingSession() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (data: CreateSowingSessionInput) => sowingSessionApi.create(data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: sowingSessionKeys.lists() });
      },
   });
}

// invalide le cache du detail et de la list
export function useUpdateSowingSession() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateSowingSessionInput }) => sowingSessionApi.update(id, data),
      onSuccess: (_data, variables) => {
         queryClient.invalidateQueries({ queryKey: sowingSessionKeys.lists() });
         queryClient.invalidateQueries({ queryKey: sowingSessionKeys.detail(variables.id) });
      },
   });
}

// doit invalider le cache de la liste
export function useDeleteSowingSession() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (id: string) => sowingSessionApi.delete(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: sowingSessionKeys.lists() });
      },
   });
}

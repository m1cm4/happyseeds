import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { CreateSowingSessionInput } from "@happyseeds/shared-types";
import { SowingSessionForm } from "@/components/sowing-session/sowing-session-form";
import { useCreateSowingSession } from "@/hooks/useSowingSession";

export const Route = createFileRoute("/_authenticated/sowing-sessions/new")({
   component: NewsSessionPage,
});

function NewsSessionPage() {
   const navigate = useNavigate();
   const createMutation = useCreateSowingSession();

   const handleSubmit = (data: CreateSowingSessionInput) => {
      createMutation.mutate(data, {
         onSuccess: () => {
            toast.success("Session créée avec succès !");
            navigate({ to: "/sowing-sessions" });
         },
         onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Erreur lors de la création");
         },
      });
   };

   return (
      <div className="container max-w-2xl py-8">
         <h1 className="text-2xl font-bold mb-6">Nouvelle graine</h1>
         <SowingSessionForm onSubmit={(data) => handleSubmit(data)} isSubmitting={createMutation.isPending} />
      </div>
   );
}

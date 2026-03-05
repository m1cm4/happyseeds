import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { signIn, useSession } from "../lib/auth-client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

type LoginSearch = {
   redirect?: string;
};

export const Route = createFileRoute("/login")({
   validateSearch: (search: Record<string, unknown>): LoginSearch => {
      return {
         redirect: typeof search.redirect === "string" ? search.redirect : undefined,
      };
   },
   component: LoginPage,
});

function LoginPage() {
   const [errorMessage, setError] = useState<string | null>(null);
   const { redirect: redirectUrl } = useSearch({ from: "/login" });
   const [loading, setLoading] = useState(false);
   // NOUVEAU : Vérifier si déjà connecté
   const { data: session } = useSession();

   // Si déjà connecté, rediriger vers dashboard
   useEffect(() => {
      if (session) {
         window.location.href = "/dashboard";
      }
   }, [session]);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setError(null);
      setLoading(true);

      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const { error } = await signIn.email({
         email,
         password,
      });

      setLoading(false);

      if (error) {
         setError(error.message || "Email ou mot de passe incorrect");
         return;
      }

      // on fait la redirection avec window.location
      // pour mettre à zero le cache existant de useSession()
      //navigate({ to: redirectUrl || "/dashboard" });
      window.location.href = redirectUrl || "/dashboard";
   }

   return (
      <div className="min-h-screen flex items-center justify-center bg-background">
         <div className="w-full max-w-md p-8 bg-card rounded-xl border border-border">
            {/* Logo */}
            <div className="flex justify-center mb-6">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                     <span className="grayscale-icon text-lg">🌱</span>
                  </div>
                  <span className="text-xl font-semibold text-foreground">HappySeeds</span>
               </div>
            </div>

            <h1 className="text-2xl font-semibold text-foreground text-center mb-6">
               Se connecter
            </h1>

            {errorMessage && (
               <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                  {errorMessage}
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <Label htmlFor="email" className="text-foreground font-medium mb-2 block">
                     Email
                  </Label>
                  <Input
                     id="email"
                     name="email"
                     type="email"
                     required
                     placeholder="vous@exemple.com"
                     className="w-full"
                  />
               </div>

               <div>
                  <Label htmlFor="password" className="text-foreground font-medium mb-2 block">
                     Mot de passe
                  </Label>
                  <Input
                     id="password"
                     name="password"
                     type="password"
                     required
                     placeholder="Votre mot de passe"
                     className="w-full"
                  />
               </div>

               <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Connexion..." : "Se connecter"}
               </Button>
            </form>

            <p className="mt-6 text-center text-sm text-wire-text-muted">
               Pas encore de compte ?{" "}
               <Link
                  to="/signup"
                  className="text-foreground hover:opacity-70 font-medium transition-fast"
               >
                  S'inscrire
               </Link>
            </p>
         </div>
      </div>
   );
}

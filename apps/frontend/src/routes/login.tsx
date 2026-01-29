import { createFileRoute, Link, useSearch} from "@tanstack/react-router";
import { useState } from "react";
import { signIn, useSession } from "../lib/auth-client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

type LoginSearch = {
  redirect?: string;
}

export const Route = createFileRoute("/login")({ 

  validateSearch: (search: Record<string, unknown>): LoginSearch =>{
    return {
      redirect: typeof search.redirect === "string" ? search.redirect : undefined
    }
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
  if (session) {                                     
    window.location.href = "/dashboard";             
    return null;                                     
  }    
 

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Se connecter
        </h1>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="vous@exemple.com"
              value="maesmichel@gmail.com"
            />
          </div>

          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Votre mot de passe"
              value="$$$$$$$$"

            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Pas encore de compte ?{" "}
          <Link to="/signup" className="text-emerald-600 hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
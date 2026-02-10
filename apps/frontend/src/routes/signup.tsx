import { signUp } from "@/lib/auth-client";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

type SignupSearch = {
  redirect?: string;
};

// déclare cette route comme "/"
export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>): SignupSearch => {
    return {
      redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    };
  },
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const { redirect: redirectUrl } = useSearch({ from: "/signup" });
  const [errorMessage, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const { error } = await signUp.email({
      name,
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setError(error.message || "Erruer lors de l'inscription");
      return;
    }
    // Inscription réussie, redirection vers la page d'accueil sans redirection
    //navigate({ to: "/" });
    // redirection page courante ou dashboard
    navigate({ to: redirectUrl || "/dashboard" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Créer un compte</h1>

        {errorMessage && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" type="text" required placeholder="Votre nom" />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="vous@exemple.com" />
          </div>

          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="Minimum 8 caractères"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Inscription..." : "S'inscrire"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-emerald-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

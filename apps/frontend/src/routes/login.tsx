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
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-sm border border-[#e6dccf]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 organic-shape bg-gradient-to-br from-[#3a9133] to-[#53802d] flex items-center justify-center shadow-lg shadow-[#3a9133]/20">
              <span className="text-white text-xl">🌱</span>
            </div>
            <span className="font-display text-2xl gradient-text">HappySeeds</span>
          </div>
        </div>

        <h1 className="font-display text-2xl text-[#5a4032] text-center mb-6">Se connecter</h1>

        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-[#5a4032] font-medium mb-2 block">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="vous@exemple.com"
              value="maesmichel@gmail.com"
              className="w-full px-5 py-4 rounded-2xl border-2 border-[#e6dccf] bg-[#f9f5ed] text-[#5a4032] placeholder-[#bfa385] focus:outline-none focus:border-[#3a9133] focus:bg-white transition-all"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-[#5a4032] font-medium mb-2 block">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Votre mot de passe"
              value="$$$$$$$$"
              className="w-full px-5 py-4 rounded-2xl border-2 border-[#e6dccf] bg-[#f9f5ed] text-[#5a4032] placeholder-[#bfa385] focus:outline-none focus:border-[#3a9133] focus:bg-white transition-all"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full px-8 py-4 bg-gradient-to-r from-[#3a9133] to-[#53802d] text-white rounded-full font-medium hover:shadow-lg hover:shadow-[#3a9133]/25 transition-all hover:-translate-y-0.5 border-0"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6d4c3b]">
          Pas encore de compte ?{" "}
          <Link to="/signup" className="text-[#3a9133] hover:text-[#53802d] font-medium transition-colors">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { useSession } from "../../lib/auth-client";
import { hasSessionCookie } from "../../lib/auth";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    // SSR : vérifie seulement la PRÉSENCE du cookie (pas de requête réseau)

    const hasCookie = await hasSessionCookie();

    if (!hasCookie) {
      throw redirect({
        to: "/login",
        search: location.pathname === "/login" ? {} : { redirect: location.pathname },
      });
    }

    // On ne retourne pas la session ici - elle sera chargée côté client
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { data: session, isPending } = useSession();

  // Rediriger si pas de session après vérification côté client
  useEffect(() => {
    if (!session && !isPending) {
      window.location.href = "/login";
    }
  }, [session, isPending]);

  // Pendant le chargement, afficher un loader
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Chargement...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Outlet />
    </main>
  );
}

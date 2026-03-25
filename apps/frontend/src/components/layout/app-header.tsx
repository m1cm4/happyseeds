import { Link, useMatchRoute } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";

export function AppHeader() {
   const { data: session, isPending } = useSession();
   const matchRoute = useMatchRoute();
   const isPlantRoute = matchRoute({ to: "/plants", fuzzy: true });
   const isSeedRoute = matchRoute({ to: "/seeds", fuzzy: true });
   const isSessionRoute = matchRoute({ to: "/sowing-sessions", fuzzy: true });
   const isDashboardRoute = matchRoute({ to: "/dashboard", fuzzy: true });
   const isCalendarRoute = matchRoute({ to: "/calendar", fuzzy: true });

   return (
      <header className="bg-card border-b border-border sticky top-0 z-50">
         <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <span className="grayscale-icon text-lg">🌱</span>
               </div>
               <Link
                  to="/"
                  className="text-xl font-semibold text-foreground hover:opacity-80 transition-fast"
               >
                  HappySeeds
               </Link>
            </div>
            <div>
               {isPending ? (
                  <span className="text-wire-text-muted">Chargement...</span>
               ) : session ? (
                  <div className="flex items-center gap-6">
                     <span className="text-wire-text-muted">Bonjour, {session.user.name}</span>
                     <nav className="flex items-center gap-6">
                        <Link
                           to="/dashboard"
                           className={`font-medium transition-fast relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-foreground after:transition-fast ${
                              isDashboardRoute
                                 ? "text-foreground after:scale-x-100"
                                 : "text-wire-text-muted hover:text-foreground after:scale-x-0 hover:after:scale-x-100"
                           }`}
                        >
                           Dashboard
                        </Link>
                        <Link
                           to="/plants"
                           className={`font-medium transition-fast relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-foreground after:transition-fast ${
                              isPlantRoute
                                 ? "text-foreground after:scale-x-100"
                                 : "text-wire-text-muted hover:text-foreground after:scale-x-0 hover:after:scale-x-100"
                           }`}
                        >
                           Plantes
                        </Link>
                        <Link
                           to="/seeds"
                           className={`font-medium transition-fast relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-foreground after:transition-fast ${
                              isSeedRoute
                                 ? "text-foreground after:scale-x-100"
                                 : "text-wire-text-muted hover:text-foreground after:scale-x-0 hover:after:scale-x-100"
                           }`}
                        >
                           Graines
                        </Link>
                        <Link
                           to="/calendar"
                           search={{
                              year: new Date().getFullYear(),
                              month: new Date().getMonth() + 1,
                           }}
                           className={`font-medium transition-fast relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-foreground after:transition-fast ${
                              isCalendarRoute
                                 ? "text-foreground after:scale-x-100"
                                 : "text-wire-text-muted hover:text-foreground after:scale-x-0 hover:after:scale-x-100"
                           }`}
                        >
                           Calendrier
                        </Link>
                        <Link
                           to="/sowing-sessions"
                           className={`font-medium transition-fast relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-foreground after:transition-fast ${
                              isSessionRoute
                                 ? "text-foreground after:scale-x-100"
                                 : "text-wire-text-muted hover:text-foreground after:scale-x-0 hover:after:scale-x-100"
                           }`}
                        >
                           Sessions
                        </Link>
                     </nav>
                     <Button onClick={() => logout("/")} variant="secondary">
                        Déconnexion
                     </Button>
                  </div>
               ) : (
                  <div className="flex items-center gap-4">
                     <Link
                        to="/login"
                        className="text-foreground hover:opacity-70 font-medium transition-fast"
                     >
                        Se connecter
                     </Link>
                     <Button asChild>
                        <Link to="/signup">S'inscrire</Link>
                     </Button>
                  </div>
               )}
            </div>
         </div>
      </header>
   );
}

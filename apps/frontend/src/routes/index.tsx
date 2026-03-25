import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";

// déclare cette route comme "/"
export const Route = createFileRoute("/")({ component: App });

function App() {
   // Si déjà connecté, rediriger vers dashboard
   const { data: session } = useSession();

   useEffect(() => {
      if (session) {
         window.location.href = "/dashboard";
      }
   }, [session]);

   return (
      <div className="min-h-screen bg-background">
         {/* Hero Section */}
         <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="text-center">
               {/* Logo */}
               <div className="flex justify-center mb-8">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
                        <span className="grayscale-icon text-2xl">🌱</span>
                     </div>
                     <h1 className="text-3xl font-semibold text-foreground">HappySeeds</h1>
                  </div>
               </div>

               {/* Tagline */}
               <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Gérez votre grainothèque et planifiez vos semis
               </h2>
               <p className="text-wire-text-muted text-lg mb-10 max-w-2xl mx-auto">
                  Organisez vos variétés de plantes, suivez votre stock de graines et planifiez vos
                  sessions de semis avec une interface simple et élégante.
               </p>

               {/* CTA Buttons */}
               <div className="flex justify-center gap-4">
                  <Link to="/signup">
                     <Button size="lg">Commencer gratuitement</Button>
                  </Link>
                  <Link to="/login">
                     <Button variant="outline" size="lg">
                        Se connecter
                     </Button>
                  </Link>
               </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 mt-16">
               <div className="bg-card rounded-xl p-6 border border-border text-center hover:border-wire-focus transition-medium">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-muted flex items-center justify-center mb-4">
                     <span className="grayscale-icon text-xl">🌿</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Mes Plantes</h3>
                  <p className="text-wire-text-muted">
                     Cataloguez vos variétés avec toutes les informations essentielles
                  </p>
               </div>

               <div className="bg-card rounded-xl p-6 border border-border text-center hover:border-wire-focus transition-medium">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-muted flex items-center justify-center mb-4">
                     <span className="grayscale-icon text-xl">🌰</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Mes Graines</h3>
                  <p className="text-wire-text-muted">
                     Suivez votre stock et l'origine de vos sachets de graines
                  </p>
               </div>

               <div className="bg-card rounded-xl p-6 border border-border text-center hover:border-wire-focus transition-medium">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-muted flex items-center justify-center mb-4">
                     <span className="grayscale-icon text-xl">🪴</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Mes Semis</h3>
                  <p className="text-wire-text-muted">
                     Planifiez et suivez vos sessions de semis tout au long de l'année
                  </p>
               </div>
            </div>
         </div>

         {/* Footer */}
         <footer className="mt-12 border-t border-border bg-card py-6">
            <div className="max-w-6xl mx-auto px-6 text-center">
               <p className="font-semibold text-foreground mb-1">🌱 HappySeeds</p>
               <p className="text-wire-text-muted text-sm">Cultivez votre passion du jardinage</p>
            </div>
         </footer>
      </div>
   );
}

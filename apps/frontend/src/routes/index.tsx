import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../components/ui/button";

// déclare cette route comme "/"
export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 organic-shape bg-gradient-to-br from-[#3a9133] to-[#53802d] flex items-center justify-center shadow-lg shadow-[#3a9133]/20">
                <span className="text-white text-2xl">🌱</span>
              </div>
              <h1 className="font-display text-4xl gradient-text">HappySeeds</h1>
            </div>
          </div>

          {/* Tagline */}
          <h2 className="font-display text-3xl text-[#5a4032] mb-4">
            Gérez votre grainothèque et planifiez vos semis
          </h2>
          <p className="text-[#6d4c3b] text-lg mb-10 max-w-2xl mx-auto">
            Organisez vos variétés de plantes, suivez votre stock de graines et planifiez vos sessions de semis avec une interface simple et élégante.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4">
            <Link to="/signup">
              <Button className="px-8 py-4 bg-gradient-to-r from-[#3a9133] to-[#53802d] text-white rounded-full font-medium hover:shadow-lg hover:shadow-[#3a9133]/25 transition-all hover:-translate-y-0.5 border-0 text-lg">
                Commencer gratuitement
              </Button>
            </Link>
            <Link to="/login">
              <Button className="px-8 py-4 border-2 border-[#3a9133] text-[#3a9133] rounded-full font-medium hover:bg-[#3a9133]/5 transition-all text-lg bg-transparent">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-[#e6dccf] text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#3a9133]/10 flex items-center justify-center mb-4">
              <span className="text-2xl">🌿</span>
            </div>
            <h3 className="font-display text-[1.4rem] text-[#5a4032] mb-2">Mes Plantes</h3>
            <p className="text-[#6d4c3b]">Cataloguez vos variétés avec toutes les informations essentielles</p>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm border border-[#e6dccf] text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#998100]/10 flex items-center justify-center mb-4">
              <span className="text-2xl">🌰</span>
            </div>
            <h3 className="font-display text-[1.4rem] text-[#5a4032] mb-2">Mes Graines</h3>
            <p className="text-[#6d4c3b]">Suivez votre stock et l'origine de vos sachets de graines</p>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm border border-[#e6dccf] text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#855c45]/10 flex items-center justify-center mb-4">
              <span className="text-2xl">🪴</span>
            </div>
            <h3 className="font-display text-[1.4rem] text-[#5a4032] mb-2">Mes Semis</h3>
            <p className="text-[#6d4c3b]">Planifiez et suivez vos sessions de semis tout au long de l'année</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#e6dccf] bg-white/70 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-display text-xl gradient-text mb-1">🌱 HappySeeds</p>
          <p className="text-[#6d4c3b]">Cultivez votre passion du jardinage</p>
        </div>
      </footer>
    </div>
  );
}

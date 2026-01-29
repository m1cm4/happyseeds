import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router';
import { useSession, signOut} from "../lib/auth-client";

// déclare cette route comme "/"
export const Route = createFileRoute('/')({ component: App })

function App() {
  const { data: session, isPending } = useSession()

  return (
    <>
    {/*  ------------ Header avec état de connexion ----------------------- */}
      <header className="p-4 bg-white shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-emerald-600">🌱 HappySeeds</h1>

          {isPending ? (
            <span className="text-slate-400">Chargement...</span>
          ) 
          : session ? (
            <div className="flex items-center gap-4">
              <span className="text-slate-600">
                Bonjour, {session.user.name}
              </span>
              <Button
                variant="outline"
                onClick={() => signOut()}
              >
                Déconnexion
              </Button>
            <a href="/dashboard" className="text-emerald-600 hover:text-emerald-700 font-medium"
          >Mon Dashboard</a>
          </div>
          ) 
          : (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <a href="/login">Se connecte</a>
              </Button>
              <Button asChild>
                <a href="/signup">S'inscrir</a>
              </Button>
            </div>
          )}
        </div>
      </header>


        <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-8">
          Gérez votre grainothèque et planifiez vos semis
        </p>
        <div className="space-x-4">
          <Button className='bg-emerald-600'>se connecter shadcn button</Button>
          <Button className='text-emerald-600 border-emerald-600' variant="outline">S'inscrire shadcnbutton</Button><br/>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
            Se connecter
          </button>
          <button className="border border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-50 transition">
            S'inscrire
          </button>
        </div>
      </div>
    </div>
    <hr />
    <hr />
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-6 mb-6">
            <img
              src="/tanstack-circle-logo.png"
              alt="TanStack Logo"
              className="w-24 h-24 md:w-32 md:h-32"
            />
            <h1 className="text-6xl md:text-7xl font-black text-white [tracking:-0.08em]">
              <span className="text-gray-300">TANSTACK</span>{' '}
              <span className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                START
              </span>
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
            The framework for next generation AI applications
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
            Full-stack framework powered by TanStack Router for React and Solid.
            Build modern applications with server functions, streaming, and type
            safety.
          </p>
          <div className="flex flex-col items-center gap-4">
            <a
              href="https://tanstack.com/start"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
            >
              Documentation
            </a>
            <p className="text-gray-400 text-sm mt-2">
              Begin your TanStack Start journey by editing{' '}
              <code className="px-2 py-1 bg-slate-700 rounded text-cyan-400">
                /src/routes/index.tsx
              </code>
            </p>
          </div>
        </div>
      </section>

    </div>
    </>
  )
}

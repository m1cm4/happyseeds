import { Link } from '@tanstack/react-router';
import { useSession, signOut } from '../lib/auth-client';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';


export function AppHeader() {
   const { data: session, isPending } = useSession();
   
   return (
      <header className="p-4 bg-white shadow"> 
         <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-emerald-600">
               <Link to="/">🌱 HappySeeds</Link>
            </h1>
            <div>
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
                onClick={ ()=>logout("/")}
              >
                Déconnexion
              </Button>
            <Link to="/dashboard" className="text-emerald-600 hover:text-emerald-700 font-medium"
          >Mon Dashboard</Link>
          </div>
          ) 
          : (
            <div className="flex gap-2">
              <Link to="/login">
                Se connecter
              </Link>
              <Button asChild>
                <a href="/signup">S'inscrire</a>
              </Button>
            </div>
          )}
            </div>
         </div> 
      </header>
   );
}
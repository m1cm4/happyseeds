// contiend les utilitaires d'authentification isomorphiques.
import { authClient, signOut } from "./auth-client";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

/**
 * Vérifie la présence du cookie de session côté serveur.
 * Pas de validation : ne vérifie pas si la session est valide, cad
 * il n'y a pas de requete vers le backend pour vérifier le status de la session valide.
 * c'est plus rapide et on évite un appel à l'api à chaque page
 * La validation réelle est faite côté client par useSession().
 */
export const hasSessionCookie = createIsomorphicFn()
  .client(() => {
    // Côté client, on laisse useSession() gérer
    // On retourne true pour ne pas bloquer le rendu
    return true;
  })
  .server(async () => {
    const headers = await getRequestHeaders();
    const cookies = headers.get("cookie") || "";

    // Better-Auth utilise ce nom de cookie par défaut
    return cookies.includes("better-auth.session_token");
  });

/**                                                     
* Déconnecte l'utilisateur et redirige.                
* Utilise window.location pour vider le cache          
useSession().                                           
*/
export async function logout(redirectTo: string = "/") {
  // de better-auth : supprime le cookie
  await signOut();
  // en utilisant window.location on supprimer le cache pour useSession();
  window.location.href = redirectTo;
}

// ma solution isomorph. non utilisée, gardée pour reference
// où serverside,  on fait appel au bakcend à chaque requête
const getSession = createIsomorphicFn()
  .client(async () => {
    // coté clien , betterAuth se charge de faire la requete au backend
    console.log("==== getSession (client) ");
    const { data: session } = await authClient.getSession({
      fetchOptions: { credentials: "include" },
    });
    return session;
  })
  .server(async () => {
    // executé côté server : on fait la rêquete nous même, en récuperant les cookie (dans le header entier) avet getRequestHeaders()
    console.log("==== getSession (server)");
    const headers = await getRequestHeaders();
    const response = await fetch(`http://localhost:3001/api/auth/get-session`, {
      method: "GET",
      headers: headers,
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const session = await response.json();
    return session;
  });

import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { QueryClient } from '@tanstack/react-query';


// Create QueryClient (react-query)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});
// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {
      // ajoute queryClient au context
      queryClient
    },

    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  })

  return router
}

export { queryClient }
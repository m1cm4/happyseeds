import { createFileRoute } from '@tanstack/react-router';

// déclare cette route comme "/"
export const Route = createFileRoute('/')({ component: App })

function App() {

  return (
    <>
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-8">
          Gérez votre grainothèque et planifiez vos semis
        </p>
      </div>
    </div>
    </>
  )
}
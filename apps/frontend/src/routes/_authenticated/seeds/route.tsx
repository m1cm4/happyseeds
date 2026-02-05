
// composant route.tsx fonvtionne comme le layout global
// pour toutes les pages /plants/

import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute("/_authenticated/seeds")({
  component: PlantsLayout,
})

function PlantsLayout() {
  // Le composant Outlet est l'emplacement où les routes enfants seront rendues
  return <Outlet />
}
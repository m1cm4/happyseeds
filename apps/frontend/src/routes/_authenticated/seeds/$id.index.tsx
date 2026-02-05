import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/seeds/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/seeds/$seedId/"!</div>
}

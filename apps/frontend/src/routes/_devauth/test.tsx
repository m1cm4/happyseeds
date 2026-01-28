import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_devauth/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_devauth/test"!</div>
}

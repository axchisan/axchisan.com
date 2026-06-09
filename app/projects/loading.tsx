export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      <span className="sr-only">Cargando proyectos…</span>
    </div>
  )
}

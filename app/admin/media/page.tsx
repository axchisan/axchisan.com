import { MediaManager } from "@/components/admin/media-manager"

export const dynamic = "force-dynamic"

export default function AdminMediaPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-[-0.02em]">Media</h1>
      <p className="mt-1 text-sm text-muted">Todos los archivos subidos al sitio. Copia su URL o elimínalos.</p>
      <div className="mt-7">
        <MediaManager />
      </div>
    </div>
  )
}

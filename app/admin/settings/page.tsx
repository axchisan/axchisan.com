import { prisma } from "@/lib/prisma"
import { SettingsForm } from "@/components/admin/settings-form"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  const rows = await prisma.siteSettings
    .findMany({ where: { key: { in: ["years_experience", "clients_count"] } } })
    .catch(() => [])
  const initial = Object.fromEntries(rows.map((r) => [r.key, r.value]))

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-[-0.02em]">Ajustes</h1>
      <p className="mt-1 text-sm text-graphite">Métricas y configuración del sitio.</p>
      <div className="mt-7 max-w-3xl">
        <SettingsForm initial={initial} />
      </div>
    </div>
  )
}

import { prisma } from "@/lib/prisma"
import { ProfileForm } from "@/components/admin/profile-form"

export const dynamic = "force-dynamic"

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findFirst().catch(() => null)

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-[-0.02em]">Perfil</h1>
      <p className="mt-1 text-sm text-muted">Datos del founder y de contacto que muestra el sitio.</p>
      <div className="mt-7 max-w-3xl">
        <ProfileForm initial={profile ?? {}} />
      </div>
    </div>
  )
}

import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { ProfileEditor } from "@/components/admin/profile-editor"

export const metadata = {
  title: "Editar Perfil - Admin",
  description: "Edita la información de tu perfil personal.",
}

export default async function AdminProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Perfil</h1>
        <p className="text-muted-foreground">Actualiza tu información personal y profesional.</p>
      </div>
      <ProfileEditor />
    </div>
  )
}

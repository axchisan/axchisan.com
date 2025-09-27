import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminLayout } from "@/components/admin/admin-layout"
import { MediaManager } from "@/components/admin/media-manager"

export const metadata = {
  title: "Gestor de Archivos - Admin",
  description: "Administra tus archivos multimedia.",
}

export default async function MediaPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin")
  }

  return (
    <AdminLayout>
      <MediaManager />
    </AdminLayout>
  )
}

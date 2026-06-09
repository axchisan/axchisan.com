import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata = {
  title: "Panel de Administración - Axchi",
  description: "Panel de control para gestionar el contenido del sitio web.",
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin")
  }

  return <AdminDashboard />
}

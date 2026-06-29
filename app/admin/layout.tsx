import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { AuthProvider } from "@/components/auth-provider"
import { AdminShell } from "@/components/admin/admin-shell"

export const dynamic = "force-dynamic"

export default async function AdminLayoutPage({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin?callbackUrl=/admin")
  }

  return (
    <AuthProvider>
      <AdminShell userName={session.user.name ?? session.user.email ?? "Admin"}>{children}</AdminShell>
    </AuthProvider>
  )
}

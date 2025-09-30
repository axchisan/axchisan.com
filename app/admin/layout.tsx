import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { AdminLayout } from "@/components/admin/admin-layout"

export default async function AdminLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin?callbackUrl=/admin")
  }

  return <AdminLayout>{children}</AdminLayout>
}

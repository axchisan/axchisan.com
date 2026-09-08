import Link from "next/link"
import { Plus } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { ProjectsList } from "@/components/admin/projects-list"

export const dynamic = "force-dynamic"

export default async function AdminProjectsPage() {
  const projects = await prisma.project
    .findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] })
    .catch(() => [])

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">Proyectos</h1>
          <p className="mt-1 text-sm text-graphite">{projects.length} proyecto(s).</p>
        </div>
        <Button href="/admin/projects/new">
          <Plus className="h-4 w-4" /> Nuevo
        </Button>
      </div>
      <div className="mt-7">
        <ProjectsList items={projects} />
      </div>
    </div>
  )
}

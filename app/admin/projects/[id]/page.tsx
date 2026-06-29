import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ProjectForm } from "@/components/admin/project-form"

export const dynamic = "force-dynamic"

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.project
    .findUnique({ where: { id }, include: { files: { orderBy: { order: "asc" } } } })
    .catch(() => null)
  if (!project) notFound()

  return (
    <div className="max-w-4xl">
      <Link href="/admin/projects" className="mono-label inline-flex items-center gap-2 text-muted transition-colors hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" /> Proyectos
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold tracking-[-0.02em]">Editar proyecto</h1>
      <div className="mt-7">
        <ProjectForm
          initial={{
            id: project.id,
            title: project.title,
            shortDesc: project.shortDesc,
            description: project.description,
            content: project.content,
            category: project.category,
            status: project.status,
            featured: project.featured,
            technologies: project.technologies,
            githubUrl: project.githubUrl,
            liveUrl: project.liveUrl,
            coverImage: project.coverImage,
            images: project.images,
            files: project.files.map((f) => ({
              id: f.id,
              filename: f.filename,
              originalName: f.originalName,
              displayName: f.displayName ?? f.originalName,
              url: f.url,
              size: f.size,
              type: f.type,
              category: f.category,
              platform: f.platform,
              version: f.version,
              isDownloadable: f.isDownloadable,
            })),
            order: project.order,
          }}
        />
      </div>
    </div>
  )
}

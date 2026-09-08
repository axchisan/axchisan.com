import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ProjectForm } from "@/components/admin/project-form"

export const dynamic = "force-dynamic"

export default function NewProjectPage() {
  return (
    <div className="max-w-4xl">
      <Link href="/admin/projects" className="text-[0.875rem] text-faint inline-flex items-center gap-2 text-graphite transition-colors hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Proyectos
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-[-0.02em]">Nuevo proyecto</h1>
      <div className="mt-7">
        <ProjectForm />
      </div>
    </div>
  )
}

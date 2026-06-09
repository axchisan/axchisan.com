import type { Metadata } from "next"
import { getProjects } from "@/lib/data"
import { ProjectsPageClient } from "@/components/projects/projects-page-client"

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Explora mis proyectos de desarrollo web, móvil y software. Una colección de trabajos construidos con tecnologías modernas, filtrables por categoría y tecnología.",
  alternates: { canonical: "/projects" },
}

export const revalidate = 300

export default async function ProjectsPage() {
  const projects = await getProjects()

  return <ProjectsPageClient projects={projects} />
}

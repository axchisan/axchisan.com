import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProjectById } from "@/lib/data"
import { SITE_URL } from "@/lib/site"
import { ProjectDetailClient } from "@/components/projects/project-detail-client"

export const revalidate = 300

function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim()
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const project = await getProjectById(params.id)

  if (!project) {
    return { title: "Proyecto no encontrado" }
  }

  const description = truncate(project.shortDesc || project.description || "")
  const ogImage = project.coverImage || project.images?.[0] || undefined

  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.id}` },
    openGraph: {
      type: "article",
      title: project.title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id)

  if (!project || project.status !== "COMPLETED") {
    notFound()
  }

  const description = truncate(project.shortDesc || project.description || "")
  const hasFiles = project.files && project.files.length > 0

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": hasFiles ? "SoftwareApplication" : "CreativeWork",
    name: project.title,
    description,
    url: `${SITE_URL}/projects/${project.id}`,
    image: project.coverImage || project.images?.[0] || undefined,
    dateCreated: new Date(project.createdAt).toISOString(),
    dateModified: new Date(project.updatedAt).toISOString(),
    author: { "@type": "Person", name: "Duvan Yair Arciniegas", url: SITE_URL },
    ...(hasFiles ? { applicationCategory: project.category || "Application" } : {}),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectDetailClient project={project as any} />
    </>
  )
}

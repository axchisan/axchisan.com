"use client"

import { useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuroraBackground } from "@/components/aurora-background"
import { PageTransition } from "@/components/page-transition"
import { ProjectsHero } from "@/components/projects/projects-hero"
import { ProjectsGrid } from "@/components/projects/projects-grid"
import { ProjectsFilters } from "@/components/projects/projects-filters"
import type { getProjects } from "@/lib/data"

// El shape exacto que devuelve la capa de datos (Prisma + _count).
type RawProject = Awaited<ReturnType<typeof getProjects>>[number]

interface ProjectsPageClientProps {
  projects: RawProject[]
}

export function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Normaliza el shape de Prisma (_count) al que espera ProjectCard (likes/comments planos).
  const normalizedProjects = useMemo(
    () =>
      projects.map((p) => ({
        ...p,
        likes: p._count?.likes ?? 0,
        comments: p._count?.comments ?? 0,
      })),
    [projects],
  )

  // Categorías y tecnologías disponibles derivadas de los projects recibidos.
  const categories = useMemo(
    () => [
      "Todos",
      ...Array.from(new Set(normalizedProjects.map((p) => p.category).filter((c): c is string => Boolean(c)))),
    ],
    [normalizedProjects],
  )
  const technologies = useMemo(
    () => Array.from(new Set(normalizedProjects.flatMap((p) => p.technologies))),
    [normalizedProjects],
  )

  // Filtrado en memoria (sin re-fetch): categoría, tecnologías y búsqueda.
  const filteredProjects = useMemo(() => {
    let filtered = normalizedProjects

    if (selectedCategory && selectedCategory !== "Todos") {
      filtered = filtered.filter((project) => project.category === selectedCategory)
    }

    if (selectedTechs.length > 0) {
      filtered = filtered.filter((project) => selectedTechs.some((tech) => project.technologies.includes(tech)))
    }

    if (searchQuery) {
      const term = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          project.technologies.some((tech) => tech.toLowerCase().includes(term)),
      )
    }

    return filtered
  }, [normalizedProjects, selectedCategory, selectedTechs, searchQuery])

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <Header />

      <PageTransition>
        <main className="relative z-10 pt-16">
          <ProjectsHero />
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <ProjectsFilters
                categories={categories}
                technologies={technologies}
                onCategoryChange={setSelectedCategory}
                onTechChange={setSelectedTechs}
                onSearchChange={setSearchQuery}
              />
              <ProjectsGrid projects={filteredProjects} />
            </div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  )
}

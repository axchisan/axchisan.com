"use client"

import { SectionReveal, SectionRevealItem } from "@/components/motion/section-reveal"
import { ProjectCard } from "./project-card"
import { useProjects } from "@/hooks/use-projects"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"

interface ProjectsGridProps {
  // Cuando se pasan `projects` por props (SSR), se usan directamente sin fetch.
  projects?: any[]
  selectedCategory?: string
  selectedTechs?: string[]
  searchQuery?: string
}

export function ProjectsGrid({ projects: projectsProp, selectedCategory, selectedTechs = [], searchQuery }: ProjectsGridProps) {
  // Modo controlado: los projects ya vienen filtrados desde el Server Component.
  const controlled = projectsProp !== undefined

  const { projects: fetchedProjects, loading, error } = useProjects()
  const projects = controlled ? (projectsProp as any[]) : fetchedProjects
  const [filteredProjects, setFilteredProjects] = useState(projects)

  useEffect(() => {
    if (controlled) {
      setFilteredProjects(projects)
      return
    }

    let filtered = projects

    // Filter by category
    if (selectedCategory && selectedCategory !== "Todos") {
      filtered = filtered.filter((project) => project.category === selectedCategory)
    }

    // Filter by technologies
    if (selectedTechs.length > 0) {
      filtered = filtered.filter((project) =>
        selectedTechs.some((tech: string) => project.technologies.includes(tech)),
      )
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.technologies.some((tech: string) => tech.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    setFilteredProjects(filtered)
  }, [controlled, projects, selectedCategory, selectedTechs, searchQuery])

  if (!controlled && error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Error al cargar los proyectos</p>
      </div>
    )
  }

  if (!controlled && loading) {
    return (
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-14" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron proyectos que coincidan con los filtros</p>
      </div>
    )
  }

  return (
    <SectionReveal stagger staggerDelay={0.08} className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {filteredProjects.map((project) => (
        <SectionRevealItem key={project.id}>
          <ProjectCard project={project} />
        </SectionRevealItem>
      ))}
    </SectionReveal>
  )
}

"use client"

import { motion } from "framer-motion"
import { ProjectCard } from "./project-card"
import { useProjects } from "@/hooks/use-projects"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"

interface ProjectsGridProps {
  selectedCategory?: string
  selectedTechs?: string[]
  searchQuery?: string
}

export function ProjectsGrid({ selectedCategory, selectedTechs = [], searchQuery }: ProjectsGridProps) {
  const { projects, loading, error } = useProjects()
  const [filteredProjects, setFilteredProjects] = useState(projects)

  useEffect(() => {
    let filtered = projects

    // Filter by category
    if (selectedCategory && selectedCategory !== "Todos") {
      filtered = filtered.filter((project) => project.category === selectedCategory)
    }

    // Filter by technologies
    if (selectedTechs.length > 0) {
      filtered = filtered.filter((project) => selectedTechs.some((tech) => project.technologies.includes(tech)))
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.technologies.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    setFilteredProjects(filtered)
  }, [projects, selectedCategory, selectedTechs, searchQuery])

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Error al cargar los proyectos</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
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
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredProjects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  )
}

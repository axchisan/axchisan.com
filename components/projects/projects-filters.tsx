"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { useProjects } from "@/hooks/use-projects"

interface ProjectsFiltersProps {
  onCategoryChange: (category: string) => void
  onTechChange: (techs: string[]) => void
  onSearchChange: (query: string) => void
}

export function ProjectsFilters({ onCategoryChange, onTechChange, onSearchChange }: ProjectsFiltersProps) {
  const { projects } = useProjects()
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Extract unique categories and technologies from projects
  const categories = ["Todos", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))]
  const technologies = Array.from(new Set(projects.flatMap((p) => p.technologies)))

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    onCategoryChange(category)
  }

  const toggleTech = (tech: string) => {
    const newTechs = selectedTechs.includes(tech) ? selectedTechs.filter((t) => t !== tech) : [...selectedTechs, tech]
    setSelectedTechs(newTechs)
    onTechChange(newTechs)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    onSearchChange(query)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar proyectos..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 bg-card/50 border-primary/20"
        />
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Categorías
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category)}
              className={
                selectedCategory === category ? "transition-neon hover:neon-glow" : "bg-transparent hover:bg-primary/10"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Technologies */}
      {technologies.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Tecnologías</h3>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <Badge
                key={tech}
                variant={selectedTechs.includes(tech) ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  selectedTechs.includes(tech)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-primary/10 hover:border-primary/30"
                }`}
                onClick={() => toggleTech(tech)}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"

interface ProjectsFiltersProps {
  // Opciones derivadas en el servidor y pasadas por props (sin fetch en cliente).
  categories: string[]
  technologies: string[]
  onCategoryChange: (category: string) => void
  onTechChange: (techs: string[]) => void
  onSearchChange: (query: string) => void
}

export function ProjectsFilters({
  categories,
  technologies,
  onCategoryChange,
  onTechChange,
  onSearchChange,
}: ProjectsFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

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
          className="pl-10 rounded-xl bg-card/60 backdrop-blur-sm border-border/60 focus-visible:border-primary/40 transition-colors duration-300"
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
                selectedCategory === category
                  ? "rounded-full glow"
                  : "rounded-full bg-card/40 border-border/60 hover:border-primary/40 hover:bg-primary/10 transition-colors duration-300"
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
                className={`cursor-pointer rounded-full transition-colors duration-300 ${
                  selectedTechs.includes(tech)
                    ? "bg-primary text-primary-foreground glow"
                    : "border-border/60 hover:bg-primary/10 hover:border-primary/40"
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

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"

const categories = ["Todos", "Web", "Móvil", "Automatización", "Juegos", "API"]
const technologies = ["React", "Next.js", "Flutter", "Python", "PHP", "TypeScript", "Node.js"]

export function ProjectsFilters() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) => (prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]))
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
          onChange={(e) => setSearchQuery(e.target.value)}
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
              onClick={() => setSelectedCategory(category)}
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
    </motion.div>
  )
}

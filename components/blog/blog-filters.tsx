"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface BlogFiltersProps {
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  categories: string[]
}

export function BlogFilters({
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  categories,
}: BlogFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar artículos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filters */}
      <div className="space-y-3">
        <h3 className="font-semibold">Categorías</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(null)}
            className="transition-neon hover:neon-glow"
          >
            Todos
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className="transition-neon hover:neon-glow"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

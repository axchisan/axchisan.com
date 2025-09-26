"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackgroundEffects } from "@/components/background-effects"
import { PageTransition } from "@/components/page-transition"
import { ProjectsHero } from "@/components/projects/projects-hero"
import { ProjectsGrid } from "@/components/projects/projects-grid"
import { ProjectsFilters } from "@/components/projects/projects-filters"

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="relative min-h-screen">
      <BackgroundEffects />
      <Header />

      <PageTransition>
        <main className="relative z-10 pt-16">
          <ProjectsHero />
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <ProjectsFilters
                onCategoryChange={setSelectedCategory}
                onTechChange={setSelectedTechs}
                onSearchChange={setSearchQuery}
              />
              <ProjectsGrid
                selectedCategory={selectedCategory}
                selectedTechs={selectedTechs}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  )
}

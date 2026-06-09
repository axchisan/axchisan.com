"use client"

import { BookOpen } from "lucide-react"
import { PageHero } from "@/components/page-hero"

export function BlogHero() {
  return (
    <PageHero
      icon={BookOpen}
      title="Mi"
      highlight="Blog"
      subtitle="Comparto mis experiencias, aprendizajes y reflexiones sobre desarrollo de software, tecnología y programación."
      metrics={[
        { value: 50, suffix: "+", label: "Artículos" },
        { value: 30, suffix: "+", label: "Publicaciones" },
        { value: 15, label: "Categorías" },
      ]}
    />
  )
}

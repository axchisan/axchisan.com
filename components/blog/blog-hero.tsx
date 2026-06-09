"use client"

import { BookOpen } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { useMetrics } from "@/hooks/use-metrics"

export function BlogHero() {
  const m = useMetrics()
  return (
    <PageHero
      icon={BookOpen}
      title="Mi"
      highlight="Blog"
      subtitle="Comparto mis experiencias, aprendizajes y reflexiones sobre desarrollo de software, tecnología y programación."
      metrics={[
        { value: m?.blogPostsCount ?? 15, suffix: "+", label: "Artículos" },
        { value: m?.categoriesCount ?? 8, suffix: "+", label: "Categorías" },
      ]}
    />
  )
}

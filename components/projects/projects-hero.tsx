"use client"

import { FolderOpen } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { useMetrics } from "@/hooks/use-metrics"

export function ProjectsHero() {
  const m = useMetrics()
  return (
    <PageHero
      icon={FolderOpen}
      title="Mis"
      highlight="Proyectos"
      subtitle="Una colección de proyectos que demuestran mi pasión por crear soluciones tecnológicas innovadoras y funcionales."
      metrics={[
        { value: m?.projectsCount ?? 25, suffix: "+", label: "Proyectos" },
        { value: m?.technologiesCount ?? 10, suffix: "+", label: "Tecnologías" },
        { value: m?.clientsCount ?? 15, suffix: "+", label: "Clientes" },
      ]}
    />
  )
}

"use client"

import { FolderOpen } from "lucide-react"
import { PageHero } from "@/components/page-hero"

export function ProjectsHero() {
  return (
    <PageHero
      icon={FolderOpen}
      title="Mis"
      highlight="Proyectos"
      subtitle="Una colección de proyectos que demuestran mi pasión por crear soluciones tecnológicas innovadoras y funcionales."
      metrics={[
        { value: 25, suffix: "+", label: "Proyectos" },
        { value: 10, suffix: "+", label: "Tecnologías" },
        { value: 15, suffix: "+", label: "Clientes" },
      ]}
    />
  )
}

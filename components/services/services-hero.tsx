"use client"

import { Briefcase } from "lucide-react"
import { PageHero } from "@/components/page-hero"

export function ServicesHero() {
  return (
    <PageHero
      icon={Briefcase}
      title="Mis"
      highlight="Servicios"
      subtitle="Ofrezco soluciones tecnológicas completas para hacer crecer tu negocio, desde páginas web hasta aplicaciones móviles y sistemas de automatización."
    />
  )
}

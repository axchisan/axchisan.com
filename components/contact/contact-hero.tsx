"use client"

import { Mail } from "lucide-react"
import { PageHero } from "@/components/page-hero"

export function ContactHero() {
  return (
    <PageHero
      icon={Mail}
      title="Hablemos de tu"
      highlight="Proyecto"
      subtitle="¿Tienes una idea que quieres convertir en realidad? Me encantaría escuchar sobre tu proyecto y ayudarte a crear algo increíble."
      metrics={[
        { value: 24, suffix: "h", label: "Respuesta" },
        { value: 100, suffix: "%", label: "Confidencial" },
        { value: 0, prefix: "$", label: "Consulta gratis" },
      ]}
    />
  )
}

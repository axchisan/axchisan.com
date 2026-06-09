"use client"

import Image from "next/image"
import { PageHero } from "@/components/page-hero"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, GraduationCap } from "lucide-react"

export function AboutHero() {
  const info = [
    { icon: MapPin, label: "Colombia" },
    { icon: Calendar, label: "3+ años de experiencia" },
    { icon: GraduationCap, label: "Estudiante SENA" },
  ]

  return (
    <PageHero
      variant="split"
      badge="Desarrollador de Software"
      title="Duvan Yair"
      highlight="Arciniegas"
      subtitle='Conocido como "Axchi". Soy un desarrollador de software apasionado por crear soluciones tecnológicas innovadoras. Mi enfoque se centra en transformar ideas complejas en aplicaciones funcionales y elegantes que realmente marquen la diferencia.'
      actions={
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {info.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center rounded-xl bg-primary/10 w-9 h-9 shrink-0">
                <Icon className="h-4 w-4 text-primary" />
              </span>
              <span className="text-muted-foreground text-sm">{label}</span>
            </div>
          ))}
        </div>
      }
      media={
        <div className="relative">
          <div className="absolute -inset-4 aurora-surface rounded-3xl opacity-60" aria-hidden />
          <Card className="relative border-border/60 bg-card/60 backdrop-blur-sm rounded-2xl">
            <CardContent className="p-8">
              <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl overflow-hidden mb-6">
                <Image
                  src="/axchi.jpg"
                  alt="Duvan Yair Arciniegas (Axchi)"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Axchi</h3>
                <p className="text-muted-foreground text-sm">
                  "La innovación nace de la pasión por resolver problemas complejos"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    />
  )
}

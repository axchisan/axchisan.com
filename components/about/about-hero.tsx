"use client"

import Image from "next/image"
import { PageHero } from "@/components/page-hero"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Briefcase, Cpu } from "lucide-react"
import { useProfile } from "@/hooks/use-profile"

export function AboutHero() {
  const { profile } = useProfile()

  const fullName = profile?.name || "Duvan Yair Arciniegas"
  const nameParts = fullName.trim().split(" ")
  const highlight = nameParts.length > 1 ? nameParts.slice(-1).join(" ") : ""
  const title = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : fullName

  const badge = profile?.title || "Desarrollador de Software"
  const subtitle =
    profile?.bio ||
    'Conocido como "Axchi". Desde enero de 2026 trabajo como desarrollador de software en una empresa en Bogotá, Colombia, creando productos para clientes reales con DevOps, CI/CD, automatización e integración de agentes de inteligencia artificial.'
  const avatar = profile?.avatar || "/axchi.jpg"

  const info = [
    { icon: MapPin, label: "Bogotá, Colombia" },
    { icon: Briefcase, label: "Desarrollador en empresa de software" },
    { icon: Cpu, label: "DevOps · CI/CD · IA" },
  ]

  return (
    <PageHero
      variant="split"
      badge={badge}
      title={title}
      highlight={highlight}
      subtitle={subtitle}
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
                  src={avatar}
                  alt={fullName}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">{profile?.name?.split(" ")[0] || "Axchi"}</h3>
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

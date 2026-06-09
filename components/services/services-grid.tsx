"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Code, Smartphone, Globe, Zap, Database, Palette } from "lucide-react"
import { SectionReveal, SectionRevealItem } from "@/components/motion/section-reveal"
import { TiltCard } from "@/components/ui/tilt-card"
import { serviceImages } from "@/lib/stock-images"

const services = [
  {
    id: 1,
    title: "Desarrollo Web",
    description:
      "Aplicaciones web modernas y responsivas utilizando las últimas tecnologías como React, Next.js y TypeScript.",
    icon: Globe,
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    id: 2,
    title: "Desarrollo Móvil",
    description: "Aplicaciones móviles nativas y multiplataforma con Flutter para iOS y Android.",
    icon: Smartphone,
    technologies: ["Flutter", "Dart", "Firebase", "SQLite"],
  },
  {
    id: 3,
    title: "Desarrollo Backend",
    description: "APIs robustas y escalables con Node.js, Python y bases de datos modernas.",
    icon: Database,
    technologies: ["Node.js", "Python", "PostgreSQL", "MongoDB"],
  },
  {
    id: 4,
    title: "Automatización",
    description: "Automatización de procesos empresariales con n8n y scripts personalizados.",
    icon: Zap,
    technologies: ["n8n", "Python", "APIs", "Webhooks"],
  },
  {
    id: 5,
    title: "Desarrollo Full Stack",
    description: "Soluciones completas desde el frontend hasta el backend y la base de datos.",
    icon: Code,
    technologies: ["React", "Node.js", "PostgreSQL", "Docker"],
  },
  {
    id: 6,
    title: "UI/UX Design",
    description: "Diseño de interfaces de usuario atractivas y experiencias de usuario optimizadas.",
    icon: Palette,
    technologies: ["Figma", "Adobe XD", "Tailwind CSS", "Framer Motion"],
  },
]

export function ServicesGrid() {
  return (
    <SectionReveal stagger className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {services.map((service, i) => {
        const IconComponent = service.icon
        return (
          <SectionRevealItem key={service.id}>
            <TiltCard className="h-full">
              <Card className="h-full overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/40 transition-colors duration-300 group">
                {/* Banner decorativo (foto real) con overlay on-brand */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={serviceImages[i % serviceImages.length]}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 p-2 rounded-xl bg-background/70 backdrop-blur-sm border border-border/60">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{service.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <Button size="sm" className="glow transition-shadow">
                      Solicitar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TiltCard>
          </SectionRevealItem>
        )
      })}
    </SectionReveal>
  )
}

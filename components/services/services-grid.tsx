"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Smartphone, Globe, Zap, Database, Palette } from "lucide-react"

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
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service) => {
        const IconComponent = service.icon
        return (
          <Card
            key={service.id}
            className="border-primary/20 hover:border-primary/40 transition-all duration-300 group"
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </div>
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
                <Button size="sm" className="transition-neon hover:neon-glow">
                  Solicitar
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

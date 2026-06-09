"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GradientText } from "@/components/ui/gradient-text"
import { SectionReveal, SectionRevealItem } from "@/components/motion/section-reveal"

const timelineEvents = [
  {
    year: "2020",
    title: "Primeros Pasos",
    description: "Comencé mi viaje mediante juegos de aprendizaje y tutoriales interactivos.",
    technologies: ["Scratch", "Mimo", "Code.org"],
  },
  {
    year: "2021",
    title: "Conceptos Básicos",
    description: "Continué aprendiendo los fundamentos básicos de la programación.",
    technologies: ["HTML", "CSS", "JavaScript"],
  },
  {
    year: "2022",
    title: "Aprendizaje Sobre Electrónica",
    description: "Me interesé por la electrónica y comencé a aprender sobre microcontroladores y circuitos.",
    technologies: ["Arduino", "Raspberry Pi", "Circuitos"],
  },
  {
    year: "2023",
    title: "Desarrollo de mis Primeros Proyectos",
    description: "Desarrollé mis primeros proyectos simples, aplicando lo que había aprendido. Para mi proyecto final de curso cree un sistema de monitoreo ambiental con sensores de temperatura y humedad.",
    technologies: ["Arduino", "Sensores", "C++"],
  },
  {
    year: "2024",
    title: "Aprendizaje en el SENA",
    description: "Aprendí sobre desarrollo web, bases de datos y programación orientada a objetos gracias al SENA.",
    technologies: ["Java", "MySQL", "HTML/CSS", "phpMyAdmin"],
  },
  {
    year: "2025",
    title: "Construcción de Proyectos Más Complejos",
    description: "Comencé a trabajar en proyectos más complejos y sistemas de gran escala. También aprendí sobre metodologías ágiles, automatización y control de versiones, también adquirí mi propio servidor y dominio. Actualmente estoy trabajando en proyectos para clientes reales y colaborando con otros desarrolladores.",
    technologies: ["Next.js", "TypeScript", "Docker", "Git", "Flutter", "n8n", "php", "Hostinger", "Coolify", "Vercel" ],
  },
]

export function AboutTimeline() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <SectionReveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-center mb-12">
              Mi <GradientText>Trayectoria</GradientText>
            </h2>
          </SectionReveal>

          <div className="relative">
            {/* Línea: en móvil pegada a la izquierda, centrada desde md */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-primary/30" />

            <SectionReveal stagger staggerDelay={0.12} className="space-y-8">
              {timelineEvents.map((event, index) => (
                <SectionRevealItem
                  key={event.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot: comparte exactamente el mismo left que la línea */}
                  <div className="absolute left-4 md:left-1/2 top-6 md:top-1/2 w-3 h-3 -translate-x-1/2 md:-translate-y-1/2 rounded-full bg-primary z-10" />

                  <div className={`w-full pl-10 md:pl-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                    <Card className="border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/40 transition-colors duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="outline" className="text-primary border-primary">
                            {event.year}
                          </Badge>
                          <h3 className="text-xl font-semibold">
                            <GradientText>{event.title}</GradientText>
                          </h3>
                        </div>

                        <p className="text-muted-foreground mb-4 leading-relaxed">{event.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {event.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </SectionRevealItem>
              ))}
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  )
}

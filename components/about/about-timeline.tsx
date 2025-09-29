"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 neon-text">Mi Trayectoria</h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 transform md:-translate-x-0.5" />

            <div className="space-y-8">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full transform md:-translate-x-1.5 z-10" />

                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                    <Card className="ml-8 md:ml-0 bg-card/50 backdrop-blur-sm border-primary/20 transition-neon hover:neon-glow">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="outline" className="text-primary border-primary">
                            {event.year}
                          </Badge>
                          <h3 className="text-xl font-semibold text-primary">{event.title}</h3>
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
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

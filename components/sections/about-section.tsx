"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Music, Gamepad2, Heart } from "lucide-react"

const interests = [
  {
    name: "Desarrollo de Juegos",
    icon: Gamepad2,
    color: "text-red-400",
    description: "Creando experiencias interactivas y divertidas",
  },
  {
    name: "Apasionado por la Música",
    icon: Music,
    color: "text-purple-400",
    description: "La música inspira mi creatividad en el código",
  },
  {
    name: "Programación Creativa",
    icon: Code,
    color: "text-blue-400",
    description: "Explorando nuevas formas de expresión digital",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Sobre <span className="text-primary">Axchi</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conoce más sobre mi pasión por la tecnología y mi enfoque en crear soluciones innovadoras
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Bio section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mr-4">
                    <Heart className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Mi Historia</h3>
                    <p className="text-muted-foreground">Desarrollador de Software</p>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  Soy un apasionado desarrollador de software, actualmente estudiante en el SENA. Me encanta la
                  programación y creo soluciones tecnológicas innovadoras para diferentes negocios.
                </p>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  En mis tiempos libres disfruto creando juegos y soy un gran apasionado por la música. Trabajo bajo el
                  apodo <span className="text-primary font-semibold">Axchi</span>, mi marca personal que representa
                  innovación y creatividad en el desarrollo de software.
                </p>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Estudiante SENA</Badge>
                  <Badge variant="secondary">Innovador</Badge>
                  <Badge variant="secondary">Creativo</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Interests section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold mb-8">Mis Pasiones</h3>

            {interests.map((interest, index) => {
              const Icon = interest.icon
              return (
                <motion.div
                  key={interest.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-primary/10 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`p-3 rounded-lg bg-primary/10 ${interest.color} group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">{interest.name}</h4>
                          <p className="text-muted-foreground text-sm">{interest.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { label: "Años de Experiencia", value: "3+" },
              { label: "Proyectos Completados", value: "25+" },
              { label: "tecnologias en aprendizaje", value: "3"}
              
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

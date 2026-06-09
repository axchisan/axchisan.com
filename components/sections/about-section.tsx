"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Music, Gamepad2, Heart } from "lucide-react"
import { GradientText } from "@/components/ui/gradient-text"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { SectionReveal, SectionRevealItem } from "@/components/motion/section-reveal"
import { TiltCard } from "@/components/ui/tilt-card"

const interests = [
  {
    name: "Desarrollo de Juegos",
    icon: Gamepad2,
    color: "text-rose-400",
    description: "Creando experiencias interactivas y divertidas",
  },
  {
    name: "Apasionado por la Música",
    icon: Music,
    color: "text-violet-400",
    description: "La música inspira mi creatividad en el código",
  },
  {
    name: "Programación Creativa",
    icon: Code,
    color: "text-cyan-400",
    description: "Explorando nuevas formas de expresión digital",
  },
]

const stats = [
  { label: "Años de Experiencia", value: 3, suffix: "+" },
  { label: "Proyectos Completados", value: 25, suffix: "+" },
  { label: "Tecnologías Aprendidas", value: 10, suffix: "+" },
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionReveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Sobre <GradientText>Axchi</GradientText>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conoce más sobre mi pasión por la tecnología y mi enfoque en crear soluciones innovadoras
          </p>
        </SectionReveal>

        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          {/* Bio */}
          <SectionReveal y={32}>
            <TiltCard className="h-full" intensity={5}>
              <Card className="h-full border-border/60 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="h-12 w-12 rounded-xl bg-gradient-aurora flex items-center justify-center mr-4 glow">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Mi Historia</h3>
                      <p className="text-muted-foreground text-sm">Desarrollador de Software</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Soy un apasionado desarrollador de software, actualmente estudiante en el SENA. Me encanta la
                    programación y creo soluciones tecnológicas innovadoras para diferentes negocios.
                  </p>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    En mis tiempos libres disfruto creando proyectos y soy un gran apasionado por el aprendizaje. Trabajo
                    bajo el apodo <GradientText className="font-semibold">Axchi</GradientText>, mi marca personal que
                    representa innovación y creatividad en el desarrollo de software.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Estudiante SENA</Badge>
                    <Badge variant="secondary">Innovador</Badge>
                    <Badge variant="secondary">Creativo</Badge>
                    <Badge variant="secondary">Autodidacta</Badge>
                  </div>
                </CardContent>
              </Card>
            </TiltCard>
          </SectionReveal>

          {/* Intereses */}
          <SectionReveal stagger className="space-y-5" amount={0.15}>
            <SectionRevealItem>
              <h3 className="text-2xl font-semibold mb-2">Mis Pasiones</h3>
            </SectionRevealItem>
            {interests.map((interest) => {
              const Icon = interest.icon
              return (
                <SectionRevealItem key={interest.name}>
                  <Card className="border-border/50 bg-card/40 backdrop-blur-sm hover:border-primary/40 transition-colors duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`p-3 rounded-xl bg-primary/10 ${interest.color} group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{interest.name}</h4>
                          <p className="text-muted-foreground text-sm">{interest.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </SectionRevealItem>
              )
            })}
          </SectionReveal>
        </div>

        {/* Stats */}
        <SectionReveal className="mt-20" delay={0.1}>
          <div className="grid grid-cols-3 gap-6 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

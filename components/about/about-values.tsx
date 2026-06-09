"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Code, Lightbulb, Users, Zap } from "lucide-react"
import { GradientText } from "@/components/ui/gradient-text"
import { TiltCard } from "@/components/ui/tilt-card"
import { SectionReveal, SectionRevealItem } from "@/components/motion/section-reveal"

const values = [
  {
    icon: Code,
    title: "Código Limpio",
    description:
      "Escribo código mantenible, escalable y bien documentado que otros desarrolladores puedan entender y mejorar fácilmente.",
  },
  {
    icon: Lightbulb,
    title: "Innovación",
    description:
      "Siempre busco nuevas formas de resolver problemas, adoptando tecnologías emergentes y metodologías innovadoras.",
  },
  {
    icon: Users,
    title: "Colaboración",
    description:
      "Creo en el poder del trabajo en equipo y la comunicación efectiva para lograr resultados excepcionales.",
  },
  {
    icon: Zap,
    title: "Eficiencia",
    description:
      "Me enfoco en crear soluciones que no solo funcionen, sino que optimicen procesos y mejoren la productividad.",
  },
]

export function AboutValues() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <SectionReveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-center mb-12">
              Mis <GradientText>Valores</GradientText>
            </h2>
          </SectionReveal>

          <SectionReveal stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <SectionRevealItem key={value.title}>
                <TiltCard className="h-full">
                  <Card className="h-full border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/40 transition-colors duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 flex justify-center">
                        <div className="p-3 rounded-xl bg-primary/10">
                          <value.icon className="w-8 h-8 text-primary" />
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold mb-3">
                        <GradientText>{value.title}</GradientText>
                      </h3>

                      <p className="text-muted-foreground leading-relaxed text-sm">{value.description}</p>
                    </CardContent>
                  </Card>
                </TiltCard>
              </SectionRevealItem>
            ))}
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}

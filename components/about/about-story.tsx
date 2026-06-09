"use client"

import { Card, CardContent } from "@/components/ui/card"
import { GradientText } from "@/components/ui/gradient-text"
import { SectionReveal, SectionRevealItem } from "@/components/motion/section-reveal"

const story = [
  {
    title: "El Comienzo",
    description:
      "Mi pasión por la tecnología comenzó desde muy joven. Siempre me fascinó cómo las líneas de código podían transformarse en soluciones reales que impactan la vida de las personas.",
  },
  {
    title: "La Evolución",
    description:
      "A lo largo de los años evolucioné desde crear simples scripts hasta desarrollar aplicaciones complejas y sistemas de automatización que optimizan procesos empresariales.",
  },
  {
    title: "El Presente",
    description:
      "Hoy trabajo como desarrollador de software en una empresa en Bogotá, Colombia, junto a un equipo con el que construyo productos para clientes reales: DevOps, CI/CD, automatización e integración de agentes de inteligencia artificial forman parte de mi día a día.",
  },
  {
    title: "La Misión",
    description:
      "Mi objetivo es crear soluciones tecnológicas que no solo funcionen, sino que transformen la manera en que las personas y empresas interactúan con la tecnología, manteniéndome siempre a la vanguardia.",
  },
]

export function AboutStory() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <SectionReveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-center mb-12">
              Mi <GradientText>Historia</GradientText>
            </h2>
          </SectionReveal>

          <SectionReveal stagger className="grid sm:grid-cols-2 gap-6">
            {story.map((item) => (
              <SectionRevealItem key={item.title}>
                <Card className="h-full border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/40 transition-colors duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">
                      <GradientText>{item.title}</GradientText>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </SectionRevealItem>
            ))}
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}

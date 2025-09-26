"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export function AboutStory() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 neon-text">Mi Historia</h2>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-primary">El Comienzo</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Mi pasión por la tecnología comenzó desde muy joven. Siempre me fascinó cómo las líneas de código
                    podían transformarse en soluciones reales que impactan la vida de las personas.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-primary">La Evolución</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    A lo largo de los años, he evolucionado desde crear simples scripts hasta desarrollar aplicaciones
                    complejas y sistemas de automatización que optimizan procesos empresariales.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-primary">La Misión</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Mi objetivo es crear soluciones tecnológicas que no solo funcionen, sino que transformen la manera
                    en que las personas y empresas interactúan con la tecnología.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-primary">El Futuro</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Continúo explorando nuevas tecnologías y metodologías para mantenerme a la vanguardia y ofrecer
                    siempre las mejores soluciones a mis clientes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

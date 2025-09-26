"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Lightbulb, Users, Zap } from "lucide-react"

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 neon-text">Mis Valores</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/20 transition-neon hover:neon-glow group">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <value.icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-3 text-primary">{value.title}</h3>

                    <p className="text-muted-foreground leading-relaxed text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

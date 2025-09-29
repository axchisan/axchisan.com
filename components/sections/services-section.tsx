"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Smartphone, Zap, Code, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

const services = [
  {
    title: "Páginas Web",
    description: "Desarrollo de sitios web modernos y responsivos utilizando las últimas tecnologías web.",
    icon: Globe,
    features: ["Diseño Responsivo", "SEO Optimizado", "Carga Rápida", "Fácil Mantenimiento"],
    color: "text-blue-400",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Apps Multiplataforma",
    description: "Aplicaciones multiplataforma con Flutter.",
    icon: Smartphone,
    features: ["iOS, Android, Web, Windows, Linux, Mac", "UI/UX Moderno", "Rendimiento Óptimo", "Integración API"],
    color: "text-green-400",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    title: "Automatización",
    description: "Servicios de automatización para optimizar procesos de negocio.",
    icon: Zap,
    features: ["Workflows Personalizados", "Integración de APIs", "Ahorro de Tiempo", "Escalabilidad"],
    color: "text-yellow-400",
    gradient: "from-yellow-500/20 to-orange-500/20",
  },
  {
    title: "Software Personalizado",
    description: "Soluciones de software a medida para necesidades específicas de tu negocio.",
    icon: Code,
    features: ["Desarrollo a Medida", "Arquitectura Escalable", "Soporte Técnico", "Documentación"],
    color: "text-purple-400",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Mis <span className="text-primary">Servicios</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Soluciones tecnológicas completas para hacer crecer tu negocio
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 group h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-br ${service.gradient} ${service.color} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3 mb-6">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors bg-transparent"
                      asChild
                    >
                      <Link href="/contact">
                        Solicitar cotización
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">¿Tienes un proyecto en mente?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Conversemos sobre cómo puedo ayudarte a transformar tu idea en una solución digital exitosa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="transition-neon hover:neon-glow" asChild>
                  <Link href="/contact">Iniciar proyecto</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/services">Ver todos los servicios</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

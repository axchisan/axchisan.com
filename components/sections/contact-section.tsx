"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Phone, Mail, Instagram, Github } from "lucide-react"

const contactMethods = [
  {
    name: "WhatsApp",
    description: "Conversemos sobre tu proyecto",
    icon: MessageCircle,
    href: "https://wa.me/3183038190",
    color: "text-green-400",
    action: "Chatear",
  },
  {
    name: "Teléfono",
    description: "Llamada directa",
    icon: Phone,
    href: "tel:3183038190",
    color: "text-blue-400",
    action: "Llamar",
  },
  {
    name: "Email",
    description: "axchisan923@gmail.com",
    icon: Mail,
    href: "mailto:axchisan923@gmail.com",
    color: "text-purple-400",
    action: "Escribir",
  },
]

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/axchisan",
    icon: Instagram,
    color: "text-pink-400",
  },
  {
    name: "GitHub",
    href: "https://github.com/axchisan",
    icon: Github,
    color: "text-gray-400",
  },
]

export function ContactSection() {
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
            ¿Tienes un proyecto en <span className="text-primary">mente</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Estoy siempre abierto a nuevas oportunidades y colaboraciones. ¡Conversemos!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 ${method.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{method.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{method.description}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="transition-neon hover:neon-glow bg-transparent"
                      asChild
                    >
                      <a href={method.href} target="_blank" rel="noopener noreferrer">
                        {method.action}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-6">O sígueme en mis redes sociales</p>
          <div className="flex justify-center space-x-4">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="sm"
                  className={`transition-neon hover:neon-glow ${social.color}`}
                  asChild
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{social.name}</span>
                  </a>
                </Button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

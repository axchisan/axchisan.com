"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Phone, Mail, Instagram, Github, MapPin, Clock, Globe } from "lucide-react"

const contactMethods = [
  {
    name: "WhatsApp",
    description: "Respuesta inmediata",
    value: "+57 318 303 8190",
    href: "https://wa.me/3183038190?text=Hola%20Duvan,%20me%20interesa%20hablar%20sobre%20un%20proyecto",
    icon: MessageCircle,
    color: "text-green-400",
    primary: true,
  },
  {
    name: "Email",
    description: "Respuesta en 24h",
    value: "axchisan923@gmail.com",
    href: "mailto:axchisan923@gmail.com",
    icon: Mail,
    color: "text-blue-400",
    primary: true,
  },
  {
    name: "Teléfono",
    description: "Llamada directa",
    value: "+57 318 303 8190",
    href: "tel:+573183038190",
    icon: Phone,
    color: "text-purple-400",
    primary: false,
  },
]

const socialLinks = [
  {
    name: "Instagram",
    username: "@axchisan",
    href: "https://instagram.com/axchisan",
    icon: Instagram,
    color: "text-pink-400",
  },
  {
    name: "GitHub",
    username: "@axchisan",
    href: "https://github.com/axchisan",
    icon: Github,
    color: "text-gray-400",
  },
]

const additionalInfo = [
  {
    icon: MapPin,
    label: "Ubicación",
    value: "Colombia",
    color: "text-red-400",
  },
  {
    icon: Clock,
    label: "Horario",
    value: "Lun - Vie, 7AM - 5PM COT",
    color: "text-yellow-400",
  },
  {
    icon: Globe,
    label: "Idiomas",
    value: "Español, Inglés",
    color: "text-cyan-400",
  },
]

export function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Primary Contact Methods */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-6">Contacto Directo</h3>
          <div className="space-y-4">
            {contactMethods
              .filter((method) => method.primary)
              .map((method) => {
                const Icon = method.icon
                return (
                  <div
                    key={method.name}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg bg-primary/10 ${method.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{method.name}</h4>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                        <p className="text-sm font-mono">{method.value}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="transition-neon hover:neon-glow bg-transparent"
                      asChild
                    >
                      <a href={method.href} target="_blank" rel="noopener noreferrer">
                        Contactar
                      </a>
                    </Button>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>

      {/* Additional Contact Methods */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-6">Otras Formas de Contacto</h3>
          <div className="space-y-4">
            {contactMethods
              .filter((method) => !method.primary)
              .map((method) => {
                const Icon = method.icon
                return (
                  <div key={method.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-primary/10 ${method.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{method.name}</h4>
                        <p className="text-xs text-muted-foreground">{method.value}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={method.href} target="_blank" rel="noopener noreferrer">
                        <Icon className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-6">Redes Sociales</h3>
          <div className="space-y-4">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <div key={social.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-primary/10 ${social.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{social.name}</h4>
                      <p className="text-xs text-muted-foreground">{social.username}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={social.href} target="_blank" rel="noopener noreferrer">
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-6">Información Adicional</h3>
          <div className="space-y-4">
            {additionalInfo.map((info) => {
              const Icon = info.icon
              return (
                <div key={info.label} className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-primary/10 ${info.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{info.label}</h4>
                    <p className="text-xs text-muted-foreground">{info.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-6">Preguntas Frecuentes</h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">¿Cuánto tiempo toma un proyecto?</h4>
              <p className="text-muted-foreground">Depende de la complejidad, pero típicamente entre 2-8 semanas.</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">¿Trabajas con clientes internacionales?</h4>
              <p className="text-muted-foreground">Sí, trabajo con clientes de todo el mundo.</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">¿Ofreces soporte post-lanzamiento?</h4>
              <p className="text-muted-foreground">Sí, incluyo soporte y mantenimiento en todos mis proyectos.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

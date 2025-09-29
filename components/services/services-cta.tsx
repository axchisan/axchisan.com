"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Mail, Calendar } from "lucide-react"
import Link from "next/link"

export function ServicesCTA() {
  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
      <CardContent className="p-8 text-center space-y-6">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">¿Listo para comenzar tu proyecto?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Conversemos sobre tu idea y cómo puedo ayudarte a convertirla en realidad. Ofrezco consultas gratuitas para
            discutir tu proyecto sin compromiso.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <Button size="lg" className="transition-neon hover:neon-glow">
              <Mail className="h-5 w-5 mr-2" />
              Contactar por Email
            </Button>
          </Link>

          <Button
            size="lg"
            variant="outline"
            className="transition-neon hover:neon-glow bg-transparent"
            onClick={() => window.open("https://wa.me/573183038190", "_blank")}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            WhatsApp
          </Button>

          <Button
            size="lg"
            variant="secondary"
            className="transition-neon hover:neon-glow"
            onClick={() => window.open("https://calendly.com/axchisan923/30min", "_blank")}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Agendar Reunión
          </Button>
        </div>

        <div className="pt-4 border-t border-primary/20">
          <p className="text-sm text-muted-foreground">
            Respuesta garantizada en menos de 24 horas • Consulta inicial gratuita
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

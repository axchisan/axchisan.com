"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Mail, Calendar } from "lucide-react"
import Link from "next/link"
import { useProfile } from "@/hooks/use-profile"

export function ServicesCTA() {
  const { profile } = useProfile()
  const whatsapp = (profile?.whatsapp || "573183038190").replace(/\D/g, "")

  return (
    <Card className="relative overflow-hidden border-border/60 bg-card/40 backdrop-blur-sm">
      <div className="absolute inset-0 aurora-surface opacity-70" aria-hidden />
      <CardContent className="relative p-8 text-center space-y-6">
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">¿Listo para comenzar tu proyecto?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Conversemos sobre tu idea y cómo puedo ayudarte a convertirla en realidad. Ofrezco consultas gratuitas para
            discutir tu proyecto sin compromiso.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <Button size="lg" className="glow transition-shadow">
              <Mail className="h-5 w-5 mr-2" />
              Contactar por Email
            </Button>
          </Link>

          <Button
            size="lg"
            variant="outline"
            className="bg-transparent"
            onClick={() => window.open(`https://wa.me/${whatsapp}`, "_blank")}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            WhatsApp
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={() => window.open("https://calendly.com/axchisan923/30min", "_blank")}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Agendar Reunión
          </Button>
        </div>

        <div className="pt-4 border-t border-border/60">
          <p className="text-sm text-muted-foreground">
            Respuesta garantizada en menos de 24 horas • Consulta inicial gratuita
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown, MessageCircle, Github, Instagram } from "lucide-react"
import Link from "next/link"
import { useProfile } from "@/hooks/use-profile"
import { GradientText } from "@/components/ui/gradient-text"
import { useReducedMotion, getTransition } from "@/hooks/use-reduced-motion"

export function HeroSection() {
  const { profile } = useProfile()
  const reduced = useReducedMotion()

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
  }

  const displayName = profile?.name || "Duvan Yair Arciniegas"
  const displayTitle = profile?.title || "Innovación y Creatividad en Desarrollo de Software"
  const displayBio =
    profile?.bio ||
    "Creo soluciones tecnológicas que transforman ideas en realidad digital. Especializado en desarrollo web, móvil y automatización de procesos."

  const words = displayTitle.split(" ")
  const titleLead = words.slice(0, 2).join(" ")
  const titleRest = words.slice(2).join(" ")

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: getTransition(reduced, 0.7, delay),
  })

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 overflow-hidden">
      {/* Brillo aurora propio del hero */}
      <div className="absolute inset-0 -z-[1] aurora-surface" aria-hidden />

      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div {...fade(0)} className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            ¡Hola! Soy {displayName}
          </span>
        </motion.div>

        {/* Título */}
        <motion.h1
          {...fade(0.1)}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-balance"
        >
          <span className="text-foreground">{titleLead}</span>
          <br />
          <GradientText>{titleRest}</GradientText>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          {...fade(0.2)}
          className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty"
        >
          {displayBio}
        </motion.p>

        {/* CTAs */}
        <motion.div {...fade(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="glow transition-shadow" asChild>
            <Link href="/contact">
              <MessageCircle className="mr-2 h-5 w-5" />
              Conversemos sobre tu proyecto
            </Link>
          </Button>

          <Button variant="outline" size="lg" className="bg-transparent backdrop-blur-sm" asChild>
            <Link href="/projects">Ver mis proyectos</Link>
          </Button>
        </motion.div>

        {/* Redes */}
        <motion.div {...fade(0.4)} className="flex justify-center space-x-4 mb-12">
          {profile?.github && (
            <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors" asChild>
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          )}
          {profile?.instagram && (
            <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors" asChild>
              <a href={profile.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </Button>
          )}
          {profile?.whatsapp && (
            <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors" asChild>
              <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                <span className="sr-only">WhatsApp</span>
              </a>
            </Button>
          )}
        </motion.div>

        {/* Indicador de scroll */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={getTransition(reduced, 0.6, 0.5)}
          onClick={scrollToAbout}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full glass text-primary hover:bg-primary/10 transition-colors animate-bounce"
        >
          <ArrowDown className="h-4 w-4" />
          <span className="sr-only">Ir a la sección sobre mí</span>
        </motion.button>
      </div>
    </section>
  )
}

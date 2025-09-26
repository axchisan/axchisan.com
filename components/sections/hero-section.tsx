"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown, MessageCircle, Github, Instagram } from "lucide-react"
import Link from "next/link"
import { useProfile } from "@/hooks/use-profile"

export function HeroSection() {
  const { profile, loading } = useProfile()

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
  }

  // Show loading state or fallback data
  const displayName = profile?.name || "Duvan Yair Arciniegas"
  const displayTitle = profile?.title || "Innovación y Creatividad en Desarrollo de Software"
  const displayBio =
    profile?.bio ||
    "Creo soluciones tecnológicas que transforman ideas en realidad digital. Especializado en desarrollo web, móvil y automatización de procesos."

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            ¡Hola! Soy {displayName}
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 text-balance"
        >
          <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            {displayTitle.split(" ").slice(0, 2).join(" ")}
          </span>
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent neon-text">
            {displayTitle.split(" ").slice(2).join(" ")}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty"
        >
          {displayBio}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Button size="lg" className="transition-neon hover:neon-glow" asChild>
            <Link href="/contact">
              <MessageCircle className="mr-2 h-5 w-5" />
              Conversemos sobre tu proyecto
            </Link>
          </Button>

          <Button variant="outline" size="lg" className="transition-neon hover:neon-glow bg-transparent" asChild>
            <Link href="/projects">Ver mis proyectos</Link>
          </Button>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center space-x-6 mb-12"
        >
          {profile?.github && (
            <Button variant="ghost" size="sm" className="transition-neon hover:neon-glow" asChild>
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          )}
          {profile?.instagram && (
            <Button variant="ghost" size="sm" className="transition-neon hover:neon-glow" asChild>
              <a href={profile.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </Button>
          )}
          {profile?.whatsapp && (
            <Button variant="ghost" size="sm" className="transition-neon hover:neon-glow" asChild>
              <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                <span className="sr-only">WhatsApp</span>
              </a>
            </Button>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          onClick={scrollToAbout}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-300 animate-bounce"
        >
          <ArrowDown className="h-4 w-4" />
          <span className="sr-only">Scroll to about section</span>
        </motion.button>
      </div>
    </section>
  )
}

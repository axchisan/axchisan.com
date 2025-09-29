"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Github, Instagram, Phone, MessageCircle, Mail, Heart, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/axchisan",
    icon: Github,
    color: "hover:text-gray-400",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/axchisan",
    icon: Instagram,
    color: "hover:text-pink-400",
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/3183038190",
    icon: MessageCircle,
    color: "hover:text-green-400",
  },
  {
    name: "Teléfono",
    href: "tel:3183038190",
    icon: Phone,
    color: "hover:text-blue-400",
  },
]

const quickLinks = [
  { name: "Inicio", href: "/" },
  { name: "Sobre Mí", href: "/about" },
  { name: "Servicios", href: "/services" },
  { name: "Proyectos", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Contacto", href: "/contact" },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 group mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center transition-neon group-hover:neon-glow">
                <span className="text-primary-foreground font-mono font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Axchi
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md mb-6">
              Desarrollador de software apasionado por crear soluciones tecnológicas innovadoras. Especializado en
              desarrollo web, móvil y automatización de procesos.
            </p>

            {/* Contact info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>axchisan923@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+57 318 303 8190</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Sígueme</h3>
            <div className="flex flex-col space-y-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.div
                    key={social.name}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className={`justify-start h-auto p-2 ${social.color} transition-neon hover:neon-glow`}
                    >
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{social.name}</span>
                        <ExternalLink className="h-3 w-3 opacity-50" />
                      </a>
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border/50 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>© {currentYear} Axchi. Hecho con</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>en Colombia</span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacidad
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Términos
              </Link>
              <span className="text-xs">axchi</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

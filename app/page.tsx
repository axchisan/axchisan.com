import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuroraBackground } from "@/components/aurora-background"

export const metadata: Metadata = {
  title: "Portafolio de Duvan Yair Arciniegas (Axchi) | Desarrollador de Software",
  description:
    "Desarrollador de software que transforma ideas en soluciones digitales: desarrollo web, aplicaciones multiplataforma y automatización de procesos.",
  alternates: { canonical: "/" },
}
import { HeroSection } from "@/components/sections/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { SkillsSection } from "@/components/sections/skills-section"
import { ServicesSection } from "@/components/sections/services-section"
import { ProjectsPreview } from "@/components/sections/projects-preview"
import { ContactSection } from "@/components/sections/contact-section"

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <Header />

      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ServicesSection />
        <ProjectsPreview />
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackgroundEffects } from "@/components/background-effects"
import { HeroSection } from "@/components/sections/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { SkillsSection } from "@/components/sections/skills-section"
import { ServicesSection } from "@/components/sections/services-section"
import { ProjectsPreview } from "@/components/sections/projects-preview"
import { ContactSection } from "@/components/sections/contact-section"

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <BackgroundEffects />
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

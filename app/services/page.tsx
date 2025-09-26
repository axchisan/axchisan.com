import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackgroundEffects } from "@/components/background-effects"
import { PageTransition } from "@/components/page-transition"
import { ServicesHero } from "@/components/services/services-hero"
import { ServicesGrid } from "@/components/services/services-grid"
import { ServicesProcess } from "@/components/services/services-process"
import { ServicesCTA } from "@/components/services/services-cta"

export const metadata = {
  title: "Servicios - Axchi",
  description:
    "Servicios de desarrollo de software: páginas web, aplicaciones móviles, automatización y software personalizado.",
}

export default function ServicesPage() {
  return (
    <div className="relative min-h-screen">
      <BackgroundEffects />
      <Header />

      <PageTransition>
        <main className="relative z-10 pt-16">
          <ServicesHero />
          <ServicesGrid />
          <ServicesProcess />
          <ServicesCTA />
        </main>
      </PageTransition>

      <Footer />
    </div>
  )
}

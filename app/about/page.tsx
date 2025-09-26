import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackgroundEffects } from "@/components/background-effects"
import { PageTransition } from "@/components/page-transition"
import { AboutHero } from "@/components/about/about-hero"
import { AboutStory } from "@/components/about/about-story"
import { AboutTimeline } from "@/components/about/about-timeline"
import { AboutValues } from "@/components/about/about-values"

export const metadata = {
  title: "Sobre Mí - Axchi",
  description:
    "Conoce más sobre Duvan Yair Arciniegas (Axchi), desarrollador de software apasionado por la innovación y la creatividad.",
}

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      <BackgroundEffects />
      <Header />

      <PageTransition>
        <main className="relative z-10 pt-16">
          <AboutHero />
          <AboutStory />
          <AboutTimeline />
          <AboutValues />
        </main>
      </PageTransition>

      <Footer />
    </div>
  )
}

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackgroundEffects } from "@/components/background-effects"
import { PageTransition } from "@/components/page-transition"
import { ProjectsHero } from "@/components/projects/projects-hero"
import { ProjectsGrid } from "@/components/projects/projects-grid"
import { ProjectsFilters } from "@/components/projects/projects-filters"

export const metadata = {
  title: "Proyectos - Axchi",
  description: "Explora mi portafolio de proyectos de desarrollo de software, aplicaciones web y móviles.",
}

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen">
      <BackgroundEffects />
      <Header />

      <PageTransition>
        <main className="relative z-10 pt-16">
          <ProjectsHero />
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <ProjectsFilters />
              <ProjectsGrid />
            </div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  )
}

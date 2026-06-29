import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { HeroInteractive } from "@/components/home/hero-interactive"
import { ServicesSection } from "@/components/home/services-section"
import { WorkSection } from "@/components/home/work-section"
import { InsightsSection } from "@/components/home/insights-section"
import { CtaSection } from "@/components/home/cta-section"
import { getServices, getProjects, getBlogPosts, getSiteMetrics } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [metrics, services, projects, blog] = await Promise.all([
    getSiteMetrics(),
    getServices(),
    getProjects(),
    getBlogPosts(),
  ])

  const stats = [
    { n: String(metrics.projectsCount).padStart(2, "0"), label: "en producción" },
    { n: String(metrics.clientsCount).padStart(2, "0"), label: "clientes" },
    { n: `${metrics.yearsExperience}+`, label: "años" },
    { n: `${metrics.technologiesCount}+`, label: "tecnologías" },
  ]

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <HeroInteractive stats={stats} />
        <ServicesSection services={services} />
        <WorkSection projects={projects.slice(0, 3)} />
        <InsightsSection posts={blog.posts.slice(0, 4)} />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}

import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { PageHero } from "@/components/site/page-hero"
import { ProjectCard } from "@/components/work/project-card"
import { Reveal } from "@/components/ui/reveal"
import { getProjects } from "@/lib/data"

export const metadata: Metadata = {
  title: "Trabajo",
  description:
    "Casos y productos que hemos diseñado y construido: web, multiplataforma, automatización e IA para clientes reales.",
  alternates: { canonical: "/trabajo" },
}

export const dynamic = "force-dynamic"

export default async function TrabajoPage() {
  const projects = await getProjects()

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <PageHero
          kicker="Trabajo · Casos en producción"
          title="Cosas que hemos construido"
          description="Productos reales, en producción, para clientes reales. Cada uno resolvió un problema concreto con la tecnología adecuada."
        />

        <section className="px-7 py-14">
          <div className="mx-auto max-w-6xl">
            {projects.length === 0 ? (
              <p className="text-muted">Pronto compartiremos casos aquí.</p>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 0.06}>
                    <ProjectCard project={p} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

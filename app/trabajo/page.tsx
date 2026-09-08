import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { ProjectRow } from "@/components/work/project-row"
import { getProjects } from "@/lib/data"

export const metadata: Metadata = {
  title: "Trabajo",
  description:
    "Sistemas que he construido de punta a punta: automatización de contenido, aplicaciones multiplataforma sobre infraestructura serverless, juegos y sistemas institucionales.",
  alternates: { canonical: "/trabajo" },
}

export const dynamic = "force-dynamic"

export default async function TrabajoPage() {
  const projects = await getProjects()

  return (
    <>
      <Header />

      <main id="contenido" className="mx-auto max-w-5xl px-5 sm:px-8">
        <header className="enter py-14 sm:py-16">
          <h1>Trabajo</h1>
          <p className="measure mt-4 text-[1.0625rem] leading-relaxed text-graphite">
            Cada uno de estos sistemas lo llevé del modelo de datos al despliegue. Las cifras que
            aparecen salen del proyecto: si no puedo sostener un número, no lo escribo.
          </p>
        </header>

        <section className="border-t border-line pt-10">
          {projects.length === 0 ? (
            <p className="text-graphite">Todavía no hay proyectos publicados.</p>
          ) : (
            projects.map((p) => <ProjectRow key={p.id} project={p} />)
          )}
        </section>
      </main>

      <Footer />
    </>
  )
}

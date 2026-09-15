import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Band, Body, PageBand } from "@/components/site/band"
import { ProjectRow } from "@/components/work/project-row"
import { Button } from "@/components/ui/button"
import { getProjects } from "@/lib/data"

export const metadata: Metadata = {
  title: "Trabajo",
  description:
    "Sistemas que he construido de punta a punta: automatización de contenido, aplicaciones multiplataforma sobre infraestructura serverless, plataformas institucionales y trabajo para clientes.",
  alternates: { canonical: "/trabajo" },
}

export const dynamic = "force-dynamic"

export default async function TrabajoPage() {
  const projects = await getProjects()

  return (
    <>
      <Header />

      <main id="contenido">
        <PageBand
          titulo="Trabajo que se puede abrir y revisar"
          entradilla="Cada uno de estos sistemas lo llevé del modelo de datos al despliegue. Las cifras salen del proyecto: si no puedo sostener un número, no lo escribo."
        />

        <Body>
          {projects.length === 0 ? (
            <p className="text-mid">Todavía no hay proyectos publicados.</p>
          ) : (
            <div className="rounded-[16px] border border-line bg-card px-6 py-2 shadow-card sm:px-8">
              {projects.map((p) => (
                <ProjectRow key={p.id} project={p} />
              ))}
            </div>
          )}

          <p className="mt-8 text-[0.9375rem] text-mid">
            El código de la mayoría está publicado en{" "}
            <Link href="https://github.com/axchisan" className="link" target="_blank" rel="noreferrer noopener">
              GitHub
            </Link>
            .
          </p>
        </Body>

        <Band>
          <div className="py-20 text-center sm:py-24">
            <h2 className="mx-auto max-w-[24ch] text-[1.9375rem] sm:text-[2.4375rem]">
              ¿Algo de esto se parece a lo que necesitas?
            </h2>
            <p className="mx-auto mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-on-band-mid">
              Cuéntame el problema y te digo cómo lo abordaría, cuánto costaría y cuánto tardaría.
            </p>
            <div className="mt-9 flex justify-center">
              <Button href="/contacto#agendar" size="lg">Hablemos de tu proyecto</Button>
            </div>
          </div>
        </Band>
      </main>

      <Footer />
    </>
  )
}

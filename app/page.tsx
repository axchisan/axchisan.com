import Link from "next/link"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Band, Body, SectionHead } from "@/components/site/band"
import { ServiceCard } from "@/components/site/service-card"
import { ProjectRow } from "@/components/work/project-row"
import { Button } from "@/components/ui/button"
import { getBlogPosts, getProjects } from "@/lib/data"
import { PROCESO, SERVICIOS } from "@/lib/servicios"

export const dynamic = "force-dynamic"

export default async function Home() {
  const [projects, blog] = await Promise.all([getProjects(), getBlogPosts()])

  const destacados = projects.filter((p) => p.featured).slice(0, 3)
  const mostrados = destacados.length > 0 ? destacados : projects.slice(0, 3)
  const articulos = blog.posts.slice(0, 2)

  return (
    <>
      <Header />

      <main id="contenido">
        {/* Banda de apertura. El titular dice qué se hace y para quién, sin
            recurrir a colorear una palabra suelta para dar énfasis. */}
        <Band>
          <div className="enter grid gap-12 py-20 sm:py-24 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
            <div>
              <h1 className="max-w-[19ch] text-[2.4375rem] leading-[1.06] sm:text-[3.0625rem] lg:text-[3.5rem]">
                Soluciones de software listas para operar.
              </h1>
              <p className="mt-6 max-w-[54ch] text-[1.125rem] leading-relaxed text-on-band-mid">
                Axchi diseña e implementa aplicaciones, integraciones y
                automatizaciones para operaciones y productos digitales, con criterios de operación,
                costo y mantenimiento desde el inicio.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button href="/contacto#agendar" size="lg">
                Iniciar conversación
                </Button>
                <Button href="/trabajo" variant="outline-band" size="lg">
                  Ver casos de estudio
                </Button>
              </div>

              <p className="mt-8 text-[0.9375rem] text-on-band-mid">
                Bogotá, Colombia. Trabajo también en remoto.
              </p>
            </div>

            {/* Tres hechos verificables. Cada uno enlaza a donde se comprueba:
                una cifra que no se puede abrir no vale nada. */}
            <ul className="grid gap-px overflow-hidden rounded-[16px] bg-band-line sm:grid-cols-3 lg:grid-cols-1">
              {[
                {
                  dato: "0,01 USD",
                  unidad: "al mes de operación",
                  detalle: "Aplicación con API, base de datos y tres clientes.",
                  href: "/trabajo/calculadora-de-gastos",
                },
                {
                  dato: "1 paso",
                  unidad: "manual en todo el proceso",
                  detalle: "Flujo de contenido con revisión humana antes de publicar.",
                  href: "/trabajo/tecnobichos",
                },
                {
                  dato: "10 sistemas",
                  unidad: "documentados para revisión",
                  detalle: "Casos de estudio con arquitectura, alcance y tecnologías.",
                  href: "/trabajo",
                },
              ].map((m) => (
                <li key={m.dato}>
                  <Link href={m.href} className="block bg-band-2 p-6 transition-colors hover:bg-[#182029]">
                    <span className="block text-[1.75rem] font-semibold tracking-[-0.03em] text-accent">
                      {m.dato}
                    </span>
                    <span className="mt-0.5 block text-[0.9375rem] text-on-band">{m.unidad}</span>
                    <span className="mt-1 block text-[0.875rem] leading-snug text-on-band-mid">
                      {m.detalle}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Band>

        <Body>
          <SectionHead
            titulo="Áreas de trabajo"
            entradilla="Capacidades técnicas aplicadas de punta a punta: desde el modelo de datos y las integraciones hasta el despliegue, las pruebas y la operación."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {SERVICIOS.map((s) => (
              <ServiceCard key={s.id} servicio={s} />
            ))}
          </div>
        </Body>

        {mostrados.length > 0 && (
          <div className="bg-card">
            <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
              <SectionHead
                titulo="Trabajo"
                entradilla="Casos de estudio de sistemas implementados: contexto, decisiones técnicas y tecnologías utilizadas."
                accion={
                  <Link href="/trabajo" className="link text-[0.9375rem] font-medium">
                    Ver todos los proyectos
                  </Link>
                }
              />
              <div>
                {mostrados.map((p) => (
                  <ProjectRow key={p.id} project={p} />
                ))}
              </div>
            </div>
          </div>
        )}

        <Body>
          <SectionHead
            titulo="Cómo trabajo"
            entradilla="Un proceso definido para acordar alcance, validar avances y entregar un sistema que pueda operar y mantenerse."
          />
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PROCESO.map((etapa, i) => (
              <li
                key={etapa.titulo}
                className="rounded-[16px] border border-line bg-card p-6 shadow-card"
              >
                {/* Aquí la numeración sí informa: es una secuencia con orden. */}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-weak text-[0.9375rem] font-semibold text-accent-ink">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-[1.0625rem] font-semibold text-ink">{etapa.titulo}</h3>
                <p className="mt-1 text-[0.875rem] text-accent-ink">{etapa.duracion}</p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-mid">{etapa.detalle}</p>
              </li>
            ))}
          </ol>
        </Body>

        {articulos.length > 0 && (
          <div className="bg-card">
            <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
              <SectionHead
            titulo="Publicaciones técnicas"
            entradilla="Decisiones de ingeniería documentadas a partir de sistemas concretos."
                accion={
                  <Link href="/blog" className="link text-[0.9375rem] font-medium">
                    Todos los artículos
                  </Link>
                }
              />
              <ul className="grid gap-6 md:grid-cols-2">
                {articulos.map((post) => (
                  <li
                    key={post.id}
                    className="rounded-[16px] border border-line bg-paper p-6 transition-colors hover:border-line-firm"
                  >
                    <h3 className="text-[1.1875rem] font-semibold tracking-[-0.015em] text-ink">
                      <Link href={`/blog/${post.slug}`} className="hover:text-accent-ink">
                        {post.title}
                      </Link>
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-mid">{post.excerpt}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <Band>
          <div className="py-20 text-center sm:py-24">
            <h2 className="mx-auto max-w-[20ch] text-[1.9375rem] sm:text-[2.4375rem]">
              ¿Buscas apoyo para un proyecto de software?
            </h2>
            <p className="mx-auto mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-on-band-mid">
              Comparte el contexto, los objetivos y las restricciones. Evaluaré el alcance y te
              responderé con una propuesta técnica clara.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button href="/contacto#agendar" size="lg">
                Contactar
              </Button>
              <Button href="/proceso" variant="outline-band" size="lg">
                Conocer el proceso
              </Button>
            </div>
          </div>
        </Band>
      </main>

      <Footer />
    </>
  )
}

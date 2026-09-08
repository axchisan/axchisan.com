import Link from "next/link"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { ProjectRow } from "@/components/work/project-row"
import { Button } from "@/components/ui/button"
import { getBlogPosts, getProjects } from "@/lib/data"
import { PROFILE } from "@/lib/site"

export const dynamic = "force-dynamic"

export default async function Home() {
  const [projects, blog] = await Promise.all([getProjects(), getBlogPosts()])

  const destacados = projects.filter((p) => p.featured).slice(0, 4)
  const mostrados = destacados.length > 0 ? destacados : projects.slice(0, 4)
  const articulos = blog.posts.slice(0, 3)

  return (
    <>
      <Header />

      <main id="contenido" className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* Identidad, no hero. Quien lee tiene treinta segundos: se le dice
            quién es, qué construye y se pasa al trabajo. */}
        <section className="enter py-16 sm:py-20">
          <h1 className="max-w-[18ch] text-[2.4375rem] leading-[1.08] sm:text-[3.0625rem]">
            {PROFILE.name}
          </h1>
          <p className="mt-3 text-[1.25rem] text-graphite">
            {PROFILE.role} en {PROFILE.location}
          </p>

          <p className="measure mt-8 text-[1.0625rem] leading-relaxed">
            Construyo sistemas completos, no piezas sueltas: un canal de contenido que se produce y
            publica sin intervención, una aplicación de finanzas en tres plataformas que opera por un
            centavo al mes, un juego con servidor multijugador autoritativo. Trabajo indistintamente
            en Flutter, Spring Boot, Next.js y Python, y escribo la decisión de arquitectura antes que
            el código.
          </p>

          <p className="measure mt-4 text-[1.0625rem] leading-relaxed text-graphite">
            Vengo de un año en una empresa de software en Bogotá haciendo DevOps, pipelines de CI/CD e
            integración de agentes de IA sobre proyectos con clientes reales.{" "}
            <strong className="font-medium text-ink">Busco equipo.</strong>
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/contacto">Escríbeme</Button>
            <Button href="/trabajo" variant="outline">
              Ver el trabajo
            </Button>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer noopener"
              className="link text-[0.9375rem]"
            >
              GitHub
            </a>
          </div>
        </section>

        {mostrados.length > 0 && (
          <section className="border-t border-line pt-12">
            <div className="mb-8 flex items-baseline justify-between gap-4">
              <h2>Trabajo</h2>
              <Link href="/trabajo" className="link text-[0.9375rem]">
                Todos los proyectos
              </Link>
            </div>

            <div>
              {mostrados.map((p) => (
                <ProjectRow key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}

        {/* La sección solo existe si hay algo publicado. Una sección vacía deja
            un hueco en la página y hace que el sitio parezca roto. */}
        {articulos.length > 0 && (
          <section className="mt-14 border-t border-line pt-11">
            <div className="mb-8 flex items-baseline justify-between gap-4">
              <h2>Escritos</h2>
              <Link href="/blog" className="link text-[0.9375rem]">
                Todos los artículos
              </Link>
            </div>

            <ul>
              {articulos.map((post) => (
                <li key={post.id} className="border-t border-line py-6 first:border-t-0 first:pt-0">
                  <h3 className="text-[1.1875rem] font-semibold tracking-[-0.015em]">
                    <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-accent">
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt && (
                    <p className="measure mt-1.5 text-[1rem] text-graphite">{post.excerpt}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-14 border-t border-line pt-11">
          <h2>Hablemos</h2>
          <p className="measure mt-3 text-[1.0625rem] text-graphite">
            Si buscas a alguien que se haga cargo de un sistema de punta a punta —del modelo de datos
            al despliegue— escríbeme y lo conversamos.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button href="/contacto">Escríbeme</Button>
            <a href={`mailto:${PROFILE.email}`} className="link text-[0.9375rem]">
              {PROFILE.email}
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

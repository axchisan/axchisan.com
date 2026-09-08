import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"
import { getProfile, getSkills } from "@/lib/data"
import { PROFILE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Sobre mí",
  description:
    "Duvan Yair Arciniegas, desarrollador de software en Bogotá. Tecnólogo en Análisis y Desarrollo de Software, con experiencia en DevOps, CI/CD e integración de agentes de IA.",
  alternates: { canonical: "/sobre" },
}

export const dynamic = "force-dynamic"

/** Recorrido profesional. Fechas explícitas: un portafolio sin fechas no dice nada. */
const TRAYECTORIA = [
  {
    periodo: "2026",
    titulo: "Desarrollador de software · Bogotá",
    detalle:
      "Un año en una empresa de desarrollo trabajando sobre proyectos con clientes reales: prácticas de DevOps, pipelines de CI/CD, automatización de procesos e integración de agentes de IA en el flujo de trabajo del equipo.",
  },
  {
    periodo: "2025 — 2026",
    titulo: "Tecnólogo en Análisis y Desarrollo de Software · SENA",
    detalle:
      "Formación técnica y etapa productiva. De ahí salieron los primeros sistemas que terminaron en manos de otras personas, como el control de inventario de los ambientes de formación.",
  },
  {
    periodo: "En paralelo",
    titulo: "Proyectos propios",
    detalle:
      "Es donde aprendo lo que no enseña un curso: qué cuesta operar una arquitectura, cuándo un servidor sobra y por qué conviene escribir la decisión antes que el código.",
  },
]

export default async function SobrePage() {
  const [profile, skills] = await Promise.all([getProfile(), getSkills()])

  const porCategoria = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    ;(acc[s.category] ??= []).push(s)
    return acc
  }, {})

  return (
    <>
      <Header />

      <main id="contenido" className="mx-auto max-w-5xl px-5 sm:px-8">
        <header className="enter py-14 sm:py-16">
          <h1>Sobre mí</h1>
          <p className="measure mt-5 text-[1.0625rem] leading-relaxed">
            {profile?.bio?.trim() ||
              "Desarrollador de software en Bogotá. Me interesa el punto donde una decisión técnica se convierte en una consecuencia medible: cuánto cuesta operar un sistema, cuánto tarda en arrancar, qué pasa cuando falla a mitad."}
          </p>
        </header>

        <section className="border-t border-line pt-12">
          <h2>Recorrido</h2>
          <ol className="mt-8">
            {TRAYECTORIA.map((t) => (
              <li
                key={t.titulo}
                className="grid gap-1 border-t border-line py-6 first:border-t-0 first:pt-0 sm:grid-cols-[10rem_1fr] sm:gap-8"
              >
                <p className="text-[0.9375rem] text-faint">{t.periodo}</p>
                <div>
                  <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em]">{t.titulo}</h3>
                  <p className="measure mt-1.5 text-[1rem] leading-relaxed text-graphite">{t.detalle}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {Object.keys(porCategoria).length > 0 && (
          <section className="mt-14 border-t border-line pt-11">
            <h2>Herramientas</h2>
            <p className="measure mt-3 text-[1.0625rem] text-graphite">
              Lo que he usado en proyectos que terminaron funcionando, agrupado por dónde encaja.
            </p>

            <dl className="mt-8">
              {Object.entries(porCategoria).map(([categoria, lista]) => (
                <div
                  key={categoria}
                  className="grid gap-2 border-t border-line py-5 first:border-t-0 first:pt-0 sm:grid-cols-[10rem_1fr] sm:gap-8"
                >
                  <dt className="text-[0.9375rem] text-faint">{categoria}</dt>
                  <dd className="flex flex-wrap gap-2">
                    {lista.map((s) => (
                      <span
                        key={s.id}
                        className="rounded-[5px] border border-line bg-raised px-2 py-0.5 text-[0.875rem] text-graphite"
                      >
                        {s.name}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="mt-14 border-t border-line pt-11">
          <h2>Dónde encontrarme</h2>
          <p className="measure mt-3 text-[1.0625rem] text-graphite">
            El código está en GitHub y la trayectoria en LinkedIn. Para lo demás, el correo.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button href="/contacto">Escríbeme</Button>
            <a href={PROFILE.github} target="_blank" rel="noreferrer noopener" className="link text-[0.9375rem]">
              GitHub
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer noopener" className="link text-[0.9375rem]">
              LinkedIn
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

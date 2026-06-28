import type { Metadata } from "next"
import { Check } from "lucide-react"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { PageHero } from "@/components/site/page-hero"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/ui/reveal"
import { getServices } from "@/lib/data"

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Desarrollo web, aplicaciones multiplataforma, automatización con IA y software a medida. Lo que el studio puede construir para tu negocio.",
}

export const dynamic = "force-dynamic"

const PROCESS = [
  { k: "01", t: "Entendemos", d: "Escuchamos el problema real y definimos el alcance con claridad." },
  { k: "02", t: "Diseñamos", d: "Proponemos la arquitectura y la experiencia antes de escribir código." },
  { k: "03", t: "Construimos", d: "Iteramos en entregas funcionales, con calidad y comunicación constante." },
  { k: "04", t: "Lanzamos", d: "Desplegamos, medimos y damos soporte. El producto sigue vivo." },
]

export default async function ServiciosPage() {
  const services = await getServices()

  return (
    <>
      <Header />
      <main>
        <PageHero
          kicker="Servicios · Qué construimos"
          title="Software a la medida de tu problema"
          description="No vendemos features sueltas: entregamos productos que resuelven algo concreto para tu negocio, bien construidos y mantenibles."
        />

        <section className="px-7 py-14">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={(i % 2) * 0.06}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-7">
                  <span className="font-mono text-[11px] tracking-[0.1em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.01em]">{s.title}</h2>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{s.description}</p>
                  {s.features?.length > 0 && (
                    <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-text">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.price && <p className="mt-5 font-mono text-sm text-muted">Desde {s.price}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="px-7 py-14">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2 className="mb-9 border-b border-border pb-4 font-display text-[clamp(26px,3.4vw,38px)] font-semibold tracking-[-0.02em]">
                Cómo trabajamos
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((p, i) => (
                <Reveal key={p.k} delay={i * 0.06}>
                  <div className="rounded-2xl border border-border bg-surface p-6">
                    <span className="font-display text-3xl font-semibold text-accent">{p.k}</span>
                    <h3 className="mt-3 font-display text-lg font-semibold">{p.t}</h3>
                    <p className="mt-1.5 text-sm text-muted">{p.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="px-7 pb-20 pt-6">
          <div className="mx-auto max-w-6xl rounded-3xl border border-border bg-surface px-8 py-14 text-center">
            <h2 className="font-display text-[clamp(24px,3.6vw,38px)] font-bold tracking-[-0.02em]">
              ¿Empezamos tu proyecto?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted">
              Cuéntanos qué necesitas y te decimos cómo lo abordaríamos, sin compromiso.
            </p>
            <div className="mt-7 flex justify-center">
              <Button href="/contacto" size="lg">Hablemos →</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

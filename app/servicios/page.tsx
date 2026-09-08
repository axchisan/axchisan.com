import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"
import { getServices } from "@/lib/data"

export const metadata: Metadata = {
  title: "Qué hago",
  description:
    "Tipos de sistema que puedo tomar de punta a punta: aplicaciones web y multiplataforma, automatización de procesos e infraestructura serverless.",
  alternates: { canonical: "/servicios" },
}

export const dynamic = "force-dynamic"

export default async function QueHagoPage() {
  const services = await getServices()

  return (
    <>
      <Header />

      <main id="contenido" className="mx-auto max-w-5xl px-5 sm:px-8">
        <header className="enter py-14 sm:py-16">
          <h1>Qué hago</h1>
          <p className="measure mt-4 text-[1.0625rem] leading-relaxed text-graphite">
            Los tipos de sistema que puedo tomar completos: del modelo de datos al despliegue, la
            monitorización y la factura mensual.
          </p>
        </header>

        <section className="border-t border-line pt-10">
          {services.length === 0 ? (
            <p className="text-graphite">Nada publicado todavía.</p>
          ) : (
            <ul>
              {services.map((s) => (
                <li key={s.id} className="border-t border-line py-8 first:border-t-0 first:pt-0">
                  <h2 className="text-[1.375rem] font-semibold tracking-[-0.02em]">{s.title}</h2>
                  <p className="measure mt-2 text-[1.0625rem] leading-relaxed text-graphite">
                    {s.description}
                  </p>
                  {s.features.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {s.features.map((f) => (
                        <li
                          key={f}
                          className="rounded-[5px] border border-line bg-raised px-2 py-0.5 text-[0.875rem] text-graphite"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-20 border-t border-line pt-12">
          <h2>¿Encaja con lo que buscas?</h2>
          <p className="measure mt-3 text-[1.0625rem] text-graphite">
            Cuéntame qué necesitas resolver y te digo con franqueza si soy la persona indicada.
          </p>
          <div className="mt-6">
            <Button href="/contacto">Escríbeme</Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

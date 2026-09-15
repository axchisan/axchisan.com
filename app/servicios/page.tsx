import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Band, Body, PageBand } from "@/components/site/band"
import { ServiceCard } from "@/components/site/service-card"
import { Button } from "@/components/ui/button"
import { SERVICIOS } from "@/lib/servicios"

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Desarrollo de aplicaciones web y multiplataforma, automatización con IA e infraestructura serverless para empresas. Alcance y precio cerrados antes de empezar.",
  alternates: { canonical: "/servicios" },
}

export default function ServiciosPage() {
  return (
    <>
      <Header />

      <main id="contenido">
        <PageBand
          titulo="Qué puedo construirte"
          entradilla="Cuatro tipos de encargo que tomo completos: del modelo de datos al despliegue, la monitorización y la factura mensual. Cada uno con un proyecto real que lo demuestra."
        />

        <Body>
          <div className="grid gap-6 md:grid-cols-2">
            {SERVICIOS.map((s) => (
              <ServiceCard key={s.id} servicio={s} />
            ))}
          </div>
        </Body>

        <div className="bg-card">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
            <h2 className="text-[1.9375rem] text-ink">Lo que no hago</h2>
            <p className="mt-3 max-w-[58ch] text-[1.0625rem] leading-relaxed text-mid">
              Decirlo por adelantado ahorra una reunión a los dos.
            </p>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  t: "Tiendas sobre Shopify o WordPress",
                  d: "Si lo que necesitas es una tienda estándar, esas plataformas lo resuelven mejor y más barato de lo que yo podría.",
                },
                {
                  t: "Diseño gráfico de marca",
                  d: "Diseño interfaces, no identidades. Para un logo o un manual de marca necesitas a alguien de esa disciplina.",
                },
                {
                  t: "Mantener código que no puedo leer",
                  d: "Sin acceso al repositorio y sin forma de reproducir el entorno, cualquier presupuesto que te diera sería inventado.",
                },
              ].map((x) => (
                <li key={x.t} className="rounded-[16px] border border-line bg-paper p-6">
                  <h3 className="text-[1.0625rem] font-semibold text-ink">{x.t}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-mid">{x.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Band>
          <div className="py-20 text-center sm:py-24">
            <h2 className="mx-auto max-w-[22ch] text-[1.9375rem] sm:text-[2.4375rem]">
              ¿Encaja con lo que necesitas?
            </h2>
            <p className="mx-auto mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-on-band-mid">
              Media hora de conversación basta para saberlo. Si no soy la persona indicada, te lo digo
              ahí mismo.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button href="/contacto#agendar" size="lg">Hablemos de tu proyecto</Button>
              <Button href="/trabajo" variant="outline-band" size="lg">Ver el trabajo</Button>
            </div>
          </div>
        </Band>
      </main>

      <Footer />
    </>
  )
}

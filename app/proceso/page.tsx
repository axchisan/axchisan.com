import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Band, Body, PageBand } from "@/components/site/band"
import { Button } from "@/components/ui/button"
import { PROCESO } from "@/lib/servicios"
import { MENSAJE_WHATSAPP, whatsappUrl } from "@/lib/site"

export const metadata: Metadata = {
  title: "Proceso",
  description:
    "Cómo se contrata con Axchi: propuesta por escrito con precio cerrado, avances que pruebas desde el celular y todo a tu nombre al final.",
  alternates: { canonical: "/proceso" },
}

const COMPROMISOS = [
  {
    t: "El precio se cierra antes de empezar",
    d: "Se cotiza por alcance, no por horas. Si algo se sale de lo acordado, se habla antes de hacerlo, no aparece en la cuenta.",
  },
  {
    t: "Ves avances desde la primera semana",
    d: "Cada entrega queda en un enlace que abres desde el celular. No tienes que imaginarte nada.",
  },
  {
    t: "Todo queda a tu nombre",
    d: "Dominio, código y datos son tuyos cuando terminas de pagar. Sin licencias sorpresa ni dependencias escondidas.",
  },
  {
    t: "Tu equipo aprende a usarlo",
    d: "Una capacitación y un manual corto. La idea es que el día a día no dependa de nadie más.",
  },
  {
    t: "Si no te conviene, te lo decimos",
    d: "Cuando una herramienta que ya existe te resuelve mejor, te la recomendamos aunque eso signifique no cobrarte.",
  },
  {
    t: "30 días de garantía",
    d: "Cualquier falla que aparezca en el primer mes después de la entrega se corrige sin costo.",
  },
]

export default function ProcesoPage() {
  return (
    <>
      <Header />

      <main id="contenido">
        <PageBand
          titulo="Cómo se trabaja con Axchi"
          entradilla="Sin sorpresas en el alcance ni en la cuenta. Esto es lo que pasa desde el primer mensaje hasta que tu página o tu sistema están funcionando."
        />

        <Body>
          <ol className="space-y-5">
            {PROCESO.map((etapa, i) => (
              <li
                key={etapa.titulo}
                className="grid gap-4 rounded-[16px] border border-line bg-card p-6 shadow-card sm:grid-cols-[auto_1fr] sm:gap-7 sm:p-8"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-weak text-[1.0625rem] font-semibold text-accent-ink">
                  {i + 1}
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">
                      {etapa.titulo}
                    </h2>
                    <span className="text-[0.9375rem] text-accent-ink">{etapa.duracion}</span>
                  </div>
                  <p className="measure mt-2.5 text-[1rem] leading-relaxed text-mid">{etapa.detalle}</p>
                </div>
              </li>
            ))}
          </ol>
        </Body>

        <div className="bg-card">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
            <h2 className="text-[1.9375rem] text-ink">Lo que te garantizamos</h2>
            <p className="mt-3 max-w-[58ch] text-[1.0625rem] leading-relaxed text-mid">
              Seis compromisos por escrito. Si alguno no se cumple, tienes con qué reclamarlo.
            </p>
            <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {COMPROMISOS.map((c) => (
                <li key={c.t} className="rounded-[16px] border border-line bg-paper p-6">
                  <h3 className="text-[1.0625rem] font-semibold text-ink">{c.t}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-mid">{c.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Band>
          <div className="py-20 text-center sm:py-24">
            <h2 className="mx-auto max-w-[22ch] text-[1.9375rem] sm:text-[2.4375rem]">
              Empecemos por una conversación
            </h2>
            <p className="mx-auto mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-on-band-mid">
              Sin costo y sin compromiso. Sales de ahí sabiendo qué te conviene y cuánto costaría.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button href={whatsappUrl(MENSAJE_WHATSAPP)} size="lg" target="_blank" rel="noreferrer noopener">
                Escribir por WhatsApp
              </Button>
              <Button href="/cotizar" variant="outline-band" size="lg">
                Llenar el formulario
              </Button>
            </div>
          </div>
        </Band>
      </main>

      <Footer />
    </>
  )
}

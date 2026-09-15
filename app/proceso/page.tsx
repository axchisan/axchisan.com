import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Band, Body, PageBand } from "@/components/site/band"
import { Button } from "@/components/ui/button"
import { PROCESO } from "@/lib/servicios"

export const metadata: Metadata = {
  title: "Cómo trabajo",
  description:
    "Cuatro etapas, alcance y precio cerrados por escrito, entregas parciales que puedes abrir y probar, y traspaso completo al final.",
  alternates: { canonical: "/proceso" },
}

const COMPROMISOS = [
  {
    t: "El precio se cierra antes de empezar",
    d: "Presupuesto por alcance, no por horas. Si algo se sale de lo acordado, se habla antes de tocarlo, no aparece en la factura.",
  },
  {
    t: "Ves avances desde la primera semana",
    d: "Cada entrega se despliega en un enlace que puedes abrir. Nadie tiene que fiarse de una barra de progreso.",
  },
  {
    t: "El código es tuyo desde el primer commit",
    d: "Trabajo en tu repositorio o te lo transfiero al terminar. Sin dependencias ocultas ni licencias sorpresa.",
  },
  {
    t: "Te enseño a operarlo",
    d: "La documentación explica cómo funciona y cómo cambiarlo. El objetivo es que no me necesites para el día a día.",
  },
  {
    t: "Te digo que no cuando corresponde",
    d: "Si el problema se resuelve mejor con una herramienta que ya existe, te lo digo aunque signifique no facturar.",
  },
  {
    t: "Las copias de seguridad se prueban",
    d: "Un respaldo que nunca se ha restaurado no es un respaldo. Los pruebo restaurándolos antes de darlos por buenos.",
  },
]

export default function ProcesoPage() {
  return (
    <>
      <Header />

      <main id="contenido">
        <PageBand
          titulo="Cómo trabajo"
          entradilla="Sin sorpresas de alcance ni de factura. Esto es lo que pasa desde el primer mensaje hasta la entrega."
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
            <h2 className="text-[1.9375rem] text-ink">Lo que te garantizo</h2>
            <p className="mt-3 max-w-[58ch] text-[1.0625rem] leading-relaxed text-mid">
              Seis compromisos concretos. Si alguno no se cumple, tienes con qué reclamármelo.
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
              Media hora, sin costo y sin compromiso. Sales de ahí sabiendo si esto tiene sentido.
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

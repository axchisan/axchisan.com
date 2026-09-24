import type { Metadata } from "next"
import { MessageCircle } from "lucide-react"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Band, Body, PageBand } from "@/components/site/band"
import { Button } from "@/components/ui/button"
import { LEGAL_NAME, MENSAJE_WHATSAPP, PROFILE, WHATSAPP, whatsappUrl } from "@/lib/site"

export const metadata: Metadata = {
  title: "Sobre Axchi",
  description:
    "Axchi es un estudio de software de una persona en Bogotá. Hablas directamente con quien construye tu página, tu tienda o tu sistema.",
  alternates: { canonical: "/empresa" },
}

const RAZONES = [
  {
    t: "Hablas con quien construye",
    d: "No hay intermediarios que traduzcan lo que pides. Lo que me cuentas es lo que se construye.",
  },
  {
    t: "No se empieza de cero",
    d: "Las soluciones del catálogo parten de piezas ya probadas en las demos. Por eso los plazos son cortos y los precios, de estudio pequeño.",
  },
  {
    t: "Te digo que no cuando toca",
    d: "Si otra herramienta te resuelve mejor, o si un proyecto me queda grande, te lo digo antes de cobrarte.",
  },
]

export default function EmpresaPage() {
  return (
    <>
      <Header />

      <main id="contenido">
        <PageBand
          titulo="Quién está detrás de Axchi"
          entradilla="Axchi es un estudio de software de una sola persona, en Bogotá. Hablas directamente con quien construye tu página, tu tienda o tu sistema."
        />

        <Body>
          <section aria-labelledby="por-que">
            <h2 id="por-que" className="text-[1.9375rem] text-ink">
              Por qué un estudio pequeño
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {RAZONES.map((r) => (
                <div key={r.t} className="border-t-2 border-ink pt-5">
                  <h3 className="text-[1.1875rem] text-ink">{r.t}</h3>
                  <p className="mt-2 text-[1rem] leading-relaxed text-mid">{r.d}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="quien" className="mt-16 border-t border-line pt-12">
            <h2 id="quien" className="text-[1.9375rem] text-ink">
              Soy Duvan Yair Arciniegas
            </h2>
            <p className="measure mt-4 text-[1.0625rem] leading-relaxed text-mid">
              Fundador de Axchi y quien escribe el código. Construyo el sistema completo: la página que
              ve tu cliente, el panel que usa tu equipo, la base de datos y el servidor donde corre, y
              te dejo todo a tu nombre y documentado para que no dependas de mí.
            </p>
          </section>

          <section aria-labelledby="datos" className="mt-16 border-t border-line pt-12">
            <h2 id="datos" className="text-[1.9375rem] text-ink">
              Datos de contacto
            </h2>
            <dl className="mt-6 grid max-w-2xl gap-x-8 gap-y-4 text-[1rem] sm:grid-cols-[10rem_1fr]">
              <dt className="text-faint">Nombre comercial</dt>
              <dd className="text-ink">{LEGAL_NAME}</dd>
              <dt className="text-faint">Ciudad</dt>
              <dd className="text-ink">{PROFILE.location}, con clientes en todo el país</dd>
              <dt className="text-faint">WhatsApp</dt>
              <dd>
                <a href={whatsappUrl(MENSAJE_WHATSAPP)} target="_blank" rel="noreferrer noopener" className="link">
                  {WHATSAPP.visible}
                </a>
              </dd>
              <dt className="text-faint">Correo</dt>
              <dd>
                <a href={`mailto:${PROFILE.email}`} className="link break-all">
                  {PROFILE.email}
                </a>
              </dd>
              <dt className="text-faint">Perfiles</dt>
              <dd className="flex gap-4">
                <a href={PROFILE.linkedin} target="_blank" rel="noreferrer noopener" className="link">
                  LinkedIn
                </a>
                <a href={PROFILE.github} target="_blank" rel="noreferrer noopener" className="link">
                  GitHub
                </a>
              </dd>
            </dl>
          </section>
        </Body>

        <Band>
          <div className="py-20 text-center sm:py-24">
            <h2 className="mx-auto max-w-[22ch] text-[1.9375rem] sm:text-[2.4375rem]">Hablemos de tu negocio.</h2>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button href={whatsappUrl(MENSAJE_WHATSAPP)} size="lg" target="_blank" rel="noreferrer noopener">
                <MessageCircle className="h-5 w-5" aria-hidden />
                Escribir por WhatsApp
              </Button>
              <Button href="/soluciones" variant="outline-band" size="lg">
                Ver soluciones
              </Button>
            </div>
          </div>
        </Band>
      </main>

      <Footer />
    </>
  )
}

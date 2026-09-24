import type { Metadata } from "next"
import { MessageCircle } from "lucide-react"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Body, PageBand } from "@/components/site/band"
import { CotizacionForm } from "@/components/contact/cotizacion-form"
import { Button } from "@/components/ui/button"
import { PLANES, pesos } from "@/lib/catalogo/planes"
import { SECTORES } from "@/lib/catalogo/sectores"
import { MENSAJE_WHATSAPP, PROFILE, WHATSAPP, whatsappUrl } from "@/lib/site"

export const metadata: Metadata = {
  title: "Cotizar",
  description:
    "Cuéntanos qué necesita tu negocio y te respondemos el mismo día hábil con lo que te conviene y cuánto costaría. Por WhatsApp o por formulario.",
  alternates: { canonical: "/cotizar" },
}

const NEGOCIOS = [...SECTORES.map((s) => ({ valor: s.id, texto: s.nombre })), { valor: "otro", texto: "Otro tipo de negocio" }]

const QUE_NECESITA = [
  ...Object.values(PLANES).map((p) => ({ valor: p.id, texto: `${p.nombre} (desde ${pesos(p.desde)})` })),
  { valor: "a-medida", texto: "Un desarrollo a medida" },
]

export default async function CotizarPage({
  searchParams,
}: {
  searchParams: Promise<{ negocio?: string; plan?: string }>
}) {
  const { negocio, plan } = await searchParams
  const negocioValido = NEGOCIOS.some((n) => n.valor === negocio) ? negocio : undefined
  const planValido = QUE_NECESITA.some((p) => p.valor === plan) ? plan : undefined

  return (
    <>
      <Header />

      <main id="contenido">
        <PageBand
          titulo="Cotizar"
          entradilla="Cuéntanos qué necesita tu negocio. Te respondemos el mismo día hábil con lo que te conviene, cuánto costaría y cuánto tardaría."
        />

        <Body>
          <div className="grid gap-12 lg:grid-cols-[1fr_19rem] lg:gap-16">
            <section aria-labelledby="formulario">
              <h2 id="formulario" className="sr-only">
                Formulario de cotización
              </h2>
              <CotizacionForm
                negocios={NEGOCIOS}
                planes={QUE_NECESITA}
                negocioInicial={negocioValido}
                planInicial={planValido}
              />
            </section>

            <aside className="h-fit rounded-[16px] border border-line bg-card p-6 shadow-card">
              <h2 className="text-[1.0625rem] font-semibold text-ink">¿Prefieres WhatsApp?</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-mid">
                Es lo más rápido. Escríbenos qué negocio tienes y qué te gustaría resolver.
              </p>
              <Button href={whatsappUrl(MENSAJE_WHATSAPP)} className="mt-5 w-full" target="_blank" rel="noreferrer noopener">
                <MessageCircle className="h-4 w-4" aria-hidden />
                {WHATSAPP.visible}
              </Button>
              <dl className="mt-6 space-y-4 border-t border-line pt-5 text-[0.9375rem]">
                <div>
                  <dt className="text-faint">Correo</dt>
                  <dd className="mt-0.5">
                    <a href={`mailto:${PROFILE.email}`} className="link break-all">
                      {PROFILE.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-faint">Ubicación</dt>
                  <dd className="mt-0.5 text-mid">{PROFILE.location}, con clientes en todo el país</dd>
                </div>
              </dl>
            </aside>
          </div>
        </Body>
      </main>

      <Footer />
    </>
  )
}

import type { Metadata } from "next"
import { Check, Minus, MessageCircle } from "lucide-react"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Band, PageBand } from "@/components/site/band"
import { Preguntas } from "@/components/site/preguntas"
import { Button } from "@/components/ui/button"
import {
  COSTOS_DESPUES,
  EXTRA_SUSCRIPCION,
  MANTENIMIENTO,
  MENSUAL_ENTRADA,
  MODULOS,
  PERMANENCIA_MESES,
  PLANES,
  PRECIO_ENTRADA,
  SUSCRIPCIONES,
  TECHO,
  pesos,
  type PlanId,
} from "@/lib/catalogo/planes"
import { PREGUNTAS_GENERALES } from "@/lib/catalogo/preguntas"
import { LEGAL_NAME, MENSAJE_WHATSAPP, SITE_URL, whatsappUrl } from "@/lib/site"

export const metadata: Metadata = {
  title: "Planes y precios",
  description: `Precios de páginas web, tiendas en línea y sistemas en Colombia: desde ${pesos(PRECIO_ENTRADA)} en un solo pago o ${pesos(MENSUAL_ENTRADA)} al mes, y ningún plan pasa de ${pesos(TECHO)}.`,
  alternates: { canonical: "/planes" },
}

const GRUPOS: { titulo: string; entradilla: string; planes: PlanId[] }[] = [
  {
    titulo: "Para que te encuentren",
    entradilla: "Tu negocio en Google y en el celular de tus clientes.",
    planes: ["presencia", "pagina-profesional", "sitio-con-panel"],
  },
  {
    titulo: "Para vender",
    entradilla: "Catálogo, carrito y pedidos, con o sin cobro en línea.",
    planes: ["catalogo-whatsapp", "tienda-con-pagos"],
  },
  {
    titulo: "Para organizar tu operación",
    entradilla: "Citas, inventario, historias, pedidos: el sistema de tu negocio.",
    planes: ["citas-en-linea", "sistema-de-gestion", "sistema-completo"],
  },
]

const CONDICIONES = [
  ["Pago único hasta $ 1.000.000", "50 % para empezar y 50 % al entregar."],
  ["Pago único mayor a $ 1.000.000", "40 % para empezar, 30 % en la entrega intermedia y 30 % al final."],
  ["Suscripción", `Mes anticipado, sin pago inicial, con permanencia mínima de ${PERMANENCIA_MESES} meses. Si se cancela antes, se paga la mitad de los meses que faltan.`],
  ["Medios de pago", "Transferencia, Nequi o Daviplata."],
  ["Validez de la cotización", "15 días."],
  ["Ajustes", "Las rondas que incluye cada plan. Las adicionales, a $ 40.000 la hora."],
  ["Contenido", "Textos, fotos y logo los entregas tú, o se contratan aparte."],
  ["Propiedad", "Con pago único, dominio, código y datos quedan a tu nombre al terminar de pagar. Con suscripción, el dominio y los datos son tuyos siempre; el código se usa mientras dure, y para quedártelo se abona la mitad de lo pagado."],
  ["IVA", "No se cobra: los precios son finales."],
]

export default function PlanesPage() {
  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "OfferCatalog",
            name: `Planes de ${LEGAL_NAME}`,
            url: `${SITE_URL}/planes`,
            itemListElement: Object.values(PLANES).map((p) => ({
              "@type": "Offer",
              name: p.nombre,
              description: p.resumen,
              priceSpecification: { "@type": "PriceSpecification", minPrice: p.desde, priceCurrency: "COP" },
            })),
          }),
        }}
      />

      <main id="contenido">
        <PageBand
          titulo="Planes y precios"
          entradilla={`Paga de una vez o por mes, como te quede mejor. Precios desde, finales y sin IVA, y ningún plan pasa de ${pesos(TECHO)}.`}
        />

        {GRUPOS.map((g, gi) => (
          <section key={g.titulo} className={gi % 2 ? "bg-card" : "bg-paper"}>
            <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
              <h2 className="text-[1.9375rem] text-ink">{g.titulo}</h2>
              <p className="mt-2 text-[1.0625rem] text-mid">{g.entradilla}</p>
              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                {g.planes.map((id) => {
                  const p = PLANES[id]
                  const entrada = id === "presencia"
                  return (
                    <article
                      key={id}
                      id={id}
                      className={`flex scroll-mt-24 flex-col rounded-[16px] border p-6 ${
                        entrada ? "border-2 border-accent-ink bg-card" : "border-line bg-card"
                      }`}
                    >
                      <h3 className="text-[1.25rem] text-ink">{p.nombre}</h3>
                      <p className="mt-3">
                        <span className="text-[0.9375rem] text-mid">desde </span>
                        <span className="text-[1.9375rem] leading-none font-semibold tracking-[-0.03em] tabular-nums text-ink">
                          {pesos(p.desde)}
                        </span>
                      </p>
                      <p className="mt-1 text-[0.9375rem] text-accent-ink">Entrega en {p.entrega}</p>
                      {p.suscripcion && (
                        <p className="mt-1 text-[0.9375rem] text-mid">
                          o{" "}
                          <a href="#suscripciones" className="link">
                            {pesos(SUSCRIPCIONES[p.suscripcion].mensual)} al mes
                          </a>
                        </p>
                      )}
                      <p className="mt-4 text-[0.9375rem] leading-relaxed text-mid">{p.resumen}</p>
                      <ul className="mt-5 space-y-2">
                        {p.incluye.map((x) => (
                          <li key={x} className="flex gap-2.5 text-[0.9375rem] leading-snug text-ink">
                            <Check className="mt-[3px] h-4 w-4 shrink-0 text-accent-ink" aria-hidden />
                            {x}
                          </li>
                        ))}
                        {p.noIncluye.map((x) => (
                          <li key={x} className="flex gap-2.5 text-[0.9375rem] leading-snug text-mid">
                            <Minus className="mt-[3px] h-4 w-4 shrink-0 text-faint" aria-hidden />
                            <span>
                              <span className="sr-only">No incluye: </span>
                              {x}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto pt-6">
                        <Button href={`/cotizar?plan=${id}`} variant={entrada ? "primary" : "outline"} className="w-full">
                          Cotizar este plan
                        </Button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </section>
        ))}

        <section id="suscripciones" className="scroll-mt-20 bg-band text-on-band">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
            <h2 className="text-[1.9375rem]">O paga por mes, sin pago inicial</h2>
            <p className="mt-3 max-w-[62ch] text-[1.0625rem] leading-relaxed text-on-band-mid">
              Lo mismo que el pago único, con dominio, alojamiento y soporte ya incluidos. Permanencia
              mínima de {PERMANENCIA_MESES} meses. Pagos en línea o automatizaciones se suman por{" "}
              {pesos(EXTRA_SUSCRIPCION)} al mes cada uno.
            </p>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {Object.values(SUSCRIPCIONES).map((x) => (
                <article key={x.id} className="flex flex-col rounded-[16px] border border-band-line p-6">
                  <h3 className="text-[1.25rem]">{x.nombre}</h3>
                  <p className="mt-3">
                    <span className="text-[1.9375rem] leading-none font-semibold tracking-[-0.03em] tabular-nums">
                      {pesos(x.mensual)}
                    </span>
                    <span className="text-[0.9375rem] text-on-band-mid"> al mes</span>
                  </p>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-on-band-mid">{x.resumen}</p>
                  <ul className="mt-5 space-y-2">
                    {x.incluye.map((i) => (
                      <li key={i} className="flex gap-2.5 text-[0.9375rem] leading-snug">
                        <Check className="mt-[3px] h-4 w-4 shrink-0 text-accent" aria-hidden />
                        {i}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <Button href={`/cotizar?plan=${x.id}`} variant="outline-band" className="w-full">
                      Quiero pagar por mes
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="despues" className="scroll-mt-20 bg-paper">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2">
            <div>
              <h2 className="text-[1.9375rem] text-ink">Lo que cuesta después de un pago único</h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-mid">
                Lo pagas directamente al proveedor y queda a tu nombre. Con suscripción, esto ya está incluido.
              </p>
              <dl className="mt-6 divide-y divide-line border-y border-line">
                {COSTOS_DESPUES.map((c) => (
                  <div key={c.concepto} className="grid gap-1 py-4 sm:grid-cols-[1fr_1.3fr] sm:gap-6">
                    <dt className="font-medium text-ink">{c.concepto}</dt>
                    <dd className="text-[0.9375rem] text-mid">{c.costo}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h2 className="text-[1.9375rem] text-ink">Mantenimiento</h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-mid">
                Opcional. Sin plan, tu sitio sigue funcionando igual: solo pagas los cambios cuando los pides.
              </p>
              <ul className="mt-6 space-y-4">
                {MANTENIMIENTO.map((m) => (
                  <li key={m.nombre} className="rounded-[14px] border border-line bg-card p-5">
                    <p className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-[1.125rem] font-semibold text-ink">{m.nombre}</span>
                      <span className="font-semibold tabular-nums text-ink">{m.precio}</span>
                    </p>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-mid">{m.incluye}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-card">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2">
            <div>
              <h2 className="text-[1.9375rem] text-ink">Módulos adicionales</h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-mid">Se suman a cualquier plan cuando los necesitas.</p>
              <dl className="mt-6 divide-y divide-line border-y border-line">
                {MODULOS.map((m) => (
                  <div key={m.nombre} className="grid gap-1 py-4 sm:grid-cols-[1.4fr_1fr] sm:gap-6">
                    <dt className="text-ink">{m.nombre}</dt>
                    <dd className="font-medium text-ink sm:text-right">{m.precio}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h2 className="text-[1.9375rem] text-ink">Condiciones</h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-mid">Las mismas para todos, por escrito desde la cotización.</p>
              <dl className="mt-6 divide-y divide-line border-y border-line">
                {CONDICIONES.map(([t, d]) => (
                  <div key={t} className="grid gap-1 py-4 sm:grid-cols-[1fr_1.4fr] sm:gap-6">
                    <dt className="font-medium text-ink">{t}</dt>
                    <dd className="text-[0.9375rem] text-mid">{d}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="bg-paper">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.6fr]">
            <h2 className="text-[1.9375rem] text-ink">Preguntas frecuentes</h2>
            <Preguntas preguntas={PREGUNTAS_GENERALES} />
          </div>
        </section>

        <Band>
          <div className="py-20 text-center sm:py-24">
            <h2 className="mx-auto max-w-[24ch] text-[1.9375rem] sm:text-[2.4375rem]">¿No sabes cuál te sirve?</h2>
            <p className="mx-auto mt-5 max-w-[50ch] text-[1.0625rem] leading-relaxed text-on-band-mid">
              Cuéntanos cómo funciona tu negocio y te recomendamos el plan más sencillo que te resuelva.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button href={whatsappUrl(MENSAJE_WHATSAPP)} size="lg" target="_blank" rel="noreferrer noopener">
                <MessageCircle className="h-5 w-5" aria-hidden />
                Escribir por WhatsApp
              </Button>
              <Button href="/cotizar" variant="outline-band" size="lg">Llenar el formulario</Button>
            </div>
          </div>
        </Band>
      </main>
      <Footer />
    </>
  )
}

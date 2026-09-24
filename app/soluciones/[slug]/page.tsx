import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, ExternalLink, MessageCircle, MonitorPlay, Minus } from "lucide-react"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Band } from "@/components/site/band"
import { Celular, Navegador } from "@/components/site/dispositivos"
import { Preguntas } from "@/components/site/preguntas"
import { Button } from "@/components/ui/button"
import { PLANES, pesos } from "@/lib/catalogo/planes"
import { SECTORES } from "@/lib/catalogo/sectores"
import { SOLUCIONES, solucion } from "@/lib/catalogo/soluciones"
import { LEGAL_NAME, SITE_URL, whatsappUrl } from "@/lib/site"

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return SOLUCIONES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const s = solucion((await params).slug)
  if (!s) return {}
  return {
    title: s.seo.title,
    description: s.seo.description,
    alternates: { canonical: `/soluciones/${s.slug}` },
  }
}

export default async function FichaSolucion({ params }: Params) {
  const s = solucion((await params).slug)
  if (!s) notFound()

  const Icono = SECTORES.find((x) => x.solucion === s.slug)?.icono
  const planes = s.planes.map((id) => PLANES[id])
  const desde = Math.min(...planes.map((p) => p.desde))
  const mensaje = `Hola, vi la solución para ${s.sector.toLowerCase()} en axchisan.com y quiero cotizar algo así para mi negocio.`

  const botonMuestra =
    s.muestra.tipo === "demo" ? (
      <Button href={s.muestra.href} size="lg">
        <MonitorPlay className="h-5 w-5" aria-hidden />
        Probar la demo
      </Button>
    ) : (
      <Button href={s.muestra.href} size="lg" target="_blank" rel="noreferrer noopener">
        <ExternalLink className="h-5 w-5" aria-hidden />
        Ver la tienda real
      </Button>
    )

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.titulo,
            description: s.resumen,
            url: `${SITE_URL}/soluciones/${s.slug}`,
            areaServed: { "@type": "Country", name: "Colombia" },
            provider: { "@type": "ProfessionalService", name: LEGAL_NAME, url: SITE_URL },
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "COP",
              lowPrice: desde,
              offerCount: planes.length,
            },
          }),
        }}
      />

      <main id="contenido">
        {/* 1 · Apertura con la muestra */}
        <Band as="header">
          <div className="enter grid gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-[0.9375rem] text-on-band-mid">
                {Icono && <Icono className="h-5 w-5 text-accent" strokeWidth={1.75} aria-hidden />}
                <Link href="/soluciones" className="hover:text-on-band">
                  Soluciones
                </Link>
                <span aria-hidden>/</span>
                <span>{s.sector}</span>
              </p>
              <h1 className="mt-5 max-w-[20ch] text-[2.125rem] leading-[1.08] sm:text-[2.75rem]">{s.titulo}</h1>
              <p className="mt-5 max-w-[52ch] text-[1.125rem] leading-relaxed text-on-band-mid">{s.resumen}</p>
              <p className="mt-6 text-[1.0625rem] text-on-band-mid">
                Desde <span className="text-[1.5625rem] font-semibold tabular-nums text-on-band">{pesos(desde)}</span>
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {botonMuestra}
                <Button href={whatsappUrl(mensaje)} variant="outline-band" size="lg" target="_blank" rel="noreferrer noopener">
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  Cotizar por WhatsApp
                </Button>
              </div>
              <p className="mt-4 text-[0.875rem] text-on-band-mid">{s.muestra.nota}</p>
            </div>
            <div className="relative pb-8">
              <Navegador captura={s.capturas.escritorio} prioridad tamanos="(min-width: 1024px) 600px, 100vw" />
              <Celular captura={s.capturas.movil} prioridad className="absolute right-3 -bottom-2 w-[28%] max-w-[180px]" tamanos="180px" />
            </div>
          </div>
        </Band>

        {/* 2 · Para quién */}
        <section className="bg-paper">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.6fr]">
            <h2 className="text-[1.9375rem] text-ink sm:text-[2.125rem]">¿Te suena?</h2>
            <ul className="space-y-4">
              {s.sintomas.map((x) => (
                <li key={x} className="border-l-2 border-accent pl-5 text-[1.125rem] leading-relaxed text-ink">
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3 · Qué obtienes */}
        <section className="bg-card">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
            <h2 className="text-[1.9375rem] text-ink sm:text-[2.125rem]">Qué cambia</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {s.resultados.map((r) => (
                <div key={r.titulo} className="border-t-2 border-ink pt-5">
                  <h3 className="text-[1.25rem] text-ink">{r.titulo}</h3>
                  <p className="mt-2 text-[1rem] leading-relaxed text-mid">{r.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4 · El día a día */}
        <section className="bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
            <h2 className="text-[1.9375rem] text-ink sm:text-[2.125rem]">Así se usa en el día a día</h2>
            <ol className="mt-10 space-y-12">
              {s.diaADia.map((d, i) => (
                <li key={d.titulo} className="grid gap-6 lg:grid-cols-[1fr_1.5fr] lg:items-center">
                  <div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-weak font-semibold text-accent-ink">
                      {i + 1}
                    </span>
                    <h3 className="mt-4 text-[1.25rem] text-ink">{d.titulo}</h3>
                    <p className="mt-2 max-w-[44ch] text-[1rem] leading-relaxed text-mid">{d.texto}</p>
                  </div>
                  {d.captura &&
                    (d.captura.ancho < d.captura.alto ? (
                      <Celular captura={d.captura} className="w-[min(70%,260px)]" tamanos="260px" />
                    ) : (
                      <Navegador captura={d.captura} tamanos="(min-width: 1024px) 640px, 100vw" />
                    ))}
                </li>
              ))}
            </ol>
            {s.muestra.tipo === "demo" && (
              <div className="mt-12 rounded-[16px] border border-line bg-card p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
                <p className="text-[1.0625rem] text-ink">
                  Todo esto funciona en la demo. Tócalo, rómpelo: lo que hagas se guarda solo en tu navegador.
                </p>
                <Button href={s.muestra.href} className="mt-4 sm:mt-0">
                  <MonitorPlay className="h-4 w-4" aria-hidden />
                  Abrir la demo
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* 5 · Qué incluye y qué no */}
        <section className="bg-card">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-2">
            <div>
              <h2 className="text-[1.5625rem] text-ink">Qué incluye la solución completa</h2>
              <ul className="mt-6 space-y-3">
                {s.incluye.map((x) => (
                  <li key={x} className="flex gap-3 text-[1rem] leading-snug text-ink">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent-ink" aria-hidden />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-[1.5625rem] text-ink">Qué no incluye</h2>
              <ul className="mt-6 space-y-3">
                {s.noIncluye.map((x) => (
                  <li key={x} className="flex gap-3 text-[1rem] leading-snug text-mid">
                    <Minus className="mt-0.5 h-5 w-5 shrink-0 text-faint" aria-hidden />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6 · Planes */}
        <section id="planes" className="scroll-mt-20 bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
            <h2 className="text-[1.9375rem] text-ink sm:text-[2.125rem]">Planes para {s.sector.toLowerCase()}</h2>
            <p className="mt-3 max-w-[60ch] text-[1.0625rem] leading-relaxed text-mid">
              Puedes empezar por el primero y crecer después sin rehacer nada. Precios desde, finales y sin IVA.
            </p>
            <ul className="mt-8 divide-y divide-line overflow-hidden rounded-[16px] border border-line bg-card">
              {planes.map((p) => (
                <li key={p.id} className="grid gap-3 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
                  <div>
                    <h3 className="text-[1.25rem] text-ink">{p.nombre}</h3>
                    <p className="mt-1 text-[0.9375rem] text-mid">
                      {p.resumen} Entrega en {p.entrega}.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                    <p className="text-[1.125rem] text-ink">
                      <span className="text-[0.9375rem] text-mid">desde </span>
                      <span className="font-semibold tabular-nums">{pesos(p.desde)}</span>
                    </p>
                    <Button href={`/cotizar?negocio=${SECTORES.find((x) => x.solucion === s.slug)?.id ?? ""}&plan=${p.id}`} variant="outline" size="sm">
                      Cotizar este plan
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            {/* 7 · Propiedad y costos */}
            <p className="mt-6 max-w-[70ch] text-[0.9375rem] leading-relaxed text-mid">
              El dominio, el código y los datos quedan a tu nombre. Después de la entrega solo pagas lo que
              cuesta tenerlo en línea, casi siempre menos de lo que imaginas.{" "}
              <Link href="/planes#despues" className="link">
                Ver cuánto cuesta mantenerlo
              </Link>
              .
            </p>
          </div>
        </section>

        {/* 8 · Preguntas */}
        <section className="bg-card">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.6fr]">
            <h2 className="text-[1.9375rem] text-ink sm:text-[2.125rem]">Preguntas frecuentes</h2>
            <div>
              <Preguntas preguntas={s.preguntas} />
              {/* 9 · Detalles técnicos */}
              <details className="mt-8 rounded-[12px] border border-line p-5">
                <summary className="cursor-pointer font-medium text-ink">Detalles técnicos</summary>
                <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[0.9375rem] text-mid">
                  {s.tecnico.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        </section>

        {/* 10 · Cierre */}
        <Band>
          <div className="py-20 text-center sm:py-24">
            <h2 className="mx-auto max-w-[24ch] text-[1.9375rem] sm:text-[2.4375rem]">
              ¿Quieres algo así para tu negocio?
            </h2>
            <p className="mx-auto mt-5 max-w-[50ch] text-[1.0625rem] leading-relaxed text-on-band-mid">
              Escríbenos y te respondemos el mismo día hábil con lo que te conviene y cuánto costaría.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button href={whatsappUrl(mensaje)} size="lg" target="_blank" rel="noreferrer noopener">
                <MessageCircle className="h-5 w-5" aria-hidden />
                Cotizar por WhatsApp
              </Button>
              <Button
                href={s.muestra.href}
                variant="outline-band"
                size="lg"
                {...(s.muestra.tipo === "real" ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              >
                {s.muestra.tipo === "demo" ? "Probar la demo" : "Ver la tienda real"}
              </Button>
            </div>
          </div>
        </Band>
      </main>
      <Footer />
    </>
  )
}

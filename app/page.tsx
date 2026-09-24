import Link from "next/link"
import { ExternalLink, MessageCircle, MonitorPlay } from "lucide-react"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Band, Body, SectionHead } from "@/components/site/band"
import { Celular, Navegador } from "@/components/site/dispositivos"
import { Preguntas } from "@/components/site/preguntas"
import { Button } from "@/components/ui/button"
import { MENSUAL_ENTRADA, PLANES, PRECIO_ENTRADA, SUSCRIPCIONES, TECHO, pesos, type PlanId } from "@/lib/catalogo/planes"
import { PREGUNTAS_GENERALES } from "@/lib/catalogo/preguntas"
import { SECTORES } from "@/lib/catalogo/sectores"
import { SOLUCIONES, solucion } from "@/lib/catalogo/soluciones"
import { PROCESO } from "@/lib/servicios"
import { MENSAJE_WHATSAPP, whatsappUrl } from "@/lib/site"

const DESTACADOS: PlanId[] = ["presencia", "pagina-profesional", "catalogo-whatsapp", "citas-en-linea", "sistema-completo"]

export default function Home() {
  const canela = solucion("veterinarias")!
  const conMuestra = SECTORES.filter((s) => s.solucion)
  const porCotizar = SECTORES.filter((s) => !s.solucion)

  return (
    <>
      <Header />

      <main id="contenido">
        {/* ── Apertura: la promesa, el precio y una demo que se puede abrir ── */}
        <Band>
          <div className="enter grid gap-14 py-16 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12">
            <div>
              <h1 className="max-w-[15ch] text-[2.4375rem] leading-[1.05] sm:text-[3.0625rem] lg:text-[3.5rem]">
                Páginas web, tiendas y sistemas para tu negocio.
              </h1>
              <p className="mt-6 max-w-[48ch] text-[1.125rem] leading-relaxed text-on-band-mid">
                Cada solución tiene una demo funcionando. Ábrela desde el celular, pruébala como si
                fuera tuya y después decide.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button href="/soluciones" size="lg">
                  Ver soluciones por negocio
                </Button>
                <Button href={whatsappUrl(MENSAJE_WHATSAPP)} variant="outline-band" size="lg" target="_blank" rel="noreferrer noopener">
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  Cotizar por WhatsApp
                </Button>
              </div>

              <Link
                href="/planes"
                className="mt-10 flex max-w-md flex-col gap-2 rounded-[14px] border border-band-line p-5 transition-colors hover:border-accent sm:flex-row sm:items-center sm:gap-5"
              >
                <span className="shrink-0">
                  <span className="block text-[0.9375rem] text-on-band-mid">Desde</span>
                  <span className="block text-[2.4375rem] leading-none font-semibold tracking-[-0.03em] tabular-nums text-on-band">
                    {pesos(PRECIO_ENTRADA)}
                  </span>
                </span>
                <span className="text-[0.9375rem] leading-snug text-on-band-mid">
                  Tu página con servicios, horario, mapa y WhatsApp, lista en{" "}
                  {PLANES.presencia.entrega}. O{" "}
                  <span className="text-on-band">{pesos(MENSUAL_ENTRADA)} al mes</span>, sin pago inicial.
                </span>
              </Link>
            </div>

            <div>
              <div className="relative pr-[12%] pb-[14%]">
                <Navegador captura={canela.capturas.escritorio} prioridad tamanos="(min-width: 1024px) 560px, 90vw" />
                <Celular
                  captura={canela.capturas.movil}
                  prioridad
                  className="absolute right-0 bottom-0 w-[24%] max-w-[160px]"
                  tamanos="160px"
                />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                <p className="text-[0.9375rem] text-on-band-mid">
                  Demo funcionando: <span className="text-on-band">{canela.muestra.nombre}</span>
                </p>
                <Link href={canela.muestra.href} className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent hover:underline">
                  <MonitorPlay className="h-4 w-4" aria-hidden />
                  Abrir la demo
                </Link>
              </div>
            </div>
          </div>
        </Band>

        {/* ── Sectores ─────────────────────────────────────────────── */}
        <Body>
          <SectionHead
            titulo="¿Qué negocio tienes?"
            entradilla="Elige el tuyo y mira funcionando lo que tendrías, con lo que cuesta al lado."
          />

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {conMuestra.map((sector) => {
              const s = SOLUCIONES.find((x) => x.slug === sector.solucion)!
              const Icono = sector.icono
              return (
                <article key={sector.id} className="flex flex-col overflow-hidden rounded-[16px] border border-line bg-card">
                  <div className="bg-band px-6 pt-6">
                    <Navegador captura={s.capturas.escritorio} tamanos="(min-width: 1024px) 520px, 100vw" className="rounded-b-none" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="flex items-center gap-2.5 text-[1.25rem] text-ink">
                      <Icono className="h-5 w-5 text-accent-ink" strokeWidth={1.75} aria-hidden />
                      {s.sector}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-mid">{s.resumen}</p>
                    <div className="mt-auto flex flex-wrap gap-3 pt-6">
                      <Button href={`/soluciones/${s.slug}`}>Ver solución y precios</Button>
                      {s.muestra.tipo === "demo" ? (
                        <Button href={s.muestra.href} variant="outline">
                          <MonitorPlay className="h-4 w-4" aria-hidden />
                          Probar la demo
                        </Button>
                      ) : (
                        <Button href={s.muestra.href} variant="outline" target="_blank" rel="noreferrer noopener">
                          <ExternalLink className="h-4 w-4" aria-hidden />
                          Ver la tienda real
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="mt-12">
            <h3 className="text-[1.25rem] text-ink">¿Tu negocio es otro?</h3>
            <p className="mt-2 max-w-[60ch] text-[0.9375rem] leading-relaxed text-mid">
              Estas demos se están construyendo. Mientras tanto, cuéntanos qué necesitas y te enviamos
              una propuesta con ejemplos de lo que tendrías.
            </p>
            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {porCotizar.map((sector) => {
                const Icono = sector.icono
                return (
                  <li key={sector.id} className="border-t border-line">
                    <Link
                      href={`/cotizar?negocio=${sector.id}`}
                      className="group flex gap-3 py-4"
                    >
                      <Icono className="mt-0.5 h-5 w-5 shrink-0 text-accent-ink" strokeWidth={1.75} aria-hidden />
                      <span>
                        <span className="block font-medium text-ink group-hover:text-accent-ink">{sector.nombre}</span>
                        <span className="block text-[0.875rem] text-mid">{sector.ejemplo}</span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </Body>

        {/* ── Precios ──────────────────────────────────────────────── */}
        <div className="bg-card">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
            <SectionHead
              titulo="Cuánto cuesta"
              entradilla={`Paga de una vez o por mes. Precios desde, finales y sin IVA; ningún plan pasa de ${pesos(TECHO)}.`}
              accion={
                <Link href="/planes" className="link text-[0.9375rem] font-medium">
                  Todos los planes y lo que cuesta mantenerlos
                </Link>
              }
            />
            <ul className="divide-y divide-line border-y border-line">
              {DESTACADOS.map((id) => {
                const plan = PLANES[id]
                return (
                  <li key={id} className="grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
                    <div>
                      <p className="text-[1.125rem] font-semibold text-ink">{plan.nombre}</p>
                      <p className="mt-1 text-[0.9375rem] text-mid">
                        {plan.resumen} Entrega en {plan.entrega}.
                      </p>
                    </div>
                    <p className="text-[1.125rem] text-ink sm:text-right">
                      <span className="text-[0.9375rem] text-mid">desde </span>
                      <span className="font-semibold tabular-nums">{pesos(plan.desde)}</span>
                      {plan.suscripcion && (
                        <span className="block text-[0.875rem] text-mid">
                          o {pesos(SUSCRIPCIONES[plan.suscripcion].mensual)} al mes
                        </span>
                      )}
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* ── Proceso ──────────────────────────────────────────────── */}
        <Body>
          <SectionHead
            titulo="Cómo funciona"
            entradilla="Sabes qué entra, cuánto cuesta y cuándo lo tienes antes de pagar el primer peso."
            accion={
              <Link href="/proceso" className="link text-[0.9375rem] font-medium">
                El proceso completo
              </Link>
            }
          />
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PROCESO.map((etapa, i) => (
              <li key={etapa.titulo} className="rounded-[16px] border border-line bg-card p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-weak text-[0.9375rem] font-semibold text-accent-ink">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-[1.125rem] text-ink">{etapa.titulo}</h3>
                <p className="mt-1 text-[0.875rem] font-medium text-accent-ink">{etapa.duracion}</p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-mid">{etapa.detalle}</p>
              </li>
            ))}
          </ol>
        </Body>

        {/* ── Preguntas ────────────────────────────────────────────── */}
        <div className="bg-card">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.6fr]">
            <h2 className="text-[1.9375rem] text-ink sm:text-[2.125rem]">Preguntas frecuentes</h2>
            <Preguntas preguntas={PREGUNTAS_GENERALES} />
          </div>
        </div>

        {/* ── Cierre ───────────────────────────────────────────────── */}
        <Band>
          <div className="py-20 text-center sm:py-24">
            <h2 className="mx-auto max-w-[22ch] text-[1.9375rem] sm:text-[2.4375rem]">
              Cuéntanos qué necesita tu negocio.
            </h2>
            <p className="mx-auto mt-5 max-w-[50ch] text-[1.0625rem] leading-relaxed text-on-band-mid">
              Te respondemos el mismo día hábil con una idea clara de qué te conviene y cuánto costaría.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button href={whatsappUrl(MENSAJE_WHATSAPP)} size="lg" target="_blank" rel="noreferrer noopener">
                <MessageCircle className="h-5 w-5" aria-hidden />
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

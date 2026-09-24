import type { Metadata } from "next"
import Link from "next/link"
import { ExternalLink, MonitorPlay } from "lucide-react"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Band, Body, PageBand } from "@/components/site/band"
import { Celular, Navegador } from "@/components/site/dispositivos"
import { Button } from "@/components/ui/button"
import { PLANES, pesos } from "@/lib/catalogo/planes"
import { SECTORES } from "@/lib/catalogo/sectores"
import { SOLUCIONES } from "@/lib/catalogo/soluciones"

export const metadata: Metadata = {
  title: "Soluciones por tipo de negocio",
  description:
    "Páginas web, tiendas y sistemas para veterinarias, tiendas de cosméticos, restaurantes, salones y más. Cada solución con una demo funcionando y su precio.",
  alternates: { canonical: "/soluciones" },
}

export default function SolucionesPage() {
  const pendientes = SECTORES.filter((s) => !s.solucion)

  return (
    <>
      <Header />
      <main id="contenido">
        <PageBand
          titulo="Soluciones por tipo de negocio"
          entradilla="Cada una con una muestra que puedes abrir y usar: una demo con un negocio ficticio o una tienda real funcionando."
        />

        <Body>
          <ul className="space-y-10">
            {SOLUCIONES.map((s) => {
              const sector = SECTORES.find((x) => x.solucion === s.slug)
              const Icono = sector?.icono
              const desde = Math.min(...s.planes.map((p) => PLANES[p].desde))
              return (
                <li key={s.slug} className="grid gap-8 rounded-[16px] border border-line bg-card p-6 sm:p-8 lg:grid-cols-[1fr_1.15fr] lg:items-center">
                  <div>
                    <h2 className="flex items-center gap-3 text-[1.5625rem] text-ink sm:text-[1.9375rem]">
                      {Icono && <Icono className="h-6 w-6 shrink-0 text-accent-ink" strokeWidth={1.75} aria-hidden />}
                      {s.sector}
                    </h2>
                    <p className="mt-3 text-[1.0625rem] leading-relaxed text-mid">{s.resumen}</p>
                    <p className="mt-4 text-[0.9375rem] text-mid">
                      {s.muestra.tipo === "demo" ? "Demo: " : "En producción: "}
                      <span className="font-medium text-ink">{s.muestra.nombre}</span>
                    </p>
                    <p className="mt-1 text-[0.9375rem] text-mid">
                      Desde <span className="font-semibold text-ink tabular-nums">{pesos(desde)}</span>
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
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
                  <div className="relative rounded-[14px] bg-band p-5 pb-8 sm:p-8 sm:pb-10">
                    <Navegador captura={s.capturas.escritorio} tamanos="(min-width: 1024px) 560px, 100vw" />
                    <Celular captura={s.capturas.movil} className="absolute right-3 -bottom-4 w-[26%] max-w-[150px] sm:right-5" tamanos="150px" />
                  </div>
                </li>
              )
            })}
          </ul>

          <section aria-labelledby="otros" className="mt-16">
            <h2 id="otros" className="text-[1.5625rem] text-ink sm:text-[1.9375rem]">
              Otros negocios
            </h2>
            <p className="mt-3 max-w-[62ch] text-[1.0625rem] leading-relaxed text-mid">
              Las demos de estos sectores se están construyendo. Si el tuyo está aquí, o no está,
              cuéntanos qué necesitas y te enviamos una propuesta con ejemplos.
            </p>
            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {pendientes.map((sector) => {
                const Icono = sector.icono
                return (
                  <li key={sector.id} className="border-t border-line">
                    <Link href={`/cotizar?negocio=${sector.id}`} className="group flex gap-3 py-4">
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
          </section>
        </Body>

        <Band>
          <div className="py-20 text-center sm:py-24">
            <h2 className="mx-auto max-w-[24ch] text-[1.9375rem] sm:text-[2.4375rem]">
              ¿No sabes qué plan necesitas?
            </h2>
            <p className="mx-auto mt-5 max-w-[50ch] text-[1.0625rem] leading-relaxed text-on-band-mid">
              Cuéntanos cómo funciona tu negocio hoy y te decimos qué te conviene, aunque sea lo más sencillo.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button href="/cotizar" size="lg">Cotizar</Button>
              <Button href="/planes" variant="outline-band" size="lg">Ver planes y precios</Button>
            </div>
          </div>
        </Band>
      </main>
      <Footer />
    </>
  )
}

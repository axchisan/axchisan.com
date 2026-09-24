"use client"

import Link from "next/link"
import { useRef, type ReactNode } from "react"
import { Lightbulb, MessageCircle, SlidersHorizontal, X } from "lucide-react"
import { LogoMark } from "@/components/site/logo"
import { PLANES, pesos } from "@/lib/catalogo/planes"
import { whatsappUrl } from "@/lib/site"
import { useDemo } from "./contexto"

/**
 * Barra de Axchi sobre toda demo. Dice que el negocio es ficticio, deja elegir
 * qué plan se está viendo, abre el recorrido y lleva a cotizar. Usa los colores
 * del sitio, no los de la demo: es la capa de Axchi sobre el trabajo.
 */
export function BarraDemo() {
  const { config, nivel, recorrido, alternarRecorrido } = useDemo()
  const dialogo = useRef<HTMLDialogElement>(null)

  const mensaje =
    `Hola, vi la demo de ${config.nombre} en axchisan.com y me interesa algo así para ` +
    `${config.paraQuien}. Estaba mirando el nivel "${nivel.etiqueta}".`

  return (
    <>
      <div className="sticky top-0 z-50 border-b border-band-line bg-band font-sans text-on-band print:hidden">
        <div className="mx-auto flex h-12 max-w-[1400px] items-center gap-3 px-3 sm:px-5">
          <Link href="/" className="flex shrink-0 items-center gap-2 rounded-[4px]" aria-label="Axchi, ir al sitio">
            <LogoMark className="h-[16px] w-[22px]" />
            <span className="text-[0.875rem] font-semibold">Axchi</span>
          </Link>
          <p className="hidden truncate text-[0.8125rem] text-on-band-mid md:block">
            Demostración con un negocio ficticio
          </p>

          <div className="ml-auto hidden lg:block">
            <SelectorNivel />
          </div>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-3">
            <BotonBarra
              onClick={() => alternarRecorrido()}
              pressed={recorrido}
              icono={<Lightbulb className="h-4 w-4" aria-hidden />}
            >
              Cómo funciona
            </BotonBarra>
            <BotonBarra
              onClick={() => dialogo.current?.showModal()}
              icono={<SlidersHorizontal className="h-4 w-4" aria-hidden />}
            >
              <span className="lg:hidden">Planes</span>
              <span className="hidden lg:inline">Planes y precios</span>
            </BotonBarra>
            <a
              href={whatsappUrl(mensaje)}
              target="_blank"
              rel="noreferrer noopener"
              className="hidden h-8 items-center gap-1.5 rounded-[8px] bg-accent px-3 text-[0.8125rem] font-semibold text-on-accent transition-colors hover:bg-accent-hover hover:text-on-band sm:inline-flex"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Quiero una así
            </a>
          </div>
        </div>
      </div>

      <dialog
        ref={dialogo}
        aria-labelledby="planes-titulo"
        className="m-0 mt-auto w-full max-w-none rounded-t-[18px] bg-band p-0 font-sans text-on-band backdrop:bg-black/50 sm:m-auto sm:max-w-[560px] sm:rounded-[18px]"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close()
        }}
      >
        <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="planes-titulo" className="text-[1.25rem] font-semibold">
                Qué entra en cada plan
              </h2>
              <p className="mt-1 text-[0.9375rem] text-on-band-mid">
                Elige un nivel y la demo muestra solo lo que incluye.
              </p>
            </div>
            <button
              type="button"
              onClick={() => dialogo.current?.close()}
              className="rounded-[6px] p-1.5 text-on-band-mid hover:text-on-band"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="mt-5">
            <SelectorNivel apilado alElegir={() => dialogo.current?.close()} />
          </div>

          <p className="mt-5 text-[0.8125rem] leading-relaxed text-on-band-mid">
            Precios desde, finales, sin IVA. Aparte, lo que cuesta mantenerlo en línea: el dominio
            ronda {pesos(60_000)} al año, y una página sin panel se aloja gratis.
          </p>

          <a
            href={whatsappUrl(mensaje)}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-5 flex h-11 items-center justify-center gap-2 rounded-[10px] bg-accent text-[0.9375rem] font-semibold text-on-accent transition-colors hover:bg-accent-hover hover:text-on-band"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Cotizar algo así por WhatsApp
          </a>
        </div>
      </dialog>
    </>
  )
}

function BotonBarra({
  children,
  icono,
  onClick,
  pressed,
}: {
  children: ReactNode
  icono: ReactNode
  onClick: () => void
  pressed?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={`inline-flex h-8 items-center gap-1.5 rounded-[8px] px-2.5 text-[0.8125rem] font-medium transition-colors ${
        pressed ? "bg-on-band text-band" : "text-on-band hover:bg-band-2"
      }`}
    >
      {icono}
      {children}
    </button>
  )
}

/** "Ver como": un botón por nivel, con el precio desde del plan que lo cubre. */
function SelectorNivel({ apilado, alElegir }: { apilado?: boolean; alElegir?: () => void }) {
  const { config, nivel, elegirNivel } = useDemo()

  return (
    <div
      role="radiogroup"
      aria-label="Ver la demo como"
      className={apilado ? "grid gap-2" : "flex items-center gap-1 rounded-[10px] bg-band-2 p-1"}
    >
      {config.niveles.map((n) => {
        const activo = n.id === nivel.id
        const planes = n.planes.map((id) => PLANES[id])
        const desde = Math.min(...planes.map((p) => p.desde))
        return (
          <button
            key={n.id}
            type="button"
            role="radio"
            aria-checked={activo}
            onClick={() => {
              elegirNivel(n.id)
              alElegir?.()
            }}
            className={
              apilado
                ? `rounded-[12px] border p-4 text-left transition-colors ${
                    activo ? "border-accent bg-band-2" : "border-band-line hover:border-on-band-mid"
                  }`
                : `rounded-[7px] px-3 py-1 text-[0.8125rem] font-medium transition-colors ${
                    activo ? "bg-on-band text-band" : "text-on-band-mid hover:text-on-band"
                  }`
            }
          >
            {apilado ? (
              <>
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-[1rem] font-semibold">{n.etiqueta}</span>
                  <span className="text-[0.9375rem] text-on-band-mid">
                    desde <span className="font-semibold text-on-band">{pesos(desde)}</span>
                  </span>
                </span>
                {planes.map((p) => (
                  <span key={p.id} className="mt-1.5 block text-[0.875rem] leading-relaxed text-on-band-mid">
                    <span className="text-on-band">{p.nombre}</span>, {pesos(p.desde)}.{" "}
                    {p.resumen} Entrega en {p.entrega}.
                  </span>
                ))}
              </>
            ) : (
              <>
                {n.etiqueta}
                <span className={activo ? "ml-1.5 text-band/75" : "ml-1.5"}>{pesos(desde)}</span>
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}

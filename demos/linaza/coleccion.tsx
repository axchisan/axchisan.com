"use client"

import { useState } from "react"
import { Punto } from "@/demos/comun/recorrido"
import { disponible } from "@/demos/motores/catalogo/variantes"
import { useTienda } from "./estado"
import { CATEGORIAS, PRENDAS } from "./modelo"
import { TarjetaPrenda } from "./publico"

const TALLAS = ["XS", "S", "M", "L", "XL"]

export function ColeccionLinaza({ categoriaInicial }: { categoriaInicial?: string }) {
  const e = useTienda()
  const [categoria, setCategoria] = useState<string>(categoriaInicial && (CATEGORIAS as readonly string[]).includes(categoriaInicial) ? categoriaInicial : "Todo")
  const [talla, setTalla] = useState<string | null>(null)

  const visibles = PRENDAS.filter(
    (p) =>
      (categoria === "Todo" || p.categoria === categoria) &&
      (!talla || (p.tallas.includes(talla) && (!e || p.colores.some((c) => disponible(e.existencias, p.id, c.id, talla) > 0)))),
  )

  return (
    <section id="coleccion" aria-labelledby="coleccion-titulo" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 lg:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id="coleccion-titulo" className="text-[2.75rem] leading-none font-bold tracking-[-0.04em] sm:text-[3.5rem]">
          Colección
        </h2>
        <p className="max-w-[40ch] text-[1rem] text-li-gris">Cortada y cosida en nuestro taller de Medellín, en tandas pequeñas. Cuando una talla se acaba, puede tardar un mes en volver.</p>
      </div>

      <Punto id="filtros" className="mt-10">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-y border-li-linea py-4">
          <div role="group" aria-label="Tipo de prenda" className="flex flex-wrap gap-x-5 gap-y-2">
            {["Todo", ...CATEGORIAS].map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={categoria === c}
                onClick={() => setCategoria(c)}
                className={`text-[0.9375rem] underline-offset-[6px] ${categoria === c ? "font-semibold text-li-tinta underline decoration-2 decoration-li-azul" : "text-li-gris hover:text-li-tinta"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div role="group" aria-label="Talla" className="flex items-center gap-1.5 sm:ml-auto">
            <span className="mr-1 text-[0.9375rem] text-li-gris" aria-hidden>
              Talla
            </span>
            {TALLAS.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={talla === t}
                aria-label={`Solo talla ${t}`}
                onClick={() => setTalla(talla === t ? null : t)}
                className={`h-9 w-10 border text-[0.875rem] font-semibold ${talla === t ? "border-li-tinta bg-li-tinta text-white" : "border-li-linea hover:border-li-tinta"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Punto>

      <p className="mt-4 text-[0.9375rem] text-li-gris" aria-live="polite">
        {visibles.length} {visibles.length === 1 ? "prenda" : "prendas"}
        {talla ? ` con talla ${talla} disponible` : ""}
      </p>

      <Punto id="coleccion" className="mt-6">
        {visibles.length === 0 ? (
          <p className="py-10 text-li-gris">No hay prendas con esa combinación. Prueba otra talla o escríbenos: avisamos cuando vuelva.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
            {visibles.map((p, i) => (
              <TarjetaPrenda key={p.id} prenda={p} prioridad={i < 3} />
            ))}
          </div>
        )}
      </Punto>
    </section>
  )
}

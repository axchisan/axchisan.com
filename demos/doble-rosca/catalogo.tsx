"use client"

import Link from "next/link"
import { useDeferredValue, useState } from "react"
import { Check, ClipboardList, Minus, Plus, Search } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import { ponerEnLista, precioDe, useExistencias, useFerreteria, useLista } from "./estado"
import { CATEGORIAS, PRODUCTOS, productoPorId, type Producto } from "./modelo"
import { botonVerde, Disponibilidad } from "./publico"

/** Quita tildes y mayúsculas: "cafe" encuentra "café", "tefl" encuentra "Teflón". */
export const normalizar = (t: string) => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

export function CatalogoFerreteria() {
  const { incluye } = useDemo()
  const e = useFerreteria()
  const stock = useExistencias(e)
  const lista = useLista()
  const [texto, setTexto] = useState("")
  const [categoria, setCategoria] = useState<string>("Todas")
  const q = normalizar(useDeferredValue(texto).trim())

  const visibles = PRODUCTOS.filter(
    (p) => (categoria === "Todas" || p.categoria === categoria) && (!q || normalizar(`${p.nombre} ${p.sku} ${p.categoria}`).includes(q)),
  )
  const enLista = new Set(lista?.lineas.map((l) => l.productoId))
  const total = (lista?.lineas ?? []).reduce((t, l) => {
    const p = productoPorId(l.productoId)
    return t + (p ? precioDe(e, p) * l.cantidad : 0)
  }, 0)

  return (
    <section id="productos" aria-labelledby="productos-titulo" className="scroll-mt-12">
      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 lg:pt-20">
        <h2 id="productos-titulo" className="dr-ancha text-[2.25rem] leading-none font-extrabold sm:text-[2.75rem]">
          ¿Lo tenemos?
        </h2>
        <p className="mt-3 max-w-[56ch] text-[1.0625rem] text-dr-acero">
          Busque el producto, mire el precio y si hay. Arme su lista y nos la manda por WhatsApp: la alistamos para que pase a recoger o se la
          llevamos.
        </p>

        <Punto id="buscar" className="mt-8">
          <label className="relative block max-w-xl">
            <span className="sr-only">Buscar un producto</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-dr-acero" aria-hidden />
            <input
              type="search"
              value={texto}
              onChange={(ev) => setTexto(ev.target.value)}
              placeholder="Tornillo drywall, cemento, teflón…"
              className="h-14 w-full rounded-[8px] border-2 border-dr-tinta bg-white pr-4 pl-12 text-[1.0625rem] placeholder:text-dr-acero focus:border-dr-verde focus:outline-2 focus:outline-dr-verde"
            />
          </label>
        </Punto>

        <div role="group" aria-label="Categoría" className="mt-5 flex flex-wrap gap-2">
          {["Todas", ...CATEGORIAS].map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={categoria === c}
              onClick={() => setCategoria(c)}
              className={`h-9 rounded-[6px] border px-3.5 text-[0.9375rem] font-semibold ${categoria === c ? "border-dr-tinta bg-dr-tinta text-white" : "border-dr-linea bg-white hover:border-dr-tinta"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-8 pb-24 sm:px-6 lg:grid-cols-[1fr_320px]">
        <Punto id="disponible">
          <p className="mb-3 text-[0.9375rem] text-dr-acero" aria-live="polite">
            {visibles.length === PRODUCTOS.length ? `${PRODUCTOS.length} productos` : `${visibles.length} de ${PRODUCTOS.length} productos`}
          </p>
          {visibles.length === 0 ? (
            <div className="rounded-[8px] bg-white p-6 ring-1 ring-dr-linea">
              <p className="font-semibold">No encontramos «{texto}».</p>
              <p className="mt-1 text-dr-acero">Puede que lo tengamos con otro nombre. Pregúntenos por WhatsApp y le respondemos.</p>
            </div>
          ) : (
            <ul className="divide-y divide-dr-linea rounded-[8px] bg-white ring-1 ring-dr-linea">
              {visibles.map((p) => (
                <FilaProducto key={p.id} producto={p} precio={precioDe(e, p)} hay={stock?.get(p.id) ?? null} exacto={incluye("gestion")} enLista={enLista.has(p.id)} />
              ))}
            </ul>
          )}
        </Punto>

        <aside aria-label="Mi lista" className="lg:sticky lg:top-16 lg:self-start">
          <Punto id="lista">
            <div className="rounded-[8px] border-2 border-dr-tinta bg-white p-5">
              <h3 className="dr-ancha flex items-center gap-2 text-[1.25rem] font-extrabold">
                <ClipboardList className="h-5 w-5" aria-hidden />
                Mi lista
              </h3>
              {!lista?.lineas.length ? (
                <p className="mt-3 text-[0.9375rem] text-dr-acero">Agregue productos y aquí aparece la lista con el total.</p>
              ) : (
                <>
                  <ul className="mt-3 divide-y divide-dr-linea">
                    {lista.lineas.map((l) => {
                      const p = productoPorId(l.productoId)
                      if (!p) return null
                      return (
                        <li key={l.productoId} className="flex items-start justify-between gap-3 py-2.5 text-[0.9375rem]">
                          <span>
                            <span className="font-semibold tabular-nums">{l.cantidad} ×</span> {p.nombre}
                          </span>
                          <span className="shrink-0 tabular-nums">{pesos(precioDe(e, p) * l.cantidad)}</span>
                        </li>
                      )
                    })}
                  </ul>
                  <p className="mt-2 flex justify-between border-t-2 border-dr-tinta pt-3 font-bold">
                    <span>Total</span>
                    <span className="tabular-nums">{pesos(total)}</span>
                  </p>
                  <Link href={`${RAIZ}/lista`} className={`${botonVerde} mt-4 w-full`}>
                    Revisar y enviar
                  </Link>
                </>
              )}
            </div>
          </Punto>
        </aside>
      </div>

      {!!lista?.lineas.length && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-dr-linea bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
          <Link href={`${RAIZ}/lista`} className={`${botonVerde} w-full justify-between`}>
            <span>Mi lista ({lista.lineas.length})</span>
            <span className="tabular-nums">{pesos(total)}</span>
          </Link>
        </div>
      )}
    </section>
  )
}

function FilaProducto({ producto: p, precio, hay, exacto, enLista }: { producto: Producto; precio: number; hay: number | null; exacto: boolean; enLista: boolean }) {
  const [cantidad, setCantidad] = useState(1)
  const agotado = hay !== null && hay <= 0
  return (
    <li className="flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-4">
      <div className="min-w-[14rem] flex-1">
        <p className="font-semibold">{p.nombre}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.875rem] text-dr-acero">
          <span>{p.sku}</span>
          <span>{p.categoria}</span>
          {hay !== null && <Disponibilidad hay={hay} minimo={p.minimo} unidad={p.unidad} exacto={exacto} />}
        </p>
      </div>
      <p className="mr-auto sm:mr-0 sm:w-32 sm:text-right">
        <span className="block font-bold tabular-nums">{pesos(precio)}</span>
        <span className="text-[0.8125rem] text-dr-acero">por {p.unidad}</span>
      </p>
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-[6px] border border-dr-linea" role="group" aria-label={`Cantidad de ${p.nombre}`}>
          <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} className="flex h-10 w-9 items-center justify-center hover:bg-dr-zinc" aria-label="Uno menos" disabled={agotado}>
            <Minus className="h-4 w-4" aria-hidden />
          </button>
          <span className="w-8 text-center font-semibold tabular-nums">{cantidad}</span>
          <button type="button" onClick={() => setCantidad((c) => c + 1)} className="flex h-10 w-9 items-center justify-center hover:bg-dr-zinc" aria-label="Uno más" disabled={agotado}>
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <button
          type="button"
          disabled={agotado}
          onClick={() => {
            ponerEnLista(p.id, cantidad)
            setCantidad(1)
          }}
          className="inline-flex h-10 w-32 items-center justify-center gap-1.5 rounded-[6px] bg-dr-tinta px-3 text-[0.875rem] font-bold text-white hover:bg-dr-verde disabled:cursor-not-allowed disabled:bg-dr-linea disabled:text-dr-acero"
          aria-label={`Agregar ${p.nombre} a la lista`}
        >
          {enLista ? <Check className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
          {enLista ? "Sumar más" : "Agregar"}
        </button>
      </div>
    </li>
  )
}


"use client"

import Image from "next/image"
import Link from "next/link"
import { useId, useRef, useState } from "react"
import { Check, Ruler, X } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { disponible } from "@/demos/motores/catalogo/variantes"
import { RAIZ } from "./config"
import { agregar, useTienda } from "./estado"
import { GRATIS_DESDE, GUIAS, PRENDAS, type Prenda } from "./modelo"
import { botonTinta, Precio, TarjetaPrenda } from "./publico"
import { pesos } from "@/lib/catalogo/planes"

export function ProductoLinaza({ prenda: p }: { prenda: Prenda }) {
  const e = useTienda()
  const [color, setColor] = useState(p.colores[0].id)
  const [talla, setTalla] = useState<string | null>(null)
  const [aviso, setAviso] = useState("")
  const [falta, setFalta] = useState(false)
  const guia = useRef<HTMLDialogElement>(null)
  const id = useId()
  const c = p.colores.find((x) => x.id === color)!
  const hay = (t: string) => (e ? disponible(e.existencias, p.id, color, t) : 1)
  const otras = PRENDAS.filter((x) => x.id !== p.id && x.categoria !== p.categoria).slice(0, 3)

  return (
    <>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-6 pb-16 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:pt-10">
        <div className="relative aspect-[4/5] overflow-hidden bg-li-niebla">
          <Image key={c.id} src={c.fotos[0].src} alt={c.fotos[0].alt} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
        </div>

        <div className="lg:pt-6">
          <p className="text-[0.9375rem] text-li-gris">
            <Link href={`${RAIZ}#coleccion`} className="underline underline-offset-4 hover:text-li-tinta">
              Colección
            </Link>{" "}
            / {p.categoria}
          </p>
          <h1 className="mt-3 text-[2.25rem] leading-[1.05] font-bold tracking-[-0.03em] sm:text-[2.75rem]">{p.nombre}</h1>
          <div className="mt-4">
            <Precio p={p} grande />
          </div>
          <p className="mt-5 max-w-[48ch] text-[1.0625rem] leading-relaxed text-li-gris">{p.descripcion}</p>

          <Punto id="tallas" className="mt-8">
            <fieldset>
              <legend className="text-[0.9375rem] font-semibold">
                Color: <span className="font-normal">{c.nombre}</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {p.colores.map((x) => (
                  <label key={x.id} className="cursor-pointer rounded-full p-1 ring-1 ring-transparent has-[:checked]:ring-li-tinta has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-li-azul">
                    <input
                      type="radio"
                      name={`${id}-color`}
                      className="sr-only"
                      checked={color === x.id}
                      onChange={() => {
                        setColor(x.id)
                        setTalla(null)
                      }}
                    />
                    <span className="block h-8 w-8 rounded-full ring-1 ring-black/15" style={{ background: x.hex }} />
                    <span className="sr-only">{x.nombre}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className="sr-only">Talla</legend>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[0.9375rem] font-semibold" aria-hidden>
                  Talla
                </span>
                <Punto id="guia">
                  <button type="button" onClick={() => guia.current?.showModal()} className="inline-flex items-center gap-1.5 text-[0.9375rem] underline underline-offset-4 hover:text-li-azul">
                    <Ruler className="h-4 w-4" aria-hidden />
                    Guía de tallas
                  </button>
                </Punto>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tallas.map((t) => {
                  const n = hay(t)
                  return (
                    <label
                      key={t}
                      className={`relative flex h-12 w-14 items-center justify-center border text-[0.9375rem] font-semibold ${
                        n > 0 ? "cursor-pointer border-li-linea hover:border-li-tinta has-[:checked]:border-li-tinta has-[:checked]:bg-li-tinta has-[:checked]:text-white has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-li-azul" : "border-li-linea text-li-gris line-through"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${id}-talla`}
                        className="sr-only"
                        disabled={n <= 0}
                        checked={talla === t}
                        onChange={() => {
                          setTalla(t)
                          setFalta(false)
                        }}
                      />
                      {t}
                      {n <= 0 && <span className="sr-only"> (agotada)</span>}
                    </label>
                  )
                })}
              </div>
              <p className="mt-3 min-h-6 text-[0.9375rem]" aria-live="polite">
                {falta ? (
                  <span className="font-semibold text-li-rojo">Elige una talla para agregar a la bolsa.</span>
                ) : talla && hay(talla) === 1 ? (
                  <span className="font-semibold text-li-alerta">Queda una sola en {c.nombre.toLowerCase()}, talla {talla}.</span>
                ) : talla ? (
                  <span className="text-li-exito">Disponible en talla {talla}.</span>
                ) : (
                  p.modelo && <span className="text-li-gris">{p.modelo}</span>
                )}
              </p>
            </fieldset>
          </Punto>

          <button
            type="button"
            onClick={() => {
              if (!talla) {
                setFalta(true)
                return
              }
              agregar(p.id, color, talla)
              setAviso(`${p.nombre}, ${c.nombre.toLowerCase()}, talla ${talla}`)
            }}
            className={`${botonTinta} mt-4 w-full`}
          >
            Agregar a la bolsa
          </button>
          {aviso && (
            <div role="status" className="mt-4 flex items-start gap-3 border border-li-linea bg-li-niebla p-4 text-[0.9375rem]">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-li-exito" aria-hidden />
              <p>
                Agregaste {aviso}.{" "}
                <Link href={`${RAIZ}/bolsa`} className="font-semibold underline underline-offset-4">
                  Ver la bolsa
                </Link>
              </p>
            </div>
          )}

          <dl className="mt-10 divide-y divide-li-linea border-y border-li-linea text-[0.9375rem]">
            {[
              ["Tela", p.tela],
              ["Cuidado", p.cuidado],
              ["Envío", `A todo el país. Gratis desde ${pesos(GRATIS_DESDE)}.`],
              ["Cambios", "Durante 30 días, con la etiqueta puesta. El primer cambio va por nuestra cuenta."],
            ].map(([t, d]) => (
              <div key={t} className="grid grid-cols-[6rem_1fr] gap-4 py-3.5">
                <dt className="font-semibold">{t}</dt>
                <dd className="text-li-gris">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section aria-labelledby="combina" className="mx-auto max-w-7xl border-t border-li-linea px-4 py-16 sm:px-6">
        <h2 id="combina" className="text-[1.75rem] font-bold tracking-[-0.03em]">
          Para combinar
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
          {otras.map((x) => (
            <TarjetaPrenda key={x.id} prenda={x} />
          ))}
        </div>
      </section>

      <dialog
        ref={guia}
        aria-labelledby={`${id}-guia`}
        onClick={(ev) => ev.target === ev.currentTarget && ev.currentTarget.close()}
        className="m-auto w-[min(94vw,520px)] bg-white p-0 font-li text-li-tinta backdrop:bg-black/50"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id={`${id}-guia`} className="text-[1.375rem] font-bold">
              Guía de tallas: {GUIAS[p.guia].titulo.toLowerCase()}
            </h2>
            <button type="button" onClick={() => guia.current?.close()} className="p-1 text-li-gris hover:text-li-tinta" aria-label="Cerrar">
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <p className="mt-2 text-[0.9375rem] text-li-gris">Medidas del cuerpo en centímetros. Si quedas entre dos tallas, el lino se ve mejor en la más holgada.</p>
          <table className="mt-5 w-full text-[0.9375rem]">
            <thead>
              <tr className="border-b border-li-tinta text-left">
                {GUIAS[p.guia].columnas.map((col) => (
                  <th key={col} scope="col" className="py-2 font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GUIAS[p.guia].filas.map((f) => (
                <tr key={f[0]} className="border-b border-li-linea">
                  {f.map((celda, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="py-2.5 text-left font-semibold">
                        {celda}
                      </th>
                    ) : (
                      <td key={i} className="py-2.5 tabular-nums">
                        {celda}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </dialog>
    </>
  )
}

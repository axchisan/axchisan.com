"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useId, useRef, useState } from "react"
import { Flame, Leaf, MessageCircle, Minus, Plus, ShoppingBag, Users, X } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { precioUnitario, seleccionInicial, textoSeleccion, unidades, type Seleccion } from "@/demos/motores/pedidos/carrito"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import {
  agregarAlCarrito,
  cambiarCantidadCarrito,
  estaAgotado,
  fijarMesa,
  precioDe,
  precioLinea,
  subtotalCarrito,
  useCarrito,
  useRestaurante,
} from "./estado"
import { CATEGORIAS, ETIQUETA, PLATOS, platoPorId, type Etiqueta, type Plato } from "./modelo"
import { BotonWhatsappFogon, botonPrincipal, Olla } from "./publico"

const ICONO_ETIQUETA: Record<Etiqueta, { icono: typeof Flame; clase: string }> = {
  picante: { icono: Flame, clase: "text-fg-aji" },
  vegetariano: { icono: Leaf, clase: "text-fg-exito" },
  "para-compartir": { icono: Users, clase: "text-fg-ceniza" },
}

/** La foto del plato como un plato de peltre visto desde arriba. */
export function PlatoPeltre({ plato, tamano, gris }: { plato: Plato; tamano: number; gris?: boolean }) {
  return (
    <div className="fg-plato relative shrink-0 bg-white" style={{ width: tamano, height: tamano }}>
      {plato.foto ? (
        <Image src={plato.foto.src} alt={plato.foto.alt} fill sizes={`${tamano * 2}px`} className={`object-cover ${gris ? "grayscale" : ""}`} />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-fg-linea">
          <Olla className="h-1/3 w-1/3" />
        </span>
      )}
    </div>
  )
}

export function CartaFogon({ mesa }: { mesa?: number }) {
  const { incluye } = useDemo()
  const e = useRestaurante()
  const carrito = useCarrito()
  const [abierto, setAbierto] = useState<Plato | null>(null)
  const [aviso, setAviso] = useState("")
  const pide = incluye("pedidos")

  useEffect(() => {
    if (mesa) fijarMesa(mesa)
  }, [mesa])

  const mesaActual = carrito?.mesa
  const n = unidades(carrito?.lineas ?? [])
  const subtotal = subtotalCarrito(e, carrito?.lineas ?? [])

  return (
    <section id="carta" aria-labelledby="carta-titulo" className="scroll-mt-12 bg-white">
      {mesaActual && (
        <div className="bg-fg-cobalto text-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
            <p className="text-[1rem] font-semibold">
              Estás en la mesa {mesaActual}.{" "}
              <span className="font-normal text-fg-niebla">
                {pide ? "Lo que pidas aquí llega a tu mesa." : "Cuando quieras pedir, llama a quien te atiende."}
              </span>
            </p>
            <button type="button" onClick={() => fijarMesa(undefined)} className="text-[0.9375rem] font-semibold text-fg-maiz underline underline-offset-4 hover:no-underline">
              No estoy en el restaurante
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 lg:pt-20">
        <h2 id="carta-titulo" className="font-fg-letrero text-[2.75rem] leading-none text-fg-cobalto sm:text-[3.25rem]">
          La carta
        </h2>
        <p className="mt-3 max-w-[52ch] text-[1.0625rem] text-fg-ceniza">
          Precios con impuestos incluidos. El servicio es voluntario y no se suma en los pedidos de la página.
        </p>
      </div>

      <nav aria-label="Categorías de la carta" className="sticky top-12 z-30 mt-8 border-y border-fg-linea bg-white/95 backdrop-blur-sm">
        <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {CATEGORIAS.map((c) => (
            <li key={c.id} className="shrink-0">
              <a href={`#cat-${c.id}`} className="inline-flex h-9 items-center rounded-full border border-fg-linea px-4 text-[0.9375rem] font-semibold whitespace-nowrap hover:border-fg-cobalto hover:text-fg-cobalto">
                {c.nombre}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-8 pb-20 sm:px-6 lg:grid-cols-[1fr_340px] lg:pb-28">
        <Punto id="carta">
          <div className="space-y-14">
            {CATEGORIAS.map((c, ci) => (
              <div key={c.id} id={`cat-${c.id}`} className="scroll-mt-32">
                <h3 className="font-fg-letrero text-[1.75rem] leading-tight text-fg-tizne">{c.nombre}</h3>
                <ul className="mt-6 divide-y divide-fg-linea">
                  {PLATOS.filter((p) => p.categoria === c.id).map((p, i) => {
                    const fila = (
                      <FilaPlato key={p.id} plato={p} precio={precioDe(e, p)} agotado={estaAgotado(e, p.id)} pide={pide} alAgregar={() => setAbierto(p)} />
                    )
                    // El recorrido señala un plato con opciones, el primero de "Del fogón".
                    return ci === 2 && i === 0 ? (
                      <li key={p.id}>
                        <Punto id="plato">{fila}</Punto>
                      </li>
                    ) : (
                      <li key={p.id}>{fila}</li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </Punto>

        <aside aria-label={pide ? "Tu pedido" : "Cómo pedir"} className="lg:sticky lg:top-32 lg:self-start">
          <Punto id="carrito">
            {pide ? (
              <div className="rounded-[20px] border-2 border-fg-cobalto bg-fg-peltre p-5">
                <h3 className="font-fg-letrero text-[1.5rem] text-fg-cobalto">Tu pedido</h3>
                {n === 0 ? (
                  <p className="mt-3 text-[0.9375rem] text-fg-ceniza">Todavía no has agregado nada. Elige en la carta y aparece aquí.</p>
                ) : (
                  <>
                    <LineasCarrito />
                    <p className="mt-4 flex justify-between border-t border-fg-linea pt-4 text-[1.0625rem] font-bold">
                      <span>Subtotal</span>
                      <span className="tabular-nums">{pesos(subtotal)}</span>
                    </p>
                    <Link href={`${RAIZ}/pedir`} className={`${botonPrincipal} mt-4 w-full`}>
                      Continuar con el pedido
                    </Link>
                  </>
                )}
                <p className="mt-4 text-[0.875rem] text-fg-ceniza">En la mesa, para recoger o a domicilio en Chapinero y Teusaquillo.</p>
              </div>
            ) : (
              <div className="rounded-[20px] border-2 border-fg-cobalto bg-fg-peltre p-5">
                <h3 className="font-fg-letrero text-[1.5rem] text-fg-cobalto">¿Quieres pedir?</h3>
                <p className="mt-2 text-[0.9375rem] text-fg-ceniza">
                  Escríbenos con lo que quieres y te confirmamos el total y el tiempo. Domicilios en Chapinero y Teusaquillo.
                </p>
                <BotonWhatsappFogon className={`${botonPrincipal} mt-4 w-full`}>
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  Pedir por WhatsApp
                </BotonWhatsappFogon>
              </div>
            )}
          </Punto>
        </aside>
      </div>

      {pide && n > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-fg-linea bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
          <Link href={`${RAIZ}/pedir`} className={`${botonPrincipal} w-full justify-between`}>
            <span className="inline-flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" aria-hidden />
              Ver tu pedido ({n})
            </span>
            <span className="tabular-nums">{pesos(subtotal)}</span>
          </Link>
        </div>
      )}

      {abierto && (
        <DialogoPlato
          key={abierto.id}
          plato={abierto}
          alCerrar={() => setAbierto(null)}
          alAgregar={(texto) => {
            setAviso(texto)
            setTimeout(() => setAviso(""), 3500)
          }}
        />
      )}
      <p role="status" aria-live="polite" className={`fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-fg-tizne px-5 py-2.5 text-[0.9375rem] font-semibold text-white shadow-lg transition-opacity lg:bottom-6 ${aviso ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        {aviso}
      </p>
    </section>
  )
}

function FilaPlato({ plato, precio, agotado, pide, alAgregar }: { plato: Plato; precio: number; agotado: boolean; pide: boolean; alAgregar: () => void }) {
  return (
    <div className="flex gap-4 py-5 sm:gap-6">
      <div className="pt-1 pl-1.5">
        <PlatoPeltre plato={plato} tamano={84} gris={agotado} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h4 className="text-[1.125rem] leading-snug font-bold">{plato.nombre}</h4>
          <p className="text-[1.0625rem] font-bold tabular-nums">
            {plato.opciones?.some((g) => g.tipo === "uno" && g.opciones.some((o) => o.extra)) && <span className="text-[0.875rem] font-normal">desde </span>}
            {pesos(precio)}
          </p>
        </div>
        <p className="mt-1 max-w-[56ch] text-[0.9375rem] leading-relaxed text-fg-ceniza">{plato.descripcion}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
          {plato.etiquetas?.map((t) => {
            const { icono: Icono, clase } = ICONO_ETIQUETA[t]
            return (
              <span key={t} className="inline-flex items-center gap-1 text-[0.875rem] font-semibold text-fg-tizne">
                <Icono className={`h-4 w-4 ${clase}`} aria-hidden />
                {ETIQUETA[t]}
              </span>
            )
          })}
          {agotado ? (
            <span className="ml-auto rounded-full bg-fg-aji-suave px-3 py-1 text-[0.875rem] font-bold text-fg-aji">Agotado hoy</span>
          ) : (
            pide && (
              <button
                type="button"
                onClick={alAgregar}
                className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-full border-2 border-fg-cobalto px-4 text-[0.9375rem] font-bold text-fg-cobalto transition-colors hover:bg-fg-cobalto hover:text-white"
                aria-label={`Agregar ${plato.nombre}`}
              >
                <Plus className="h-4 w-4" aria-hidden />
                Agregar
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}

/** Se monta al elegir un plato y se desmonta al cerrarse: cada apertura empieza limpia. */
function DialogoPlato({ plato, alCerrar, alAgregar }: { plato: Plato; alCerrar: () => void; alAgregar: (aviso: string) => void }) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const id = useId()
  const e = useRestaurante()
  const [seleccion, setSeleccion] = useState<Seleccion>(() => seleccionInicial(plato))
  const [cantidad, setCantidad] = useState(1)
  const [nota, setNota] = useState("")

  useEffect(() => {
    dialogo.current?.showModal()
  }, [])

  const unitario = precioUnitario(plato, seleccion, precioDe(e, plato))

  return (
    <dialog
      ref={dialogo}
      aria-labelledby={`${id}-titulo`}
      onClose={alCerrar}
      onClick={(ev) => {
        if (ev.target === ev.currentTarget) ev.currentTarget.close()
      }}
      className="m-0 mt-auto w-full max-w-none rounded-t-[24px] bg-white p-0 font-fg-texto text-fg-tizne backdrop:bg-black/50 sm:m-auto sm:max-w-[520px] sm:rounded-[24px]"
    >
      <form
        method="dialog"
        className="flex max-h-[88vh] flex-col"
        onSubmit={() => {
          agregarAlCarrito(plato.id, seleccion, cantidad, nota)
          const detalle = textoSeleccion(plato, seleccion)
          alAgregar(`Agregado: ${cantidad} × ${plato.nombre}${detalle ? `, ${detalle.toLowerCase()}` : ""}`)
        }}
      >
        <div className="overflow-y-auto px-5 pt-5 pb-4 sm:px-7 sm:pt-7">
          <div className="flex items-start gap-4">
            <div className="p-1.5">
              <PlatoPeltre plato={plato} tamano={96} />
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <h2 id={`${id}-titulo`} className="font-fg-letrero text-[1.625rem] leading-tight text-fg-cobalto">
                {plato.nombre}
              </h2>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-fg-ceniza">{plato.descripcion}</p>
            </div>
            <button type="button" onClick={() => dialogo.current?.close()} className="-mt-1 -mr-2 rounded-full p-2 text-fg-ceniza hover:text-fg-tizne" aria-label="Cerrar">
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          {plato.opciones?.map((g) => (
            <fieldset key={g.id} className="mt-6">
              <legend className="text-[1rem] font-bold">
                {g.nombre}
                <span className="ml-2 text-[0.875rem] font-normal text-fg-ceniza">{g.tipo === "uno" ? "Elige una" : "Opcional"}</span>
              </legend>
              <div className="mt-2 divide-y divide-fg-linea rounded-[14px] border border-fg-linea">
                {g.opciones.map((o) => {
                  const marcada = seleccion[g.id]?.includes(o.id) ?? false
                  return (
                    <label key={o.id} className="flex cursor-pointer items-center gap-3 px-4 py-3 text-[1rem] has-[:checked]:bg-fg-peltre">
                      <input
                        type={g.tipo === "uno" ? "radio" : "checkbox"}
                        name={`${id}-${g.id}`}
                        checked={marcada}
                        onChange={() =>
                          setSeleccion((s) => ({
                            ...s,
                            [g.id]: g.tipo === "uno" ? [o.id] : marcada ? s[g.id].filter((x) => x !== o.id) : [...(s[g.id] ?? []), o.id],
                          }))
                        }
                        className="h-5 w-5 accent-fg-cobalto"
                      />
                      <span className="flex-1">{o.nombre}</span>
                      {o.extra ? <span className="text-[0.9375rem] text-fg-ceniza tabular-nums">+ {pesos(o.extra)}</span> : null}
                    </label>
                  )
                })}
              </div>
            </fieldset>
          ))}

          <label className="mt-6 block">
            <span className="text-[1rem] font-bold">Nota para la cocina</span>
            <span className="ml-2 text-[0.875rem] text-fg-ceniza">Opcional</span>
            <textarea
              value={nota}
              onChange={(ev) => setNota(ev.target.value)}
              rows={2}
              maxLength={140}
              placeholder="Sin cebolla, el ají aparte…"
              className="mt-2 block w-full rounded-[12px] border border-fg-linea px-3 py-2.5 text-[1rem] placeholder:text-fg-ceniza focus:border-fg-cobalto focus:outline-2 focus:outline-fg-cobalto"
            />
          </label>
        </div>

        <div className="flex items-center gap-3 border-t border-fg-linea px-5 py-4 sm:px-7">
          <div className="flex items-center rounded-full border-2 border-fg-linea" role="group" aria-label="Cantidad">
            <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-fg-peltre" aria-label="Uno menos">
              <Minus className="h-4 w-4" aria-hidden />
            </button>
            <span className="w-6 text-center text-[1.0625rem] font-bold tabular-nums" aria-live="polite">
              {cantidad}
            </span>
            <button type="button" onClick={() => setCantidad((c) => Math.min(20, c + 1))} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-fg-peltre" aria-label="Uno más">
              <Plus className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <button type="submit" className={`${botonPrincipal} flex-1`}>
            Agregar por {pesos(unitario * cantidad)}
          </button>
        </div>
      </form>
    </dialog>
  )
}

/** Las líneas del carrito con su cantidad editable. Se usa en la carta y al pedir. */
export function LineasCarrito() {
  const e = useRestaurante()
  const carrito = useCarrito()
  return (
    <ul className="mt-3 divide-y divide-fg-linea">
      {(carrito?.lineas ?? []).map((l) => {
        const plato = platoPorId(l.productoId)
        if (!plato) return null
        const detalle = textoSeleccion(plato, l.seleccion)
        return (
          <li key={l.clave} className="py-3">
            <div className="flex justify-between gap-3">
              <p className="text-[0.9375rem] font-semibold">{plato.nombre}</p>
              <p className="text-[0.9375rem] font-semibold tabular-nums">{pesos(precioLinea(e, l) * l.cantidad)}</p>
            </div>
            {(detalle || l.nota) && (
              <p className="mt-0.5 text-[0.875rem] text-fg-ceniza">{[detalle, l.nota && `Nota: ${l.nota}`].filter(Boolean).join(". ")}</p>
            )}
            <div className="mt-2 flex items-center gap-1" role="group" aria-label={`Cantidad de ${plato.nombre}`}>
              <button type="button" onClick={() => cambiarCantidadCarrito(l.clave, l.cantidad - 1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-fg-linea hover:border-fg-cobalto" aria-label={l.cantidad === 1 ? `Quitar ${plato.nombre}` : `Uno menos de ${plato.nombre}`}>
                <Minus className="h-3.5 w-3.5" aria-hidden />
              </button>
              <span className="w-7 text-center text-[0.9375rem] font-bold tabular-nums">{l.cantidad}</span>
              <button type="button" onClick={() => cambiarCantidadCarrito(l.clave, l.cantidad + 1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-fg-linea hover:border-fg-cobalto" aria-label={`Uno más de ${plato.nombre}`}>
                <Plus className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

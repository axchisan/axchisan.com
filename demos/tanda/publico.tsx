"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, type ReactNode } from "react"
import { MessageCircle, Minus, Plus, ShoppingBag } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { useAhora } from "@/demos/comun/reloj"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { textoHora } from "@/demos/motores/agenda/tiempo"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import { agregar, pedidosDeHoy, useBolsa, usePanaderia } from "./estado"
import { disponibilidad, tandasDelDia, yaSalio } from "./horneadas"
import { CATEGORIAS, PRODUCTOS, type Producto } from "./modelo"

const hora = (hhmm: string) => textoHora(`2000-01-01T${hhmm}`)

/** Un pan con sus tres cortes: la marca. */
export function Pan({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 26" className={className} aria-hidden>
      <path d="M4 20C4 10 11 3 20 3s16 7 16 17c0 2-1.5 3-3.5 3h-25C5.5 23 4 22 4 20Z" fill="currentColor" />
      <g stroke="var(--color-ta-mantequilla)" strokeWidth="2.2" strokeLinecap="round">
        <path d="M12 9l4 5" />
        <path d="M18.5 7l4 5" />
        <path d="M25 9l4 5" />
      </g>
    </svg>
  )
}

export function MarcaTanda({ claro }: { claro?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${claro ? "text-ta-mantequilla" : "text-ta-cacao"}`}>
      <Pan className="h-7 w-10" />
      <span className="font-ta-titulo text-[1.75rem] leading-none font-bold">tanda</span>
    </span>
  )
}

export const botonCacao =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ta-cacao px-6 text-[1rem] font-bold text-white transition-colors hover:bg-ta-cacao-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ta-fresa disabled:cursor-not-allowed disabled:opacity-50"
export const botonBorde =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-ta-cacao px-6 text-[1rem] font-bold transition-colors hover:bg-ta-cacao hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ta-fresa"
export const campo =
  "mt-1.5 block h-12 w-full rounded-[14px] border-2 border-ta-linea bg-white px-3.5 text-[1rem] placeholder:text-ta-miga focus:border-ta-cacao focus:outline-none"

export function BotonWhatsappTanda(props: { children: ReactNode; className?: string; mensaje?: string }) {
  return (
    <WhatsappSimulado negocio="la panadería" mensaje={props.mensaje ?? "Hola, Tanda. Quiero hacer un pedido."} className={props.className}>
      {props.children}
    </WhatsappSimulado>
  )
}

export function CabeceraTanda() {
  const { incluye } = useDemo()
  const bolsa = useBolsa()
  const n = bolsa?.lineas.reduce((t, l) => t + l.cantidad, 0) ?? 0
  return (
    <header className="bg-ta-mantequilla">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href={RAIZ} aria-label="Tanda, inicio">
          <MarcaTanda />
        </Link>
        <nav aria-label="Secciones" className="ml-auto hidden items-center gap-6 text-[0.9375rem] font-bold md:flex">
          <a href={`${RAIZ}#horneadas`} className="hover:underline">Horneadas</a>
          <a href={`${RAIZ}#vitrina`} className="hover:underline">Vitrina</a>
          <a href={`${RAIZ}#tortas`} className="hover:underline">Tortas</a>
        </nav>
        {incluye("pedidos") ? (
          <Link href={`${RAIZ}/bolsa`} className="ml-auto inline-flex h-10 items-center gap-2 rounded-full bg-ta-cacao px-4 text-[0.9375rem] font-bold text-white hover:bg-ta-cacao-2 md:ml-0">
            <ShoppingBag className="h-4 w-4" aria-hidden />
            Bolsa{n ? ` (${n})` : ""}
          </Link>
        ) : (
          <BotonWhatsappTanda className="ml-auto inline-flex h-10 items-center gap-2 rounded-full bg-ta-cacao px-4 text-[0.9375rem] font-bold text-white hover:bg-ta-cacao-2 md:ml-0">
            <MessageCircle className="h-4 w-4" aria-hidden />
            Pedir
          </BotonWhatsappTanda>
        )}
      </div>
    </header>
  )
}

/**
 * La línea del día: las horneadas de 6:00 a. m. a 5:00 p. m., con lo que sale en
 * cada una y una marca en la hora actual. Es lo memorable de la página.
 */
export function Horneadas() {
  const ahora = useAhora()
  const tandas = tandasDelDia(PRODUCTOS)
  const inicio = 5.5 * 60
  const fin = 17.5 * 60
  const pos = (hhmm: string) => ((Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5)) - inicio) / (fin - inicio)) * 100
  const ahoraM = ahora ? ahora.getHours() * 60 + ahora.getMinutes() : null
  const proxima = ahora ? tandas.find((t) => !yaSalio(t.hora, ahora)) : null
  const faltan = proxima && ahoraM !== null ? Number(proxima.hora.slice(0, 2)) * 60 + Number(proxima.hora.slice(3, 5)) - ahoraM : null

  return (
    <section id="horneadas" aria-labelledby="horneadas-titulo" className="scroll-mt-12 bg-ta-cacao text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="horneadas-titulo" className="font-ta-titulo text-[2.5rem] leading-none font-bold text-ta-mantequilla">
            Horneadas de hoy
          </h2>
          <p className="text-[1.0625rem]" aria-live="polite">
            {!ahora ? " " : proxima ? (faltan! <= 60 ? `La próxima sale en ${faltan} minutos: ${proxima.productos.map((p) => p.nombre.toLowerCase()).join(", ")}.` : `La próxima sale a las ${hora(proxima.hora)}`) : "Ya salieron todas las de hoy. Mañana, desde las 6:00 a. m."}
          </p>
        </div>
        <Punto id="tandas" className="mt-10">
          {/* Escritorio: la línea con la hora actual. */}
          <div className="relative hidden h-60 md:block" aria-hidden>
            <div className="absolute inset-x-0 top-[7.25rem] h-1 rounded-full bg-white/20" />
            {ahoraM !== null && ahoraM > inicio && ahoraM < fin && (
              <div className="absolute top-12 bottom-8 w-0.5 bg-ta-fresa" style={{ left: `${((ahoraM - inicio) / (fin - inicio)) * 100}%` }}>
                <span className="absolute -bottom-6 -translate-x-1/2 rounded-full bg-ta-fresa px-2 py-0.5 text-[0.75rem] font-bold whitespace-nowrap">Ahora</span>
              </div>
            )}
            {tandas.map((t, i) => {
              const salio = ahora ? yaSalio(t.hora, ahora) : false
              // Las etiquetas se alternan arriba y abajo: hay tandas a una hora de distancia.
              const arriba = i % 2 === 1
              return (
                <div key={t.hora} className={`absolute flex w-32 -translate-x-1/2 flex-col items-center ${arriba ? "top-0 flex-col-reverse" : "top-[6.5rem]"}`} style={{ left: `${pos(t.hora)}%` }}>
                  <span className={`block h-7 w-7 shrink-0 rounded-full border-4 ${salio ? "border-ta-mantequilla bg-ta-mantequilla" : "border-ta-mantequilla bg-ta-cacao"} ${arriba ? "mt-2" : ""}`} />
                  <span className={`block text-center ${arriba ? "" : "mt-2"}`}>
                    <span className="block font-ta-titulo text-[1.125rem] font-bold text-ta-mantequilla">{hora(t.hora)}</span>
                    <span className="block text-[0.8125rem] leading-snug text-white/85">{t.productos.map((p) => p.nombre).join(", ")}</span>
                  </span>
                </div>
              )
            })}
          </div>
          {/* Celular y lectores de pantalla: la lista. */}
          <ol className="grid gap-2 sm:grid-cols-2 md:sr-only">
            {tandas.map((t) => {
              const salio = ahora ? yaSalio(t.hora, ahora) : false
              return (
                <li key={t.hora} className="flex gap-3 rounded-[14px] bg-white/10 p-3">
                  <span className="w-28 shrink-0 font-ta-titulo text-[1.125rem] font-bold text-ta-mantequilla">{hora(t.hora)}</span>
                  <span className="text-[0.9375rem]">
                    {t.productos.map((p) => p.nombre).join(", ")}
                    <span className="block text-[0.8125rem] text-white/85">{salio ? "Ya salió" : "Por salir"}</span>
                  </span>
                </li>
              )
            })}
          </ol>
        </Punto>
      </div>
    </section>
  )
}

export function Vitrina() {
  return (
    <section id="vitrina" aria-labelledby="vitrina-titulo" className="mx-auto max-w-6xl scroll-mt-12 px-4 py-16 sm:px-6 lg:py-20">
      <h2 id="vitrina-titulo" className="font-ta-titulo text-[2.5rem] leading-none font-bold">
        La vitrina
      </h2>
      {CATEGORIAS.map((c, ci) => (
        <div key={c.id} className="mt-10">
          <h3 className="text-[1.25rem] font-extrabold">{c.nombre}</h3>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTOS.filter((p) => p.categoria === c.id).map((p, i) => (
              <li key={p.id}>{ci === 0 && i === 0 ? <Punto id="quedan"><Tarjeta p={p} /></Punto> : <Tarjeta p={p} />}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

function Tarjeta({ p }: { p: Producto }) {
  const { incluye } = useDemo()
  const e = usePanaderia()
  const ahora = useAhora()
  const [cantidad, setCantidad] = useState(1)
  const [opcion, setOpcion] = useState(p.opciones?.[0]?.opciones[0].id ?? "")
  const [aviso, setAviso] = useState("")
  const d = ahora ? disponibilidad(p, ahora, pedidosDeHoy(e)) : null
  const agotado = d?.quedan === 0
  const pide = incluye("pedidos")
  const grupo = p.opciones?.[0]

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[20px] bg-white ring-2 ring-ta-linea">
      <div className="relative aspect-[4/3] bg-ta-mantequilla-suave">
        {p.foto ? (
          <Image src={p.foto.src} alt={p.foto.alt} fill sizes="(min-width: 1024px) 260px, 50vw" className={`object-cover ${agotado ? "grayscale" : ""}`} />
        ) : (
          <span className="flex h-full items-center justify-center text-ta-mantequilla">
            <Pan className="h-12 w-20" />
          </span>
        )}
        {d?.recien && <span className="absolute top-3 left-3 rounded-full bg-ta-fresa px-3 py-1 text-[0.8125rem] font-bold text-white">Recién salido</span>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="font-extrabold">{p.nombre}</h4>
          <span className="font-bold tabular-nums">{pesos(p.precio)}</span>
        </div>
        <p className="mt-1 flex-1 text-[0.875rem] leading-relaxed text-ta-miga">{p.descripcion}</p>
        <p className="mt-3 text-[0.875rem] font-bold" aria-live="polite">
          {!d ? (
            " "
          ) : d.quedan === null ? (
            <span className="text-ta-miga">Se prepara al momento</span>
          ) : !incluye("pedidos") ? (
            <span className="text-ta-miga">Sale a las {p.tandas.map(hora).join(", ")}</span>
          ) : agotado ? (
            <span className="text-ta-fresa">{d.proxima ? `Se acabó. Sale otra vez a las ${hora(d.proxima)}` : "Se acabó por hoy"}</span>
          ) : (
            <span className={d.quedan <= 8 ? "text-ta-alerta" : "text-ta-exito"}>Quedan {d.quedan}</span>
          )}
        </p>
        {pide && !agotado && (
          <div className="mt-3 space-y-2">
            {grupo && (
              <label className="block">
                <span className="sr-only">
                  {grupo.nombre} de {p.nombre}
                </span>
                <select value={opcion} onChange={(ev) => setOpcion(ev.target.value)} className="h-10 w-full rounded-full border-2 border-ta-linea bg-white px-3 text-[0.875rem]">
                  {grupo.opciones.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.nombre}
                      {o.extra ? ` (+ ${pesos(o.extra)})` : ""}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-full border-2 border-ta-linea" role="group" aria-label={`Cantidad de ${p.nombre}`}>
                <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} className="flex h-9 w-9 items-center justify-center" aria-label="Uno menos">
                  <Minus className="h-4 w-4" aria-hidden />
                </button>
                <span className="w-6 text-center font-bold tabular-nums">{cantidad}</span>
                <button type="button" onClick={() => setCantidad((c) => Math.min(d?.quedan ?? 30, c + 1))} className="flex h-9 w-9 items-center justify-center" aria-label="Uno más">
                  <Plus className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  agregar(p.id, cantidad, grupo ? { [grupo.id]: [opcion] } : {})
                  setAviso(`${cantidad} en la bolsa`)
                  setCantidad(1)
                }}
                className="h-9 flex-1 rounded-full bg-ta-cacao px-3 text-[0.875rem] font-bold text-white hover:bg-ta-cacao-2"
                aria-label={`Agregar ${p.nombre}`}
              >
                Agregar
              </button>
            </div>
            {aviso && (
              <p role="status" className="text-[0.8125rem] font-bold text-ta-exito">
                {aviso}.{" "}
                <Link href={`${RAIZ}/bolsa`} className="underline underline-offset-2">
                  Ver la bolsa
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

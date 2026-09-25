"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { agotado, tallasCon } from "@/demos/motores/catalogo/variantes"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import { useBolsa, useTienda } from "./estado"
import type { Prenda } from "./modelo"

/** La flor del lino: cinco pétalos. Es la marca. */
export function Flor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {[0, 72, 144, 216, 288].map((g) => (
        <ellipse key={g} cx="12" cy="6.2" rx="3.6" ry="5.4" fill="currentColor" transform={`rotate(${g} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="2.2" fill="#fff" />
    </svg>
  )
}

export function MarcaLinaza({ claro }: { claro?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${claro ? "text-white" : "text-li-tinta"}`}>
      <Flor className={`h-5 w-5 ${claro ? "text-li-azul-claro" : "text-li-azul"}`} />
      <span className="text-[1.5rem] leading-none font-bold tracking-[-0.04em]">linaza</span>
    </span>
  )
}

export const botonTinta =
  "inline-flex h-12 items-center justify-center gap-2 bg-li-tinta px-6 text-[1rem] font-semibold text-white transition-colors hover:bg-li-azul focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-li-azul disabled:cursor-not-allowed disabled:bg-li-linea disabled:text-li-gris"
export const botonBorde =
  "inline-flex h-12 items-center justify-center gap-2 border border-li-tinta px-6 text-[1rem] font-semibold transition-colors hover:bg-li-tinta hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-li-azul"
export const campo =
  "mt-1.5 block h-12 w-full border border-li-linea bg-white px-3 text-[1rem] placeholder:text-li-gris focus:border-li-tinta focus:outline-2 focus:outline-li-azul aria-[invalid=true]:border-li-rojo"

export function Precio({ p, grande }: { p: Pick<Prenda, "precio" | "antes">; grande?: boolean }) {
  return (
    <span className={`inline-flex items-baseline gap-2 tabular-nums ${grande ? "text-[1.375rem]" : "text-[1rem]"}`}>
      <span className={p.antes ? "font-semibold text-li-azul" : "font-semibold"}>{pesos(p.precio)}</span>
      {p.antes && (
        <span className="text-[0.875em] text-li-gris line-through">
          <span className="sr-only">antes </span>
          {pesos(p.antes)}
        </span>
      )}
    </span>
  )
}

/** Una prenda en la colección: foto grande, nombre, precio y los colores. */
export function TarjetaPrenda({ prenda: p, prioridad }: { prenda: Prenda; prioridad?: boolean }) {
  const e = useTienda()
  const sinStock = e ? agotado(p, e.existencias) : false
  const pocas = e && !sinStock ? p.colores.every((c) => tallasCon(p, e.existencias, c.id).length <= 1) : false
  return (
    <article className="group">
      <Link href={`${RAIZ}/producto/${p.id}`} className="block focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-li-azul">
        <div className="relative aspect-[4/5] overflow-hidden bg-li-niebla">
          <Image src={p.colores[0].fotos[0].src} alt={p.colores[0].fotos[0].alt} fill priority={prioridad} sizes="(min-width: 1024px) 33vw, 50vw" className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${sinStock ? "opacity-60" : ""}`} />
          {(p.antes || sinStock || pocas) && (
            <span className="absolute top-3 left-3 bg-white px-2 py-1 text-[0.8125rem] font-semibold">
              {sinStock ? "Agotado" : p.antes ? "Rebaja" : "Últimas tallas"}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-[1rem] leading-snug font-semibold group-hover:underline group-hover:underline-offset-4">{p.nombre}</h3>
      </Link>
      <div className="mt-1 flex items-center justify-between gap-3">
        <Precio p={p} />
        <span className="flex gap-1" aria-label={`${p.colores.length} ${p.colores.length === 1 ? "color" : "colores"}`}>
          {p.colores.map((c) => (
            <span key={c.id} title={c.nombre} className="h-3.5 w-3.5 rounded-full ring-1 ring-black/15" style={{ background: c.hex }} />
          ))}
        </span>
      </div>
    </article>
  )
}

export function CabeceraLinaza() {
  const bolsa = useBolsa()
  const n = bolsa?.lineas.reduce((t, l) => t + l.cantidad, 0) ?? 0
  return (
    <header className="sticky top-12 z-30 border-b border-li-linea bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6">
        <Link href={RAIZ} aria-label="Linaza, inicio">
          <MarcaLinaza />
        </Link>
        <nav aria-label="Colección" className="hidden gap-6 text-[0.9375rem] md:flex">
          <Link href={`${RAIZ}#coleccion`} className="hover:underline hover:underline-offset-4">Colección</Link>
          <Link href={`${RAIZ}?categoria=Camisas#coleccion`} className="hover:underline hover:underline-offset-4">Camisas</Link>
          <Link href={`${RAIZ}?categoria=Vestidos#coleccion`} className="hover:underline hover:underline-offset-4">Vestidos</Link>
          <Link href={`${RAIZ}#taller`} className="hover:underline hover:underline-offset-4">El taller</Link>
        </nav>
        <Link href={`${RAIZ}/bolsa`} className="ml-auto inline-flex h-10 items-center gap-2 px-2 text-[0.9375rem] font-semibold hover:underline hover:underline-offset-4">
          <ShoppingBag className="h-5 w-5" aria-hidden />
          Bolsa
          <span className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[0.8125rem] tabular-nums ${n ? "bg-li-azul text-white" : "bg-li-niebla"}`}>
            {n}
            <span className="sr-only"> {n === 1 ? "prenda" : "prendas"}</span>
          </span>
        </Link>
      </div>
    </header>
  )
}

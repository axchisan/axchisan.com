"use client"

import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { BedDouble, Car, Maximize2 } from "lucide-react"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import type { EstadoInmueble, Inmueble } from "./modelo"

/** La placa de nomenclatura de una casa: la marca. */
export function Placa({ className, claro }: { className?: string; claro?: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-[4px] border-2 px-1.5 py-0.5 font-bold leading-none tabular-nums ${claro ? "border-white text-white" : "border-nm-tinta text-nm-tinta"} ${className ?? ""}`} aria-hidden>
      #
    </span>
  )
}

export function MarcaNomenclatura({ claro }: { claro?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${claro ? "text-white" : "text-nm-tinta"}`}>
      <Placa className="text-[1rem]" claro={claro} />
      <span className="leading-none">
        <span className="block text-[1.1875rem] font-extrabold tracking-[-0.02em]">Nomenclatura</span>
        <span className={`block text-[0.75rem] font-medium ${claro ? "text-nm-agua" : "text-nm-gris"}`}>finca raíz en el sur del valle</span>
      </span>
    </span>
  )
}

export const botonPetroleo =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[6px] bg-nm-petroleo px-6 text-[1rem] font-semibold text-white transition-colors hover:bg-nm-petroleo-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nm-petroleo disabled:cursor-not-allowed disabled:opacity-60"
export const botonBorde =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[6px] border-2 border-nm-tinta px-6 text-[1rem] font-semibold transition-colors hover:bg-nm-tinta hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nm-petroleo"
export const campo =
  "mt-1.5 block h-12 w-full rounded-[6px] border border-nm-linea bg-white px-3 text-[1rem] placeholder:text-nm-gris focus:border-nm-petroleo focus:outline-2 focus:outline-nm-petroleo"

/** "$ 520 millones" para venta, "$ 2.400.000 al mes" para arriendo. */
export function precioTexto(x: Pick<Inmueble, "precio" | "operacion">) {
  if (x.operacion === "arriendo") return `${pesos(x.precio)} al mes`
  const millones = x.precio / 1_000_000
  return `$ ${millones.toLocaleString("es-CO", { maximumFractionDigits: millones % 1 ? 1 : 0 })} millones`
}

export function BotonWhatsappInmobiliaria(props: { children: ReactNode; className?: string; mensaje?: string }) {
  return (
    <WhatsappSimulado negocio="la inmobiliaria" mensaje={props.mensaje ?? "Hola, Nomenclatura. Estoy buscando inmueble."} className={props.className}>
      {props.children}
    </WhatsappSimulado>
  )
}

type Vigente = Inmueble & { estado: EstadoInmueble; destacado: boolean }

export function TarjetaInmueble({ x, prioridad }: { x: Vigente; prioridad?: boolean }) {
  return (
    <article className="group overflow-hidden rounded-[8px] bg-white ring-1 ring-nm-linea">
      <Link href={`${RAIZ}/inmuebles/${x.id}`} className="block focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nm-petroleo">
        <div className="relative aspect-[3/2] overflow-hidden bg-nm-linea">
          <Image src={x.fotos[0].src} alt={x.fotos[0].alt} fill priority={prioridad} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          <span className="absolute top-3 left-3 rounded-[4px] bg-white px-2 py-1 text-[0.8125rem] font-semibold">{x.operacion === "venta" ? "Venta" : "Arriendo"}</span>
          {x.estado !== "disponible" ? (
            <span className="absolute top-3 right-3 rounded-[4px] bg-nm-tinta px-2 py-1 text-[0.8125rem] font-semibold text-white">{x.estado === "reservado" ? "Reservado" : x.operacion === "venta" ? "Vendido" : "Arrendado"}</span>
          ) : x.publicado <= 3 ? (
            <span className="absolute top-3 right-3 rounded-[4px] bg-nm-ladrillo px-2 py-1 text-[0.8125rem] font-semibold text-white">Nuevo</span>
          ) : null}
        </div>
        <div className="p-4">
          <p className="text-[1.25rem] font-extrabold tracking-[-0.01em]">{precioTexto(x)}</p>
          <h3 className="mt-1 leading-snug font-semibold group-hover:underline group-hover:underline-offset-4">{x.titulo}</h3>
          <p className="mt-0.5 text-[0.875rem] text-nm-gris">
            {x.barrio}, {x.zona}
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.875rem]" aria-label="Datos principales">
            <li className="inline-flex items-center gap-1.5">
              <Maximize2 className="h-4 w-4 text-nm-gris" aria-hidden />
              {x.area} m²
            </li>
            <li className="inline-flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-nm-gris" aria-hidden />
              {x.habitaciones} {x.habitaciones === 1 ? "alcoba" : "alcobas"}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Car className="h-4 w-4 text-nm-gris" aria-hidden />
              {x.parqueaderos ? `${x.parqueaderos} parq.` : "Sin parq."}
            </li>
          </ul>
        </div>
      </Link>
    </article>
  )
}

/**
 * Mapa esquemático del sur del Valle de Aburrá: el río en diagonal y las
 * zonas donde trabaja la inmobiliaria. No es un mapa de calles; basta para
 * ubicar cada inmueble, y no depende de un servicio de mapas externo.
 */
export function MapaValle({ inmuebles, activo, alPasar }: { inmuebles: Vigente[]; activo?: string | null; alPasar?: (id: string | null) => void }) {
  const zonas: { nombre: string; x: number; y: number; d: string }[] = [
    { nombre: "Laureles", x: 28, y: 20, d: "M8 6 L46 6 L46 38 L8 38 Z" },
    { nombre: "Belén", x: 12, y: 58, d: "M2 40 L34 40 L34 74 L2 74 Z" },
    { nombre: "El Poblado", x: 70, y: 12, d: "M54 4 L92 4 L90 50 L56 50 Z" },
    { nombre: "Envigado", x: 72, y: 60, d: "M56 52 L90 52 L88 80 L58 80 Z" },
    { nombre: "Sabaneta", x: 40, y: 88, d: "M30 78 L60 78 L60 98 L30 98 Z" },
  ]
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="group" aria-label="Mapa de inmuebles por zona">
      <rect width="100" height="100" fill="var(--color-nm-agua-suave)" />
      {zonas.map((z) => (
        <g key={z.nombre} aria-hidden>
          <path d={z.d} fill="#fff" stroke="var(--color-nm-linea)" strokeWidth="0.6" />
          <text x={z.x} y={z.y} fontSize="3.2" fontWeight="700" fill="var(--color-nm-gris)" textAnchor="middle">
            {z.nombre}
          </text>
        </g>
      ))}
      <path d="M50 0 C 51 30, 48 62, 51 100" fill="none" stroke="var(--color-nm-petroleo)" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" aria-hidden />
      <text x="51.5" y="40" fontSize="2.6" fill="var(--color-nm-petroleo)" transform="rotate(90 51.5 40)" aria-hidden>
        Río Medellín
      </text>
      <g aria-hidden>
        <rect x="80" y="84" width="19" height="14" rx="1.5" fill="#fff" stroke="var(--color-nm-linea)" strokeWidth="0.6" />
        <text x="89.5" y="89.5" fontSize="2.8" fontWeight="700" fill="var(--color-nm-gris)" textAnchor="middle">
          El Retiro
        </text>
        <text x="89.5" y="93.5" fontSize="2.3" fill="var(--color-nm-gris)" textAnchor="middle">
          a 40 min
        </text>
      </g>
      {inmuebles.map((x) => {
        const es = activo === x.id
        return (
          <a key={x.id} href={`${RAIZ}/inmuebles/${x.id}`} aria-label={`${x.titulo}, ${precioTexto(x)}`} onMouseEnter={() => alPasar?.(x.id)} onMouseLeave={() => alPasar?.(null)} onFocus={() => alPasar?.(x.id)} onBlur={() => alPasar?.(null)}>
            <circle cx={x.mapa.x} cy={x.mapa.y} r={es ? 3.4 : 2.4} fill={x.estado === "disponible" ? "var(--color-nm-ladrillo)" : "var(--color-nm-gris)"} stroke="#fff" strokeWidth="0.8" />
          </a>
        )
      })}
    </svg>
  )
}

export function CabeceraNomenclatura() {
  return (
    <header className="border-b border-nm-linea bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link href={RAIZ} aria-label="Nomenclatura, inicio">
          <MarcaNomenclatura />
        </Link>
        <nav aria-label="Secciones" className="ml-auto flex items-center gap-5 text-[0.9375rem] font-semibold">
          <Link href={`${RAIZ}/inmuebles?operacion=venta`} className="hover:underline">Comprar</Link>
          <Link href={`${RAIZ}/inmuebles?operacion=arriendo`} className="hover:underline">Arrendar</Link>
          <Link href={`${RAIZ}#consignar`} className="hidden hover:underline sm:inline">Consignar</Link>
        </nav>
      </div>
    </header>
  )
}

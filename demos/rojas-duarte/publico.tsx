"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { MessageCircle } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { useAhora } from "@/demos/comun/reloj"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { estadoHorario, filasHorario } from "@/demos/motores/presencia/horario"
import { RAIZ } from "./config"
import { EMPRESA, EQUIPO, FOTOS, AREAS, HORARIO } from "./modelo"

export const botonVino =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[3px] bg-rd-vino px-6 text-[1rem] font-semibold text-white transition-colors hover:bg-rd-vino-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-vino disabled:cursor-not-allowed"
export const botonBorde =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[3px] border border-rd-tinta px-6 text-[1rem] font-semibold transition-colors hover:bg-rd-tinta hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-vino"
export const campo =
  "mt-1.5 block w-full rounded-[3px] border border-rd-gris/50 bg-white px-3 text-[1rem] placeholder:text-rd-gris focus:border-rd-vino focus:outline-2 focus:outline-rd-vino aria-[invalid=true]:border-rd-vino"

/** El ampersand en la serif hace de logo: no hace falta más. */
export function MarcaRojasDuarte({ claro }: { claro?: boolean }) {
  return (
    <span className="inline-flex flex-col leading-none">
      <span className="font-rd-titulo text-[1.375rem] font-medium tracking-[-0.01em] whitespace-nowrap">
        Rojas <span className={`italic ${claro ? "text-rd-rosa" : "text-rd-vino"}`}>&amp;</span> Duarte
      </span>
      <span className={`mt-1 text-[0.75rem] font-medium whitespace-nowrap ${claro ? "text-rd-rosa" : "text-rd-gris"}`}>{EMPRESA.subtitulo}</span>
    </span>
  )
}

export function BotonWhatsappFirma(props: { children: ReactNode; className?: string; mensaje?: string }) {
  return (
    <WhatsappSimulado negocio="la firma" mensaje={props.mensaje ?? "Hola, Rojas & Duarte. Quiero agendar una consulta."} className={props.className}>
      {props.children}
    </WhatsappSimulado>
  )
}

/**
 * El botón principal: en la página profesional abre el formulario de consulta;
 * en la de presencia, que no lo tiene, el WhatsApp.
 */
export function BotonConsulta({ area, className, children }: { area?: string; className?: string; children?: ReactNode }) {
  const { incluye } = useDemo()
  if (incluye("profesional")) {
    return (
      <Link href={`${RAIZ}/consulta${area ? `?area=${area}` : ""}`} className={className ?? botonVino}>
        {children ?? "Agendar una consulta"}
      </Link>
    )
  }
  return (
    <BotonWhatsappFirma className={className ?? botonVino}>
      <MessageCircle className="h-5 w-5" aria-hidden />
      {children ?? "Escribir por WhatsApp"}
    </BotonWhatsappFirma>
  )
}

export function CabeceraRojasDuarte() {
  const enlaces = [
    { href: `${RAIZ}#areas`, texto: "Áreas" },
    { href: `${RAIZ}#herramientas`, texto: "Calculadoras" },
    { href: `${RAIZ}#equipo`, texto: "Equipo" },
    { href: `${RAIZ}#contacto`, texto: "Contacto" },
  ]
  return (
    <header className="border-b border-rd-linea bg-rd-papel">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center gap-8 px-4 sm:px-6">
        <Link href={RAIZ} aria-label="Rojas & Duarte, inicio" className="focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-rd-vino">
          <MarcaRojasDuarte />
        </Link>
        <nav aria-label="Secciones" className="ml-auto hidden items-center gap-7 text-[0.9375rem] font-medium md:flex">
          {enlaces.map((e) => (
            <Link key={e.href} href={e.href} className="hover:text-rd-vino hover:underline hover:underline-offset-4">
              {e.texto}
            </Link>
          ))}
        </nav>
        <BotonConsulta className="ml-auto inline-flex h-10 items-center gap-2 rounded-[3px] bg-rd-vino px-4 text-[0.9375rem] font-semibold whitespace-nowrap text-white hover:bg-rd-vino-2 md:ml-0">
          Consulta
        </BotonConsulta>
      </div>
      <nav aria-label="Secciones" className="border-t border-rd-linea md:hidden">
        <ul className="mx-auto flex max-w-6xl justify-between px-4 text-[0.9375rem] font-medium">
          {enlaces.map((e) => (
            <li key={e.href}>
              <Link href={e.href} className="inline-block py-2.5 hover:text-rd-vino">
                {e.texto}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export function EstadoAbierto() {
  const ahora = useAhora()
  if (!ahora) return <p className="h-6" aria-hidden />
  const e = estadoHorario(HORARIO, ahora)
  return (
    <p className="flex items-center gap-2 font-semibold">
      <span className={`h-2.5 w-2.5 rounded-full ${e.abierto ? "bg-rd-exito" : "bg-rd-gris"}`} aria-hidden />
      {e.texto}
    </p>
  )
}

export function TablaHorario() {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-[0.9375rem]">
      {filasHorario(HORARIO).map((f) => (
        <div key={f.dias} className="contents">
          <dt className="text-rd-gris">{f.dias}</dt>
          <dd>{f.horas}</dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * Plano de Chapinero con las vías que un bogotano usa para ubicarse. Sin
 * servicio de mapas: carga al instante y no cuesta por visita.
 */
export function PlanoChapinero() {
  // Con el norte arriba, en Bogotá las carreras crecen hacia el occidente: la
  // Caracas a la izquierda, la Séptima a la derecha.
  const carreras = [
    { x: 16, nombre: "Avenida Caracas", ancho: 4 },
    { x: 36, nombre: "Carrera 13", ancho: 2.4 },
    { x: 58, nombre: "Carrera 11", ancho: 2.4 },
    { x: 84, nombre: "Carrera 7", ancho: 3.2 },
  ]
  const calles = [
    { y: 22, nombre: "Calle 67", ancho: 2.4 },
    { y: 50, nombre: "Calle 63", ancho: 3.2 },
    { y: 78, nombre: "Calle 60", ancho: 2.4 },
  ]
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label={`Ubicación: ${EMPRESA.direccion}, sobre la Carrera 13 junto a la Calle 63, a una cuadra de la Avenida Caracas`}>
      <rect width="100" height="100" fill="var(--color-rd-niebla)" />
      <rect x="61" y="53" width="21" height="23" fill="#d9e3d3" />
      {carreras.map((c) => (
        <line key={c.nombre} x1={c.x} y1="0" x2={c.x} y2="100" stroke="#fff" strokeWidth={c.ancho} />
      ))}
      {calles.map((c) => (
        <line key={c.nombre} x1="0" y1={c.y} x2="100" y2={c.y} stroke="#fff" strokeWidth={c.ancho} />
      ))}
      <g fontSize="2.8" fill="var(--color-rd-gris)">
        <text x="71.5" y="65.5" textAnchor="middle">
          Parque
        </text>
        {carreras.map((c) => (
          <text key={c.nombre} x={c.x + 3.4} y="97" transform={`rotate(-90 ${c.x + 3.4} 97)`}>
            {c.nombre}
          </text>
        ))}
        {calles.map((c) => (
          <text key={c.nombre} x="40" y={c.y - 2.2}>
            {c.nombre}
          </text>
        ))}
      </g>
      <circle cx="36" cy="45" r="3.2" fill="var(--color-rd-vino)" stroke="#fff" strokeWidth="1" />
      <rect x="40" y="36" width="30" height="7" rx="1" fill="var(--color-rd-tinta)" />
      <text x="55" y="40.8" fontSize="3" fontWeight="600" fill="#fff" textAnchor="middle">
        Rojas &amp; Duarte
      </text>
    </svg>
  )
}

const CREDITOS = [...new Set([FOTOS.portada.autor, ...AREAS.map((a) => a.foto.autor), ...EQUIPO.map((p) => p.foto.autor)])]

export function PieRojasDuarte() {
  return (
    <footer className="bg-rd-tinta text-rd-rosa">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr_1.2fr]">
        <div className="text-white">
          <MarcaRojasDuarte claro />
          <p className="mt-4 text-[0.9375rem] text-rd-rosa">
            {EMPRESA.direccion} ({EMPRESA.nota})
          </p>
        </div>
        <div className="text-[0.9375rem] leading-relaxed">
          <p>WhatsApp {EMPRESA.whatsappVisible}</p>
          <p>{EMPRESA.correo}</p>
          <ul className="mt-4 space-y-1">
            {AREAS.map((a) => (
              <li key={a.id}>
                <Link href={`${RAIZ}/areas/${a.id}`} className="text-white hover:underline hover:underline-offset-4">
                  {a.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[0.8125rem] leading-relaxed">
          Rojas &amp; Duarte es una firma ficticia, creada por Axchi como demostración. Personas, casos y honorarios de ejemplo; las calculadoras usan las cifras oficiales de 2026 y son orientativas. Fotografías de{" "}
          {CREDITOS.slice(0, -1).join(", ")} y {CREDITOS.at(-1)} en Unsplash.
        </p>
      </div>
    </footer>
  )
}

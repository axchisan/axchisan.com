"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, type ReactNode } from "react"
import { CalendarDays, ExternalLink, Home, MessageCircle, RotateCcw, Users, type LucideIcon } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { claveDia, sumarDias, textoDia, textoFecha, textoHora } from "@/demos/motores/agenda/tiempo"
import { RAIZ } from "./config"
import { ajustar, cambiarEstadoLead, cambiarEstadoVisita, restablecerInmobiliaria, todos, useInmobiliaria } from "./estado"
import { ASESORES, asesor, inmueblePorId, type EstadoInmueble, type EstadoLead } from "./modelo"
import { Placa, precioTexto } from "./publico"

type Seccion = { href: string; etiqueta: string; icono: LucideIcon; nivel: string }

const SECCIONES: Seccion[] = [
  { href: `${RAIZ}/panel`, etiqueta: "Inmuebles", icono: Home, nivel: "panel" },
  { href: `${RAIZ}/panel/interesados`, etiqueta: "Interesados", icono: Users, nivel: "sistema" },
  { href: `${RAIZ}/panel/visitas`, etiqueta: "Visitas", icono: CalendarDays, nivel: "sistema" },
]

const activa = (ruta: string, href: string) => (href === `${RAIZ}/panel` ? ruta === href : ruta.startsWith(href))

export function MarcoNomenclatura({ children }: { children: ReactNode }) {
  const ruta = usePathname()
  const { incluye } = useDemo()
  return (
    <SoloEnNivel nivel="panel">
      <div className="lg:grid lg:grid-cols-[228px_1fr]">
        <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] flex-col bg-nm-tinta px-4 py-6 text-white lg:flex">
          <Link href={`${RAIZ}/panel`} className="flex items-center gap-2 px-2">
            <Placa claro />
            <span className="text-[1.0625rem] font-extrabold">Nomenclatura</span>
          </Link>
          <Punto id="menu" className="mt-8">
            <nav aria-label="Panel">
              <ul className="space-y-1">
                {SECCIONES.map((s) => {
                  const Icono = s.icono
                  const es = activa(ruta, s.href)
                  return (
                    <li key={s.href}>
                      <Link href={s.href} aria-current={es ? "page" : undefined} className={`flex items-center gap-3 rounded-[6px] px-3 py-2.5 text-[0.9375rem] ${es ? "bg-white font-semibold text-nm-tinta" : "text-nm-agua hover:bg-white/10 hover:text-white"}`}>
                        <Icono className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                        <span className="flex-1">{s.etiqueta}</span>
                        {!incluye(s.nivel) && <span className="rounded-[4px] bg-white/15 px-1.5 py-0.5 text-[0.6875rem] text-white">Sistema</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </Punto>
          <div className="mt-auto space-y-1 border-t border-white/15 pt-4 text-[0.875rem]">
            <p className="px-3 pb-2">
              <span className="block font-semibold">Beatriz Uribe</span>
              <span className="text-nm-agua">Gerente</span>
            </p>
            <Link href={RAIZ} className="flex items-center gap-2.5 rounded-[6px] px-3 py-2 text-nm-agua hover:bg-white/10 hover:text-white">
              <ExternalLink className="h-4 w-4" aria-hidden />
              Ver la página pública
            </Link>
            <button type="button" onClick={restablecerInmobiliaria} className="flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2 text-left text-nm-agua hover:bg-white/10 hover:text-white">
              <RotateCcw className="h-4 w-4" aria-hidden />
              Restablecer la demo
            </button>
          </div>
        </aside>
        <div className="flex h-14 items-center justify-between bg-nm-tinta px-4 text-white lg:hidden">
          <Link href={`${RAIZ}/panel`} className="flex items-center gap-2">
            <Placa claro />
            <span className="font-extrabold">Nomenclatura</span>
          </Link>
          <button type="button" onClick={restablecerInmobiliaria} className="rounded-[6px] p-2 text-nm-agua hover:text-white" aria-label="Restablecer la demo">
            <RotateCcw className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="min-w-0 pb-24 lg:pb-0">{children}</div>
        <nav aria-label="Panel" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-nm-linea bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
          {SECCIONES.map((s) => {
            const Icono = s.icono
            const es = activa(ruta, s.href)
            return (
              <Link key={s.href} href={s.href} aria-current={es ? "page" : undefined} className={`flex flex-col items-center gap-0.5 py-2 text-[0.75rem] ${es ? "font-semibold text-nm-petroleo" : "text-nm-gris"}`}>
                <Icono className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                {s.etiqueta}
              </Link>
            )
          })}
        </nav>
      </div>
    </SoloEnNivel>
  )
}

function Encabezado({ titulo, detalle }: { titulo: string; detalle?: string }) {
  return (
    <div className="border-b border-nm-linea bg-white px-4 py-6 sm:px-8">
      <h1 className="text-[2rem] leading-none font-extrabold tracking-[-0.03em]">{titulo}</h1>
      {detalle && <p className="mt-2 text-[0.9375rem] text-nm-gris">{detalle}</p>}
    </div>
  )
}

const Cargando = () => <div className="min-h-[60vh]" aria-busy="true" />

const ESTADOS_INMUEBLE: { id: EstadoInmueble; texto: (venta: boolean) => string }[] = [
  { id: "disponible", texto: () => "Disponible" },
  { id: "reservado", texto: () => "Reservado" },
  { id: "cerrado", texto: (venta) => (venta ? "Vendido" : "Arrendado") },
]

export function InmueblesPanel() {
  const e = useInmobiliaria()
  if (!e) return <Cargando />
  const lista = todos(e)
  return (
    <>
      <Encabezado titulo="Inmuebles" detalle={`${lista.filter((x) => x.estado === "disponible").length} disponibles de ${lista.length}. Lo que cambies aquí se ve al instante en la página.`} />
      <Punto id="inmuebles" className="px-4 py-6 sm:px-8">
        <ul className="space-y-3">
          {lista.map((x) => (
            <FilaInmueble key={`${x.id}-${x.precio}`} x={x} />
          ))}
        </ul>
      </Punto>
    </>
  )
}

function FilaInmueble({ x }: { x: ReturnType<typeof todos>[number] }) {
  const [precio, setPrecio] = useState(x.precio.toLocaleString("es-CO"))
  const guardar = () => {
    const v = Number(precio.replace(/\D/g, ""))
    if (v >= 100_000 && v !== x.precio) ajustar(x.id, { precio: v })
    else setPrecio(x.precio.toLocaleString("es-CO"))
  }
  return (
    <li className="flex flex-wrap items-center gap-4 rounded-[8px] bg-white p-3 ring-1 ring-nm-linea">
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-[6px] bg-nm-linea">
        <Image src={x.fotos[0].src} alt="" fill sizes="96px" className="object-cover" />
      </div>
      <div className="min-w-[14rem] flex-1">
        <Link href={`${RAIZ}/inmuebles/${x.id}`} className="font-semibold hover:underline">
          {x.titulo}
        </Link>
        <p className="text-[0.8125rem] text-nm-gris">
          {x.codigo}, {x.operacion === "venta" ? "venta" : "arriendo"}, {x.zona}
        </p>
      </div>
      <label className="flex items-center gap-1.5">
        <span className="sr-only">Precio de {x.titulo}</span>
        <span className="text-nm-gris">$</span>
        <input value={precio} onChange={(ev) => setPrecio(ev.target.value)} onBlur={guardar} onKeyDown={(ev) => ev.key === "Enter" && (ev.target as HTMLInputElement).blur()} inputMode="numeric" className="h-10 w-36 rounded-[6px] border border-nm-linea px-2 text-right font-semibold tabular-nums" />
      </label>
      <label className="block">
        <span className="sr-only">Estado de {x.titulo}</span>
        <select value={x.estado} onChange={(ev) => ajustar(x.id, { estado: ev.target.value as EstadoInmueble })} className="h-10 rounded-[6px] border border-nm-linea bg-white px-2">
          {ESTADOS_INMUEBLE.map((s) => (
            <option key={s.id} value={s.id}>
              {s.texto(x.operacion === "venta")}
            </option>
          ))}
        </select>
      </label>
      <label className="inline-flex items-center gap-2 text-[0.9375rem]">
        <input type="checkbox" checked={x.destacado} onChange={(ev) => ajustar(x.id, { destacado: ev.target.checked })} className="h-4 w-4 accent-nm-petroleo" />
        Destacado<span className="sr-only">: {x.titulo}</span>
      </label>
    </li>
  )
}

const ETAPAS: { id: EstadoLead; texto: string }[] = [
  { id: "nuevo", texto: "Nuevo" },
  { id: "contactado", texto: "Contactado" },
  { id: "visita", texto: "Visita" },
  { id: "oferta", texto: "Oferta" },
  { id: "cerrado", texto: "Cerrado" },
  { id: "descartado", texto: "Descartado" },
]
const ORIGEN = { web: "Página", whatsapp: "WhatsApp", portal: "Portal" } as const

export function InteresadosPanel() {
  const e = useInmobiliaria()
  const [etapa, setEtapa] = useState<EstadoLead | "abiertos">("abiertos")
  return (
    <SoloEnNivel nivel="sistema">
      {!e ? (
        <Cargando />
      ) : (
        (() => {
          const abiertos = e.leads.filter((l) => !["cerrado", "descartado"].includes(l.estado))
          const lista = etapa === "abiertos" ? abiertos : e.leads.filter((l) => l.estado === etapa)
          const cuenta = (id: EstadoLead) => e.leads.filter((l) => l.estado === id).length
          return (
            <>
              <Encabezado titulo="Interesados" detalle={`${abiertos.length} abiertos. ${cuenta("nuevo")} sin contactar.`} />
              <div className="px-4 py-6 sm:px-8">
                <div role="group" aria-label="Etapa" className="flex flex-wrap gap-1.5">
                  {[{ id: "abiertos" as const, texto: "Abiertos", n: abiertos.length }, ...ETAPAS.map((x) => ({ ...x, n: cuenta(x.id) }))].map((x) => (
                    <button key={x.id} type="button" aria-pressed={etapa === x.id} onClick={() => setEtapa(x.id)} className={`h-9 rounded-[6px] px-3 text-[0.875rem] font-semibold ${etapa === x.id ? "bg-nm-tinta text-white" : "bg-white text-nm-gris ring-1 ring-nm-linea hover:text-nm-tinta"}`}>
                      {x.texto} ({x.n})
                    </button>
                  ))}
                </div>
                <Punto id="embudo" className="mt-5">
                  <ul className="divide-y divide-nm-linea rounded-[8px] bg-white ring-1 ring-nm-linea">
                    {lista.map((l) => {
                      const x = inmueblePorId(l.inmuebleId)!
                      return (
                        <li key={l.id} className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3.5 sm:px-5">
                          <div className="min-w-[14rem] flex-1">
                            <p className="font-semibold">
                              {l.nombre} <span className="font-normal text-nm-gris">, {l.telefono}</span>
                            </p>
                            <p className="text-[0.875rem] text-nm-gris">
                              {x.titulo} ({x.codigo}). {ORIGEN[l.origen]}, {textoFecha(l.fecha.slice(0, 10))}.
                            </p>
                            {l.mensaje && <p className="mt-0.5 text-[0.875rem]">«{l.mensaje}»</p>}
                          </div>
                          <label className="block">
                            <span className="sr-only">Etapa de {l.nombre}</span>
                            <select value={l.estado} onChange={(ev) => cambiarEstadoLead(l.id, ev.target.value as EstadoLead)} className="h-9 rounded-[6px] border border-nm-linea bg-white px-2 text-[0.875rem]">
                              {ETAPAS.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.texto}
                                </option>
                              ))}
                            </select>
                          </label>
                          <WhatsappSimulado
                            negocio="el interesado"
                            mensaje={`Hola, ${l.nombre.split(" ")[0]}. Te escribe ${asesor(x.asesorId).nombre.split(" ")[0]}, de Nomenclatura, por el inmueble ${x.codigo} (${precioTexto(x)}). ¿Cuándo te queda bien para verlo?`}
                            className="inline-flex h-9 items-center gap-1.5 rounded-[6px] border border-nm-linea px-3 text-[0.875rem] font-semibold hover:border-nm-petroleo"
                          >
                            <MessageCircle className="h-4 w-4" aria-hidden />
                            Escribir
                          </WhatsappSimulado>
                        </li>
                      )
                    })}
                  </ul>
                  {lista.length === 0 && <p className="mt-4 text-nm-gris">Nadie en esta etapa.</p>}
                </Punto>
              </div>
            </>
          )
        })()
      )}
    </SoloEnNivel>
  )
}

export function VisitasPanel() {
  const e = useInmobiliaria()
  return (
    <SoloEnNivel nivel="sistema">
      {!e ? (
        <Cargando />
      ) : (
        (() => {
          const hoy = claveDia(new Date())
          const dias = Array.from({ length: 6 }, (_, i) => sumarDias(hoy, i))
          const proximas = e.visitas.filter((v) => v.inicio.slice(0, 10) >= hoy && v.estado !== "cancelada")
          return (
            <>
              <Encabezado titulo="Visitas" detalle={`${proximas.filter((v) => v.estado === "agendada").length} agendadas en los próximos días.`} />
              <Punto id="agenda" className="grid gap-4 px-4 py-6 sm:px-8 xl:grid-cols-3">
                {ASESORES.map((a) => (
                  <section key={a.id} aria-labelledby={`as-${a.id}`} className="rounded-[8px] bg-white p-4 ring-1 ring-nm-linea">
                    <h2 id={`as-${a.id}`} className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-nm-agua-suave text-[0.8125rem] font-bold text-nm-petroleo" aria-hidden>
                        {a.iniciales}
                      </span>
                      <span>
                        <span className="block font-semibold">{a.nombre}</span>
                        <span className="block text-[0.8125rem] font-normal text-nm-gris">{a.zonas}</span>
                      </span>
                    </h2>
                    {dias.map((d) => {
                      const suyas = proximas.filter((v) => v.asesorId === a.id && v.inicio.startsWith(d))
                      if (!suyas.length) return null
                      return (
                        <div key={d} className="mt-4">
                          <h3 className="text-[0.8125rem] font-semibold text-nm-gris">{d === hoy ? "Hoy" : textoDia(d)}</h3>
                          <ul className="mt-1.5 space-y-2">
                            {suyas.map((v) => {
                              const x = inmueblePorId(v.inmuebleId)!
                              const l = e.leads.find((y) => y.id === v.leadId)
                              return (
                                <li key={v.id} className={`rounded-[6px] border-l-4 bg-nm-fondo p-3 ${v.estado === "realizada" ? "border-nm-exito" : "border-nm-petroleo"}`}>
                                  <p className="text-[0.875rem] font-semibold tabular-nums">{textoHora(v.inicio)}</p>
                                  <p className="font-semibold">{l?.nombre}</p>
                                  <p className="text-[0.8125rem] text-nm-gris">
                                    {x.titulo}, {x.barrio}
                                  </p>
                                  {v.estado === "agendada" ? (
                                    <div className="mt-2 flex gap-1.5">
                                      <button type="button" onClick={() => { cambiarEstadoVisita(v.id, "realizada"); if (l) cambiarEstadoLead(l.id, "oferta") }} className="h-8 rounded-[6px] bg-nm-petroleo px-3 text-[0.8125rem] font-semibold text-white hover:bg-nm-petroleo-2">
                                        Hecha<span className="sr-only">: visita de {l?.nombre}</span>
                                      </button>
                                      <button type="button" onClick={() => cambiarEstadoVisita(v.id, "cancelada")} className="h-8 rounded-[6px] px-3 text-[0.8125rem] font-semibold text-nm-ladrillo hover:bg-white">
                                        Cancelar
                                      </button>
                                    </div>
                                  ) : (
                                    <p className="mt-1 text-[0.8125rem] font-semibold text-nm-exito">Realizada</p>
                                  )}
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )
                    })}
                    {!proximas.some((v) => v.asesorId === a.id) && <p className="mt-4 text-[0.9375rem] text-nm-gris">Sin visitas en los próximos días.</p>}
                  </section>
                ))}
              </Punto>
            </>
          )
        })()
      )}
    </SoloEnNivel>
  )
}

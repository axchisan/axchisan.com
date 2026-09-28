"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo, useState, type ReactNode } from "react"
import { Send } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { claveDia, diasEntre, textoFecha } from "@/demos/motores/agenda/tiempo"
import { estadoCupon } from "@/demos/motores/fidelizacion/programa"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import { CAMPANAS, type EstadoCafe } from "./modelo"
import { enviarCampana, resumenCliente, segmentoDe, useCafe } from "./estado"

export function MarcoPanel({ children }: { children: ReactNode }) {
  const ruta = usePathname()
  const pestanas = [
    { href: `${RAIZ}/panel`, nombre: "Resumen y clientes" },
    { href: `${RAIZ}/panel/campanas`, nombre: "Campañas" },
  ]
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
      <nav aria-label="Secciones del panel" className="flex gap-2">
        {pestanas.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            aria-current={ruta === p.href ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-[0.9375rem] font-medium ${ruta === p.href ? "bg-cb-cafeto text-white" : "bg-white text-cb-tinta hover:bg-cb-hoja"}`}
          >
            {p.nombre}
          </Link>
        ))}
      </nav>
      <div className="mt-5">{children}</div>
    </div>
  )
}

/** Métricas de los últimos 30 días, comparadas con los 30 anteriores. */
function metricas(e: EstadoCafe) {
  const hoy = claveDia(new Date())
  const compras = e.movimientos.filter((m) => m.tipo === "compra")
  const en = (desde: number, hasta: number) => compras.filter((m) => { const d = diasEntre(m.fecha, hoy); return d >= desde && d < hasta })
  const ultimos = en(0, 30)
  const anteriores = en(30, 60)
  const activos = new Set(ultimos.map((m) => m.clienteId))
  const antes = new Set(anteriores.map((m) => m.clienteId))
  const volvieron = [...antes].filter((id) => activos.has(id)).length
  const canjes = e.movimientos.filter((m) => m.tipo === "canje" && diasEntre(m.fecha, hoy) < 30)
  const tarjetas = e.movimientos.filter((m) => m.tipo === "sello-canjeado" && diasEntre(m.fecha, hoy) < 30).length
  return {
    activos: activos.size,
    visitas: ultimos.length,
    porCliente: activos.size ? ultimos.length / activos.size : 0,
    ventas: ultimos.reduce((t, m) => t + (m.monto ?? 0), 0),
    volvieron: antes.size ? Math.round((volvieron / antes.size) * 100) : 0,
    puntosCanjeados: -canjes.reduce((t, m) => t + m.puntos, 0),
    premios: canjes.length + tarjetas,
    tarjetas,
  }
}

type Filtro = "todos" | "inactivos" | "por-vencer"

export function ResumenYClientes() {
  const e = useCafe()
  const [filtro, setFiltro] = useState<Filtro>("todos")
  const filas = useMemo(() => {
    if (!e) return []
    return e.clientes
      .map((c) => ({ c, r: resumenCliente(e, c.id) }))
      .sort((a, b) => (b.r.ultimaVisita ?? "").localeCompare(a.r.ultimaVisita ?? ""))
  }, [e])
  if (!e) return <div className="h-96 animate-pulse rounded-[16px] bg-white" aria-busy="true" />
  const m = metricas(e)
  const visibles = filas.filter(({ r }) => (filtro === "inactivos" ? (r.diasSinVenir ?? 0) >= 30 : filtro === "por-vencer" ? r.porVencer.puntos > 0 : true))

  return (
    <div className="space-y-5">
      <Punto id="resumen">
        <section aria-labelledby="t-resumen">
          <h1 id="t-resumen" className="font-cb-marca text-[1.75rem] text-cb-cafeto">
            Los últimos 30 días
          </h1>
          <dl className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { t: "Clientes que vinieron", v: m.activos.toLocaleString("es-CO"), n: `${m.porCliente.toLocaleString("es-CO", { maximumFractionDigits: 1 })} visitas cada uno` },
              { t: "Volvieron del mes anterior", v: `${m.volvieron} %`, n: "de quienes vinieron hace 30 a 60 días" },
              { t: "Ventas a clientes del programa", v: pesos(m.ventas), n: `${m.visitas} compras registradas` },
              { t: "Premios canjeados", v: `${m.premios}`, n: `${m.puntosCanjeados.toLocaleString("es-CO")} puntos y ${m.tarjetas} ${m.tarjetas === 1 ? "tarjeta de sellos" : "tarjetas de sellos"}` },
            ].map((x) => (
              <div key={x.t} className="rounded-[16px] bg-white p-4">
                <dt className="text-[0.875rem] text-cb-gris">{x.t}</dt>
                <dd className="mt-1 text-[1.75rem] font-semibold tabular-nums">{x.v}</dd>
                <dd className="text-[0.8125rem] text-cb-gris">{x.n}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Punto>

      <Punto id="clientes">
        <section aria-labelledby="t-clientes" className="rounded-[16px] bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="t-clientes" className="font-cb-marca text-[1.375rem] text-cb-cafeto">
              Clientes
            </h2>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar clientes">
              {(
                [
                  ["todos", "Todos"],
                  ["inactivos", "No vienen hace un mes"],
                  ["por-vencer", "Con puntos por vencer"],
                ] as const
              ).map(([id, nombre]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={filtro === id}
                  onClick={() => setFiltro(id)}
                  className={`rounded-full px-3 py-1.5 text-[0.875rem] font-medium ${filtro === id ? "bg-cb-cafeto text-white" : "bg-cb-hoja text-cb-tinta"}`}
                >
                  {nombre}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-2 text-[0.875rem] text-cb-gris" aria-live="polite">
            {visibles.length} {visibles.length === 1 ? "cliente" : "clientes"}
          </p>
          <div className="mt-2 overflow-x-auto focus-visible:outline-2 focus-visible:outline-cb-cafeto" tabIndex={0} role="region" aria-label="Tabla de clientes">
            <table className="w-full min-w-[40rem] text-left text-[0.9375rem]">
              <thead className="text-[0.8125rem] text-cb-gris">
                <tr className="border-b border-cb-linea">
                  <th scope="col" className="py-2 font-medium">Cliente</th>
                  <th scope="col" className="py-2 font-medium">Nivel</th>
                  <th scope="col" className="py-2 text-right font-medium">Puntos</th>
                  <th scope="col" className="py-2 text-right font-medium">Visitas</th>
                  <th scope="col" className="py-2 pl-4 font-medium">Última visita</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map(({ c, r }) => (
                  <tr key={c.id} className="border-b border-cb-linea last:border-0">
                    <th scope="row" className="py-2.5 pr-3 font-medium">
                      {c.nombre}
                      <span className="block text-[0.8125rem] font-normal text-cb-gris">{c.codigo}</span>
                    </th>
                    <td className="py-2.5">{r.nivel.actual.nombre}</td>
                    <td className="py-2.5 text-right tabular-nums">
                      {r.saldo}
                      {r.porVencer.puntos > 0 && <span className="block text-[0.8125rem] text-cb-oro">{r.porVencer.puntos} por vencer</span>}
                    </td>
                    <td className="py-2.5 text-right tabular-nums">{r.visitas}</td>
                    <td className="py-2.5 pl-4">
                      {r.ultimaVisita ? textoFecha(r.ultimaVisita.slice(0, 10)) : "Sin compras"}
                      {(r.diasSinVenir ?? 0) >= 30 && <span className="ml-2 rounded-full bg-cb-cereza-suave px-2 py-0.5 text-[0.75rem] font-semibold text-cb-cereza">Hace {r.diasSinVenir} días</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Punto>
    </div>
  )
}

export function Campanas() {
  const e = useCafe()
  const [ultimo, setUltimo] = useState<{ campana: string; enviados: number; ejemplo: string | null } | null>(null)
  if (!e) return <div className="h-96 animate-pulse rounded-[16px] bg-white" aria-busy="true" />
  const hoy = claveDia(new Date())
  return (
    <div>
      <h1 className="font-cb-marca text-[1.75rem] text-cb-cafeto">Campañas</h1>
      <p className="mt-1 max-w-[60ch] text-cb-gris">Cada cliente del grupo recibe un cupón con su código y el mensaje de WhatsApp listo para enviar.</p>

      {ultimo && (
        <div className="mt-4 rounded-[16px] bg-cb-exito-suave p-4 text-cb-exito" role="status">
          <p className="font-semibold">
            «{ultimo.campana}» salió para {ultimo.enviados} {ultimo.enviados === 1 ? "cliente" : "clientes"}.
          </p>
          {ultimo.ejemplo && (
            <WhatsappSimulado negocio="el cliente" mensaje={ultimo.ejemplo} className="mt-2 font-semibold underline underline-offset-2">
              Ver el mensaje que le llega
            </WhatsappSimulado>
          )}
        </div>
      )}

      <Punto id="campana" className="mt-4">
        <ul className="grid gap-3 md:grid-cols-2">
          {CAMPANAS.map((c) => {
            const destinatarios = segmentoDe(e, c.segmento).length
            const envios = e.envios.filter((x) => x.campanaId === c.id)
            const usados = e.cupones.filter((x) => x.titulo === c.premio && x.origen === "campana" && estadoCupon(x, hoy) === "usado").length
            return (
              <li key={c.id} className="flex flex-col rounded-[16px] bg-white p-5">
                <h2 className="font-cb-marca text-[1.25rem]">{c.nombre}</h2>
                <p className="mt-1 font-semibold text-cb-cereza">{c.premio}</p>
                <p className="mt-2 flex-1 text-[0.9375rem] text-cb-gris">{c.mensaje.replace("{nombre}", "Mariana").replace("{codigo}", "K7Q3MD")}</p>
                <p className="mt-3 text-[0.875rem] text-cb-gris">
                  {envios.length ? `Enviada ${envios.length === 1 ? "una vez" : `${envios.length} veces`}, la última el ${textoFecha(envios.at(-1)!.fecha.slice(0, 10))}. ${usados} ${usados === 1 ? "cupón usado" : "cupones usados"}.` : "Todavía no se ha enviado."}
                </p>
                <button
                  type="button"
                  disabled={!destinatarios}
                  onClick={() => setUltimo({ campana: c.nombre, ...enviarCampana(c.id) })}
                  className="mt-3 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-cb-cafeto px-5 font-semibold text-white hover:bg-cb-cafeto-2 disabled:bg-cb-linea disabled:text-cb-gris"
                >
                  <Send className="h-4 w-4" aria-hidden />
                  {destinatarios ? `Enviar a ${destinatarios} ${destinatarios === 1 ? "cliente" : "clientes"}` : "Nadie en este grupo ahora"}
                </button>
              </li>
            )
          })}
        </ul>
      </Punto>
    </div>
  )
}

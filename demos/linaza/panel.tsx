"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, type ReactNode } from "react"
import { ExternalLink, RotateCcw } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { clave } from "@/demos/motores/catalogo/variantes"
import { textoFecha, textoHora } from "@/demos/motores/agenda/tiempo"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import { cambiarEstado, fijarExistencia, restablecerTienda, useTienda } from "./estado"
import { CIUDADES, ESTADO, PAGO, PRENDAS, type EstadoPedido, type Pedido } from "./modelo"
import { MarcaLinaza } from "./publico"

const SECCIONES = [
  { href: `${RAIZ}/panel`, etiqueta: "Pedidos", nivel: "catalogo" },
  { href: `${RAIZ}/panel/inventario`, etiqueta: "Inventario por talla", nivel: "tienda" },
]

export function MarcoLinaza({ children }: { children: ReactNode }) {
  const ruta = usePathname()
  const { incluye, config } = useDemo()
  return (
    <div className="min-h-[calc(100vh-3rem)] bg-li-niebla">
      <header className="border-b border-li-linea bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-2 px-4 py-3 sm:px-6">
          <Link href={`${RAIZ}/panel`} className="flex items-center gap-2">
            <MarcaLinaza />
            <span className="text-[0.9375rem] text-li-gris">tienda</span>
          </Link>
          <nav aria-label="Panel" className="flex gap-1 text-[0.9375rem]">
            {SECCIONES.map((s) => {
              const es = s.href === `${RAIZ}/panel` ? ruta === s.href : ruta.startsWith(s.href)
              return (
                <Link key={s.href} href={s.href} aria-current={es ? "page" : undefined} className={`px-3 py-2 ${es ? "font-semibold underline decoration-2 decoration-li-azul underline-offset-8" : "text-li-gris hover:text-li-tinta"}`}>
                  {s.etiqueta}
                  {!incluye(s.nivel) && <span className="ml-1.5 bg-li-niebla px-1.5 py-0.5 text-[0.75rem]">{config.niveles.find((n) => n.id === s.nivel)?.etiqueta}</span>}
                </Link>
              )
            })}
          </nav>
          <div className="ml-auto flex items-center gap-1 text-[0.875rem]">
            <Link href={RAIZ} className="inline-flex items-center gap-1.5 px-2 py-2 text-li-gris hover:text-li-tinta">
              <ExternalLink className="h-4 w-4" aria-hidden />
              Ver la tienda
            </Link>
            <button type="button" onClick={restablecerTienda} className="inline-flex items-center gap-1.5 px-2 py-2 text-li-gris hover:text-li-tinta">
              <RotateCcw className="h-4 w-4" aria-hidden />
              Restablecer la demo
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  )
}

const SIGUIENTE: Partial<Record<EstadoPedido, { a: EstadoPedido; verbo: string }>> = {
  "por-confirmar": { a: "pagado", verbo: "Confirmar pago" },
  pagado: { a: "alistado", verbo: "Marcar empacado" },
  alistado: { a: "enviado", verbo: "Marcar enviado" },
  enviado: { a: "entregado", verbo: "Marcar entregado" },
}

const COLOR: Record<EstadoPedido, string> = {
  "por-confirmar": "bg-li-alerta-suave text-li-alerta",
  pagado: "bg-[#e8edfb] text-li-azul",
  alistado: "bg-[#e8edfb] text-li-azul",
  enviado: "bg-li-exito-suave text-li-exito",
  entregado: "bg-li-niebla text-li-gris",
  cancelado: "bg-[#fdeceb] text-li-rojo",
}

type Filtro = "abiertos" | "todos"

export function PedidosLinaza() {
  const e = useTienda()
  const [filtro, setFiltro] = useState<Filtro>("abiertos")
  return (
    <SoloEnNivel nivel="catalogo">
      {!e ? (
        <div className="min-h-[50vh]" aria-busy="true" />
      ) : (
        (() => {
          const abiertos = e.pedidos.filter((p) => p.estado !== "entregado" && p.estado !== "cancelado")
          const lista = filtro === "abiertos" ? abiertos : e.pedidos
          const semana = e.pedidos.filter((p) => p.estado !== "cancelado").reduce((t, p) => t + p.lineas.reduce((s, l) => s + l.precio * l.cantidad, 0) + p.envio, 0)
          return (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 className="text-[2.25rem] leading-none font-bold tracking-[-0.04em]">Pedidos</h1>
                  <p className="mt-2 text-[0.9375rem] text-li-gris">
                    {abiertos.length} por despachar. {pesos(semana)} vendidos en los últimos siete días.
                  </p>
                </div>
                <div role="group" aria-label="Filtrar pedidos" className="flex gap-1 bg-white p-1 ring-1 ring-li-linea">
                  {(["abiertos", "todos"] as const).map((f) => (
                    <button key={f} type="button" aria-pressed={filtro === f} onClick={() => setFiltro(f)} className={`px-3.5 py-1.5 text-[0.9375rem] font-semibold ${filtro === f ? "bg-li-tinta text-white" : "text-li-gris hover:text-li-tinta"}`}>
                      {f === "abiertos" ? `Por despachar (${abiertos.length})` : `Todos (${e.pedidos.length})`}
                    </button>
                  ))}
                </div>
              </div>
              <Punto id="pedidos" className="mt-6">
                <ul className="space-y-3">
                  {lista.map((p) => (
                    <FilaPedido key={p.id} pedido={p} />
                  ))}
                </ul>
                {lista.length === 0 && <p className="bg-white p-6 text-li-gris">No hay pedidos por despachar.</p>}
              </Punto>
            </>
          )
        })()
      )}
    </SoloEnNivel>
  )
}

function FilaPedido({ pedido: p }: { pedido: Pedido }) {
  const sig = SIGUIENTE[p.estado]
  const total = p.lineas.reduce((t, l) => t + l.precio * l.cantidad, 0) + p.envio
  return (
    <li className="bg-white p-5 ring-1 ring-li-linea">
      <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
        <div className="min-w-[10rem]">
          <p className="text-[1.125rem] font-bold">#{p.numero}</p>
          <p className="text-[0.875rem] text-li-gris">
            {textoFecha(p.fecha.slice(0, 10))}, {textoHora(p.fecha)}
          </p>
        </div>
        <div className="min-w-[14rem] flex-1">
          <p className="font-semibold">
            {p.cliente.nombre}
            <span className="font-normal text-li-gris">, {CIUDADES.find((c) => c.id === p.ciudadId)?.nombre}</span>
          </p>
          <p className="text-[0.9375rem] text-li-gris">{p.lineas.map((l) => `${l.nombre} (${l.colorNombre.toLowerCase()}, ${l.talla})`).join(", ")}</p>
          {p.guia && <p className="mt-1 text-[0.875rem]">Guía {p.guia}</p>}
        </div>
        <div className="text-right">
          <p className="font-bold tabular-nums">{pesos(total)}</p>
          <p className="text-[0.875rem] text-li-gris">{PAGO[p.pago]}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-li-linea pt-4">
        <span className={`px-2.5 py-1 text-[0.8125rem] font-semibold ${COLOR[p.estado]}`}>{ESTADO[p.estado]}</span>
        <span className="ml-auto flex gap-2">
          {p.estado !== "entregado" && p.estado !== "cancelado" && (
            <button type="button" onClick={() => cambiarEstado(p.id, "cancelado")} className="h-9 px-3 text-[0.875rem] font-semibold text-li-rojo hover:bg-[#fdeceb]">
              Cancelar
            </button>
          )}
          {sig && (
            <button type="button" onClick={() => cambiarEstado(p.id, sig.a)} className="h-9 bg-li-tinta px-4 text-[0.875rem] font-semibold text-white hover:bg-li-azul">
              {sig.verbo}
              <span className="sr-only"> del pedido {p.numero}</span>
            </button>
          )}
        </span>
      </div>
    </li>
  )
}

export function InventarioLinaza() {
  const e = useTienda()
  return (
    <SoloEnNivel nivel="tienda">
      {!e ? (
        <div className="min-h-[50vh]" aria-busy="true" />
      ) : (
        <>
          <h1 className="text-[2.25rem] leading-none font-bold tracking-[-0.04em]">Inventario por talla</h1>
          <p className="mt-2 text-[0.9375rem] text-li-gris">Cambia un número y la tienda lo muestra al instante. En rojo, agotadas; en amarillo, las últimas.</p>
          <Punto id="matriz" className="mt-6">
            <div className="grid gap-4 lg:grid-cols-2">
              {PRENDAS.map((p) => (
                <section key={p.id} aria-labelledby={`inv-${p.id}`} className="bg-white p-5 ring-1 ring-li-linea">
                  <h2 id={`inv-${p.id}`} className="text-[1.0625rem] font-semibold">
                    {p.nombre}
                  </h2>
                  <table className="mt-3 w-full text-[0.9375rem]">
                    <caption className="sr-only">Existencias de {p.nombre} por color y talla</caption>
                    <thead>
                      <tr className="text-left text-[0.8125rem] text-li-gris">
                        <th scope="col" className="pb-2 font-semibold">Color</th>
                        {p.tallas.map((t) => (
                          <th key={t} scope="col" className="pb-2 text-center font-semibold">
                            {t}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {p.colores.map((c) => (
                        <tr key={c.id} className="border-t border-li-linea">
                          <th scope="row" className="py-2 pr-2 text-left font-normal">
                            <span className="inline-flex items-center gap-2">
                              <span className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-black/15" style={{ background: c.hex }} aria-hidden />
                              {c.nombre}
                            </span>
                          </th>
                          {p.tallas.map((t) => {
                            const n = e.existencias[clave(p.id, c.id, t)] ?? 0
                            return (
                              <td key={t} className="py-2 text-center">
                                <label>
                                  <span className="sr-only">
                                    {p.nombre}, {c.nombre}, talla {t}
                                  </span>
                                  <input
                                    type="number"
                                    min={0}
                                    value={n}
                                    onChange={(ev) => fijarExistencia(p.id, c.id, t, Number(ev.target.value) || 0)}
                                    className={`h-9 w-14 border text-center tabular-nums ${n === 0 ? "border-li-rojo bg-[#fdeceb] text-li-rojo" : n <= 2 ? "border-li-alerta bg-li-alerta-suave" : "border-li-linea"}`}
                                  />
                                </label>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              ))}
            </div>
          </Punto>
        </>
      )}
    </SoloEnNivel>
  )
}

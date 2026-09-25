"use client"

import { useState } from "react"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { textoHora } from "@/demos/motores/agenda/tiempo"
import { accion, activo, ESTADO, PAGO, total, type EstadoPedido, type Pedido } from "@/demos/motores/pedidos/pedido"
import { pesos } from "@/lib/catalogo/planes"
import { avanzarPedido, cancelarPedido, useRestaurante } from "../estado"
import { Cargando, Encabezado } from "./marco"

export const COLOR_ESTADO: Record<EstadoPedido, string> = {
  recibido: "bg-fg-alerta-suave text-fg-alerta",
  preparando: "bg-[#e6ecf8] text-fg-cobalto",
  listo: "bg-fg-exito-suave text-fg-exito",
  "en-camino": "bg-[#e6ecf8] text-fg-cobalto",
  entregado: "bg-fg-peltre text-fg-ceniza",
  cancelado: "bg-fg-aji-suave text-fg-aji",
}

/** "Mesa 7", "Domicilio a Chapinero Alto", "Recoger 7:30 p. m.". */
export function dondeVa(p: Pedido) {
  if (p.canal === "mesa") return `Mesa ${p.mesa}`
  if (p.canal === "recoger") return `Recoger${p.hora ? ` a las ${textoHora(p.hora)}` : ""}`
  return `Domicilio a ${p.direccion?.barrio}`
}

type Filtro = "curso" | "entregados" | "todos"

export function PedidosFogon() {
  const e = useRestaurante()
  const [filtro, setFiltro] = useState<Filtro>("curso")

  return (
    <SoloEnNivel nivel="pedidos">
      {!e ? (
        <Cargando />
      ) : (
        <Lista pedidos={e.pedidos} filtro={filtro} setFiltro={setFiltro} />
      )}
    </SoloEnNivel>
  )
}

function Lista({ pedidos, filtro, setFiltro }: { pedidos: Pedido[]; filtro: Filtro; setFiltro: (f: Filtro) => void }) {
  const enCurso = pedidos.filter(activo)
  const visibles = [...(filtro === "curso" ? enCurso : filtro === "entregados" ? pedidos.filter((p) => !activo(p)) : pedidos)].sort((a, b) =>
    filtro === "curso" ? a.creado.localeCompare(b.creado) : b.creado.localeCompare(a.creado),
  )
  const FILTROS: { id: Filtro; nombre: string; n: number }[] = [
    { id: "curso", nombre: "En curso", n: enCurso.length },
    { id: "entregados", nombre: "Cerrados", n: pedidos.length - enCurso.length },
    { id: "todos", nombre: "Todos", n: pedidos.length },
  ]

  return (
    <>
      <Encabezado titulo="Pedidos de hoy" detalle={`${enCurso.length} en curso. Los de la página, los QR de las mesas y los que toma el mesero, juntos.`} />
      <div className="px-4 py-6 sm:px-8">
        <div role="group" aria-label="Filtrar pedidos" className="inline-flex gap-1 rounded-full bg-white p-1 ring-1 ring-fg-linea">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filtro === f.id}
              onClick={() => setFiltro(f.id)}
              className={`rounded-full px-4 py-1.5 text-[0.9375rem] font-semibold ${filtro === f.id ? "bg-fg-cobalto text-white" : "text-fg-ceniza hover:text-fg-tizne"}`}
            >
              {f.nombre} <span className="tabular-nums">({f.n})</span>
            </button>
          ))}
        </div>

        <Punto id="lista" className="mt-6">
          {visibles.length === 0 ? (
            <p className="rounded-[16px] bg-white p-6 text-fg-ceniza">No hay pedidos en esta lista. Cuando entre uno desde la página, aparece aquí.</p>
          ) : (
            <ul className="space-y-3">
              {visibles.map((p) => {
                const verbo = accion(p)
                return (
                  <li key={p.id} className="rounded-[16px] bg-white p-4 ring-1 ring-fg-linea sm:p-5">
                    <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
                      <div className="min-w-[9rem]">
                        <p className="text-[1.125rem] font-bold">#{p.numero}</p>
                        <p className="text-[0.875rem] text-fg-ceniza">{textoHora(p.creado)}</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">
                          {dondeVa(p)}
                          {p.canal !== "mesa" && <span className="font-normal text-fg-ceniza">, {p.cliente.nombre}</span>}
                        </p>
                        <p className="mt-0.5 text-[0.9375rem] text-fg-ceniza">{p.lineas.map((l) => `${l.cantidad} × ${l.nombre}`).join(", ")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold tabular-nums">{pesos(total(p))}</p>
                        <p className="text-[0.875rem] text-fg-ceniza">{PAGO[p.pago]}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-fg-linea pt-3">
                      <span className={`rounded-full px-3 py-1 text-[0.8125rem] font-bold ${COLOR_ESTADO[p.estado]}`}>{ESTADO[p.estado]}</span>
                      {p.origen === "web" && <span className="text-[0.8125rem] text-fg-ceniza">Desde la página</span>}
                      <span className="ml-auto flex gap-2">
                        {activo(p) && (
                          <button type="button" onClick={() => cancelarPedido(p.id)} className="h-9 rounded-full px-3 text-[0.875rem] font-semibold text-fg-aji hover:bg-fg-aji-suave">
                            Cancelar
                          </button>
                        )}
                        {verbo && (
                          <button type="button" onClick={() => avanzarPedido(p.id)} className="h-9 rounded-full bg-fg-cobalto px-4 text-[0.875rem] font-bold text-white hover:bg-fg-cobalto-2">
                            {verbo}
                            <span className="sr-only"> el pedido {p.numero}</span>
                          </button>
                        )}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Punto>
      </div>
    </>
  )
}

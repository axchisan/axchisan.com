"use client"

import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { textoFecha, textoHora } from "@/demos/motores/agenda/tiempo"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "../config"
import { marcarPedidoWeb, precioDe, useExistencias, useFerreteria } from "../estado"
import { productoPorId, type PedidoWeb } from "../modelo"
import { Cargando, Encabezado } from "./marco"

const ESTADO: Record<PedidoWeb["estado"], { texto: string; clase: string }> = {
  nuevo: { texto: "Nuevo", clase: "bg-dr-alerta-suave text-dr-alerta" },
  listo: { texto: "Alistado", clase: "bg-dr-exito-suave text-dr-exito" },
  vendido: { texto: "Vendido", clase: "bg-dr-zinc text-dr-acero" },
  cancelado: { texto: "Cancelado", clase: "bg-dr-rojo-suave text-dr-rojo" },
}

export function PedidosFerreteria() {
  const e = useFerreteria()
  const stock = useExistencias(e)
  const { incluye } = useDemo()
  return (
    <SoloEnNivel nivel="catalogo">
      {!e || !stock ? (
        <Cargando />
      ) : (
        <>
          <Encabezado titulo="Pedidos web" detalle="Las listas que los clientes arman en la página y mandan por WhatsApp." />
          <Punto id="lista" className="px-4 py-6 sm:px-8">
            {e.pedidosWeb.length === 0 ? (
              <p className="rounded-[8px] bg-white p-6 text-dr-acero ring-1 ring-dr-linea">Todavía no hay pedidos de la página. Arme una lista en la página pública y aparece aquí.</p>
            ) : (
              <ul className="space-y-4">
                {[...e.pedidosWeb].reverse().map((p) => {
                  const total = p.lineas.reduce((t, l) => t + precioDe(e, productoPorId(l.productoId)!) * l.cantidad, 0)
                  const abierto = p.estado === "nuevo" || p.estado === "listo"
                  return (
                    <li key={p.id} className="rounded-[8px] bg-white p-5 ring-1 ring-dr-linea">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-[1.125rem] font-bold">
                            #{p.numero}, {p.cliente.nombre}
                          </p>
                          <p className="text-[0.875rem] text-dr-acero">
                            {textoFecha(p.fecha.slice(0, 10))}, {textoHora(p.fecha)}. {p.cliente.telefono}.{" "}
                            {p.entrega === "domicilio" ? `Domicilio a ${p.direccion}.` : "Pasa a recoger."}
                          </p>
                        </div>
                        <span className={`rounded-[4px] px-2.5 py-1 text-[0.8125rem] font-bold ${ESTADO[p.estado].clase}`}>{ESTADO[p.estado].texto}</span>
                      </div>
                      <table className="mt-4 w-full text-[0.9375rem]">
                        <caption className="sr-only">Productos del pedido {p.numero}</caption>
                        <thead className="text-left text-[0.8125rem] text-dr-acero">
                          <tr>
                            <th scope="col" className="pb-1 font-semibold">Producto</th>
                            <th scope="col" className="pb-1 text-right font-semibold">Pide</th>
                            <th scope="col" className="pb-1 text-right font-semibold">Hay</th>
                            <th scope="col" className="pb-1 text-right font-semibold">Valor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {p.lineas.map((l) => {
                            const prod = productoPorId(l.productoId)!
                            const hay = stock.get(l.productoId) ?? 0
                            return (
                              <tr key={l.productoId} className="border-t border-dr-linea">
                                <td className="py-1.5">{prod.nombre}</td>
                                <td className="py-1.5 text-right tabular-nums">{l.cantidad}</td>
                                <td className={`py-1.5 text-right tabular-nums ${abierto && hay < l.cantidad ? "font-bold text-dr-rojo" : ""}`}>{hay}</td>
                                <td className="py-1.5 text-right tabular-nums">{pesos(precioDe(e, prod) * l.cantidad)}</td>
                              </tr>
                            )
                          })}
                          <tr className="border-t-2 border-dr-tinta font-bold">
                            <td className="pt-2" colSpan={3}>Total</td>
                            <td className="pt-2 text-right tabular-nums">{pesos(total)}</td>
                          </tr>
                        </tbody>
                      </table>
                      {abierto && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {p.estado === "nuevo" && (
                            <button type="button" onClick={() => marcarPedidoWeb(p.id, "listo")} className="h-9 rounded-[6px] border-2 border-dr-tinta px-3 text-[0.875rem] font-bold hover:bg-dr-tinta hover:text-white">
                              Marcar alistado
                            </button>
                          )}
                          <WhatsappSimulado
                            negocio="el cliente"
                            mensaje={`Hola, ${p.cliente.nombre.split(" ")[0]}. Su pedido #${p.numero} de Doble Rosca está listo${p.entrega === "domicilio" ? " y sale en el próximo domicilio" : " para recoger"}. Total ${pesos(total)}.`}
                            className="inline-flex h-9 items-center gap-1.5 rounded-[6px] border-2 border-dr-tinta px-3 text-[0.875rem] font-bold hover:bg-dr-tinta hover:text-white"
                          >
                            <MessageCircle className="h-4 w-4" aria-hidden />
                            Avisar al cliente
                          </WhatsappSimulado>
                          {incluye("gestion") ? (
                            <Link href={`${RAIZ}/panel?pedido=${p.id}`} className="inline-flex h-9 items-center rounded-[6px] bg-dr-verde px-3 text-[0.875rem] font-bold text-white hover:bg-dr-verde-2">
                              Cobrar en la caja
                            </Link>
                          ) : (
                            <button type="button" onClick={() => marcarPedidoWeb(p.id, "vendido")} className="h-9 rounded-[6px] bg-dr-verde px-3 text-[0.875rem] font-bold text-white hover:bg-dr-verde-2">
                              Marcar vendido
                            </button>
                          )}
                          <button type="button" onClick={() => marcarPedidoWeb(p.id, "cancelado")} className="h-9 rounded-[6px] px-3 text-[0.875rem] font-semibold text-dr-rojo hover:bg-dr-rojo-suave">
                            Cancelar
                          </button>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </Punto>
        </>
      )}
    </SoloEnNivel>
  )
}

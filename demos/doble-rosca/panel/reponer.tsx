"use client"

import { BellRing, MessageCircle } from "lucide-react"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { textoFecha, textoHora } from "@/demos/motores/agenda/tiempo"
import { pesos } from "@/lib/catalogo/planes"
import { bajoMinimo, porReponer, registrarAviso, useExistencias, useFerreteria } from "../estado"
import { Cargando, Encabezado } from "./marco"

const plural = (n: number, unidad: string) => (n === 1 ? unidad : unidad === "unidad" ? "unidades" : unidad === "galón" ? "galones" : `${unidad}s`)

export function ReponerFerreteria() {
  const e = useFerreteria()
  const stock = useExistencias(e)

  return (
    <SoloEnNivel nivel="completo">
      {!e || !stock ? (
        <Cargando />
      ) : (
        (() => {
          const grupos = porReponer(stock)
          const bajos = bajoMinimo(stock)
          return (
            <>
              <Encabezado titulo="Reponer" detalle={`${bajos.length} productos por debajo del mínimo, repartidos en ${grupos.length} proveedores.`} />
              <div className="grid gap-6 px-4 py-6 sm:px-8 xl:grid-cols-[1fr_340px]">
                <Punto id="sugerido">
                  {grupos.length === 0 ? (
                    <p className="rounded-[8px] bg-white p-6 text-dr-acero ring-1 ring-dr-linea">Todo está por encima del mínimo. No hay nada que pedir.</p>
                  ) : (
                    <ul className="space-y-4">
                      {grupos.map(({ proveedor, lineas }) => {
                        const valor = lineas.reduce((t, l) => t + l.pedir * l.producto.costo, 0)
                        const mensaje = [
                          `Hola, ${proveedor.contacto}. Le escribe Hernando, de Ferretería Doble Rosca. Necesito:`,
                          "",
                          ...lineas.map((l) => `${l.pedir} ${plural(l.pedir, l.producto.unidad)} de ${l.producto.nombre}`),
                          "",
                          "¿Me confirma si lo trae en la próxima visita? Gracias.",
                        ].join("\n")
                        return (
                          <li key={proveedor.id} className="rounded-[8px] bg-white p-5 ring-1 ring-dr-linea">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <h2 className="text-[1.125rem] font-bold">{proveedor.nombre}</h2>
                                <p className="text-[0.875rem] text-dr-acero">
                                  {proveedor.contacto}, pasa {proveedor.visita === "todos los días" ? "todos los días" : `los ${proveedor.visita}`}. Pedido de unos {pesos(valor)} al costo.
                                </p>
                              </div>
                              <WhatsappSimulado negocio="el proveedor" mensaje={mensaje} className="inline-flex h-10 items-center gap-2 rounded-[6px] bg-dr-verde px-4 text-[0.9375rem] font-bold text-white hover:bg-dr-verde-2">
                                <MessageCircle className="h-4 w-4" aria-hidden />
                                Enviar pedido
                              </WhatsappSimulado>
                            </div>
                            <table className="mt-4 w-full text-[0.9375rem]">
                              <caption className="sr-only">Pedido sugerido a {proveedor.nombre}</caption>
                              <thead className="text-left text-[0.8125rem] text-dr-acero">
                                <tr>
                                  <th scope="col" className="pb-1 font-semibold">Producto</th>
                                  <th scope="col" className="pb-1 text-right font-semibold">Hay</th>
                                  <th scope="col" className="pb-1 text-right font-semibold">Mínimo</th>
                                  <th scope="col" className="pb-1 text-right font-semibold">Pedir</th>
                                </tr>
                              </thead>
                              <tbody>
                                {lineas.map((l) => (
                                  <tr key={l.producto.id} className="border-t border-dr-linea">
                                    <td className="py-1.5">{l.producto.nombre}</td>
                                    <td className={`py-1.5 text-right tabular-nums ${l.hay <= 0 ? "font-bold text-dr-rojo" : ""}`}>{l.hay}</td>
                                    <td className="py-1.5 text-right text-dr-acero tabular-nums">{l.producto.minimo}</td>
                                    <td className="py-1.5 text-right font-bold tabular-nums">{l.pedir}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </Punto>

                <Punto id="avisos">
                  <section aria-labelledby="avisos-titulo" className="rounded-[8px] bg-white p-5 ring-1 ring-dr-linea">
                    <h2 id="avisos-titulo" className="flex items-center gap-2 text-[1.0625rem] font-bold">
                      <BellRing className="h-4 w-4" aria-hidden />
                      Avisos automáticos
                    </h2>
                    <p className="mt-1 text-[0.875rem] text-dr-acero">Cada mañana a las 6:30 a. m., a su WhatsApp.</p>
                    <button
                      type="button"
                      onClick={() => registrarAviso(`Aviso enviado a su WhatsApp: ${bajos.length} productos por debajo del mínimo. ${grupos.map((g) => g.proveedor.nombre).join(", ")}.`)}
                      className="mt-4 h-10 w-full rounded-[6px] border-2 border-dr-tinta font-bold hover:bg-dr-tinta hover:text-white"
                    >
                      Enviar el aviso ahora
                    </button>
                    <ol className="mt-4 space-y-3" aria-live="polite">
                      {e.avisos.slice(0, 6).map((a, i) => (
                        <li key={i} className="border-l-4 border-dr-cinta pl-3 text-[0.875rem]">
                          <p className="font-semibold">
                            {textoFecha(a.fecha.slice(0, 10))}, {textoHora(a.fecha)}
                          </p>
                          <p className="text-dr-acero">{a.texto}</p>
                        </li>
                      ))}
                    </ol>
                  </section>
                </Punto>
              </div>
            </>
          )
        })()
      )}
    </SoloEnNivel>
  )
}

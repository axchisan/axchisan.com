"use client"

import { useState } from "react"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { estadoStock, sugerirPedido } from "@/demos/motores/gestion/inventario"
import { pesos } from "@/lib/catalogo/planes"
import { registrarEntrada, useExistencias, useFerreteria } from "../estado"
import { PRODUCTOS, PROVEEDORES } from "../modelo"
import { botonVerde, campo } from "../publico"
import { Cargando, Encabezado } from "./marco"

export function EntradasFerreteria() {
  const e = useFerreteria()
  const stock = useExistencias(e)
  const [proveedorId, setProveedor] = useState(PROVEEDORES[0].id)
  const [cantidades, setCantidades] = useState<Record<string, string>>({})
  const [costos, setCostos] = useState<Record<string, string>>({})
  const [factura, setFactura] = useState("")
  const [aviso, setAviso] = useState("")

  return (
    <SoloEnNivel nivel="gestion">
      {!e || !stock ? (
        <Cargando />
      ) : (
        (() => {
          const productos = PRODUCTOS.filter((p) => p.proveedorId === proveedorId).sort((a, b) => {
            const ea = estadoStock(stock.get(a.id) ?? 0, a.minimo) === "ok" ? 1 : 0
            const eb = estadoStock(stock.get(b.id) ?? 0, b.minimo) === "ok" ? 1 : 0
            return ea - eb
          })
          const lineas = productos
            .map((p) => ({ productoId: p.id, cantidad: Number(cantidades[p.id]) || 0, costo: Number((costos[p.id] ?? "").replace(/\D/g, "")) || p.costo }))
            .filter((l) => l.cantidad > 0)
          const valor = lineas.reduce((t, l) => t + l.cantidad * l.costo, 0)
          return (
            <>
              <Encabezado titulo="Entrada de mercancía" detalle="Cuando llega el proveedor: se anotan las cantidades de la factura y el inventario sube." />
              <form
                onSubmit={(ev) => {
                  ev.preventDefault()
                  if (!lineas.length) {
                    setAviso("Anote al menos una cantidad.")
                    return
                  }
                  registrarEntrada(lineas, factura)
                  setAviso(`Entrada registrada: ${lineas.length} productos por ${pesos(valor)}. El inventario ya está al día.`)
                  setCantidades({})
                  setCostos({})
                  setFactura("")
                }}
                className="px-4 py-6 sm:px-8"
              >
                <Punto id="factura">
                  <div className="flex flex-wrap items-end gap-4">
                    <label className="block">
                      <span className="font-semibold">Proveedor</span>
                      <select
                        value={proveedorId}
                        onChange={(ev) => {
                          setProveedor(ev.target.value)
                          setCantidades({})
                          setCostos({})
                          setAviso("")
                        }}
                        className={`${campo} min-w-[16rem]`}
                      >
                        {PROVEEDORES.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="font-semibold">Número de factura</span>
                      <input value={factura} onChange={(ev) => setFactura(ev.target.value)} className={`${campo} w-44`} />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setCantidades(
                          Object.fromEntries(
                            productos.map((p) => [p.id, String(sugerirPedido(stock.get(p.id) ?? 0, p.minimo, p.empaque) || "")]).filter(([, v]) => v),
                          ),
                        )
                      }
                      className="h-11 rounded-[6px] border-2 border-dr-tinta px-4 font-bold hover:bg-dr-tinta hover:text-white"
                    >
                      Llenar con lo sugerido
                    </button>
                  </div>

                  <div className="mt-5 overflow-x-auto rounded-[8px] bg-white ring-1 ring-dr-linea">
                    <table className="w-full min-w-[640px] text-[0.9375rem]">
                      <caption className="sr-only">Productos del proveedor</caption>
                      <thead className="border-b border-dr-linea text-left text-[0.8125rem] text-dr-acero">
                        <tr>
                          <th scope="col" className="px-4 py-3 font-semibold">Producto</th>
                          <th scope="col" className="px-4 py-3 text-right font-semibold">Hay</th>
                          <th scope="col" className="px-4 py-3 text-right font-semibold">Mínimo</th>
                          <th scope="col" className="px-4 py-3 text-right font-semibold">Llegan</th>
                          <th scope="col" className="px-4 py-3 text-right font-semibold">Costo unitario</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productos.map((p) => {
                          const hay = stock.get(p.id) ?? 0
                          const bajo = estadoStock(hay, p.minimo) !== "ok"
                          return (
                            <tr key={p.id} className="border-t border-dr-linea first:border-0">
                              <td className="px-4 py-2.5">
                                <span className="font-semibold">{p.nombre}</span>
                                {bajo && <span className="ml-2 rounded-[4px] bg-dr-cinta px-1.5 py-0.5 text-[0.75rem] font-bold">Por reponer</span>}
                              </td>
                              <td className="px-4 py-2.5 text-right tabular-nums">{hay}</td>
                              <td className="px-4 py-2.5 text-right text-dr-acero tabular-nums">{p.minimo}</td>
                              <td className="px-4 py-2.5 text-right">
                                <label>
                                  <span className="sr-only">Cantidad que llega de {p.nombre}</span>
                                  <input
                                    value={cantidades[p.id] ?? ""}
                                    onChange={(ev) => setCantidades((c) => ({ ...c, [p.id]: ev.target.value.replace(/\D/g, "") }))}
                                    inputMode="numeric"
                                    placeholder="0"
                                    className="h-9 w-20 rounded-[6px] border border-dr-linea px-2 text-right tabular-nums"
                                  />
                                </label>
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                <label>
                                  <span className="sr-only">Costo unitario de {p.nombre}</span>
                                  <input
                                    value={costos[p.id] ?? p.costo.toLocaleString("es-CO")}
                                    onChange={(ev) => setCostos((c) => ({ ...c, [p.id]: ev.target.value }))}
                                    inputMode="numeric"
                                    className="h-9 w-28 rounded-[6px] border border-dr-linea px-2 text-right tabular-nums"
                                  />
                                </label>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </Punto>

                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <button type="submit" className={botonVerde}>
                    Registrar entrada{valor ? ` por ${pesos(valor)}` : ""}
                  </button>
                  {aviso && (
                    <p role="status" className="font-semibold">
                      {aviso}
                    </p>
                  )}
                </div>
              </form>
            </>
          )
        })()
      )}
    </SoloEnNivel>
  )
}

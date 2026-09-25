"use client"

import Link from "next/link"
import { useState } from "react"
import { FileSpreadsheet, Search } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { claveDia } from "@/demos/motores/agenda/tiempo"
import { estadoStock } from "@/demos/motores/gestion/inventario"
import { aCsv, descargar } from "@/demos/motores/gestion/reportes"
import { pesos } from "@/lib/catalogo/planes"
import { normalizar } from "../catalogo"
import { RAIZ } from "../config"
import { cambiarPrecio, precioDe, useExistencias, useFerreteria } from "../estado"
import { CATEGORIAS, PRODUCTOS, proveedorPorId, type Producto } from "../modelo"
import { CintaStock, Disponibilidad } from "../publico"
import { Cargando, Encabezado } from "./marco"

export function InventarioFerreteria() {
  const e = useFerreteria()
  const stock = useExistencias(e)
  const { incluye } = useDemo()
  const [texto, setTexto] = useState("")
  const [categoria, setCategoria] = useState("Todas")
  const [soloReponer, setSoloReponer] = useState(false)
  const gestion = incluye("gestion")

  return (
    <SoloEnNivel nivel="catalogo">
      {!e || !stock ? (
        <Cargando />
      ) : (
        (() => {
          const q = normalizar(texto.trim())
          const filas = PRODUCTOS.filter(
            (p) =>
              (categoria === "Todas" || p.categoria === categoria) &&
              (!q || normalizar(`${p.nombre} ${p.sku}`).includes(q)) &&
              (!soloReponer || estadoStock(stock.get(p.id) ?? 0, p.minimo) !== "ok"),
          )
          const valorInventario = PRODUCTOS.reduce((t, p) => t + Math.max(0, stock.get(p.id) ?? 0) * p.costo, 0)
          const reponer = PRODUCTOS.filter((p) => estadoStock(stock.get(p.id) ?? 0, p.minimo) !== "ok").length

          function exportar() {
            descargar(
              `inventario-doble-rosca-${claveDia(new Date())}.csv`,
              aCsv([
                ["Código", "Producto", "Categoría", "Unidad", "Existencias", "Mínimo", "Costo", "Precio", "Valor al costo", "Proveedor", "Ubicación"],
                ...PRODUCTOS.map((p) => {
                  const hay = stock!.get(p.id) ?? 0
                  return [p.sku, p.nombre, p.categoria, p.unidad, hay, p.minimo, p.costo, precioDe(e, p), Math.max(0, hay) * p.costo, proveedorPorId(p.proveedorId)?.nombre ?? "", p.ubicacion ?? ""]
                }),
              ]),
            )
          }

          return (
            <>
              <Encabezado
                titulo="Inventario"
                detalle={gestion ? `${PRODUCTOS.length} productos, ${reponer} por reponer. Inventario valorado al costo en ${pesos(valorInventario)}.` : `${PRODUCTOS.length} productos. Cambie un precio y la página lo muestra al instante.`}
                accion={
                  gestion ? (
                    <button type="button" onClick={exportar} className="inline-flex h-10 items-center gap-2 rounded-[6px] border-2 border-dr-tinta px-4 text-[0.9375rem] font-bold hover:bg-dr-tinta hover:text-white">
                      <FileSpreadsheet className="h-4 w-4" aria-hidden />
                      Descargar para Excel
                    </button>
                  ) : undefined
                }
              />
              <div className="px-4 py-6 sm:px-8">
                <div className="flex flex-wrap items-end gap-3">
                  <label className="relative block min-w-[16rem] flex-1">
                    <span className="sr-only">Buscar producto</span>
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-dr-acero" aria-hidden />
                    <input value={texto} onChange={(ev) => setTexto(ev.target.value)} placeholder="Buscar por nombre o código" className="h-11 w-full rounded-[6px] border border-dr-linea bg-white pr-3 pl-9" />
                  </label>
                  <label className="block">
                    <span className="sr-only">Categoría</span>
                    <select value={categoria} onChange={(ev) => setCategoria(ev.target.value)} className="h-11 rounded-[6px] border border-dr-linea bg-white px-3">
                      {["Todas", ...CATEGORIAS].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  {gestion && (
                    <button type="button" aria-pressed={soloReponer} onClick={() => setSoloReponer((x) => !x)} className={`h-11 rounded-[6px] border-2 px-4 font-bold ${soloReponer ? "border-dr-tinta bg-dr-cinta" : "border-dr-linea bg-white hover:border-dr-tinta"}`}>
                      Solo por reponer ({reponer})
                    </button>
                  )}
                </div>

                <div className="mt-5 overflow-x-auto rounded-[8px] bg-white ring-1 ring-dr-linea">
                  <table className="w-full min-w-[720px] text-[0.9375rem]">
                    <caption className="sr-only">Productos del inventario</caption>
                    <thead className="border-b border-dr-linea text-left text-[0.8125rem] text-dr-acero">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">Producto</th>
                        <th scope="col" className="px-4 py-3 font-semibold">{gestion ? "Existencias" : "Disponibilidad"}</th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold">Precio</th>
                        {gestion && <th scope="col" className="px-4 py-3 text-right font-semibold">Margen</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {filas.map((p, i) => (
                        <Fila key={`${p.id}-${precioDe(e, p)}`} producto={p} hay={stock.get(p.id) ?? 0} precio={precioDe(e, p)} gestion={gestion} marcar={i === 0} />
                      ))}
                    </tbody>
                  </table>
                  {filas.length === 0 && <p className="p-6 text-dr-acero">Ningún producto coincide con el filtro.</p>}
                </div>
              </div>
            </>
          )
        })()
      )}
    </SoloEnNivel>
  )
}

function Fila({ producto: p, hay, precio, gestion, marcar }: { producto: Producto; hay: number; precio: number; gestion: boolean; marcar: boolean }) {
  const [borrador, setBorrador] = useState(precio.toLocaleString("es-CO"))
  const guardar = () => {
    const v = Number(borrador.replace(/\D/g, ""))
    if (v >= 100 && v !== precio) cambiarPrecio(p.id, v)
    else setBorrador(precio.toLocaleString("es-CO"))
  }
  const margen = precio ? Math.round(((precio - p.costo) / precio) * 100) : 0
  const existencias = (
    <div className="flex items-center gap-3">
      <div className="w-28">
        <CintaStock hay={hay} minimo={p.minimo} />
      </div>
      <span className={`text-[0.875rem] tabular-nums ${estadoStock(hay, p.minimo) === "ok" ? "" : "font-bold"}`}>
        {hay} <span className="font-normal text-dr-acero">mín. {p.minimo}</span>
      </span>
    </div>
  )
  const campoPrecio = (
    <label className="inline-flex items-center justify-end gap-1">
      <span className="sr-only">Precio de {p.nombre}</span>
      <span className="text-dr-acero">$</span>
      <input
        value={borrador}
        onChange={(ev) => setBorrador(ev.target.value)}
        onBlur={guardar}
        onKeyDown={(ev) => ev.key === "Enter" && (ev.target as HTMLInputElement).blur()}
        inputMode="numeric"
        className="h-9 w-28 rounded-[6px] border border-dr-linea px-2 text-right font-semibold tabular-nums focus:border-dr-verde focus:outline-2 focus:outline-dr-verde"
      />
    </label>
  )
  return (
    <tr className="border-t border-dr-linea first:border-0">
      <td className="px-4 py-3">
        {gestion ? (
          <Link href={`${RAIZ}/panel/inventario/${p.id}`} className="font-semibold underline-offset-4 hover:underline">
            {p.nombre}
          </Link>
        ) : (
          <span className="font-semibold">{p.nombre}</span>
        )}
        <span className="block text-[0.8125rem] text-dr-acero">
          {p.sku}, {p.ubicacion}
        </span>
      </td>
      <td className="px-4 py-3">{gestion ? marcar ? <Punto id="alertas">{existencias}</Punto> : existencias : <Disponibilidad hay={hay} minimo={p.minimo} unidad={p.unidad} exacto={false} />}</td>
      <td className="px-4 py-3 text-right">{marcar ? <Punto id="precio">{campoPrecio}</Punto> : campoPrecio}</td>
      {gestion && <td className={`px-4 py-3 text-right tabular-nums ${margen < 20 ? "text-dr-alerta" : ""}`}>{margen} %</td>}
    </tr>
  )
}

"use client"

import { useState } from "react"
import { FileSpreadsheet } from "lucide-react"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { aFecha, claveDia, sumarDias, textoFecha, textoHora } from "@/demos/motores/agenda/tiempo"
import { PAGO, totalVenta } from "@/demos/motores/gestion/inventario"
import { aCsv, descargar, porCategoria, porDia, porPago, porProducto, resumen, ventasEntre } from "@/demos/motores/gestion/reportes"
import { pesos } from "@/lib/catalogo/planes"
import { useFerreteria } from "../estado"
import { PRODUCTOS } from "../modelo"
import { Cargando, Encabezado } from "./marco"

const PERIODOS = [
  { id: "hoy", nombre: "Hoy", dias: 1 },
  { id: "semana", nombre: "Últimos 7 días", dias: 7 },
  { id: "tres", nombre: "Últimas 3 semanas", dias: 21 },
] as const

const CORTO = new Intl.DateTimeFormat("es-CO", { weekday: "narrow" })

export function ReportesFerreteria() {
  const e = useFerreteria()
  const [periodo, setPeriodo] = useState<(typeof PERIODOS)[number]["id"]>("semana")

  return (
    <SoloEnNivel nivel="gestion">
      {!e ? (
        <Cargando />
      ) : (
        (() => {
          const hoy = claveDia(new Date())
          const dias = PERIODOS.find((p) => p.id === periodo)!.dias
          const desde = sumarDias(hoy, -(dias - 1))
          const ventas = ventasEntre(e.ventas, desde, hoy)
          const r = resumen(ventas)
          const serie = porDia(ventas, Array.from({ length: dias }, (_, i) => sumarDias(desde, i)))
          const maxDia = Math.max(1, ...serie.map((d) => d.total))
          const cats = porCategoria(ventas, PRODUCTOS)
          const maxCat = Math.max(1, ...cats.map(([, v]) => v))
          const productos = porProducto(ventas, PRODUCTOS).slice(0, 10)

          function exportar() {
            descargar(
              `ventas-doble-rosca-${desde}-a-${hoy}.csv`,
              aCsv([
                ["Venta", "Fecha", "Hora", "Código", "Producto", "Cantidad", "Precio", "Costo", "Valor", "Descuento de la venta", "Medio de pago", "Cliente", "Origen"],
                ...ventas.flatMap((v) =>
                  v.lineas.map((l) => [
                    v.numero,
                    v.fecha.slice(0, 10),
                    textoHora(v.fecha),
                    PRODUCTOS.find((p) => p.id === l.productoId)?.sku ?? "",
                    l.nombre,
                    l.cantidad,
                    l.precio,
                    l.costo,
                    l.precio * l.cantidad,
                    v.descuento,
                    PAGO[v.pago],
                    v.cliente ?? "",
                    v.origen === "web" ? "Pedido web" : "Mostrador",
                  ]),
                ),
              ]),
            )
          }

          return (
            <>
              <Encabezado
                titulo="Reportes"
                detalle={dias === 1 ? textoFecha(hoy) : `Del ${textoFecha(desde)} al ${textoFecha(hoy)}`}
                accion={
                  <Punto id="excel">
                    <button type="button" onClick={exportar} className="inline-flex h-10 items-center gap-2 rounded-[6px] border-2 border-dr-tinta px-4 text-[0.9375rem] font-bold hover:bg-dr-tinta hover:text-white">
                      <FileSpreadsheet className="h-4 w-4" aria-hidden />
                      Descargar ventas para Excel
                    </button>
                  </Punto>
                }
              />
              <div className="space-y-6 px-4 py-6 sm:px-8">
                <div role="group" aria-label="Periodo" className="inline-flex flex-wrap gap-1 rounded-[8px] bg-white p-1 ring-1 ring-dr-linea">
                  {PERIODOS.map((p) => (
                    <button key={p.id} type="button" aria-pressed={periodo === p.id} onClick={() => setPeriodo(p.id)} className={`rounded-[6px] px-3.5 py-1.5 text-[0.9375rem] font-semibold ${periodo === p.id ? "bg-dr-tinta text-white" : "text-dr-acero hover:text-dr-tinta"}`}>
                      {p.nombre}
                    </button>
                  ))}
                </div>

                <Punto id="resumen">
                  <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      { t: "Vendido", v: pesos(r.vendido) },
                      { t: "Ventas", v: String(r.ventas) },
                      { t: "Ticket promedio", v: pesos(r.ticket) },
                      { t: "Utilidad bruta", v: pesos(r.utilidad), d: `${Math.round(r.margen * 100)} % sobre lo vendido` },
                    ].map((x) => (
                      <div key={x.t} className="rounded-[8px] bg-white p-5 ring-1 ring-dr-linea">
                        <dt className="text-[0.9375rem] text-dr-acero">{x.t}</dt>
                        <dd className="dr-ancha mt-1 text-[1.75rem] leading-none font-extrabold tabular-nums">{x.v}</dd>
                        {x.d && <dd className="mt-1.5 text-[0.8125rem] text-dr-acero">{x.d}</dd>}
                      </div>
                    ))}
                  </dl>
                </Punto>

                {dias > 1 && (
                  <section aria-labelledby="r-dias" className="rounded-[8px] bg-white p-5 ring-1 ring-dr-linea">
                    <h2 id="r-dias" className="text-[1.0625rem] font-bold">
                      Ventas por día
                    </h2>
                    <div className="mt-4 flex h-44 items-end gap-1" aria-hidden>
                      {serie.map((d) => (
                        <div key={d.dia} className="group relative flex h-full flex-1 flex-col justify-end" title={`${textoFecha(d.dia)}: ${pesos(d.total)} en ${d.ventas} ventas`}>
                          <div className={`rounded-t-[3px] ${d.dia === hoy ? "bg-dr-cinta" : "bg-dr-verde"} group-hover:opacity-80`} style={{ height: `${(d.total / maxDia) * 100}%` }} />
                        </div>
                      ))}
                    </div>
                    <div className="mt-1.5 flex gap-1 text-center text-[0.75rem] text-dr-acero" aria-hidden>
                      {serie.map((d) => (
                        <span key={d.dia} className="flex-1">
                          {CORTO.format(aFecha(d.dia))}
                        </span>
                      ))}
                    </div>
                    <table className="sr-only">
                      <caption>Ventas por día</caption>
                      <tbody>
                        {serie.map((d) => (
                          <tr key={d.dia}>
                            <th scope="row">{textoFecha(d.dia)}</th>
                            <td>{pesos(d.total)}</td>
                            <td>{d.ventas} ventas</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="mt-3 text-[0.8125rem] text-dr-acero">Hoy va en amarillo: el día todavía no termina.</p>
                  </section>
                )}

                <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
                  <section aria-labelledby="r-cat" className="rounded-[8px] bg-white p-5 ring-1 ring-dr-linea">
                    <h2 id="r-cat" className="text-[1.0625rem] font-bold">
                      Por categoría
                    </h2>
                    <ul className="mt-4 space-y-3.5">
                      {cats.map(([c, v]) => (
                        <li key={c}>
                          <div className="flex justify-between text-[0.9375rem]">
                            <span className="font-semibold">{c}</span>
                            <span className="tabular-nums">{pesos(v)}</span>
                          </div>
                          <div className="mt-1 h-2.5 rounded-[2px] bg-dr-zinc" aria-hidden>
                            <div className="h-full rounded-[2px] bg-dr-verde" style={{ width: `${(v / maxCat) * 100}%` }} />
                          </div>
                        </li>
                      ))}
                    </ul>
                    <h2 className="mt-8 text-[1.0625rem] font-bold">Por medio de pago</h2>
                    <dl className="mt-3 space-y-2 text-[0.9375rem]">
                      {porPago(ventas).map(([m, v]) => (
                        <div key={m} className="flex justify-between border-b border-dr-linea pb-2 last:border-0">
                          <dt>{PAGO[m]}</dt>
                          <dd className="font-semibold tabular-nums">{pesos(v)}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>

                  <section aria-labelledby="r-prod" tabIndex={0} className="overflow-x-auto rounded-[8px] bg-white p-5 ring-1 ring-dr-linea">
                    <h2 id="r-prod" className="text-[1.0625rem] font-bold">
                      Los 10 que más venden
                    </h2>
                    <table className="mt-3 w-full min-w-[480px] text-[0.9375rem]">
                      <caption className="sr-only">Productos más vendidos del periodo</caption>
                      <thead className="text-left text-[0.8125rem] text-dr-acero">
                        <tr>
                          <th scope="col" className="pb-2 font-semibold">Producto</th>
                          <th scope="col" className="pb-2 text-right font-semibold">Cantidad</th>
                          <th scope="col" className="pb-2 text-right font-semibold">Vendido</th>
                          <th scope="col" className="pb-2 text-right font-semibold">Utilidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productos.map((x) => (
                          <tr key={x.producto.id} className="border-t border-dr-linea">
                            <td className="py-2">{x.producto.nombre}</td>
                            <td className="py-2 text-right tabular-nums">{x.cantidad}</td>
                            <td className="py-2 text-right tabular-nums">{pesos(x.total)}</td>
                            <td className="py-2 text-right tabular-nums">{pesos(x.utilidad)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {ventas.length === 0 && <p className="mt-3 text-dr-acero">Todavía no hay ventas en este periodo.</p>}
                  </section>
                </div>

                <p className="text-[0.8125rem] text-dr-acero">
                  La utilidad bruta es lo vendido menos el costo de lo vendido, antes de arriendo, nómina y demás gastos. {ventas.length} ventas por{" "}
                  {pesos(ventas.reduce((t, v) => t + totalVenta(v), 0))}.
                </p>
              </div>
            </>
          )
        })()
      )}
    </SoloEnNivel>
  )
}

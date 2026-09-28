"use client"

import Link from "next/link"
import { useState } from "react"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { textoFecha, textoHora } from "@/demos/motores/agenda/tiempo"
import { kardex } from "@/demos/motores/gestion/inventario"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "../config"
import { ajustarConteo, precioDe, useExistencias, useFerreteria } from "../estado"
import { productoPorId, proveedorPorId } from "../modelo"
import { botonVerde, campo, CintaStock } from "../publico"
import { Cargando, Encabezado } from "./marco"

export function KardexFerreteria({ id }: { id: string }) {
  const e = useFerreteria()
  const stock = useExistencias(e)
  const [contado, setContado] = useState("")
  const [nota, setNota] = useState("")
  const [aviso, setAviso] = useState("")
  const p = productoPorId(id)

  if (!p) {
    return (
      <div className="px-4 py-16 sm:px-8">
        <p className="text-dr-acero">Ese producto no existe.</p>
        <Link href={`${RAIZ}/panel/inventario`} className="mt-3 inline-block font-semibold text-dr-verde underline">
          Volver al inventario
        </Link>
      </div>
    )
  }

  return (
    <SoloEnNivel nivel="gestion">
      {!e || !stock ? (
        <Cargando />
      ) : (
        (() => {
          const hay = stock.get(p.id) ?? 0
          const filas = kardex(p.id, e.movimientos, e.ventas).reverse()
          const prov = proveedorPorId(p.proveedorId)
          return (
            <>
              <Encabezado
                titulo={p.nombre}
                detalle={
                  <>
                    <Link href={`${RAIZ}/panel/inventario`} className="font-semibold text-dr-verde underline underline-offset-4">
                      Inventario
                    </Link>{" "}
                    / {p.sku}, {p.categoria}, {p.ubicacion}
                  </>
                }
              />
              <div className="grid gap-6 px-4 py-6 sm:px-8 xl:grid-cols-[1fr_340px]">
                <Punto id="kardex">
                  <div className="overflow-x-auto rounded-[8px] bg-white ring-1 ring-dr-linea">
                    <table className="w-full min-w-[560px] text-[0.9375rem]">
                      <caption className="px-4 pt-4 pb-2 text-left text-[1rem] font-bold">Kardex, del más reciente al más antiguo</caption>
                      <thead className="border-b border-dr-linea text-left text-[0.8125rem] text-dr-acero">
                        <tr>
                          <th scope="col" className="px-4 py-2 font-semibold">Fecha</th>
                          <th scope="col" className="px-4 py-2 font-semibold">Concepto</th>
                          <th scope="col" className="px-4 py-2 text-right font-semibold">Entra</th>
                          <th scope="col" className="px-4 py-2 text-right font-semibold">Sale</th>
                          <th scope="col" className="px-4 py-2 text-right font-semibold">Saldo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filas.slice(0, 60).map((f, i) => (
                          <tr key={i} className="border-t border-dr-linea">
                            <td className="px-4 py-2 whitespace-nowrap text-dr-acero">
                              {textoFecha(f.fecha.slice(0, 10))}, {textoHora(f.fecha)}
                            </td>
                            <td className="px-4 py-2">{f.concepto}</td>
                            <td className="px-4 py-2 text-right text-dr-exito tabular-nums">{f.entra || ""}</td>
                            <td className="px-4 py-2 text-right tabular-nums">{f.sale || ""}</td>
                            <td className="px-4 py-2 text-right font-semibold tabular-nums">{f.saldo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filas.length > 60 && <p className="px-4 py-3 text-[0.875rem] text-dr-acero">Se muestran los 60 movimientos más recientes de {filas.length}.</p>}
                  </div>
                </Punto>

                <div className="space-y-6">
                  <section aria-labelledby="k-resumen" className="rounded-[8px] bg-white p-5 ring-1 ring-dr-linea">
                    <h2 id="k-resumen" className="text-[1.0625rem] font-bold">
                      Existencias
                    </h2>
                    <p className="mt-2 text-[2rem] leading-none font-extrabold tabular-nums">
                      {hay} <span className="text-[1rem] font-semibold text-dr-acero">{p.unidad === "unidad" ? "unidades" : p.unidad}</span>
                    </p>
                    <div className="mt-3">
                      <CintaStock hay={hay} minimo={p.minimo} />
                    </div>
                    <dl className="mt-4 space-y-1.5 text-[0.9375rem]">
                      {[
                        ["Mínimo", String(p.minimo)],
                        ["Costo", pesos(p.costo)],
                        ["Precio", pesos(precioDe(e, p))],
                        ["Proveedor", `${prov?.nombre}, pasa los ${prov?.visita}`],
                        ["Empaque", `${p.empaque} ${p.unidad === "unidad" ? "unidades" : p.unidad}`],
                      ].map(([t, v]) => (
                        <div key={t} className="flex justify-between gap-4">
                          <dt className="text-dr-acero">{t}</dt>
                          <dd className="text-right font-semibold">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>

                  <Punto id="conteo">
                    <form
                      onSubmit={(ev) => {
                        ev.preventDefault()
                        const n = Number(contado)
                        if (contado === "" || !Number.isInteger(n) || n < 0) {
                          setAviso("Escriba cuántas hay en el estante, en números enteros.")
                          return
                        }
                        ajustarConteo(p.id, n, hay, nota)
                        setAviso(n === hay ? "El conteo cuadra con el sistema. No hubo que ajustar." : `Ajuste registrado: ${n - hay > 0 ? "+" : ""}${n - hay}.`)
                        setContado("")
                        setNota("")
                      }}
                      className="rounded-[8px] bg-white p-5 ring-1 ring-dr-linea"
                    >
                      <h2 className="text-[1.0625rem] font-bold">Conteo físico</h2>
                      <label className="mt-3 block">
                        <span className="text-[0.9375rem]">¿Cuántas hay en el estante?</span>
                        <input value={contado} onChange={(ev) => setContado(ev.target.value)} inputMode="numeric" className={campo} />
                      </label>
                      <label className="mt-3 block">
                        <span className="text-[0.9375rem]">Motivo</span> <span className="text-[0.8125rem] text-dr-acero">Opcional</span>
                        <input value={nota} onChange={(ev) => setNota(ev.target.value)} placeholder="Daño, pérdida, error de conteo…" className={campo} />
                      </label>
                      <button type="submit" className={`${botonVerde} mt-4 w-full`}>
                        Registrar conteo
                      </button>
                      {aviso && (
                        <p role="status" className="mt-3 text-[0.9375rem] font-semibold">
                          {aviso}
                        </p>
                      )}
                    </form>
                  </Punto>
                </div>
              </div>
            </>
          )
        })()
      )}
    </SoloEnNivel>
  )
}

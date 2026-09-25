"use client"

import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { CANAL, PAGO } from "@/demos/motores/pedidos/pedido"
import { pesos } from "@/lib/catalogo/planes"
import { useRestaurante, ventasDelDia } from "../estado"
import { Cargando, Encabezado } from "./marco"

export function VentasFogon() {
  const e = useRestaurante()
  return (
    <SoloEnNivel nivel="sistema">
      {!e ? <Cargando /> : <Resumen v={ventasDelDia(e)} />}
    </SoloEnNivel>
  )
}

function Resumen({ v }: { v: ReturnType<typeof ventasDelDia> }) {
  const maxCanal = Math.max(1, ...v.porCanal.map((c) => c.total))
  const maxPlato = Math.max(1, ...v.masVendidos.map((p) => p.unidades))
  return (
    <>
      <Encabezado titulo="Ventas del día" detalle={`Pedidos cerrados y en curso. ${v.cancelados ? `${v.cancelados} cancelado${v.cancelados === 1 ? "" : "s"}, sin contar.` : ""}`} />
      <div className="space-y-6 px-4 py-6 sm:px-8">
        <Punto id="resumen">
          <dl className="grid gap-4 sm:grid-cols-3">
            {[
              { t: "Vendido hoy", v: pesos(v.vendido) },
              { t: "Pedidos", v: String(v.pedidos) },
              { t: "Ticket promedio", v: pesos(v.ticket) },
            ].map((x) => (
              <div key={x.t} className="rounded-[16px] bg-white p-5 ring-1 ring-fg-linea">
                <dt className="text-[0.9375rem] text-fg-ceniza">{x.t}</dt>
                <dd className="mt-1 font-fg-letrero text-[2rem] leading-none text-fg-cobalto tabular-nums">{x.v}</dd>
              </div>
            ))}
          </dl>
        </Punto>

        <Punto id="platos">
          <div className="grid gap-6 lg:grid-cols-2">
            <section aria-labelledby="v-canal" className="rounded-[16px] bg-white p-5 ring-1 ring-fg-linea">
              <h2 id="v-canal" className="font-fg-letrero text-[1.25rem]">
                Por dónde se vendió
              </h2>
              <ul className="mt-4 space-y-4">
                {v.porCanal.map((c) => (
                  <li key={c.canal}>
                    <div className="flex justify-between text-[0.9375rem]">
                      <span className="font-semibold">{CANAL[c.canal]}</span>
                      <span className="tabular-nums">
                        {pesos(c.total)} <span className="text-fg-ceniza">en {c.pedidos}</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-2.5 rounded-full bg-fg-peltre" aria-hidden>
                      <div className="h-full rounded-full bg-fg-cobalto" style={{ width: `${(c.total / maxCanal) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>

              <h2 className="mt-8 font-fg-letrero text-[1.25rem]">Para cuadrar la caja</h2>
              <table className="mt-3 w-full text-[0.9375rem]">
                <caption className="sr-only">Ventas por medio de pago</caption>
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Medio de pago</th>
                    <th scope="col">Pedidos</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {v.porPago.map((p) => (
                    <tr key={p.pago} className="border-b border-fg-linea last:border-0">
                      <th scope="row" className="py-2.5 text-left font-semibold">{PAGO[p.pago]}</th>
                      <td className="py-2.5 text-right text-fg-ceniza tabular-nums">{p.pedidos} {p.pedidos === 1 ? "pedido" : "pedidos"}</td>
                      <td className="py-2.5 pl-4 text-right font-semibold tabular-nums">{pesos(p.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section aria-labelledby="v-platos" className="rounded-[16px] bg-white p-5 ring-1 ring-fg-linea">
              <h2 id="v-platos" className="font-fg-letrero text-[1.25rem]">
                Lo que más sale hoy
              </h2>
              <ol className="mt-4 space-y-4">
                {v.masVendidos.map((p) => (
                  <li key={p.plato.id}>
                    <div className="flex justify-between text-[0.9375rem]">
                      <span className="font-semibold">{p.plato.nombre}</span>
                      <span className="tabular-nums">{p.unidades} unidades</span>
                    </div>
                    <div className="mt-1.5 h-2.5 rounded-full bg-fg-peltre" aria-hidden>
                      <div className="h-full rounded-full bg-fg-cobalto" style={{ width: `${(p.unidades / maxPlato) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </Punto>
      </div>
    </>
  )
}

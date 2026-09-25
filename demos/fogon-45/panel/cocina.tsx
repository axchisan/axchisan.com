"use client"

import { Clock } from "lucide-react"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { useAhora } from "@/demos/comun/reloj"
import { accion, type EstadoPedido, type Pedido } from "@/demos/motores/pedidos/pedido"
import { avanzarPedido, minutosDesde, useRestaurante } from "../estado"
import { Cargando, Encabezado } from "./marco"
import { dondeVa } from "./pedidos"

const COLUMNAS: { estado: EstadoPedido; titulo: string; vacio: string }[] = [
  { estado: "recibido", titulo: "Nuevos", vacio: "Sin pedidos nuevos." },
  { estado: "preparando", titulo: "En el fogón", vacio: "Nada en preparación." },
  { estado: "listo", titulo: "Listos para salir", vacio: "Nada esperando." },
]

/** A partir de estos minutos, el pedido se marca como demorado. */
const DEMORA = 20

export function CocinaFogon() {
  const e = useRestaurante()
  const ahora = useAhora()

  return (
    <SoloEnNivel nivel="sistema">
      {!e || !ahora ? (
        <Cargando />
      ) : (
        <>
          <Encabezado titulo="Cocina" detalle="Pensada para una tablet en la pared de la cocina. Los pedidos entran solos, del más viejo al más nuevo." />
          <Punto id="columnas" className="px-4 py-6 sm:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {COLUMNAS.map((c, ci) => {
                const ps = e.pedidos.filter((p) => p.estado === c.estado).sort((a, b) => a.creado.localeCompare(b.creado))
                return (
                  <section key={c.estado} aria-labelledby={`col-${c.estado}`} className="rounded-[20px] bg-white/60 p-3 ring-1 ring-fg-linea">
                    <h2 id={`col-${c.estado}`} className="flex items-baseline justify-between px-2 pt-1 pb-3 font-fg-letrero text-[1.375rem] text-fg-tizne">
                      {c.titulo}
                      <span className="font-fg-texto text-[1rem] font-bold text-fg-ceniza tabular-nums">{ps.length}</span>
                    </h2>
                    {ps.length === 0 ? (
                      <p className="px-2 pb-3 text-[0.9375rem] text-fg-ceniza">{c.vacio}</p>
                    ) : (
                      <ul className="space-y-3">
                        {ps.map((p, i) => (
                          <li key={p.id}>
                            {ci === 0 && i === 0 ? (
                              <Punto id="tiempo">
                                <Comanda pedido={p} ahora={ahora} />
                              </Punto>
                            ) : (
                              <Comanda pedido={p} ahora={ahora} />
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                )
              })}
            </div>
          </Punto>
        </>
      )}
    </SoloEnNivel>
  )
}

function Comanda({ pedido: p, ahora }: { pedido: Pedido; ahora: Date }) {
  const minutos = minutosDesde(p.creado, ahora)
  const demorado = minutos >= DEMORA
  const verbo = accion(p)
  return (
    <article aria-label={`Pedido ${p.numero}`} className={`rounded-[16px] border-2 bg-white p-4 shadow-sm ${demorado ? "border-fg-aji" : "border-fg-linea"}`}>
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[1.25rem] leading-tight font-bold">{dondeVa(p)}</p>
          <p className="text-[0.875rem] text-fg-ceniza">
            #{p.numero}
            {p.origen === "web" ? ", desde la página" : ", tomado por el mesero"}
          </p>
        </div>
        <p className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[0.875rem] font-bold tabular-nums ${demorado ? "bg-fg-aji-suave text-fg-aji" : "bg-fg-peltre text-fg-tizne"}`}>
          <Clock className="h-4 w-4" aria-hidden />
          {minutos} min
          {demorado && <span className="sr-only">, demorado</span>}
        </p>
      </header>
      <ul className="mt-3 space-y-2 border-t border-fg-linea pt-3">
        {p.lineas.map((l, i) => (
          <li key={i} className="text-[1.0625rem]">
            <span className="font-bold tabular-nums">{l.cantidad} ×</span> {l.nombre}
            {l.detalle && <span className="block pl-7 text-[0.9375rem] text-fg-ceniza">{l.detalle}</span>}
            {l.nota && <span className="mt-1 ml-7 inline-block rounded-[6px] bg-fg-alerta-suave px-2 py-0.5 text-[0.875rem] font-semibold text-fg-alerta">{l.nota}</span>}
          </li>
        ))}
      </ul>
      {verbo && (
        <button type="button" onClick={() => avanzarPedido(p.id)} className="mt-4 h-11 w-full rounded-full bg-fg-cobalto text-[1rem] font-bold text-white hover:bg-fg-cobalto-2">
          {verbo}
          <span className="sr-only"> el pedido {p.numero}</span>
        </button>
      )}
    </article>
  )
}

"use client"

import { useState } from "react"
import { MessageCircle, Search } from "lucide-react"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { claveDia, sumarDias, textoFecha } from "@/demos/motores/agenda/tiempo"
import { sesionesEntre, type EstadoMembresia } from "@/demos/motores/clases/cupos"
import { pesos } from "@/lib/catalogo/planes"
import { estadoDe, renovarMembresia, useGimnasio } from "../estado"
import { HORARIO, PAGO, plan, PLANES, tipo, type MetodoPago, type Socio } from "../modelo"
import { Cargando, Encabezado } from "./marco"

const ESTADO: Record<EstadoMembresia | "prueba", { texto: string; clase: string }> = {
  activa: { texto: "Al día", clase: "bg-pa-exito-suave text-pa-exito" },
  "por-vencer": { texto: "Vence pronto", clase: "bg-pa-alerta-suave text-pa-alerta" },
  vencida: { texto: "Vencida", clase: "bg-pa-rojo-suave text-pa-rojo" },
  "sin-clases": { texto: "Sin clases", clase: "bg-pa-rojo-suave text-pa-rojo" },
  prueba: { texto: "Clase de prueba", clase: "bg-pa-tiza text-pa-hierro" },
}

type Filtro = "renovar" | "todos"
const normalizar = (t: string) => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

export function SociosPalanca() {
  const e = useGimnasio()
  const [filtro, setFiltro] = useState<Filtro>("renovar")
  const [texto, setTexto] = useState("")
  const [abierto, setAbierto] = useState<string | null>(null)
  return (
    <SoloEnNivel nivel="sistema">
      {!e ? (
        <Cargando />
      ) : (
        (() => {
          const clave = (s: Socio) => (s.invitado ? "prueba" : estadoDe(s))
          const orden: Record<string, number> = { "por-vencer": 0, prueba: 1, "sin-clases": 2, vencida: 3, activa: 4 }
          const renovar = e.socios.filter((s) => clave(s) !== "activa")
          const q = normalizar(texto.trim())
          const lista = (filtro === "renovar" ? renovar : e.socios)
            .filter((s) => !q || normalizar(`${s.nombre} ${s.documento}`).includes(q))
            .sort((a, b) => orden[clave(a)] - orden[clave(b)] || (a.membresia?.vence ?? "").localeCompare(b.membresia?.vence ?? ""))
          const activos = e.socios.filter((s) => !s.invitado && ["activa", "por-vencer"].includes(estadoDe(s))).length
          return (
            <>
              <Encabezado titulo="SOCIOS" detalle={`${activos} con plan al día. ${renovar.length} por renovar o por convertir.`} />
              <div className="px-4 py-6 sm:px-8">
                <div className="flex flex-wrap items-center gap-3">
                  <div role="group" aria-label="Filtrar socios" className="inline-flex gap-1 rounded-[4px] bg-white p-1 ring-1 ring-pa-linea">
                    {(["renovar", "todos"] as const).map((f) => (
                      <button key={f} type="button" aria-pressed={filtro === f} onClick={() => setFiltro(f)} className={`rounded-[3px] px-3.5 py-1.5 text-[0.9375rem] font-semibold ${filtro === f ? "bg-pa-hierro text-white" : "text-pa-gris hover:text-pa-hierro"}`}>
                        {f === "renovar" ? `Por renovar (${renovar.length})` : `Todos (${e.socios.length})`}
                      </button>
                    ))}
                  </div>
                  <label className="relative block min-w-[14rem] flex-1 sm:max-w-xs">
                    <span className="sr-only">Buscar socio</span>
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-pa-gris" aria-hidden />
                    <input value={texto} onChange={(ev) => setTexto(ev.target.value)} placeholder="Nombre o documento" className="h-10 w-full rounded-[4px] border-2 border-pa-linea bg-white pr-3 pl-9" />
                  </label>
                </div>
                <Punto id="vencimientos" className="mt-5">
                  <ul className="divide-y divide-pa-linea rounded-[6px] bg-white ring-1 ring-pa-linea">
                    {lista.map((s) => (
                      <FilaSocio key={s.id} socio={s} estado={clave(s)} abierto={abierto === s.id} alternar={() => setAbierto(abierto === s.id ? null : s.id)} />
                    ))}
                  </ul>
                  {lista.length === 0 && <p className="mt-4 text-pa-gris">Nadie en esta lista.</p>}
                </Punto>
              </div>
            </>
          )
        })()
      )}
    </SoloEnNivel>
  )
}

function FilaSocio({ socio: s, estado, abierto, alternar }: { socio: Socio; estado: EstadoMembresia | "prueba"; abierto: boolean; alternar: () => void }) {
  const [planId, setPlan] = useState(s.membresia?.planId ?? "mensual")
  const [metodo, setMetodo] = useState<MetodoPago>("nequi")
  const [hecho, setHecho] = useState("")
  const nombre = s.nombre.split(" ")[0]
  const mensaje =
    estado === "prueba"
      ? `Hola, ${nombre}. ¿Cómo te fue en tu clase de prueba en Palanca? Si quieres seguir, el plan mensual sin límite cuesta ${pesos(plan("mensual").precio)}.`
      : estado === "por-vencer"
        ? `Hola, ${nombre}. Tu plan en Palanca vence el ${textoFecha(s.membresia!.vence)}. Si renuevas antes, los días se suman desde esa fecha y no pierdes ninguno.`
        : `Hola, ${nombre}. Te extrañamos en Palanca. Tu plan está vencido; cuando quieras volver, te esperamos.`
  return (
    <li className="px-4 py-3.5 sm:px-5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <div className="min-w-[13rem] flex-1">
          <p className="font-semibold">{s.nombre}</p>
          <p className="text-[0.8125rem] text-pa-gris">
            C. C. {s.documento}.{" "}
            {s.membresia ? `${plan(s.membresia.planId).nombre}, vence el ${textoFecha(s.membresia.vence)}` : "Sin plan"}
            {s.membresia?.clasesRestantes !== undefined ? `, ${s.membresia.clasesRestantes} clases` : ""}
          </p>
        </div>
        <span className={`rounded-[3px] px-2.5 py-1 text-[0.8125rem] font-bold ${ESTADO[estado].clase}`}>{ESTADO[estado].texto}</span>
        {estado !== "activa" && (
          <WhatsappSimulado negocio="el socio" mensaje={mensaje} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border-2 border-pa-linea px-3 text-[0.875rem] font-bold hover:border-pa-hierro">
            <MessageCircle className="h-4 w-4" aria-hidden />
            Escribir
          </WhatsappSimulado>
        )}
        <button type="button" onClick={alternar} aria-expanded={abierto} className="h-9 rounded-[4px] bg-pa-hierro px-3 text-[0.875rem] font-bold text-white hover:bg-pa-rojo">
          Renovar<span className="sr-only"> a {s.nombre}</span>
        </button>
      </div>
      {abierto && (
        <form
          className="mt-3 flex flex-wrap items-end gap-3 rounded-[4px] bg-pa-tiza p-3"
          onSubmit={(ev) => {
            ev.preventDefault()
            renovarMembresia(s.id, planId, metodo)
            setHecho(`Pago de ${pesos(plan(planId).precio)} registrado.`)
          }}
        >
          <label className="block">
            <span className="text-[0.875rem] font-semibold">Plan</span>
            <select value={planId} onChange={(ev) => setPlan(ev.target.value)} className="mt-1 block h-10 rounded-[4px] border-2 border-pa-linea bg-white px-2">
              {PLANES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}, {pesos(p.precio)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[0.875rem] font-semibold">Pago</span>
            <select value={metodo} onChange={(ev) => setMetodo(ev.target.value as MetodoPago)} className="mt-1 block h-10 rounded-[4px] border-2 border-pa-linea bg-white px-2">
              {(Object.keys(PAGO) as MetodoPago[]).map((m) => (
                <option key={m} value={m}>
                  {PAGO[m]}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="h-10 rounded-[4px] bg-pa-rojo px-4 font-bold text-white hover:bg-pa-rojo-2">
            Registrar pago
          </button>
          {hecho && (
            <p role="status" className="basis-full text-[0.9375rem] font-semibold text-pa-exito">
              {hecho}
            </p>
          )}
        </form>
      )}
    </li>
  )
}

const FRANJAS = ["05:30", "06:30", "07:30", "12:15", "17:30", "18:30", "19:30"]
const DIAS_CORTOS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"]

export function ResumenPalanca() {
  const e = useGimnasio()
  return (
    <SoloEnNivel nivel="sistema">
      {!e ? (
        <Cargando />
      ) : (
        (() => {
          const hoy = claveDia(new Date())
          const mes = hoy.slice(0, 7)
          const ingresos = e.pagos.filter((p) => p.fecha.startsWith(mes)).reduce((t, p) => t + p.valor, 0)
          const pasadas = sesionesEntre(HORARIO, sumarDias(hoy, -14), 14)
          // Ocupación promedio por día de la semana y hora, en las dos últimas semanas.
          const celda = (d: number, h: string) => {
            const ss = pasadas.filter((s) => s.dia === d && s.hora === h)
            if (!ss.length) return null
            return Math.round((ss.reduce((t, s) => t + e.reservas.filter((r) => r.sesionId === s.sesionId && r.estado === "asistio").length / s.cupo, 0) / ss.length) * 100)
          }
          const porTipo = ["fuerza", "funcional", "movilidad", "hiit"].map((t) => ({
            tipo: tipo(t),
            asistencias: e.reservas.filter((r) => r.estado === "asistio" && r.sesionId.startsWith(`${t}-`)).length,
          }))
          const maxTipo = Math.max(1, ...porTipo.map((x) => x.asistencias))
          const faltas = e.reservas.filter((r) => r.estado === "no-asistio").length
          const asistencias = e.reservas.filter((r) => r.estado === "asistio").length
          return (
            <>
              <Encabezado titulo="RESUMEN" detalle="Últimas dos semanas de clases y pagos del mes." />
              <div className="space-y-6 px-4 py-6 sm:px-8">
                <dl className="grid gap-4 sm:grid-cols-3">
                  {[
                    { t: "Ingresos del mes", v: pesos(ingresos) },
                    { t: "Asistencias", v: String(asistencias) },
                    { t: "Reservaron y no vinieron", v: `${Math.round((faltas / Math.max(1, faltas + asistencias)) * 100)} %` },
                  ].map((x) => (
                    <div key={x.t} className="rounded-[6px] bg-white p-5 ring-1 ring-pa-linea">
                      <dt className="text-[0.9375rem] text-pa-gris">{x.t}</dt>
                      <dd className="mt-1 font-pa-titulo text-[2rem] leading-none font-bold tabular-nums">{x.v}</dd>
                    </div>
                  ))}
                </dl>

                <Punto id="ocupacion">
                  <section aria-labelledby="ocupacion-titulo" tabIndex={0} className="overflow-x-auto rounded-[6px] bg-white p-5 ring-1 ring-pa-linea">
                    <h2 id="ocupacion-titulo" className="text-[1.0625rem] font-bold">
                      Ocupación por horario
                    </h2>
                    <p className="text-[0.875rem] text-pa-gris">Asistentes sobre cupo, en promedio. Más oscuro, más lleno.</p>
                    <table className="mt-4 w-full min-w-[560px] text-center text-[0.875rem]">
                      <caption className="sr-only">Porcentaje de ocupación por día y hora</caption>
                      <thead>
                        <tr>
                          <th scope="col" className="pb-2 text-left font-semibold text-pa-gris">
                            Hora
                          </th>
                          {[1, 2, 3, 4, 5].map((d) => (
                            <th key={d} scope="col" className="pb-2 font-semibold text-pa-gris">
                              {DIAS_CORTOS[d]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {FRANJAS.map((h) => (
                          <tr key={h}>
                            <th scope="row" className="py-1 pr-3 text-left font-semibold tabular-nums">
                              {h}
                            </th>
                            {[1, 2, 3, 4, 5].map((d) => {
                              const v = celda(d, h)
                              // El tono se aparta de la franja 53-61 %, donde ni el texto claro
                              // ni el oscuro alcanzan contraste AA.
                              const oscuro = v !== null && v >= 57
                              const tono = v === null ? 0 : oscuro ? Math.max(v, 62) : Math.min(Math.max(6, v), 52)
                              return (
                                <td key={d} className="p-0.5">
                                  <span
                                    className={`block rounded-[3px] py-2 font-semibold tabular-nums ${oscuro ? "text-white" : "text-pa-hierro"}`}
                                    style={{ background: v === null ? "transparent" : `color-mix(in srgb, var(--color-pa-hierro) ${tono}%, white)` }}
                                  >
                                    {v === null ? "" : `${v} %`}
                                  </span>
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>
                </Punto>

                <section aria-labelledby="tipos-titulo" className="rounded-[6px] bg-white p-5 ring-1 ring-pa-linea">
                  <h2 id="tipos-titulo" className="text-[1.0625rem] font-bold">
                    Asistencias por tipo de clase
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {porTipo.map((x) => (
                      <li key={x.tipo.id}>
                        <div className="flex justify-between text-[0.9375rem]">
                          <span className="font-semibold">{x.tipo.nombre}</span>
                          <span className="tabular-nums">{x.asistencias}</span>
                        </div>
                        <div className="mt-1 h-2.5 rounded-full bg-pa-tiza" aria-hidden>
                          <div className="h-full rounded-full" style={{ width: `${(x.asistencias / maxTipo) * 100}%`, background: x.tipo.claro ? "#b88d00" : x.tipo.color }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </>
          )
        })()
      )}
    </SoloEnNivel>
  )
}


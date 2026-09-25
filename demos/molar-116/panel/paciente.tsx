"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, Printer } from "lucide-react"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { textoFecha, textoHora } from "@/demos/motores/agenda/tiempo"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "../config"
import { abonado, aprobarPresupuesto, marcar, marcarHecho, pacientePorId, registrarAbono, saldo, useConsultorio, type Herramienta } from "../estado"
import { motivo, odontologo, PAGO, planDe, type MetodoPago } from "../modelo"
import { OdontogramaSvg } from "../odontograma"
import { botonVioleta, campo } from "../publico"
import { Cargando, Encabezado } from "./marco"

const HERRAMIENTAS: { id: Herramienta; nombre: string; muestra: string; cara: boolean }[] = [
  { id: "caries", nombre: "Caries", muestra: "bg-mo-rojo", cara: true },
  { id: "resina", nombre: "Resina hecha", muestra: "bg-mo-azul", cara: true },
  { id: "endodoncia", nombre: "Endodoncia indicada", muestra: "bg-mo-rojo", cara: false },
  { id: "corona", nombre: "Corona indicada", muestra: "bg-mo-rojo", cara: false },
  { id: "extraccion", nombre: "Extracción indicada", muestra: "bg-mo-rojo", cara: false },
  { id: "ausente", nombre: "Ausente", muestra: "bg-mo-gris", cara: false },
  { id: "sano", nombre: "Borrar", muestra: "bg-white ring-1 ring-mo-tinta", cara: true },
]

const edad = (nacimiento: string) => (nacimiento ? Math.floor((Date.now() - new Date(`${nacimiento}T12:00`).getTime()) / 31_557_600_000) : null)

export function PacienteMolar({ id }: { id: string }) {
  const e = useConsultorio()
  const [herramienta, setHerramienta] = useState<Herramienta>("caries")
  const [valor, setValor] = useState("")
  const [metodo, setMetodo] = useState<MetodoPago>("nequi")
  const [aviso, setAviso] = useState("")

  return (
    <SoloEnNivel nivel="sistema">
      {!e ? (
        <Cargando />
      ) : (
        (() => {
          const p = pacientePorId(e, id)
          if (!p) {
            return (
              <div className="px-8 py-16">
                <p className="text-mo-gris">No encontramos ese paciente.</p>
                <Link href={`${RAIZ}/panel/pacientes`} className="mt-3 inline-block font-semibold text-mo-violeta underline">
                  Volver a pacientes
                </Link>
              </div>
            )
          }
          const plan = planDe(p.odontograma)
          const pendiente = plan.reduce((t, x) => t + x.precio, 0)
          const hecho = p.hechos.reduce((t, x) => t + x.precio, 0)
          const citas = e.citas.filter((c) => c.pacienteId === p.id).reverse()
          const años = edad(p.nacimiento)
          const falta = saldo(p)
          const nuevo = p.aprobado ? hecho + pendiente - p.aprobado : 0

          return (
            <>
              <Encabezado
                titulo={p.nombre}
                detalle={
                  <>
                    <Link href={`${RAIZ}/panel/pacientes`} className="font-semibold text-mo-violeta underline underline-offset-4">
                      Pacientes
                    </Link>{" "}
                    / C. C. {p.documento}
                    {años !== null ? `, ${años} años` : ""}, {p.telefono}
                  </>
                }
                accion={
                  <button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-mo-tinta px-4 text-[0.9375rem] font-semibold hover:bg-mo-tinta hover:text-white">
                    <Printer className="h-4 w-4" aria-hidden />
                    Imprimir presupuesto
                  </button>
                }
              />
              {(p.alergias || p.notas) && (
                <div className="border-b border-mo-linea bg-mo-alerta-suave px-4 py-3 text-[0.9375rem] sm:px-8 print:hidden">
                  {p.alergias && <p className="font-semibold text-mo-alerta">Alergia: {p.alergias}.</p>}
                  {p.notas && <p className="text-mo-alerta">{p.notas}</p>}
                </div>
              )}

              <div className="space-y-6 px-4 py-6 sm:px-8">
                <Punto id="odontograma">
                  <section aria-labelledby="odo-titulo" className="rounded-[18px] bg-white p-5 ring-1 ring-mo-linea print:hidden">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h2 id="odo-titulo" className="text-[1.25rem] font-bold">
                        Odontograma
                      </h2>
                      <p className="text-[0.875rem] text-mo-gris">Elige un hallazgo y toca la cara del diente. Rojo: por hacer. Azul: hecho.</p>
                    </div>
                    <div role="radiogroup" aria-label="Hallazgo para marcar" className="mt-4 flex flex-wrap gap-2">
                      {HERRAMIENTAS.map((h) => (
                        <button
                          key={h.id}
                          type="button"
                          role="radio"
                          aria-checked={herramienta === h.id}
                          onClick={() => setHerramienta(h.id)}
                          className={`inline-flex h-9 items-center gap-2 rounded-full border-2 px-3.5 text-[0.875rem] font-semibold ${herramienta === h.id ? "border-mo-violeta bg-mo-lila" : "border-mo-linea hover:border-mo-violeta"}`}
                        >
                          <span className={`h-3 w-3 rounded-full ${h.muestra}`} aria-hidden />
                          {h.nombre}
                        </button>
                      ))}
                    </div>
                    <div className="-mx-2 mt-6 overflow-x-auto px-2 pb-2">
                      <div className="min-w-[600px]">
                        <OdontogramaSvg
                          odontograma={p.odontograma}
                          alTocar={(diente, cara) => {
                            const h = HERRAMIENTAS.find((x) => x.id === herramienta)!
                            marcar(p.id, diente, herramienta, h.cara ? cara : undefined)
                          }}
                        />
                      </div>
                    </div>
                  </section>
                </Punto>

                <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                  <Punto id="plan">
                    <section aria-labelledby="plan-titulo" className="rounded-[18px] bg-white p-5 ring-1 ring-mo-linea">
                      <h2 id="plan-titulo" className="text-[1.25rem] font-bold">
                        Plan de tratamiento
                      </h2>
                      {plan.length === 0 && p.hechos.length === 0 ? (
                        <p className="mt-3 text-mo-gris">No hay nada por hacer. Marca en el odontograma lo que encuentres y aquí aparece con su precio.</p>
                      ) : (
                        <table className="mt-4 w-full text-[0.9375rem]">
                          <caption className="sr-only">Procedimientos por hacer y hechos, con su precio</caption>
                          <thead className="text-left text-[0.8125rem] text-mo-gris">
                            <tr>
                              <th scope="col" className="pb-2 font-semibold">Diente</th>
                              <th scope="col" className="pb-2 font-semibold">Procedimiento</th>
                              <th scope="col" className="pb-2 text-right font-semibold">Valor</th>
                              <th scope="col" className="pb-2 text-right font-semibold print:hidden">
                                <span className="sr-only">Acción</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {plan.map((x) => (
                              <tr key={x.id} className="border-t border-mo-linea">
                                <td className="py-2.5 font-semibold text-mo-rojo tabular-nums">{x.diente}</td>
                                <td className="py-2.5">{x.nombre}</td>
                                <td className="py-2.5 text-right tabular-nums">{pesos(x.precio)}</td>
                                <td className="py-2.5 pl-3 text-right print:hidden">
                                  <button type="button" onClick={() => marcarHecho(p.id, x)} className="inline-flex h-8 items-center gap-1 rounded-full border-2 border-mo-azul px-3 text-[0.8125rem] font-semibold text-mo-azul hover:bg-mo-azul hover:text-white">
                                    <Check className="h-3.5 w-3.5" aria-hidden />
                                    Hecho<span className="sr-only">: {x.nombre} en el diente {x.diente}</span>
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {p.hechos.map((x, i) => (
                              <tr key={`h${i}`} className="border-t border-mo-linea text-mo-gris">
                                <td className="py-2.5 font-semibold text-mo-azul tabular-nums">{x.diente}</td>
                                <td className="py-2.5">
                                  {x.nombre} <span className="text-[0.8125rem]">(hecho el {textoFecha(x.fecha)})</span>
                                </td>
                                <td className="py-2.5 text-right tabular-nums">{pesos(x.precio)}</td>
                                <td className="print:hidden" />
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t-2 border-mo-tinta font-bold">
                              <td colSpan={2} className="pt-3">
                                Por hacer
                              </td>
                              <td className="pt-3 text-right tabular-nums">{pesos(pendiente)}</td>
                              <td className="print:hidden" />
                            </tr>
                          </tfoot>
                        </table>
                      )}
                    </section>
                  </Punto>

                  <Punto id="abonos">
                    <section aria-labelledby="pago-titulo" className="rounded-[18px] bg-white p-5 ring-1 ring-mo-linea">
                      <h2 id="pago-titulo" className="text-[1.25rem] font-bold">
                        Presupuesto y abonos
                      </h2>
                      {!p.aprobado ? (
                        <>
                          <p className="mt-3 text-mo-gris">El paciente todavía no ha aprobado el presupuesto de {pesos(hecho + pendiente)}.</p>
                          <button type="button" disabled={hecho + pendiente === 0} onClick={() => aprobarPresupuesto(p.id)} className={`${botonVioleta} mt-4 w-full`}>
                            Aprobar presupuesto
                          </button>
                        </>
                      ) : (
                        <>
                          <dl className="mt-3 space-y-1.5">
                            <div className="flex justify-between">
                              <dt>Aprobado</dt>
                              <dd className="tabular-nums">{pesos(p.aprobado)}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt>Abonado</dt>
                              <dd className="tabular-nums">{pesos(abonado(p))}</dd>
                            </div>
                            <div className="flex justify-between border-t-2 border-mo-tinta pt-2 text-[1.25rem] font-bold">
                              <dt>Saldo</dt>
                              <dd className="tabular-nums">{pesos(falta)}</dd>
                            </div>
                          </dl>
                          {nuevo > 0 && (
                            <div className="mt-3 rounded-[12px] bg-mo-alerta-suave p-3 text-[0.875rem] text-mo-alerta">
                              <p className="font-semibold">Hay {pesos(nuevo)} nuevos en el plan que el paciente no ha aprobado.</p>
                              <button type="button" onClick={() => aprobarPresupuesto(p.id)} className="mt-2 font-semibold underline">
                                Actualizar el presupuesto aprobado
                              </button>
                            </div>
                          )}
                          {p.abonos.length > 0 && (
                            <ul className="mt-4 space-y-1 border-t border-mo-linea pt-3 text-[0.875rem]">
                              {p.abonos.map((a, i) => (
                                <li key={i} className="flex justify-between gap-3">
                                  <span className="text-mo-gris">
                                    {textoFecha(a.fecha)}, {PAGO[a.metodo]}
                                  </span>
                                  <span className="tabular-nums">{pesos(a.valor)}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          {falta > 0 && (
                            <form
                              className="mt-4 border-t border-mo-linea pt-4 print:hidden"
                              onSubmit={(ev) => {
                                ev.preventDefault()
                                const v = Number(valor.replace(/\D/g, ""))
                                if (!v || v > falta) {
                                  setAviso(`El abono debe estar entre $ 1 y el saldo, ${pesos(falta)}.`)
                                  return
                                }
                                registrarAbono(p.id, v, metodo)
                                setAviso(`Abono de ${pesos(v)} registrado.`)
                                setValor("")
                              }}
                            >
                              <div className="grid grid-cols-2 gap-3">
                                <label className="block">
                                  <span className="text-[0.9375rem] font-semibold">Abono</span>
                                  <input value={valor} onChange={(ev) => setValor(ev.target.value)} inputMode="numeric" placeholder="200.000" className={campo} />
                                </label>
                                <label className="block">
                                  <span className="text-[0.9375rem] font-semibold">Medio</span>
                                  <select value={metodo} onChange={(ev) => setMetodo(ev.target.value as MetodoPago)} className={campo}>
                                    {(Object.keys(PAGO) as MetodoPago[]).map((m) => (
                                      <option key={m} value={m}>
                                        {PAGO[m]}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                              </div>
                              <button type="submit" className={`${botonVioleta} mt-3 h-11 w-full`}>
                                Registrar abono
                              </button>
                            </form>
                          )}
                        </>
                      )}
                      {aviso && (
                        <p role="status" className="mt-3 text-[0.9375rem] font-semibold">
                          {aviso}
                        </p>
                      )}
                    </section>
                  </Punto>
                </div>

                <section aria-labelledby="citas-titulo" className="rounded-[18px] bg-white p-5 ring-1 ring-mo-linea print:hidden">
                  <h2 id="citas-titulo" className="text-[1.25rem] font-bold">
                    Citas
                  </h2>
                  {citas.length === 0 ? (
                    <p className="mt-3 text-mo-gris">Sin citas registradas.</p>
                  ) : (
                    <ul className="mt-3 divide-y divide-mo-linea text-[0.9375rem]">
                      {citas.slice(0, 8).map((c) => (
                        <li key={c.id} className="flex flex-wrap justify-between gap-2 py-2.5">
                          <span>
                            <span className="font-semibold">{motivo(c.motivo).nombre}</span> con {odontologo(c.odontologoId).nombre}
                          </span>
                          <span className="text-mo-gris">
                            {textoFecha(c.inicio.slice(0, 10))}, {textoHora(c.inicio)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </>
          )
        })()
      )}
    </SoloEnNivel>
  )
}

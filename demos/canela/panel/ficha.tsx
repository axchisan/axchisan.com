"use client"

import Link from "next/link"
import { useState } from "react"
import { AlertTriangle, ArrowLeft, Phone, Stethoscope } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { RAIZ } from "../config"
import { conArticulo, profesional, servicio, useClinica } from "../estado"
import {
  claveDia,
  edad,
  estadoVacuna,
  textoDia,
  textoFecha,
  textoHora,
  type Mascota,
} from "../modelo"
import { CargandoPanel, PlacaMascota } from "./marco"
import { INSIGNIA_VACUNA } from "./pacientes"

export function Ficha({ id }: { id: string }) {
  return (
    <SoloEnNivel nivel="sistema">
      <FichaMascota id={id} />
    </SoloEnNivel>
  )
}

function FichaMascota({ id }: { id: string }) {
  const clinica = useClinica()
  const { recorrido } = useDemo()
  if (!clinica) return <CargandoPanel />

  const m = clinica.mascotas.find((x) => x.id === id)
  if (!m) {
    return (
      <div className="px-4 py-16 sm:px-8">
        <p className="text-[1.0625rem]">Esta mascota no existe o se borró al restablecer la demo.</p>
        <Link href={`${RAIZ}/panel/pacientes`} className="mt-4 inline-block font-bold underline">
          Ir a pacientes
        </Link>
      </div>
    )
  }

  const p = clinica.propietarios.find((x) => x.id === m.propietarioId)!
  const hoy = claveDia(new Date())
  const vacunas = clinica.vacunas
    .filter((v) => v.mascotaId === m.id)
    .sort((a, b) => a.proxima.localeCompare(b.proxima))
  const consultas = clinica.consultas
    .filter((c) => c.mascotaId === m.id)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
  const proximas = clinica.citas
    .filter((c) => c.mascotaId === m.id && c.inicio.slice(0, 10) >= hoy && c.estado === "agendada")
    .sort((a, b) => a.inicio.localeCompare(b.inicio))
  const enSala = clinica.citas.find((c) => c.mascotaId === m.id && c.estado === "en-sala")
  const pesoActual = m.pesos.at(-1)

  return (
    <>
      <div className="border-b border-cn-linea bg-white px-4 py-6 sm:px-8">
        <Link href={`${RAIZ}/panel/pacientes`} className="inline-flex items-center gap-1.5 text-[0.9375rem] hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Pacientes
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-5">
          <PlacaMascota nombre={m.nombre} especie={m.especie} foto={m.foto} tamano={72} />
          <div className="min-w-0 flex-1">
            <h1 className="text-[1.9375rem] leading-tight font-bold">{m.nombre}</h1>
            <p className="mt-1 text-[1rem] text-cn-pizarra">
              {m.especie === "perro" ? "Perro" : "Gato"} {m.raza.toLowerCase()}, {m.sexo}
              {m.esterilizado ? (m.sexo === "hembra" ? ", esterilizada" : ", esterilizado") : ""}. {edad(m.nacimiento)}
              {pesoActual ? `, ${pesoActual.kg.toLocaleString("es-CO")} kg` : ""}.
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[0.9375rem]">
              {p.nombre}
              <span className="inline-flex items-center gap-1 text-cn-pizarra">
                <Phone className="h-3.5 w-3.5" aria-hidden />
                {p.telefono}
              </span>
            </p>
          </div>
          <Link
            href={`${RAIZ}/panel/pacientes/${m.id}/consulta${enSala ? `?cita=${enSala.id}` : ""}`}
            className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-cn-collar px-4 text-[0.9375rem] font-bold text-white hover:bg-cn-collar-2"
          >
            <Stethoscope className="h-4 w-4" aria-hidden />
            Nueva consulta
          </Link>
        </div>
      </div>

      <div className="grid gap-6 px-4 py-6 sm:px-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <div className="min-w-0 space-y-6">
          {(m.alergias.length > 0 || m.alertas.length > 0 || recorrido) && (
            <Punto id="alertas">
              <section
                aria-labelledby="alertas-titulo"
                className="rounded-[14px] border-2 border-cn-coral/30 bg-cn-coral-suave p-4"
              >
                <h2 id="alertas-titulo" className="flex items-center gap-2 text-[1rem] font-bold text-cn-coral">
                  <AlertTriangle className="h-4 w-4" aria-hidden />
                  Antes de atender
                </h2>
                <ul className="mt-2 space-y-1 text-[0.9375rem]">
                  {m.alergias.map((a) => (
                    <li key={a}>
                      <strong>Alergia:</strong> {a}
                    </li>
                  ))}
                  {m.alertas.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                  {m.alergias.length + m.alertas.length === 0 && (
                    <li className="text-cn-pizarra">Sin alergias ni alertas registradas.</li>
                  )}
                </ul>
              </section>
            </Punto>
          )}

          <Punto id="peso">
            <section aria-labelledby="peso-titulo" className="rounded-[14px] bg-white p-5">
              <h2 id="peso-titulo" className="text-[1.125rem] font-bold">
                Peso
              </h2>
              <CurvaPeso pesos={m.pesos} />
            </section>
          </Punto>

          <Punto id="carnet">
            <section aria-labelledby="carnet-titulo" className="rounded-[14px] bg-white p-5">
              <h2 id="carnet-titulo" className="text-[1.125rem] font-bold">
                Carnet de vacunas
              </h2>
              {vacunas.length === 0 ? (
                <p className="mt-3 text-[0.9375rem] text-cn-pizarra">Sin vacunas registradas.</p>
              ) : (
                <table className="mt-3 w-full text-[0.9375rem]">
                  <thead className="text-left text-[0.8125rem] text-cn-pizarra">
                    <tr>
                      <th className="pb-2 font-normal">Vacuna</th>
                      <th className="pb-2 font-normal">Aplicada</th>
                      <th className="pb-2 font-normal">Siguiente</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cn-linea">
                    {vacunas.map((v) => {
                      const e = estadoVacuna(v, hoy)
                      return (
                        <tr key={v.id}>
                          <td className="py-2.5 pr-2 font-bold">{v.nombre}</td>
                          <td className="py-2.5 pr-2 tabular-nums">{textoFecha(v.aplicada)}</td>
                          <td className="py-2.5">
                            <span className="tabular-nums">{textoFecha(v.proxima)}</span>
                            {e !== "al-dia" && (
                              <span className={`ml-2 inline-block rounded-full px-2 py-0.5 text-[0.75rem] font-bold ${INSIGNIA_VACUNA[e].clase}`}>
                                {e === "vencida" ? "Vencida" : "Próxima"}
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </section>
          </Punto>

          {proximas.length > 0 && (
            <section aria-labelledby="citas-titulo" className="rounded-[14px] bg-white p-5">
              <h2 id="citas-titulo" className="text-[1.125rem] font-bold">
                Próximas citas
              </h2>
              <ul className="mt-2 space-y-1.5 text-[0.9375rem]">
                {proximas.map((c) => (
                  <li key={c.id}>
                    {textoDia(c.inicio.slice(0, 10))}, {textoHora(c.inicio)}: {servicio(c.servicioId).nombre} con{" "}
                    {conArticulo(c.profesionalId)}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <Punto id="historia" className="min-w-0">
          <section aria-labelledby="historia-titulo" className="rounded-[14px] bg-white p-5">
            <h2 id="historia-titulo" className="text-[1.125rem] font-bold">
              Historia clínica
            </h2>
            {consultas.length === 0 ? (
              <p className="mt-3 text-[0.9375rem] text-cn-pizarra">
                Todavía no hay consultas. La primera se registra con «Nueva consulta».
              </p>
            ) : (
              <ol className="mt-4 space-y-3">
                {consultas.map((c, i) => (
                  <li key={c.id}>
                    <details open={i === 0} className="group rounded-[12px] border border-cn-linea">
                      <summary className="flex cursor-pointer list-none flex-wrap items-baseline justify-between gap-x-4 gap-y-1 p-4 [&::-webkit-details-marker]:hidden">
                        <span className="font-bold">{c.motivo}</span>
                        <span className="text-[0.875rem] text-cn-pizarra">
                          {textoFecha(c.fecha.slice(0, 10))}, {profesional(c.profesionalId).nombre}
                        </span>
                      </summary>
                      <dl className="grid gap-3 border-t border-cn-linea p-4 text-[0.9375rem] sm:grid-cols-[9rem_1fr]">
                        {[
                          ["Anamnesis", c.anamnesis],
                          ["Examen físico", c.examen],
                          ["Diagnóstico", c.diagnostico],
                          ["Tratamiento", c.tratamiento],
                        ].map(([t, v]) => (
                          <div key={t} className="contents">
                            <dt className="text-cn-pizarra">{t}</dt>
                            <dd className={t === "Diagnóstico" ? "font-bold" : ""}>{v}</dd>
                          </div>
                        ))}
                        {c.formula.length > 0 && (
                          <div className="contents">
                            <dt className="text-cn-pizarra">Fórmula</dt>
                            <dd>
                              <ul className="space-y-1">
                                {c.formula.map((f) => (
                                  <li key={f.medicamento}>
                                    <strong>{f.medicamento}.</strong> {f.indicacion}
                                  </li>
                                ))}
                              </ul>
                            </dd>
                          </div>
                        )}
                      </dl>
                    </details>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </Punto>
      </div>
    </>
  )
}

/**
 * Curva de peso: una sola serie, así que no lleva leyenda; el título la nombra.
 * Cada punto muestra su valor al pasar el cursor o al enfocarlo, y la tabla
 * oculta da el mismo dato a lectores de pantalla.
 */
function CurvaPeso({ pesos }: { pesos: Mascota["pesos"] }) {
  const [activo, setActivo] = useState<number | null>(null)
  if (pesos.length < 2) {
    return (
      <p className="mt-3 text-[0.9375rem] text-cn-pizarra">
        {pesos.length === 1
          ? `Un solo registro: ${pesos[0].kg.toLocaleString("es-CO")} kg el ${textoFecha(pesos[0].fecha)}. La curva aparece con el segundo.`
          : "Sin registros de peso. Se anotan en cada consulta."}
      </p>
    )
  }

  const W = 420
  const H = 160
  const m = { t: 18, r: 58, b: 26, l: 34 }
  const kgs = pesos.map((p) => p.kg)
  const min = Math.floor(Math.min(...kgs) * 0.9)
  const max = Math.ceil(Math.max(...kgs) * 1.08)
  const x = (i: number) => m.l + (i / (pesos.length - 1)) * (W - m.l - m.r)
  const y = (kg: number) => m.t + (1 - (kg - min) / (max - min || 1)) * (H - m.t - m.b)
  const linea = pesos.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.kg)}`).join(" ")
  const ultimo = pesos.length - 1
  const marcas = [min, (min + max) / 2, max]
  const fmt = (kg: number) => kg.toLocaleString("es-CO", { maximumFractionDigits: 1 })

  return (
    <div className="relative mt-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`Peso de ${fmt(pesos[0].kg)} a ${fmt(pesos[ultimo].kg)} kg`}>
        {marcas.map((k) => (
          <g key={k}>
            <line x1={m.l} x2={W - m.r} y1={y(k)} y2={y(k)} stroke="#e7ebe9" strokeWidth={1} />
            <text x={m.l - 8} y={y(k) + 4} textAnchor="end" fontSize={12} fill="#4b5968">
              {fmt(k)}
            </text>
          </g>
        ))}
        <path d={linea} fill="none" stroke="#1c3552" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {pesos.map((p, i) => (
          <g key={p.fecha}>
            <circle cx={x(i)} cy={y(p.kg)} r={i === activo ? 6 : 4} fill="#1c3552" stroke="#fff" strokeWidth={2} />
            {/* Zona de toque mayor que el punto */}
            <circle
              cx={x(i)}
              cy={y(p.kg)}
              r={16}
              fill="transparent"
              tabIndex={0}
              role="img"
              aria-label={`${fmt(p.kg)} kg el ${textoFecha(p.fecha)}`}
              onMouseEnter={() => setActivo(i)}
              onMouseLeave={() => setActivo(null)}
              onFocus={() => setActivo(i)}
              onBlur={() => setActivo(null)}
              className="cursor-pointer outline-none"
            />
          </g>
        ))}
        <text x={x(ultimo) + 10} y={y(pesos[ultimo].kg) + 4} fontSize={13} fontWeight={700} fill="#1c3552">
          {fmt(pesos[ultimo].kg)} kg
        </text>
        <text x={m.l} y={H - 6} fontSize={12} fill="#4b5968">
          {textoFecha(pesos[0].fecha)}
        </text>
        <text x={x(ultimo)} y={H - 6} fontSize={12} fill="#4b5968" textAnchor="end">
          {textoFecha(pesos[ultimo].fecha)}
        </text>
      </svg>
      {activo !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-[8px] bg-cn-collar px-2.5 py-1.5 text-[0.8125rem] whitespace-nowrap text-white"
          style={{ left: `${(x(activo) / W) * 100}%`, top: `${(y(pesos[activo].kg) / H) * 100}%`, marginTop: -10 }}
        >
          <strong>{fmt(pesos[activo].kg)} kg</strong>, {textoFecha(pesos[activo].fecha)}
        </div>
      )}
      <table className="sr-only">
        <caption>Registros de peso</caption>
        <tbody>
          {pesos.map((p) => (
            <tr key={p.fecha}>
              <td>{textoFecha(p.fecha)}</td>
              <td>{fmt(p.kg)} kg</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

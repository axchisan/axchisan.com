"use client"

import Link from "next/link"
import { useState } from "react"
import { Punto } from "@/demos/comun/recorrido"
import { useAhora } from "@/demos/comun/reloj"
import { claveInstante, textoDia, textoFecha, textoHora } from "@/demos/motores/agenda/tiempo"
import { enEspera, puedeCancelar, sesionPorId } from "@/demos/motores/clases/cupos"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import { cancelarReserva, estadoDe, socioPorDocumento, socioPorId, useGimnasio } from "./estado"
import { HORARIO, plan, tipo } from "./modelo"
import { BotonWhatsappPalanca, campo, EtiquetaTipo } from "./publico"

const ESTADO = {
  activa: { texto: "Al día", clase: "bg-pa-exito-suave text-pa-exito" },
  "por-vencer": { texto: "Vence pronto", clase: "bg-pa-alerta-suave text-pa-alerta" },
  vencida: { texto: "Vencida", clase: "bg-pa-rojo-suave text-pa-rojo" },
  "sin-clases": { texto: "Sin clases", clase: "bg-pa-rojo-suave text-pa-rojo" },
} as const

export function MisClasesPalanca({ documentoInicial }: { documentoInicial?: string }) {
  const e = useGimnasio()
  const ahora = useAhora()
  const [documento, setDocumento] = useState(documentoInicial ?? "")
  const [aviso, setAviso] = useState("")

  if (!e || !ahora) return <div className="min-h-[60vh]" aria-busy="true" />
  const socio = socioPorDocumento(e, documento)
  const ahoraClave = claveInstante(ahora)
  const suyas = socio
    ? e.reservas
        .filter((r) => r.socioId === socio.id && r.estado !== "cancelada")
        .map((r) => ({ r, s: sesionPorId(HORARIO, r.sesionId)! }))
        .filter((x) => x.s)
        .sort((a, b) => a.s.inicio.localeCompare(b.s.inicio))
    : []
  const proximas = suyas.filter((x) => x.s.inicio > ahoraClave)
  const asistidas = suyas.filter((x) => x.r.estado === "asistio").reverse()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="pa-ancha font-pa-titulo text-[2.5rem] leading-none font-extrabold">MIS CLASES</h1>
      <label className="mt-8 block max-w-sm">
        <span className="font-semibold">Tu número de documento</span>
        <input value={documento} onChange={(ev) => setDocumento(ev.target.value)} inputMode="numeric" className={campo} />
      </label>

      {documento.replace(/\D/g, "").length >= 6 && !socio && (
        <p className="mt-6 text-pa-gris">
          No encontramos ese documento.{" "}
          <Link href={`${RAIZ}#horario`} className="font-semibold text-pa-hierro underline underline-offset-4">
            Reserva tu primera clase gratis
          </Link>
          .
        </p>
      )}

      {socio && (
        <Punto id="lista" className="mt-8">
          <section aria-labelledby="plan-titulo" className="rounded-[6px] bg-white p-5 ring-1 ring-pa-linea">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 id="plan-titulo" className="text-[1.25rem] font-bold">
                  {socio.nombre}
                </h2>
                <p className="text-[0.9375rem] text-pa-gris">
                  {socio.invitado
                    ? "Clase de prueba. Cuando quieras seguir, elige un plan."
                    : socio.membresia
                      ? `${plan(socio.membresia.planId).nombre}, vence el ${textoFecha(socio.membresia.vence)}${socio.membresia.clasesRestantes !== undefined ? `. Te quedan ${socio.membresia.clasesRestantes} clases` : ""}.`
                      : "Sin plan."}
                </p>
              </div>
              {!socio.invitado && <span className={`rounded-[3px] px-2.5 py-1 text-[0.8125rem] font-bold ${ESTADO[estadoDe(socio)].clase}`}>{ESTADO[estadoDe(socio)].texto}</span>}
            </div>
            {(socio.invitado || estadoDe(socio) !== "activa") && (
              <BotonWhatsappPalanca
                mensaje={`Hola, Palanca. Soy ${socio.nombre}. Quiero ${socio.invitado ? "tomar el plan mensual" : "renovar mi plan"}.`}
                className="mt-4 inline-flex h-10 items-center rounded-[4px] bg-pa-rojo px-4 text-[0.9375rem] font-bold text-white hover:bg-pa-rojo-2"
              >
                {socio.invitado ? `Tomar el plan mensual, ${pesos(plan("mensual").precio)}` : "Renovar por WhatsApp"}
              </BotonWhatsappPalanca>
            )}
          </section>

          <h2 className="mt-10 text-[1.25rem] font-bold">Próximas clases</h2>
          {proximas.length === 0 ? (
            <p className="mt-3 text-pa-gris">
              No tienes clases reservadas.{" "}
              <Link href={`${RAIZ}#horario`} className="font-semibold text-pa-hierro underline underline-offset-4">
                Ver el horario
              </Link>
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-pa-linea border-y border-pa-linea">
              {proximas.map(({ r, s }) => {
                const t = tipo(s.tipo)
                const puesto = r.estado === "espera" ? enEspera(e.reservas, s.sesionId).findIndex((x) => x.id === r.id) + 1 : 0
                return (
                  <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
                    <EtiquetaTipo tipo={t} />
                    <span className="min-w-[12rem] flex-1">
                      <span className="block font-semibold">
                        {textoDia(s.inicio.slice(0, 10))}, {textoHora(s.inicio)}
                      </span>
                      <span className="text-[0.875rem] text-pa-gris">{r.estado === "espera" ? `En lista de espera, puesto ${puesto}` : "Reservada"}</span>
                    </span>
                    {puedeCancelar(s.inicio, ahoraClave) ? (
                      <button
                        type="button"
                        onClick={() => {
                          const promovido = cancelarReserva(r.id)
                          const quien = promovido ? socioPorId(e, promovido.socioId) : null
                          setAviso(quien ? `Cancelaste tu puesto. Pasó a ${quien.nombre.split(" ")[0]}, que estaba en la lista de espera, y le avisamos por WhatsApp.` : "Cancelaste tu puesto. Quedó libre para otra persona.")
                        }}
                        className="h-9 rounded-[4px] px-3 text-[0.875rem] font-bold text-pa-rojo hover:bg-pa-rojo-suave"
                      >
                        Cancelar<span className="sr-only"> la clase de {t.nombre} del {textoDia(s.inicio.slice(0, 10))}</span>
                      </button>
                    ) : (
                      <span className="text-[0.8125rem] text-pa-gris">Ya no se puede cancelar</span>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
          {aviso && (
            <p role="status" className="mt-4 rounded-[4px] bg-pa-tiza p-4 font-semibold">
              {aviso}
            </p>
          )}

          {asistidas.length > 0 && (
            <>
              <h2 className="mt-10 text-[1.25rem] font-bold">Últimas clases</h2>
              <p className="mt-1 text-pa-gris">{asistidas.length} clases en las últimas dos semanas.</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {asistidas.slice(0, 10).map(({ r, s }) => (
                  <li key={r.id} className="rounded-[4px] bg-white px-3 py-2 text-[0.875rem] ring-1 ring-pa-linea">
                    {tipo(s.tipo).nombre}, {textoFecha(s.inicio.slice(0, 10))}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Punto>
      )}
    </div>
  )
}

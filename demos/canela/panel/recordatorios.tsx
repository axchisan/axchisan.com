"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Check, MessageCircle, X } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { PRECIO_RECORDATORIOS, pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "../config"
import { marcarRecordada, useClinica } from "../estado"
import { claveDia, diasEntre, estadoVacuna, textoFecha, type EstadoClinica, type Vacuna } from "../modelo"
import { CargandoPanel, EncabezadoPanel, PlacaMascota } from "./marco"

export function Recordatorios() {
  return (
    <SoloEnNivel nivel="sistema">
      <Lista />
    </SoloEnNivel>
  )
}

function mensaje(e: EstadoClinica, v: Vacuna, hoy: string) {
  const m = e.mascotas.find((x) => x.id === v.mascotaId)!
  const p = e.propietarios.find((x) => x.id === m.propietarioId)!
  const cuando =
    estadoVacuna(v, hoy) === "vencida" ? `venció el ${textoFecha(v.proxima)}` : `vence el ${textoFecha(v.proxima)}`
  return (
    `Hola, ${p.nombre.split(" ")[0]}. Te escribimos de Canela, clínica veterinaria. ` +
    `La vacuna de ${v.nombre.toLowerCase()} de ${m.nombre} ${cuando}. ` +
    `¿Te agendamos una cita? Puedes elegir la hora aquí: canela.example/agendar`
  )
}

function Lista() {
  const clinica = useClinica()
  const dialogo = useRef<HTMLDialogElement>(null)
  const [elegida, setElegida] = useState<Vacuna | null>(null)

  // El diálogo se abre cuando hay una vacuna elegida y la suelta al cerrarse.
  useEffect(() => {
    if (elegida && !dialogo.current?.open) dialogo.current?.showModal()
  }, [elegida])

  if (!clinica) return <CargandoPanel />

  const hoy = claveDia(new Date())
  const pendientes = clinica.vacunas
    .map((v) => ({ v, estado: estadoVacuna(v, hoy) }))
    .filter((x) => x.estado !== "al-dia")
    .sort((a, b) => a.v.proxima.localeCompare(b.v.proxima))
  const vencidas = pendientes.filter((x) => x.estado === "vencida")
  const proximas = pendientes.filter((x) => x.estado === "proxima")

  const grupo = (titulo: string, filas: typeof pendientes, id?: string) => (
    <section aria-label={titulo} className="mt-6">
      <h2 className="text-[1.125rem] font-bold">
        {titulo} <span className="font-normal text-cn-pizarra">({filas.length})</span>
      </h2>
      <ul className="mt-3 divide-y divide-cn-linea overflow-hidden rounded-[14px] bg-white">
        {filas.map(({ v, estado }, i) => {
          const m = clinica.mascotas.find((x) => x.id === v.mascotaId)!
          const p = clinica.propietarios.find((x) => x.id === m.propietarioId)!
          const dias = diasEntre(hoy, v.proxima)
          const boton = (
            <button
              type="button"
              onClick={() => setElegida(v)}
              className="inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-cn-collar px-3 text-[0.875rem] font-bold text-white hover:bg-cn-collar-2"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Recordar
            </button>
          )
          return (
            <li key={v.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4">
              <PlacaMascota nombre={m.nombre} especie={m.especie} foto={m.foto} />
              <div className="min-w-0 flex-1">
                <p>
                  <Link href={`${RAIZ}/panel/pacientes/${m.id}`} className="font-bold hover:underline">
                    {m.nombre}
                  </Link>
                  , {v.nombre.toLowerCase()}
                </p>
                <p className="text-[0.875rem] text-cn-pizarra">
                  {p.nombre}, {p.telefono}
                </p>
              </div>
              <p className={`text-[0.875rem] font-bold ${estado === "vencida" ? "text-cn-coral" : "text-cn-ambar"}`}>
                {dias < 0 ? `Venció hace ${-dias} ${dias === -1 ? "día" : "días"}` : dias === 0 ? "Vence hoy" : `Vence en ${dias} ${dias === 1 ? "día" : "días"}`}
              </p>
              {v.recordada === hoy ? (
                <span className="inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-cn-pino-suave px-3 text-[0.875rem] font-bold text-cn-pino">
                  <Check className="h-4 w-4" aria-hidden />
                  Recordado hoy
                </span>
              ) : id && i === 0 ? (
                <Punto id={id} className="inline-block">
                  {boton}
                </Punto>
              ) : (
                boton
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )

  return (
    <>
      <EncabezadoPanel
        titulo="Recordatorios"
        detalle={`${vencidas.length} vacunas vencidas y ${proximas.length} por vencer en los próximos 30 días`}
      />
      <div className="px-4 py-6 sm:px-8">
        <p className="max-w-3xl rounded-[14px] border-2 border-dashed border-cn-collar/25 p-4 text-[0.9375rem] leading-relaxed">
          Aquí cada recordatorio se envía con un toque. Con el módulo de recordatorios automáticos
          ({pesos(PRECIO_RECORDATORIOS)}, o incluidos en el sistema completo), salen solos cada mañana por WhatsApp; cada mensaje cuesta unos $ 3.
        </p>

        <Punto id="lista">
          {vencidas.length > 0 && grupo("Vencidas", vencidas, "enviar")}
          {proximas.length > 0 && grupo("Por vencer", proximas)}
          {pendientes.length === 0 && (
            <p className="mt-6 rounded-[14px] bg-white p-6 text-cn-pizarra">Todas las vacunas están al día.</p>
          )}
        </Punto>
      </div>

      <dialog
        ref={dialogo}
        aria-labelledby="recordar-titulo"
        className="m-auto w-[min(92vw,440px)] rounded-[18px] bg-white p-0 font-cn-texto text-cn-collar backdrop:bg-cn-collar/50"
        onClose={() => setElegida(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close()
        }}
      >
        {elegida && (
          <div className="p-6">
            <div className="flex items-start justify-between gap-3">
              <h2 id="recordar-titulo" className="text-[1.25rem] font-bold">
                Recordatorio por WhatsApp
              </h2>
              <button type="button" onClick={() => dialogo.current?.close()} className="rounded-[8px] p-1" aria-label="Cerrar">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="mt-4 rounded-[14px] rounded-tr-[4px] bg-[#dcf8c6] p-4 text-[0.9375rem] leading-relaxed text-[#111b21]">
              {mensaje(clinica, elegida, hoy)}
            </div>
            <p className="mt-3 text-[0.8125rem] text-cn-pizarra">
              En la clínica real, este botón abre el chat con el propietario y el mensaje ya escrito. Aquí
              no se envía nada: los teléfonos son de ejemplo.
            </p>
            <button
              type="button"
              onClick={() => {
                marcarRecordada(elegida.id)
                dialogo.current?.close()
              }}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-cn-pelota font-bold hover:bg-cn-pelota-2"
            >
              <Check className="h-4 w-4" aria-hidden />
              Marcar como enviado
            </button>
          </div>
        )}
      </dialog>
    </>
  )
}

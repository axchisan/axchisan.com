"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Check, MessageCircle, X } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { pesos } from "@/lib/catalogo/planes"
import { claveDia, textoFecha } from "@/demos/motores/agenda/tiempo"
import { RAIZ } from "../config"
import { marcarContactado, sinVolver, useSalon } from "../estado"
import { DIAS_SIN_VOLVER, profesional, servicio, type Cliente } from "../modelo"
import { Cargando, Encabezado } from "./marco"

export function Volver() {
  return (
    <SoloEnNivel nivel="sistema">
      <ListaVolver />
    </SoloEnNivel>
  )
}

function mensaje(c: Cliente, conQuien: string) {
  return (
    `Hola, ${c.nombre.split(" ")[0]}. Te escribimos de Peine Fino: hace rato no te vemos y ${conQuien} ` +
    `tiene horas libres esta semana. Puedes reservar aquí: peinefino.example/reservar`
  )
}

function ListaVolver() {
  const salon = useSalon()
  const [elegido, setElegido] = useState<{ cliente: Cliente; conQuien: string } | null>(null)
  const dialogo = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (elegido && !dialogo.current?.open) dialogo.current?.showModal()
  }, [elegido])

  if (!salon) return <Cargando />
  const hoy = claveDia(new Date())
  const lista = sinVolver(salon)
  const enJuego = lista.reduce((t, x) => t + x.gasto, 0)

  return (
    <>
      <Encabezado
        titulo="Que vuelvan"
        detalle={`${lista.length} clientes no vienen hace más de ${DIAS_SIN_VOLVER} días y no tienen reserva. Gastaron ${pesos(enJuego)} en los últimos tres meses.`}
      />
      <div className="px-4 py-6 sm:px-8">
        <Punto id="lista">
          <ul className="divide-y divide-pf-linea rounded-[6px] bg-white">
            {lista.map(({ cliente, ultima, dias, gasto }, i) => {
              const quien = profesional(ultima!.profesionalId).nombre.split(" ")[0]
              const boton =
                cliente.contactado === hoy ? (
                  <span className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-pf-exito-suave px-3 text-[0.875rem] font-semibold text-pf-exito">
                    <Check className="h-4 w-4" aria-hidden />
                    Escrito hoy
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setElegido({ cliente, conQuien: quien })}
                    className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-pf-cordoban px-3 text-[0.875rem] font-semibold text-white hover:bg-pf-cordoban-2"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    Escribir
                  </button>
                )
              return (
                <li key={cliente.id} className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 sm:px-5">
                  <div className="min-w-0 flex-1">
                    <Link href={`${RAIZ}/panel/clientes/${cliente.id}`} className="font-semibold hover:underline">
                      {cliente.nombre}
                    </Link>
                    <p className="text-[0.875rem] text-pf-humo">
                      {ultima!.servicios.map((s) => servicio(s).nombre).join(" + ")} con {quien}, el {textoFecha(ultima!.inicio.slice(0, 10))}
                    </p>
                  </div>
                  <p className="text-[0.875rem] font-semibold text-pf-alerta">Hace {dias} días</p>
                  <p className="w-[6.5rem] text-right font-semibold tabular-nums">{pesos(gasto)}</p>
                  {i === 0 ? (
                    <Punto id="mensaje" className="inline-block">
                      {boton}
                    </Punto>
                  ) : (
                    boton
                  )}
                </li>
              )
            })}
            {lista.length === 0 && <li className="p-5 text-pf-humo">Todos tus clientes están viniendo. Buena señal.</li>}
          </ul>
        </Punto>
      </div>

      <dialog
        ref={dialogo}
        aria-labelledby="volver-titulo"
        onClose={() => setElegido(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close()
        }}
        className="m-auto w-[min(92vw,440px)] rounded-[8px] bg-white p-0 font-pf-texto text-pf-tinta backdrop:bg-black/50"
      >
        {elegido && (
          <div className="p-6">
            <div className="flex items-start justify-between gap-3">
              <h2 id="volver-titulo" className="text-[1.25rem] font-bold">Mensaje para {elegido.cliente.nombre.split(" ")[0]}</h2>
              <button type="button" onClick={() => dialogo.current?.close()} className="rounded-[4px] p-1" aria-label="Cerrar">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="mt-4 rounded-[14px] rounded-tr-[4px] bg-[#dcf8c6] p-4 text-[0.9375rem] leading-relaxed text-[#111b21]">
              {mensaje(elegido.cliente, elegido.conQuien)}
            </div>
            <p className="mt-3 text-[0.8125rem] text-pf-humo">
              En el salón real, este botón abre el chat con el cliente y el mensaje ya escrito. Aquí no se envía nada.
            </p>
            <button
              type="button"
              onClick={() => {
                marcarContactado(elegido.cliente.id)
                dialogo.current?.close()
              }}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-[4px] bg-pf-cordoban font-semibold text-white hover:bg-pf-cordoban-2"
            >
              <Check className="h-4 w-4" aria-hidden />
              Marcar como escrito
            </button>
          </div>
        )}
      </dialog>
    </>
  )
}

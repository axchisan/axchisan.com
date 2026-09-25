"use client"

import Link from "next/link"
import { useState } from "react"
import { MessageCircle, Search } from "lucide-react"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { claveDia, textoFecha } from "@/demos/motores/agenda/tiempo"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "../config"
import { abonado, pendientePlan, saldo, useConsultorio } from "../estado"
import { Cargando, Encabezado } from "./marco"

const normalizar = (t: string) => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

export function PacientesMolar() {
  const e = useConsultorio()
  const [texto, setTexto] = useState("")
  return (
    <SoloEnNivel nivel="sistema">
      {!e ? (
        <Cargando />
      ) : (
        (() => {
          const q = normalizar(texto.trim())
          const hoy = claveDia(new Date())
          const lista = e.pacientes
            .filter((p) => !q || normalizar(`${p.nombre} ${p.documento}`).includes(q) || p.documento.replace(/\D/g, "").includes(q.replace(/\D/g, "") || "#"))
            .sort((a, b) => a.nombre.localeCompare(b.nombre))
          return (
            <>
              <Encabezado titulo="Pacientes" detalle={`${e.pacientes.length} pacientes. Toca uno para ver su odontograma y su presupuesto.`} />
              <div className="px-4 py-6 sm:px-8">
                <label className="relative block max-w-md">
                  <span className="sr-only">Buscar por nombre o documento</span>
                  <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-mo-gris" aria-hidden />
                  <input value={texto} onChange={(ev) => setTexto(ev.target.value)} placeholder="Nombre o documento" className="h-11 w-full rounded-full border border-mo-linea bg-white pr-4 pl-10" />
                </label>
                <ul className="mt-5 divide-y divide-mo-linea rounded-[18px] bg-white ring-1 ring-mo-linea">
                  {lista.map((p) => {
                    const proxima = e.citas.find((c) => c.pacienteId === p.id && c.estado === "agendada" && c.inicio >= hoy)
                    const porHacer = pendientePlan(p)
                    return (
                      <li key={p.id}>
                        <Link href={`${RAIZ}/panel/pacientes/${p.id}`} className="flex flex-wrap items-center gap-x-6 gap-y-1 px-4 py-3.5 hover:bg-mo-fondo sm:px-5">
                          <span className="min-w-[14rem] flex-1">
                            <span className="block font-semibold">{p.nombre}</span>
                            <span className="text-[0.8125rem] text-mo-gris">C. C. {p.documento}</span>
                          </span>
                          <span className="text-[0.875rem] text-mo-gris">{proxima ? `Próxima cita: ${textoFecha(proxima.inicio.slice(0, 10))}` : "Sin cita agendada"}</span>
                          <span className="w-40 text-right text-[0.875rem]">
                            {saldo(p) > 0 ? <span className="font-semibold text-mo-alerta">Saldo {pesos(saldo(p))}</span> : porHacer > 0 ? <span className="text-mo-rojo">Por hacer {pesos(porHacer)}</span> : <span className="text-mo-exito">Al día</span>}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
                {lista.length === 0 && <p className="mt-4 text-mo-gris">Nadie con ese nombre o documento.</p>}
              </div>
            </>
          )
        })()
      )}
    </SoloEnNivel>
  )
}

export function CarteraMolar() {
  const e = useConsultorio()
  return (
    <SoloEnNivel nivel="sistema">
      {!e ? (
        <Cargando />
      ) : (
        (() => {
          const conSaldo = e.pacientes.filter((p) => saldo(p) > 0).sort((a, b) => saldo(b) - saldo(a))
          const total = conSaldo.reduce((t, p) => t + saldo(p), 0)
          const recaudado = e.pacientes.reduce((t, p) => t + abonado(p), 0)
          return (
            <>
              <Encabezado titulo="Cartera" detalle={`${pesos(total)} por cobrar en ${conSaldo.length} pacientes. ${pesos(recaudado)} abonados en los tratamientos en curso.`} />
              <Punto id="saldos" className="px-4 py-6 sm:px-8">
                <ul className="divide-y divide-mo-linea rounded-[18px] bg-white ring-1 ring-mo-linea">
                  {conSaldo.map((p) => {
                    const ultimo = p.abonos.at(-1)
                    const nombre = p.nombre.split(" ")[0]
                    return (
                      <li key={p.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4 sm:px-5">
                        <div className="min-w-[14rem] flex-1">
                          <Link href={`${RAIZ}/panel/pacientes/${p.id}`} className="font-semibold hover:underline">
                            {p.nombre}
                          </Link>
                          <p className="text-[0.8125rem] text-mo-gris">
                            Aprobó {pesos(p.aprobado ?? 0)}. {ultimo ? `Último abono el ${textoFecha(ultimo.fecha)}.` : "Sin abonos todavía."}
                          </p>
                        </div>
                        <p className="text-[1.0625rem] font-bold tabular-nums">{pesos(saldo(p))}</p>
                        <WhatsappSimulado
                          negocio="el paciente"
                          mensaje={`Hola, ${nombre}. Te escribimos de Molar 116. Tu tratamiento tiene un saldo de ${pesos(saldo(p))}. Puedes abonar en tu próxima cita o por Nequi. Cualquier duda, aquí estamos.`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-full border-2 border-mo-tinta px-3 text-[0.875rem] font-semibold hover:bg-mo-tinta hover:text-white"
                        >
                          <MessageCircle className="h-4 w-4" aria-hidden />
                          Recordar
                        </WhatsappSimulado>
                      </li>
                    )
                  })}
                </ul>
                {conSaldo.length === 0 && <p className="mt-4 text-mo-gris">Nadie debe nada. Buen mes.</p>}
              </Punto>
            </>
          )
        })()
      )}
    </SoloEnNivel>
  )
}

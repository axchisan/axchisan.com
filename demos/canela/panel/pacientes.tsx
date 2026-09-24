"use client"

import Link from "next/link"
import { useState } from "react"
import { Search } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { RAIZ } from "../config"
import { buscarMascotas, useClinica } from "../estado"
import { claveDia, edad, estadoVacuna, textoFecha, type EstadoClinica, type EstadoVacuna } from "../modelo"
import { CargandoPanel, EncabezadoPanel, PlacaMascota } from "./marco"

export const INSIGNIA_VACUNA: Record<EstadoVacuna, { texto: string; clase: string }> = {
  vencida: { texto: "Vacuna vencida", clase: "bg-cn-coral-suave text-cn-coral" },
  proxima: { texto: "Vacuna próxima", clase: "bg-cn-ambar-suave text-cn-ambar" },
  "al-dia": { texto: "Al día", clase: "bg-cn-pino-suave text-cn-pino" },
}

/** El peor estado entre las vacunas de una mascota. */
export function estadoPeor(e: EstadoClinica, mascotaId: string, hoy: string): EstadoVacuna | null {
  const estados = e.vacunas.filter((v) => v.mascotaId === mascotaId).map((v) => estadoVacuna(v, hoy))
  if (estados.length === 0) return null
  if (estados.includes("vencida")) return "vencida"
  if (estados.includes("proxima")) return "proxima"
  return "al-dia"
}

export function Pacientes() {
  return (
    <SoloEnNivel nivel="sistema">
      <ListaPacientes />
    </SoloEnNivel>
  )
}

function ListaPacientes() {
  const clinica = useClinica()
  const [q, setQ] = useState("")
  if (!clinica) return <CargandoPanel />

  const hoy = claveDia(new Date())
  const filas = buscarMascotas(clinica, q).sort((a, b) => a.m.nombre.localeCompare(b.m.nombre, "es"))
  const ultima = (id: string) =>
    clinica.consultas
      .filter((c) => c.mascotaId === id)
      .map((c) => c.fecha)
      .sort()
      .at(-1)

  return (
    <>
      <EncabezadoPanel titulo="Pacientes" detalle={`${clinica.mascotas.length} mascotas registradas`} />
      <div className="px-4 py-6 sm:px-8">
        <Punto id="buscar" className="max-w-md">
          <label className="relative block">
            <span className="sr-only">Buscar paciente</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-cn-pizarra" aria-hidden />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Mascota, propietario o teléfono"
              className="h-12 w-full rounded-[12px] border-2 border-cn-linea bg-white pr-4 pl-11 text-[1rem] outline-none focus:border-cn-collar"
            />
          </label>
        </Punto>

        <Punto id="estado-vacunas" className="mt-6">
          <div className="overflow-hidden rounded-[14px] bg-white">
            <table className="w-full text-left text-[0.9375rem]">
              <thead className="hidden border-b border-cn-linea text-[0.8125rem] text-cn-pizarra md:table-header-group">
                <tr>
                  <th className="px-5 py-3 font-normal">Paciente</th>
                  <th className="px-3 py-3 font-normal">Propietario</th>
                  <th className="px-3 py-3 font-normal">Edad</th>
                  <th className="px-3 py-3 font-normal">Última consulta</th>
                  <th className="px-5 py-3 font-normal">Vacunas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cn-linea">
                {filas.map(({ m, p }) => {
                  const estado = estadoPeor(clinica, m.id, hoy)
                  const u = ultima(m.id)
                  return (
                    <tr key={m.id} className="relative block hover:bg-cn-nube md:table-row">
                      <td className="flex items-center gap-3 px-4 pt-3 md:table-cell md:px-5 md:py-3">
                        <span className="flex items-center gap-3">
                          <PlacaMascota nombre={m.nombre} especie={m.especie} foto={m.foto} />
                          <span>
                            <Link
                              href={`${RAIZ}/panel/pacientes/${m.id}`}
                              className="font-bold after:absolute after:inset-0 hover:underline"
                            >
                              {m.nombre}
                            </Link>
                            <span className="block text-[0.8125rem] text-cn-pizarra">
                              {m.especie === "perro" ? "Perro" : "Gato"}, {m.raza.toLowerCase()}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td className="block px-4 pl-[4.25rem] md:table-cell md:px-3 md:py-3">
                        {p.nombre}
                        <span className="block text-[0.8125rem] text-cn-pizarra">{p.telefono}</span>
                      </td>
                      <td className="hidden px-3 py-3 md:table-cell">{edad(m.nacimiento)}</td>
                      <td className="hidden px-3 py-3 md:table-cell">{u ? textoFecha(u.slice(0, 10)) : "Sin consultas"}</td>
                      <td className="block px-4 pt-1 pb-3 pl-[4.25rem] md:table-cell md:px-5 md:py-3">
                        {estado && (
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[0.8125rem] font-bold ${INSIGNIA_VACUNA[estado].clase}`}>
                            {INSIGNIA_VACUNA[estado].texto}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filas.length === 0 && (
              <p className="p-6 text-cn-pizarra">Ningún paciente coincide con «{q}». Revisa el nombre o prueba con el teléfono.</p>
            )}
          </div>
        </Punto>
      </div>
    </>
  )
}

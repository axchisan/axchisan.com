"use client"

import { Punto } from "@/demos/comun/recorrido"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { useClinica } from "../estado"
import { claveDia, PROFESIONALES, SERVICIOS, sumarDias, textoFecha } from "../modelo"
import { CargandoPanel, EncabezadoPanel } from "./marco"

export function Resumen() {
  return (
    <SoloEnNivel nivel="sistema">
      <Cifras />
    </SoloEnNivel>
  )
}

function Cifras() {
  const clinica = useClinica()
  if (!clinica) return <CargandoPanel />

  // Últimos 30 días hasta hoy: el tramo en el que la demo tiene historia.
  const hoy = claveDia(new Date())
  const desde = sumarDias(hoy, -29)
  const citas = clinica.citas.filter((c) => {
    const d = c.inicio.slice(0, 10)
    return d >= desde && d <= hoy && c.estado !== "agendada" && c.estado !== "en-sala"
  })
  const atendidas = citas.filter((c) => c.estado === "atendida")
  const ausencias = citas.length - atendidas.length
  const web = citas.filter((c) => c.origen === "web").length
  const pacientes = new Set(atendidas.map((c) => c.mascotaId)).size
  const porcentaje = (n: number) => (citas.length ? Math.round((n / citas.length) * 100) : 0)

  const porServicio = SERVICIOS.map((s) => ({
    id: s.id,
    etiqueta: s.nombre,
    valor: atendidas.filter((c) => c.servicioId === s.id).length,
  })).sort((a, b) => b.valor - a.valor)

  const porProfesional = PROFESIONALES.map((p) => ({
    id: p.id,
    etiqueta: p.nombre,
    valor: atendidas.filter((c) => c.profesionalId === p.id).length,
  })).sort((a, b) => b.valor - a.valor)

  return (
    <>
      <EncabezadoPanel titulo="Resumen" detalle={`Del ${textoFecha(desde)} al ${textoFecha(hoy)}`} />
      <div className="px-4 py-6 sm:px-8">
        <Punto id="cifras">
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { t: "Citas atendidas", v: String(atendidas.length) },
              { t: "Pacientes distintos", v: String(pacientes) },
              { t: "No asistieron", v: `${porcentaje(ausencias)} %`, d: `${ausencias} citas` },
              { t: "Agendadas desde la página", v: `${porcentaje(web)} %`, d: `${web} citas` },
            ].map((x) => (
              <div key={x.t} className="rounded-[14px] bg-white p-5">
                <dt className="text-[0.875rem] text-cn-pizarra">{x.t}</dt>
                <dd className="mt-1.5 text-[2.4375rem] leading-none font-bold tabular-nums">{x.v}</dd>
                {x.d && <dd className="mt-1 text-[0.875rem] text-cn-pizarra">{x.d}</dd>}
              </div>
            ))}
          </dl>
        </Punto>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <Punto id="servicios">
            <Barras titulo="Servicios atendidos" filas={porServicio} />
          </Punto>
          <Barras titulo="Citas por profesional" filas={porProfesional} />
        </div>
      </div>
    </>
  )
}

/**
 * Barras horizontales de una sola serie: un color, valor escrito al final de
 * cada barra y la tabla como estructura, así el dato no depende del color.
 */
function Barras({ titulo, filas }: { titulo: string; filas: { id: string; etiqueta: string; valor: number }[] }) {
  const max = Math.max(1, ...filas.map((f) => f.valor))
  return (
    <section aria-label={titulo} className="rounded-[14px] bg-white p-5">
      <h2 className="text-[1.125rem] font-bold">{titulo}</h2>
      <table className="mt-4 w-full border-separate border-spacing-y-2 text-[0.9375rem]">
        <tbody>
          {filas.map((f) => (
            <tr key={f.id} title={`${f.etiqueta}: ${f.valor}`}>
              <th scope="row" className="w-[42%] pr-3 text-left font-normal">
                {f.etiqueta}
              </th>
              <td>
                <span className="flex items-center gap-2">
                  <span
                    className="block h-5 rounded-r-[4px] bg-cn-collar"
                    style={{ width: `${(f.valor / max) * 85}%`, minWidth: f.valor ? 4 : 0 }}
                    aria-hidden
                  />
                  <span className="font-bold tabular-nums">{f.valor}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

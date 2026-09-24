"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { pesos } from "@/lib/catalogo/planes"
import { claveDia, sumarDias, textoDia, textoHora } from "@/demos/motores/agenda/tiempo"
import { cobrar, useSalon } from "../estado"
import { METODOS, precio, PROFESIONALES, servicio, type Cita, type MetodoPago } from "../modelo"
import { Cargando, Encabezado } from "./marco"

export function Caja() {
  return (
    <SoloEnNivel nivel="sistema">
      <CajaSalon />
    </SoloEnNivel>
  )
}

type Periodo = "hoy" | "semana"

function CajaSalon() {
  const salon = useSalon()
  const [periodo, setPeriodo] = useState<Periodo>("hoy")
  const [cobrando, setCobrando] = useState<Cita | null>(null)
  const dialogo = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (cobrando && !dialogo.current?.open) dialogo.current?.showModal()
  }, [cobrando])

  if (!salon) return <Cargando />

  const hoy = claveDia(new Date())
  const desde = periodo === "hoy" ? hoy : sumarDias(hoy, -6)
  const enPeriodo = (c: Cita) => c.inicio.slice(0, 10) >= desde && c.inicio.slice(0, 10) <= hoy
  const nombre = (id: string) => salon.clientes.find((c) => c.id === id)?.nombre ?? "Cliente"

  const porCobrar = salon.citas
    .filter((c) => c.inicio.startsWith(hoy) && (c.estado === "en-silla" || (c.estado === "atendida" && !c.pago)))
    .sort((a, b) => a.inicio.localeCompare(b.inicio))
  const cobradas = salon.citas.filter((c) => c.pago && enPeriodo(c)).sort((a, b) => b.inicio.localeCompare(a.inicio))

  const porMetodo = (Object.keys(METODOS) as MetodoPago[]).map((m) => ({
    metodo: m,
    total: cobradas.filter((c) => c.pago!.metodo === m).reduce((t, c) => t + c.pago!.total + c.pago!.propina, 0),
  }))
  const totalServicios = cobradas.reduce((t, c) => t + c.pago!.total, 0)
  const totalPropinas = cobradas.reduce((t, c) => t + c.pago!.propina, 0)

  const comisiones = PROFESIONALES.map((p) => {
    const suyas = cobradas.filter((c) => c.profesionalId === p.id)
    const vendido = suyas.reduce((t, c) => t + c.pago!.total, 0)
    const propinas = suyas.reduce((t, c) => t + c.pago!.propina, 0)
    return { p, servicios: suyas.length, vendido, comision: Math.round((vendido * p.comision) / 100), propinas }
  }).filter((x) => x.servicios > 0)

  return (
    <>
      <Encabezado
        titulo="Caja"
        detalle={periodo === "hoy" ? textoDia(hoy) : `Del ${textoDia(desde).toLowerCase()} a hoy`}
        accion={
          <div className="flex rounded-[4px] border-2 border-pf-linea bg-white p-0.5" role="radiogroup" aria-label="Periodo">
            {(["hoy", "semana"] as const).map((x) => (
              <button
                key={x}
                type="button"
                role="radio"
                aria-checked={periodo === x}
                onClick={() => setPeriodo(x)}
                className={`h-8 rounded-[3px] px-3 text-[0.9375rem] font-semibold ${periodo === x ? "bg-pf-cordoban text-white" : ""}`}
              >
                {x === "hoy" ? "Hoy" : "Últimos 7 días"}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-6 px-4 py-6 sm:px-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-6">
          <Punto id="cobrar">
            <section aria-labelledby="por-cobrar" className="rounded-[6px] bg-white p-5">
              <h2 id="por-cobrar" className="text-[1.125rem] font-bold">
                Por cobrar hoy <span className="font-normal text-pf-humo">({porCobrar.length})</span>
              </h2>
              {porCobrar.length === 0 ? (
                <p className="mt-3 text-[0.9375rem] text-pf-humo">Todo lo atendido está cobrado.</p>
              ) : (
                <ul className="mt-3 divide-y divide-pf-linea">
                  {porCobrar.map((c) => (
                    <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                      <span className="w-[4.5rem] font-semibold tabular-nums">{textoHora(c.inicio)}</span>
                      <span className="min-w-0 flex-1 text-[0.9375rem]">
                        <span className="block font-semibold">{nombre(c.clienteId)}</span>
                        <span className="block text-pf-humo">
                          {c.servicios.map((s) => servicio(s).nombre).join(" + ")}, {PROFESIONALES.find((p) => p.id === c.profesionalId)?.nombre.split(" ")[0]}
                        </span>
                      </span>
                      <span className="font-semibold tabular-nums">{pesos(precio(c.servicios))}</span>
                      <button
                        type="button"
                        onClick={() => setCobrando(c)}
                        className="inline-flex h-9 items-center rounded-[4px] bg-pf-cordoban px-4 text-[0.9375rem] font-semibold text-white hover:bg-pf-cordoban-2"
                      >
                        Cobrar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </Punto>

          <section aria-labelledby="cobradas" className="rounded-[6px] bg-white p-5">
            <h2 id="cobradas" className="text-[1.125rem] font-bold">
              Cobrado <span className="font-normal text-pf-humo">({cobradas.length})</span>
            </h2>
            {/* Con scroll propio: necesita foco para recorrerse con el teclado. */}
            <ul tabIndex={0} aria-label="Cobros del periodo" className="mt-3 max-h-[420px] divide-y divide-pf-linea overflow-y-auto focus-visible:outline-2 focus-visible:outline-pf-cordoban">
              {cobradas.map((c) => (
                <li key={c.id} className="flex items-center gap-3 py-2.5 text-[0.9375rem]">
                  <span className="w-[5.5rem] shrink-0 text-pf-humo tabular-nums">
                    {periodo === "hoy" ? textoHora(c.inicio) : c.inicio.slice(5, 10).split("-").reverse().join("/")}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{nombre(c.clienteId)}</span>
                  <span className="text-pf-humo">{METODOS[c.pago!.metodo]}</span>
                  <span className="w-[6.5rem] text-right font-semibold tabular-nums">{pesos(c.pago!.total + c.pago!.propina)}</span>
                </li>
              ))}
              {cobradas.length === 0 && <li className="py-3 text-pf-humo">Todavía no hay cobros en este periodo.</li>}
            </ul>
          </section>
        </div>

        <div className="min-w-0 space-y-6">
          <Punto id="cierre">
            <section aria-labelledby="cierre" className="rounded-[6px] bg-white p-5">
              <h2 id="cierre" className="text-[1.125rem] font-bold">Cierre</h2>
              <dl className="mt-3 divide-y divide-pf-linea text-[0.9375rem]">
                {porMetodo.map((m) => (
                  <div key={m.metodo} className="flex justify-between py-2">
                    <dt>{METODOS[m.metodo]}</dt>
                    <dd className="tabular-nums">{pesos(m.total)}</dd>
                  </div>
                ))}
                <div className="flex justify-between py-2 text-pf-humo">
                  <dt>De eso, propinas</dt>
                  <dd className="tabular-nums">{pesos(totalPropinas)}</dd>
                </div>
                <div className="flex justify-between pt-3 text-[1.125rem] font-bold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{pesos(totalServicios + totalPropinas)}</dd>
                </div>
              </dl>
            </section>
          </Punto>

          <Punto id="comisiones">
            <section aria-labelledby="comisiones" className="rounded-[6px] bg-white p-5">
              <h2 id="comisiones" className="text-[1.125rem] font-bold">Comisiones</h2>
              <p className="mt-1 text-[0.875rem] text-pf-humo">Porcentaje de cada uno sobre lo cobrado, más sus propinas completas.</p>
              <table className="mt-3 w-full text-[0.9375rem]">
                <thead className="text-left text-[0.8125rem] text-pf-humo">
                  <tr>
                    <th className="pb-2 font-normal">Profesional</th>
                    <th className="pb-2 text-right font-normal">Vendido</th>
                    <th className="pb-2 text-right font-normal">Le toca</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pf-linea">
                  {comisiones.map((x) => (
                    <tr key={x.p.id}>
                      <td className="py-2">
                        <span className="font-semibold">{x.p.nombre.split(" ")[0]}</span>{" "}
                        <span className="text-pf-humo">{x.p.comision} %</span>
                      </td>
                      <td className="py-2 text-right tabular-nums">{pesos(x.vendido)}</td>
                      <td className="py-2 text-right font-semibold tabular-nums">{pesos(x.comision + x.propinas)}</td>
                    </tr>
                  ))}
                  {comisiones.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-3 text-pf-humo">Sin cobros en este periodo.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </Punto>
        </div>
      </div>

      <dialog
        ref={dialogo}
        aria-labelledby="cobrar-titulo"
        onClose={() => setCobrando(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close()
        }}
        className="m-auto w-[min(94vw,440px)] rounded-[8px] bg-white p-0 font-pf-texto text-pf-tinta backdrop:bg-black/50"
      >
        {cobrando && <FormularioCobro key={cobrando.id} cita={cobrando} nombre={nombre(cobrando.clienteId)} cerrar={() => dialogo.current?.close()} />}
      </dialog>
    </>
  )
}

function FormularioCobro({ cita, nombre, cerrar }: { cita: Cita; nombre: string; cerrar: () => void }) {
  const lista = precio(cita.servicios)
  const [descuento, setDescuento] = useState("")
  const [propina, setPropina] = useState(0)
  const [metodo, setMetodo] = useState<MetodoPago>("efectivo")
  const valorDescuento = Math.min(lista, Math.max(0, Number(descuento.replace(/\D/g, "")) || 0))
  const total = lista - valorDescuento

  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="cobrar-titulo" className="text-[1.25rem] font-bold">Cobrar a {nombre}</h2>
          <p className="text-[0.9375rem] text-pf-humo">{cita.servicios.map((s) => servicio(s).nombre).join(" + ")}</p>
        </div>
        <button type="button" onClick={cerrar} className="rounded-[4px] p-1" aria-label="Cerrar">
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <label className="mt-5 block">
        <span className="text-[0.9375rem] font-semibold">
          Descuento <span className="font-normal text-pf-humo">(por ejemplo, el martes de barba)</span>
        </span>
        <input
          inputMode="numeric"
          value={descuento}
          onChange={(e) => setDescuento(e.target.value)}
          placeholder="0"
          className="mt-1.5 block h-11 w-full rounded-[4px] border-2 border-pf-linea px-3 outline-none focus:border-pf-cordoban"
        />
      </label>

      <fieldset className="mt-5">
        <legend className="text-[0.9375rem] font-semibold">Medio de pago</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(Object.keys(METODOS) as MetodoPago[]).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={metodo === m}
              onClick={() => setMetodo(m)}
              className={`h-10 rounded-[4px] border-2 font-semibold ${metodo === m ? "border-pf-cordoban bg-pf-cordoban text-white" : "border-pf-linea"}`}
            >
              {METODOS[m]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-[0.9375rem] font-semibold">Propina</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {[0, 2_000, 5_000, 10_000].map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={propina === p}
              onClick={() => setPropina(p)}
              className={`h-10 rounded-[4px] border-2 px-3 font-semibold tabular-nums ${propina === p ? "border-pf-cordoban bg-pf-cordoban text-white" : "border-pf-linea"}`}
            >
              {p === 0 ? "Sin propina" : pesos(p)}
            </button>
          ))}
        </div>
      </fieldset>

      <dl className="mt-5 space-y-1 border-t border-pf-linea pt-4 text-[0.9375rem]">
        <div className="flex justify-between">
          <dt>Servicios</dt>
          <dd className="tabular-nums">{pesos(lista)}</dd>
        </div>
        {valorDescuento > 0 && (
          <div className="flex justify-between">
            <dt>Descuento</dt>
            <dd className="tabular-nums">−{pesos(valorDescuento)}</dd>
          </div>
        )}
        {propina > 0 && (
          <div className="flex justify-between">
            <dt>Propina</dt>
            <dd className="tabular-nums">{pesos(propina)}</dd>
          </div>
        )}
        <div className="flex justify-between text-[1.125rem] font-bold">
          <dt>Total</dt>
          <dd className="tabular-nums">{pesos(total + propina)}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => {
          cobrar(cita.id, { metodo, total, propina })
          cerrar()
        }}
        className="mt-6 h-12 w-full rounded-[4px] bg-pf-cordoban font-semibold text-white hover:bg-pf-cordoban-2"
      >
        Registrar pago de {pesos(total + propina)}
      </button>
    </div>
  )
}

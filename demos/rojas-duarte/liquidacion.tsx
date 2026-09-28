"use client"

import Link from "next/link"
import { useRef, useState, type FormEvent } from "react"
import { Punto } from "@/demos/comun/recorrido"
import { textoFecha } from "@/demos/motores/agenda/tiempo"
import { validar, type Errores } from "@/demos/motores/presencia/formulario"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import { AUXILIO_TRANSPORTE_2026, MOTIVOS, SMMLV_2026, liquidar, type Liquidacion, type Motivo } from "./laboral"
import { botonVino, campo } from "./publico"

type Valores = { salario: string; ingreso: string; retiro: string; motivo: Motivo }
type Campo = "salario" | "ingreso" | "retiro"

const numero = (t: string) => Number(t.replace(/\D/g, "")) || 0

const REGLAS = {
  salario: (v: Valores) =>
    !numero(v.salario)
      ? "Escriba el salario mensual, sin centavos."
      : numero(v.salario) < SMMLV_2026
        ? `Con jornada completa el salario no puede ser menor al mínimo de 2026, ${pesos(SMMLV_2026)}.`
        : undefined,
  ingreso: (v: Valores) => (!v.ingreso ? "Elija la fecha en que empezó a trabajar." : undefined),
  retiro: (v: Valores) =>
    !v.retiro
      ? "Elija la fecha de su último día de trabajo."
      : !v.retiro.startsWith("2026")
        ? "La calculadora usa las cifras de 2026: el retiro tiene que ser de este año."
        : v.ingreso && v.retiro < v.ingreso
          ? "El retiro no puede ser antes del ingreso."
          : undefined,
}

export function CalculadoraLiquidacion() {
  const [v, setV] = useState<Valores>({ salario: "", ingreso: "", retiro: "", motivo: "renuncia" })
  const [errores, setErrores] = useState<Errores<Campo>>({})
  const [resultado, setResultado] = useState<{ l: Liquidacion; datos: Valores } | null>(null)
  const salida = useRef<HTMLDivElement>(null)

  const cambiar = <K extends keyof Valores>(k: K, x: Valores[K]) => setV((p) => ({ ...p, [k]: x }))

  function calcular(e: FormEvent) {
    e.preventDefault()
    const errs = validar(v, REGLAS)
    setErrores(errs)
    const primero = (Object.keys(REGLAS) as Campo[]).find((c) => errs[c])
    if (primero) {
      document.getElementById(primero)?.focus()
      return
    }
    setResultado({ l: liquidar({ salario: numero(v.salario), ingreso: v.ingreso, retiro: v.retiro, motivo: v.motivo }), datos: v })
    requestAnimationFrame(() => salida.current?.focus())
  }

  const error = (c: Campo) =>
    errores[c] && (
      <p id={`${c}-error`} className="mt-1.5 text-[0.9375rem] font-medium text-rd-vino">
        {errores[c]}
      </p>
    )
  const aria = (c: Campo) => ({ "aria-invalid": errores[c] ? true : undefined, "aria-describedby": errores[c] ? `${c}-error` : undefined })

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
      <form onSubmit={calcular} noValidate className="space-y-6">
        <div>
          <label htmlFor="salario" className="font-semibold">
            Salario mensual
          </label>
          <p className="text-[0.875rem] text-rd-gris">El básico del contrato, sin horas extra.</p>
          <input
            id="salario"
            inputMode="numeric"
            autoComplete="off"
            placeholder="2.500.000"
            value={v.salario}
            onChange={(e) => {
              const n = numero(e.target.value)
              cambiar("salario", n ? n.toLocaleString("es-CO") : "")
            }}
            className={`${campo} h-12`}
            {...aria("salario")}
          />
          {error("salario")}
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="ingreso" className="font-semibold">
              Fecha de ingreso
            </label>
            <input id="ingreso" type="date" value={v.ingreso} onChange={(e) => cambiar("ingreso", e.target.value)} className={`${campo} h-12`} {...aria("ingreso")} />
            {error("ingreso")}
          </div>
          <div>
            <label htmlFor="retiro" className="font-semibold">
              Fecha de retiro
            </label>
            <input id="retiro" type="date" min="2026-01-01" max="2026-12-31" value={v.retiro} onChange={(e) => cambiar("retiro", e.target.value)} className={`${campo} h-12`} {...aria("retiro")} />
            {error("retiro")}
          </div>
        </div>
        <fieldset>
          <legend className="font-semibold">¿Cómo terminó el contrato?</legend>
          <div className="mt-2 space-y-2">
            {(Object.keys(MOTIVOS) as Motivo[]).map((m) => (
              <label key={m} className="flex cursor-pointer items-center gap-3 rounded-[3px] border border-rd-linea bg-white px-4 py-3 has-[:checked]:border-rd-vino has-[:checked]:bg-rd-vino-suave has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-rd-vino">
                <input type="radio" name="motivo" value={m} checked={v.motivo === m} onChange={() => cambiar("motivo", m)} className="h-4 w-4 accent-rd-vino" />
                {MOTIVOS[m]}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="text-[0.875rem] leading-relaxed text-rd-gris">
          Contrato a término indefinido con salario mínimo de 2026 de {pesos(SMMLV_2026)} y auxilio de transporte de {pesos(AUXILIO_TRANSPORTE_2026)} para quien gana hasta dos mínimos.
        </p>
        <button type="submit" className={`${botonVino} w-full sm:w-auto`}>
          Calcular la liquidación
        </button>
      </form>

      <Punto id="calculo">
        <div ref={salida} tabIndex={-1} aria-live="polite" className="rounded-[2px] bg-white p-6 ring-1 ring-rd-linea outline-none sm:p-8">
          {!resultado ? (
            <div className="text-rd-gris">
              <h2 className="font-rd-titulo text-[1.75rem] leading-tight text-rd-tinta">Su liquidación</h2>
              <p className="mt-3">Llene los datos y aquí verá cada rubro: cuántos días le cuentan y de dónde sale el valor.</p>
            </div>
          ) : (
            <Resultado l={resultado.l} datos={resultado.datos} />
          )}
        </div>
      </Punto>
    </div>
  )
}

function Resultado({ l, datos }: { l: Liquidacion; datos: Valores }) {
  return (
    <>
      <h2 className="font-rd-titulo text-[1.75rem] leading-tight">Le deberían pagar</h2>
      <p className="mt-1 font-rd-titulo text-[2.75rem] leading-none text-rd-vino" data-total>
        {pesos(l.total)}
      </p>
      <p className="mt-3 text-[0.9375rem] text-rd-gris">
        {l.diasTrabajados.toLocaleString("es-CO")} días trabajados, del {textoFecha(datos.ingreso)} al {textoFecha(datos.retiro)}.{" "}
        {l.conAuxilio ? `Base para cesantías y prima: ${pesos(l.base)}, con el auxilio de transporte.` : "Gana más de dos mínimos: sin auxilio de transporte."}
      </p>
      <table className="mt-6 w-full text-left text-[0.9375rem]">
        <caption className="sr-only">Rubros de la liquidación</caption>
        <thead>
          <tr className="border-b border-rd-tinta">
            <th scope="col" className="py-2 font-semibold">
              Rubro
            </th>
            <th scope="col" className="py-2 text-right font-semibold">
              Días
            </th>
            <th scope="col" className="py-2 text-right font-semibold">
              Valor
            </th>
          </tr>
        </thead>
        <tbody>
          {l.conceptos.map((c) => (
            <tr key={c.id} className="border-b border-rd-linea align-top">
              <th scope="row" className="py-3 pr-3 font-normal">
                <span className="block font-semibold">{c.nombre}</span>
                <span className="text-[0.875rem] text-rd-gris">{c.nota}</span>
              </th>
              <td className="py-3 text-right tabular-nums">{c.dias}</td>
              <td className="py-3 pl-3 text-right whitespace-nowrap tabular-nums">{pesos(c.valor)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {datos.motivo === "justa-causa" && (
        <p className="mt-4 rounded-[2px] bg-rd-alerta-suave p-4 text-[0.9375rem] text-rd-alerta">
          Con justa causa no hay indemnización. Si la causa que le dieron no es cierta o no se probó en descargos, puede que sí la haya.
        </p>
      )}
      <Punto id="siguiente" className="mt-6">
        <div className="border-t border-rd-linea pt-6">
          <p className="font-semibold">¿No cuadra con lo que le pagaron?</p>
          <p className="mt-1 text-[0.9375rem] text-rd-gris">Tiene tres años para reclamar desde que terminó el contrato. Traiga esta cuenta y su liquidación a la consulta.</p>
          <Link href={`${RAIZ}/consulta?area=laboral`} className={`${botonVino} mt-4`}>
            Consultar con una abogada laboral
          </Link>
        </div>
      </Punto>
    </>
  )
}

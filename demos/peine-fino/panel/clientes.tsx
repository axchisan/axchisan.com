"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Search } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { pesos } from "@/lib/catalogo/planes"
import { claveDia, diasEntre, textoDia, textoFecha, textoHora } from "@/demos/motores/agenda/tiempo"
import { RAIZ } from "../config"
import { buscarClientes, frecuencia, guardarFormula, useSalon, visitas } from "../estado"
import { PROFESIONALES, profesional, servicio } from "../modelo"
import { Cargando, Encabezado } from "./marco"

export function Clientes() {
  return (
    <SoloEnNivel nivel="sistema">
      <ListaClientes />
    </SoloEnNivel>
  )
}

function ListaClientes() {
  const salon = useSalon()
  const [q, setQ] = useState("")
  if (!salon) return <Cargando />
  const hoy = claveDia(new Date())
  const filas = buscarClientes(salon, q)
    .map((c) => {
      const v = visitas(salon, c.id)
      return { c, ultima: v[0], total: v.reduce((t, x) => t + (x.pago?.total ?? 0), 0), cada: frecuencia(salon, c.id) }
    })
    .sort((a, b) => (b.ultima?.inicio ?? "").localeCompare(a.ultima?.inicio ?? ""))

  return (
    <>
      <Encabezado titulo="Clientes" detalle={`${salon.clientes.length} clientes con historia en el salón`} />
      <div className="px-4 py-6 sm:px-8">
        <Punto id="buscar" className="max-w-md">
          <label className="relative block">
            <span className="sr-only">Buscar cliente</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-pf-humo" aria-hidden />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nombre o teléfono"
              className="h-12 w-full rounded-[4px] border-2 border-pf-linea bg-white pr-4 pl-11 outline-none focus:border-pf-cordoban"
            />
          </label>
        </Punto>
        <ul className="mt-6 divide-y divide-pf-linea rounded-[6px] bg-white">
          {filas.map(({ c, ultima, total, cada }) => (
            <li key={c.id} className="relative flex flex-wrap items-center gap-x-6 gap-y-1 px-4 py-3 hover:bg-pf-porcelana sm:px-5">
              <div className="min-w-0 flex-1">
                <Link href={`${RAIZ}/panel/clientes/${c.id}`} className="font-semibold after:absolute after:inset-0 hover:underline">
                  {c.nombre}
                </Link>
                <p className="text-[0.875rem] text-pf-humo">{c.telefono}</p>
              </div>
              <p className="text-[0.875rem] text-pf-humo">
                {ultima ? `Última visita hace ${diasEntre(ultima.inicio, hoy)} días` : "Sin visitas"}
                {cada ? `, viene cada ${cada} días` : ""}
              </p>
              <p className="w-[7rem] text-right font-semibold tabular-nums">{pesos(total)}</p>
            </li>
          ))}
          {filas.length === 0 && <li className="p-5 text-pf-humo">Nadie coincide con «{q}».</li>}
        </ul>
      </div>
    </>
  )
}

export function FichaCliente({ id }: { id: string }) {
  return (
    <SoloEnNivel nivel="sistema">
      <Ficha id={id} />
    </SoloEnNivel>
  )
}

function Ficha({ id }: { id: string }) {
  const salon = useSalon()
  const [formula, setFormula] = useState("")
  const [quien, setQuien] = useState("valeria")
  if (!salon) return <Cargando />
  const c = salon.clientes.find((x) => x.id === id)
  if (!c) {
    return (
      <div className="px-8 py-16">
        <p>Este cliente no existe o se borró al restablecer la demo.</p>
        <Link href={`${RAIZ}/panel/clientes`} className="mt-3 inline-block font-semibold underline">
          Ir a clientes
        </Link>
      </div>
    )
  }
  const v = visitas(salon, c.id)
  const cada = frecuencia(salon, c.id)
  const total = v.reduce((t, x) => t + (x.pago?.total ?? 0), 0)
  const proxima = salon.citas
    .filter((x) => x.clienteId === c.id && x.estado === "agendada")
    .sort((a, b) => a.inicio.localeCompare(b.inicio))[0]
  const formulas = [...c.formulas].sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <>
      <div className="border-b border-pf-linea bg-white px-4 py-6 sm:px-8">
        <Link href={`${RAIZ}/panel/clientes`} className="inline-flex items-center gap-1.5 text-[0.9375rem] hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Clientes
        </Link>
        <h1 className="mt-3 font-pf-letrero text-[2.4375rem] leading-none font-extrabold text-pf-cordoban uppercase">{c.nombre}</h1>
        <p className="mt-2 text-[0.9375rem] text-pf-humo">
          {c.telefono}. {v.length} visitas, {pesos(total)} en total{cada ? `, viene cada ${cada} días` : ""}.
        </p>
        {proxima && (
          <p className="mt-1 text-[0.9375rem]">
            Próxima: {textoDia(proxima.inicio.slice(0, 10))}, {textoHora(proxima.inicio)}, con {profesional(proxima.profesionalId).nombre}.
          </p>
        )}
        {c.notas && <p className="mt-3 max-w-2xl rounded-[4px] bg-pf-alerta-suave p-3 text-[0.9375rem] text-pf-tinta">{c.notas}</p>}
      </div>

      <div className="grid gap-6 px-4 py-6 sm:px-8 xl:grid-cols-2">
        <Punto id="formula" className="min-w-0">
          <section aria-labelledby="formulas" className="rounded-[6px] bg-white p-5">
            <h2 id="formulas" className="text-[1.125rem] font-bold">Fórmulas de color</h2>
            {formulas.length === 0 ? (
              <p className="mt-2 text-[0.9375rem] text-pf-humo">Sin fórmulas guardadas. Se registran después de cada servicio de color.</p>
            ) : (
              <ol className="mt-3 space-y-3">
                {formulas.map((f, i) => (
                  <li key={i} className="rounded-[4px] border border-pf-linea p-3">
                    <p className="text-[0.8125rem] text-pf-humo">
                      {textoFecha(f.fecha)}, {profesional(f.profesionalId).nombre}
                    </p>
                    <p className="mt-1 text-[0.9375rem]">{f.texto}</p>
                  </li>
                ))}
              </ol>
            )}
            <form
              className="mt-5 border-t border-pf-linea pt-4"
              onSubmit={(e) => {
                e.preventDefault()
                if (formula.trim().length < 5) return
                guardarFormula(c.id, quien, formula)
                setFormula("")
              }}
            >
              <label className="block">
                <span className="text-[0.9375rem] font-semibold">Nueva fórmula</span>
                <textarea
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  rows={3}
                  placeholder="Tonos, oxidante, tiempo de exposición y matiz."
                  className="mt-1.5 block w-full rounded-[4px] border-2 border-pf-linea p-3 outline-none focus:border-pf-cordoban"
                />
              </label>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <label className="block">
                  <span className="text-[0.875rem] text-pf-humo">Quién la hizo</span>
                  <select value={quien} onChange={(e) => setQuien(e.target.value)} className="mt-1 block h-10 rounded-[4px] border-2 border-pf-linea bg-white px-2">
                    {PROFESIONALES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="submit" className="h-10 rounded-[4px] bg-pf-cordoban px-4 font-semibold text-white hover:bg-pf-cordoban-2">
                  Guardar fórmula
                </button>
              </div>
            </form>
          </section>
        </Punto>

        <Punto id="historial" className="min-w-0">
          <section aria-labelledby="visitas" className="rounded-[6px] bg-white p-5">
            <h2 id="visitas" className="text-[1.125rem] font-bold">Visitas</h2>
            <ul className="mt-3 divide-y divide-pf-linea">
              {v.map((x) => (
                <li key={x.id} className="flex flex-wrap justify-between gap-x-4 py-2.5 text-[0.9375rem]">
                  <span>
                    <span className="block">{x.servicios.map((s) => servicio(s).nombre).join(" + ")}</span>
                    <span className="block text-[0.8125rem] text-pf-humo">
                      {textoFecha(x.inicio.slice(0, 10))}, {profesional(x.profesionalId).nombre}
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums">{x.pago ? pesos(x.pago.total) : "Por cobrar"}</span>
                </li>
              ))}
              {v.length === 0 && <li className="py-3 text-pf-humo">Todavía no ha venido.</li>}
            </ul>
          </section>
        </Punto>
      </div>
    </>
  )
}

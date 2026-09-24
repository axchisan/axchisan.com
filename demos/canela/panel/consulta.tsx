"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Plus, Printer, Trash2 } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { RAIZ } from "../config"
import { profesional, registrarConsulta, servicio, useClinica } from "../estado"
import { CLINICA, claveDia, edad, textoDia, type LineaFormula } from "../modelo"
import { CargandoPanel, EncabezadoPanel, useSesion } from "./marco"

export function NuevaConsulta({ id, citaId }: { id: string; citaId?: string }) {
  return (
    <SoloEnNivel nivel="sistema">
      <Formulario id={id} citaId={citaId} />
    </SoloEnNivel>
  )
}

const campo =
  "mt-1.5 block w-full rounded-[10px] border-2 border-cn-linea bg-white px-3 py-2.5 text-[1rem] outline-none focus:border-cn-collar"

function Formulario({ id, citaId }: { id: string; citaId?: string }) {
  const clinica = useClinica()
  const sesion = useSesion()
  const router = useRouter()
  const cita = clinica?.citas.find((c) => c.id === citaId)

  const [datos, setDatos] = useState(() => ({
    motivo: cita ? [servicio(cita.servicioId).nombre, cita.nota].filter(Boolean).join(". ") : "",
    anamnesis: "",
    examen: "",
    diagnostico: "",
    tratamiento: "",
    peso: "",
  }))
  const [formula, setFormula] = useState<LineaFormula[]>([{ medicamento: "", indicacion: "" }])
  const [error, setError] = useState("")

  if (!clinica || !sesion) return <CargandoPanel />
  const m = clinica.mascotas.find((x) => x.id === id)
  if (!m) return <p className="px-8 py-16">Esta mascota no existe.</p>
  const p = clinica.propietarios.find((x) => x.id === m.propietarioId)!
  const ficha = `${RAIZ}/panel/pacientes/${m.id}`

  if (sesion.rol !== "veterinario") {
    return (
      <div className="px-4 py-16 sm:px-8">
        <p className="max-w-lg text-[1.0625rem]">
          Solo los veterinarios registran consultas. Recepción ve la agenda, los pacientes y los
          recordatorios, pero no puede escribir en la historia clínica.
        </p>
        <Link href={ficha} className="mt-4 inline-block font-bold underline">
          Volver a la ficha de {m.nombre}
        </Link>
      </div>
    )
  }

  const veterinario = cita ? cita.profesionalId : "laura"
  const lineas = formula.filter((f) => f.medicamento.trim())
  const set = (k: keyof typeof datos) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDatos((d) => ({ ...d, [k]: e.target.value }))

  function guardar() {
    if (!datos.motivo.trim() || !datos.diagnostico.trim()) {
      setError("Escribe al menos el motivo y el diagnóstico.")
      return
    }
    const peso = Number(datos.peso.replace(",", "."))
    registrarConsulta({
      mascotaId: m!.id,
      profesionalId: veterinario,
      motivo: datos.motivo.trim(),
      anamnesis: datos.anamnesis.trim(),
      examen: datos.examen.trim(),
      diagnostico: datos.diagnostico.trim(),
      tratamiento: datos.tratamiento.trim(),
      formula: lineas,
      citaId,
      pesoKg: Number.isFinite(peso) ? peso : undefined,
    })
    router.push(ficha)
  }

  return (
    <>
      <div className="print:hidden">
        <EncabezadoPanel
          titulo={`Consulta de ${m.nombre}`}
          detalle={`${textoDia(claveDia(new Date()))}, ${profesional(veterinario).nombre}`}
          accion={
            <Link href={ficha} className="inline-flex items-center gap-1.5 text-[0.9375rem] font-bold hover:underline">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Ficha
            </Link>
          }
        />

        <div className="grid gap-6 px-4 py-6 sm:px-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Punto id="formulario" className="min-w-0">
            <div className="space-y-4 rounded-[14px] bg-white p-5">
              <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
                <label className="block">
                  <span className="font-bold">Motivo de consulta</span>
                  <input value={datos.motivo} onChange={set("motivo")} className={campo} />
                </label>
                <label className="block">
                  <span className="font-bold">Peso (kg)</span>
                  <input value={datos.peso} onChange={set("peso")} inputMode="decimal" placeholder={m.pesos.at(-1)?.kg.toLocaleString("es-CO")} className={campo} />
                </label>
              </div>
              {(
                [
                  ["anamnesis", "Anamnesis", "Qué cuenta el propietario: desde cuándo, qué ha comido, qué cambió."],
                  ["examen", "Examen físico", "Temperatura, frecuencia cardiaca, mucosas, hallazgos."],
                  ["diagnostico", "Diagnóstico", ""],
                  ["tratamiento", "Tratamiento e indicaciones", "Lo que se hizo en consulta y lo que debe hacer en casa."],
                ] as const
              ).map(([k, t, ayuda]) => (
                <label key={k} className="block">
                  <span className="font-bold">{t}</span>
                  <textarea value={datos[k]} onChange={set(k)} rows={k === "diagnostico" ? 2 : 3} placeholder={ayuda} className={campo} />
                </label>
              ))}
            </div>
          </Punto>

          <Punto id="formula" className="min-w-0">
            <div className="rounded-[14px] bg-white p-5">
              <h2 className="text-[1.125rem] font-bold">Fórmula médica</h2>
              <ul className="mt-3 space-y-3">
                {formula.map((f, i) => (
                  <li key={i} className="grid gap-2 rounded-[10px] bg-cn-nube p-3">
                    <div className="flex items-center gap-2">
                      <input
                        aria-label={`Medicamento ${i + 1}`}
                        value={f.medicamento}
                        onChange={(e) => setFormula((xs) => xs.map((x, j) => (j === i ? { ...x, medicamento: e.target.value } : x)))}
                        placeholder="Medicamento y presentación"
                        className={`${campo} mt-0`}
                      />
                      <button
                        type="button"
                        onClick={() => setFormula((xs) => (xs.length > 1 ? xs.filter((_, j) => j !== i) : [{ medicamento: "", indicacion: "" }]))}
                        className="rounded-[8px] p-2 text-cn-pizarra hover:text-cn-coral"
                        aria-label={`Quitar medicamento ${i + 1}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                    <input
                      aria-label={`Indicación del medicamento ${i + 1}`}
                      value={f.indicacion}
                      onChange={(e) => setFormula((xs) => xs.map((x, j) => (j === i ? { ...x, indicacion: e.target.value } : x)))}
                      placeholder="Dosis, frecuencia y duración"
                      className={`${campo} mt-0`}
                    />
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setFormula((xs) => [...xs, { medicamento: "", indicacion: "" }])}
                className="mt-3 inline-flex items-center gap-1.5 text-[0.9375rem] font-bold hover:underline"
              >
                <Plus className="h-4 w-4" aria-hidden />
                Agregar medicamento
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                disabled={lineas.length === 0}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border-2 border-cn-collar font-bold hover:bg-cn-nube disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Printer className="h-4 w-4" aria-hidden />
                Imprimir fórmula
              </button>
            </div>
          </Punto>
        </div>

        <div className="px-4 pb-10 sm:px-8">
          {error && (
            <p role="alert" className="mb-4 font-bold text-cn-coral">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={guardar}
            className="h-12 rounded-[10px] bg-cn-pelota px-8 text-[1rem] font-bold hover:bg-cn-pelota-2"
          >
            Guardar consulta
          </button>
        </div>
      </div>

      {/* Lo único que sale en papel. */}
      <section className="hidden bg-white p-10 font-cn-texto text-black print:block">
        <header className="flex items-start justify-between border-b-2 border-black pb-4">
          <div>
            <p className="text-[1.5rem] font-bold">{CLINICA.nombreCompleto}</p>
            <p className="text-[0.875rem]">
              {CLINICA.direccion}. Tel. {CLINICA.telefono}
            </p>
          </div>
          <p className="text-right text-[0.875rem]">{textoDia(claveDia(new Date()))}</p>
        </header>
        <h1 className="mt-6 text-[1.25rem] font-bold">Fórmula médica veterinaria</h1>
        <p className="mt-3 text-[0.9375rem]">
          Paciente: <strong>{m.nombre}</strong>, {m.especie} {m.raza.toLowerCase()}, {edad(m.nacimiento)}
          {datos.peso ? `, ${datos.peso} kg` : ""}. Propietario: {p.nombre}.
        </p>
        {datos.diagnostico && <p className="mt-1 text-[0.9375rem]">Diagnóstico: {datos.diagnostico}</p>}
        <ol className="mt-6 list-decimal space-y-3 pl-6 text-[1rem]">
          {lineas.map((f, i) => (
            <li key={i}>
              <strong>{f.medicamento}</strong>
              <br />
              {f.indicacion}
            </li>
          ))}
        </ol>
        <footer className="mt-24 w-64 border-t border-black pt-2 text-[0.875rem]">
          {profesional(veterinario).nombre}
          <br />
          {profesional(veterinario).cargo}
        </footer>
        <p className="mt-10 text-[0.75rem]">Documento de ejemplo generado por una demo de Axchi. Clínica ficticia.</p>
      </section>
    </>
  )
}

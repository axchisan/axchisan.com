"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowLeft, CalendarCheck, CalendarPlus, Cat, Check, Dog } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import {
  agendar,
  buscarPorTelefono,
  conArticulo,
  horasLibres,
  profesional,
  servicio as servicioPorId,
  useClinica,
} from "./estado"
import {
  CLINICA,
  claveDia,
  SERVICIOS,
  sumarDias,
  sumarMinutos,
  textoDia,
  textoHora,
  type Cita,
  type Especie,
} from "./modelo"

const PASOS = ["Servicio", "Mascota", "Día y hora", "Confirmar"] as const

type Mascota =
  | { tipo: "existente"; id: string }
  | { tipo: "nueva"; nombre: string; especie: Especie; raza: string }

export function Agendar({ servicioInicial }: { servicioInicial?: string }) {
  const clinica = useClinica()
  const { incluye } = useDemo()

  const [paso, setPaso] = useState(0)
  const [servicioId, setServicioId] = useState(
    SERVICIOS.some((s) => s.id === servicioInicial) ? servicioInicial! : "",
  )
  const [telefono, setTelefono] = useState("")
  const [nombre, setNombre] = useState("")
  const [mascota, setMascota] = useState<Mascota | null>(null)
  const [dia, setDia] = useState("")
  const [profesionalId, setProfesionalId] = useState("")
  const [hora, setHora] = useState<{ inicio: string; profesionalId: string } | null>(null)
  const [nota, setNota] = useState("")
  const [error, setError] = useState("")
  const [cita, setCita] = useState<Cita | null>(null)

  const propietario = clinica ? buscarPorTelefono(clinica, telefono) : null
  const suyas = clinica && propietario ? clinica.mascotas.filter((m) => m.propietarioId === propietario.id) : []

  // Los próximos 14 días con al menos una hora libre para el servicio.
  const dias = useMemo(() => {
    if (!clinica || !servicioId) return []
    const hoy = claveDia(new Date())
    return Array.from({ length: 21 }, (_, i) => sumarDias(hoy, i))
      .map((d) => ({ dia: d, libres: horasLibres(clinica, d, servicioId, profesionalId || undefined) }))
      .filter((d) => d.libres.length > 0)
      .slice(0, 14)
  }, [clinica, servicioId, profesionalId])

  const diaElegido = dias.find((d) => d.dia === dia) ?? dias[0]

  if (!clinica) return <div className="min-h-[60vh]" aria-busy="true" />

  const servicio = servicioId ? servicioPorId(servicioId) : null
  const nombreMascota =
    mascota?.tipo === "existente"
      ? clinica.mascotas.find((m) => m.id === mascota.id)?.nombre
      : mascota?.nombre

  function continuar() {
    setError("")
    if (paso === 0 && !servicioId) return setError("Elige un servicio para continuar.")
    if (paso === 1) {
      if (telefono.replace(/\D/g, "").length < 10) return setError("Escribe tu celular de 10 dígitos.")
      if (!propietario && nombre.trim().length < 3) return setError("Escribe tu nombre.")
      if (!mascota) return setError("Elige tu mascota o registra una nueva.")
      if (mascota.tipo === "nueva" && mascota.nombre.trim().length < 2)
        return setError("Escribe el nombre de tu mascota.")
    }
    if (paso === 2 && !hora) return setError("Elige una hora.")
    setPaso((p) => p + 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function confirmar() {
    if (!servicio || !hora || !mascota) return
    const base = {
      servicioId: servicio.id,
      profesionalId: hora.profesionalId,
      inicio: hora.inicio,
      nota,
      origen: "web" as const,
    }
    const nueva =
      mascota.tipo === "existente"
        ? agendar({ ...base, mascotaId: mascota.id })
        : agendar({
            ...base,
            nuevaMascota: { nombre: mascota.nombre, especie: mascota.especie, raza: mascota.raza },
            propietario: { id: propietario?.id, nombre, telefono },
          })
    setCita(nueva)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (cita && servicio) {
    return (
      <Confirmada
        cita={cita}
        nombreMascota={nombreMascota ?? ""}
        conPanel={incluye("citas")}
      />
    )
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-6 pb-20 sm:px-6 lg:grid-cols-12 lg:pt-12">
      {/* min-w-0: sin él, la franja de días desplazable ensancha la columna y
          con ella toda la página en el celular. */}
      <div className="min-w-0 lg:col-span-8">
        <Link href={RAIZ} className="inline-flex items-center gap-1.5 text-[0.9375rem] hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver a Canela
        </Link>
        <h1 className="mt-4 font-cn-titulo text-[2.4375rem] leading-[1.05] font-extrabold tracking-[-0.035em]">
          Agenda tu cita
        </h1>

        <Punto id="pasos" className="mt-6">
          <ol className="flex gap-2" aria-label="Pasos">
            {PASOS.map((p, i) => (
              <li key={p} className="flex-1">
                <span
                  className={`block h-1.5 rounded-full ${i <= paso ? "bg-cn-collar" : "bg-cn-linea"}`}
                  aria-hidden
                />
                <span
                  className={`mt-2 block text-[0.8125rem] sm:text-[0.9375rem] ${i === paso ? "font-bold" : "text-cn-pizarra"}`}
                  aria-current={i === paso ? "step" : undefined}
                >
                  {i + 1}. {p}
                </span>
              </li>
            ))}
          </ol>
        </Punto>

        <div className="mt-10">
          {paso === 0 && (
            <fieldset>
              <legend className="font-cn-titulo text-[1.5625rem] font-bold">¿Qué necesita tu mascota?</legend>
              <div className="mt-5 grid gap-3">
                {SERVICIOS.map((s) => (
                  <label
                    key={s.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-[16px] border-2 bg-white p-4 transition-colors ${
                      servicioId === s.id ? "border-cn-collar" : "border-transparent hover:border-cn-linea"
                    }`}
                  >
                    <input
                      type="radio"
                      name="servicio"
                      value={s.id}
                      checked={servicioId === s.id}
                      onChange={() => {
                        setServicioId(s.id)
                        setHora(null)
                        setProfesionalId("")
                      }}
                      className="h-5 w-5 accent-cn-collar"
                    />
                    <span className="flex-1">
                      <span className="block text-[1.0625rem] font-bold">{s.nombre}</span>
                      <span className="block text-[0.9375rem] text-cn-pizarra">{s.descripcion}</span>
                    </span>
                    <span className="text-right text-[1rem] font-bold tabular-nums">
                      {s.desde && <span className="block text-[0.8125rem] font-normal">desde</span>}
                      {pesos(s.precio)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {paso === 1 && (
            <div>
              <h2 className="font-cn-titulo text-[1.5625rem] font-bold">¿Para quién es la cita?</h2>
              <Punto id="telefono" className="mt-5">
                <label className="block">
                  <span className="text-[1rem] font-bold">Tu celular</span>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={telefono}
                    onChange={(e) => {
                      setTelefono(e.target.value)
                      setMascota(null)
                    }}
                    placeholder="300 000 0000"
                    className="mt-2 block h-12 w-full max-w-sm rounded-[12px] border-2 border-cn-linea bg-white px-4 text-[1.0625rem] outline-none focus:border-cn-collar"
                  />
                </label>
              </Punto>

              {propietario ? (
                <fieldset className="mt-8">
                  <legend className="text-[1.0625rem]">
                    Hola, <strong>{propietario.nombre.split(" ")[0]}</strong>. ¿Para cuál de tus mascotas?
                  </legend>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {suyas.map((m) => (
                      <OpcionMascota
                        key={m.id}
                        activa={mascota?.tipo === "existente" && mascota.id === m.id}
                        onClick={() => setMascota({ tipo: "existente", id: m.id })}
                        especie={m.especie}
                      >
                        {m.nombre}
                      </OpcionMascota>
                    ))}
                    <OpcionMascota
                      activa={mascota?.tipo === "nueva"}
                      onClick={() => setMascota({ tipo: "nueva", nombre: "", especie: "perro", raza: "" })}
                    >
                      Otra mascota
                    </OpcionMascota>
                  </div>
                </fieldset>
              ) : (
                telefono.replace(/\D/g, "").length >= 10 && (
                  <div className="mt-8">
                    <p className="text-[1rem] text-cn-pizarra">Es tu primera vez en Canela. Bienvenido.</p>
                    <label className="mt-4 block">
                      <span className="text-[1rem] font-bold">Tu nombre</span>
                      <input
                        value={nombre}
                        onChange={(e) => {
                          setNombre(e.target.value)
                          if (!mascota) setMascota({ tipo: "nueva", nombre: "", especie: "perro", raza: "" })
                        }}
                        autoComplete="name"
                        className="mt-2 block h-12 w-full max-w-sm rounded-[12px] border-2 border-cn-linea bg-white px-4 text-[1.0625rem] outline-none focus:border-cn-collar"
                      />
                    </label>
                  </div>
                )
              )}

              {mascota?.tipo === "nueva" && (
                <div className="mt-8 grid max-w-xl gap-5 sm:grid-cols-2">
                  <fieldset className="sm:col-span-2">
                    <legend className="text-[1rem] font-bold">Es un</legend>
                    <div className="mt-2 flex gap-3">
                      {(["perro", "gato"] as const).map((e) => (
                        <OpcionMascota
                          key={e}
                          especie={e}
                          activa={mascota.especie === e}
                          onClick={() => setMascota({ ...mascota, especie: e })}
                        >
                          {e === "perro" ? "Perro" : "Gato"}
                        </OpcionMascota>
                      ))}
                    </div>
                  </fieldset>
                  <label className="block">
                    <span className="text-[1rem] font-bold">Nombre de tu mascota</span>
                    <input
                      value={mascota.nombre}
                      onChange={(e) => setMascota({ ...mascota, nombre: e.target.value })}
                      className="mt-2 block h-12 w-full rounded-[12px] border-2 border-cn-linea bg-white px-4 text-[1.0625rem] outline-none focus:border-cn-collar"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[1rem] font-bold">
                      Raza <span className="font-normal text-cn-pizarra">(si la sabes)</span>
                    </span>
                    <input
                      value={mascota.raza}
                      onChange={(e) => setMascota({ ...mascota, raza: e.target.value })}
                      className="mt-2 block h-12 w-full rounded-[12px] border-2 border-cn-linea bg-white px-4 text-[1.0625rem] outline-none focus:border-cn-collar"
                    />
                  </label>
                </div>
              )}
            </div>
          )}

          {paso === 2 && servicio && (
            <Punto id="horas">
              <h2 className="font-cn-titulo text-[1.5625rem] font-bold">¿Cuándo te queda bien?</h2>

              {servicio.profesionales.length > 1 && (
                <label className="mt-5 block max-w-sm">
                  <span className="text-[1rem] font-bold">Con quién</span>
                  <select
                    value={profesionalId}
                    onChange={(e) => {
                      setProfesionalId(e.target.value)
                      setHora(null)
                    }}
                    className="mt-2 block h-12 w-full rounded-[12px] border-2 border-cn-linea bg-white px-3 text-[1.0625rem] outline-none focus:border-cn-collar"
                  >
                    <option value="">Con quien esté disponible</option>
                    {servicio.profesionales.map((p) => (
                      <option key={p} value={p}>
                        {profesional(p).nombre}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div className="-mx-4 mt-6 overflow-x-auto px-4 pb-2">
                <div className="flex gap-2" role="radiogroup" aria-label="Día">
                  {dias.map((d) => {
                    const f = new Date(`${d.dia}T12:00`)
                    const activo = diaElegido?.dia === d.dia
                    return (
                      <button
                        key={d.dia}
                        type="button"
                        role="radio"
                        aria-checked={activo}
                        aria-label={textoDia(d.dia)}
                        onClick={() => {
                          setDia(d.dia)
                          setHora(null)
                        }}
                        className={`flex w-[68px] shrink-0 flex-col items-center rounded-[14px] border-2 py-2.5 ${
                          activo ? "border-cn-collar bg-cn-collar text-white" : "border-cn-linea bg-white"
                        }`}
                      >
                        <span className="text-[0.8125rem] capitalize">
                          {f.toLocaleDateString("es-CO", { weekday: "short" }).replace(".", "")}
                        </span>
                        <span className="font-cn-titulo text-[1.5625rem] leading-tight font-bold">{f.getDate()}</span>
                        <span className="text-[0.75rem] capitalize">
                          {f.toLocaleDateString("es-CO", { month: "short" }).replace(".", "")}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {diaElegido && (
                <div className="mt-6">
                  <p className="text-[1rem] font-bold">{textoDia(diaElegido.dia)}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5" role="radiogroup" aria-label="Hora">
                    {diaElegido.libres.map((h) => {
                      const activo = hora?.inicio === h.inicio
                      return (
                        <button
                          key={h.inicio}
                          type="button"
                          role="radio"
                          aria-checked={activo}
                          onClick={() => setHora({ inicio: h.inicio, profesionalId: h.profesionales[0] })}
                          className={`h-11 rounded-[10px] border-2 text-[0.9375rem] font-bold tabular-nums ${
                            activo ? "border-cn-collar bg-cn-pelota" : "border-cn-linea bg-white hover:border-cn-collar"
                          }`}
                        >
                          {textoHora(h.inicio)}
                        </button>
                      )
                    })}
                  </div>
                  {hora && (
                    <p className="mt-4 text-[0.9375rem] text-cn-pizarra">
                      Te atiende {conArticulo(hora.profesionalId)}.
                    </p>
                  )}
                </div>
              )}
            </Punto>
          )}

          {paso === 3 && servicio && hora && (
            <div>
              <h2 className="font-cn-titulo text-[1.5625rem] font-bold">Revisa y confirma</h2>
              <label className="mt-6 block max-w-xl">
                <span className="text-[1rem] font-bold">
                  ¿Algo que debamos saber? <span className="font-normal text-cn-pizarra">(opcional)</span>
                </span>
                <textarea
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  rows={3}
                  placeholder="Por ejemplo: vomitó dos veces esta mañana."
                  className="mt-2 block w-full rounded-[12px] border-2 border-cn-linea bg-white p-4 text-[1.0625rem] outline-none focus:border-cn-collar"
                />
              </label>
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-6 font-bold text-cn-coral">
            {error}
          </p>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          {paso > 0 && (
            <button
              type="button"
              onClick={() => {
                setError("")
                setPaso((p) => p - 1)
              }}
              className="inline-flex h-12 items-center rounded-full border-2 border-cn-collar px-6 font-bold hover:bg-white"
            >
              Atrás
            </button>
          )}
          {paso < 3 ? (
            <button
              type="button"
              onClick={continuar}
              className="inline-flex h-12 items-center rounded-full bg-cn-collar px-7 font-bold text-white hover:bg-cn-collar-2"
            >
              Continuar
            </button>
          ) : (
            <button
              type="button"
              onClick={confirmar}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-cn-pelota px-7 font-bold hover:bg-cn-pelota-2"
            >
              <Check className="h-5 w-5" aria-hidden />
              Confirmar cita
            </button>
          )}
        </div>
      </div>

      {/* Resumen: acompaña todo el proceso. */}
      <aside className="min-w-0 lg:col-span-4 lg:pt-[7.5rem]">
        <div className="rounded-[20px] bg-white p-6 lg:sticky lg:top-24">
          <h2 className="font-cn-titulo text-[1.25rem] font-bold">Tu cita</h2>
          <dl className="mt-4 space-y-3 text-[0.9375rem]">
            <Fila etiqueta="Servicio" valor={servicio?.nombre} />
            <Fila etiqueta="Mascota" valor={nombreMascota || undefined} />
            <Fila etiqueta="Día" valor={hora ? textoDia(hora.inicio.slice(0, 10)) : undefined} />
            <Fila etiqueta="Hora" valor={hora ? textoHora(hora.inicio) : undefined} />
            <Fila etiqueta="Con" valor={hora ? profesional(hora.profesionalId).nombre : undefined} />
            {servicio && (
              <Fila
                etiqueta="Valor"
                valor={`${servicio.desde ? "desde " : ""}${pesos(servicio.precio)}`}
              />
            )}
          </dl>
          <p className="mt-5 border-t border-cn-linea pt-4 text-[0.8125rem] leading-relaxed text-cn-pizarra">
            Se paga en la clínica. Si no puedes venir, avísanos por WhatsApp para liberar la hora.
          </p>
        </div>
      </aside>
    </div>
  )
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-cn-pizarra">{etiqueta}</dt>
      <dd className={`text-right ${valor ? "font-bold" : "text-cn-pizarra"}`}>{valor ?? "Por elegir"}</dd>
    </div>
  )
}

function OpcionMascota({
  children,
  activa,
  onClick,
  especie,
}: {
  children: React.ReactNode
  activa: boolean
  onClick: () => void
  especie?: Especie
}) {
  const Icono = especie === "gato" ? Cat : especie === "perro" ? Dog : null
  return (
    <button
      type="button"
      aria-pressed={activa}
      onClick={onClick}
      className={`inline-flex h-12 items-center gap-2 rounded-full border-2 px-5 text-[1rem] font-bold ${
        activa ? "border-cn-collar bg-cn-collar text-white" : "border-cn-linea bg-white hover:border-cn-collar"
      }`}
    >
      {Icono && <Icono className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
      {children}
    </button>
  )
}

// ─── Confirmación ────────────────────────────────────────────────────────

function ics(cita: Cita, mascota: string) {
  const s = servicioPorId(cita.servicioId)
  const fmt = (clave: string) => clave.replace(/[-:]/g, "") + "00"
  const sello = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z"
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Canela (demo de Axchi)//ES",
    "BEGIN:VEVENT",
    `UID:${cita.id}@canela.example`,
    `DTSTAMP:${sello}`,
    `DTSTART:${fmt(cita.inicio)}`,
    `DTEND:${fmt(sumarMinutos(cita.inicio, s.duracionMin))}`,
    `SUMMARY:${s.nombre} de ${mascota} en Canela`,
    `LOCATION:${CLINICA.direccion}`,
    `DESCRIPTION:Con ${profesional(cita.profesionalId).nombre}. Demo de Axchi con un negocio ficticio.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
}

function Confirmada({ cita, nombreMascota, conPanel }: { cita: Cita; nombreMascota: string; conPanel: boolean }) {
  const s = servicioPorId(cita.servicioId)
  const enlaceIcs = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics(cita, nombreMascota))}`

  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 pb-24 sm:px-6 lg:pt-16">
      <Punto id="confirmacion">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cn-pelota">
          <CalendarCheck className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="mt-6 font-cn-titulo text-[2.4375rem] leading-[1.05] font-extrabold tracking-[-0.035em]">
          Listo, {nombreMascota} tiene cita.
        </h1>
        <p className="mt-4 text-[1.125rem] leading-relaxed text-cn-pizarra">
          {s.nombre}, {textoDia(cita.inicio.slice(0, 10)).toLowerCase()} a las {textoHora(cita.inicio)}, con{" "}
          {conArticulo(cita.profesionalId)}. Te escribimos por WhatsApp un día antes para
          recordártela.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={enlaceIcs}
            download="cita-canela.ics"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-cn-pelota px-6 font-bold hover:bg-cn-pelota-2"
          >
            <CalendarPlus className="h-5 w-5" aria-hidden />
            Agregar a mi calendario
          </a>
          <Link
            href={RAIZ}
            className="inline-flex h-12 items-center rounded-full border-2 border-cn-collar px-6 font-bold hover:bg-white"
          >
            Volver al inicio
          </Link>
        </div>
      </Punto>

      {conPanel && (
        <div className="mt-12 rounded-[16px] border-2 border-dashed border-cn-collar/30 p-5 font-sans">
          <p className="text-[0.9375rem] font-bold">Del lado de la clínica</p>
          <p className="mt-1 text-[0.9375rem] leading-relaxed text-cn-pizarra">
            La cita ya está en la agenda, marcada como agendada desde la página.
          </p>
          <Link href={`${RAIZ}/panel/agenda?dia=${cita.inicio.slice(0, 10)}`} className="mt-3 inline-block font-bold underline">
            Verla en el panel
          </Link>
        </div>
      )}
    </div>
  )
}

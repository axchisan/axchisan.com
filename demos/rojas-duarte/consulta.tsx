"use client"

import { useRef, useState, type FormEvent } from "react"
import { CircleCheck, Mail } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { celularValido, correoValido, radicado, textoCelular, validar, type Errores } from "@/demos/motores/presencia/formulario"
import { pesos } from "@/lib/catalogo/planes"
import { AREAS, EMPRESA, area as buscarArea, persona } from "./modelo"
import { BotonWhatsappFirma, botonBorde, botonVino, campo } from "./publico"

type Valores = {
  area: string
  tipo: "persona" | "empresa"
  caso: string
  nombre: string
  celular: string
  correo: string
  modalidad: "oficina" | "videollamada"
  autorizo: boolean
}
type Campo = "area" | "caso" | "nombre" | "celular" | "correo" | "autorizo"

const MINIMO_CASO = 30

const REGLAS = {
  area: (v: Valores) => (!v.area ? "Elija el área, o «No estoy seguro»." : undefined),
  caso: (v: Valores) =>
    v.caso.trim().length < MINIMO_CASO ? `Cuéntenos un poco más: al menos ${MINIMO_CASO} caracteres, para llegar a la llamada sabiendo de qué se trata.` : undefined,
  nombre: (v: Valores) => (v.nombre.trim().split(/\s+/).length < 2 ? "Escriba su nombre y apellido." : undefined),
  celular: (v: Valores) => (!celularValido(v.celular) ? "Escriba un celular de diez dígitos que empiece por 3." : undefined),
  correo: (v: Valores) => (!correoValido(v.correo) ? "Escriba un correo como nombre@correo.com." : undefined),
  autorizo: (v: Valores) => (!v.autorizo ? "Para responderle necesitamos su autorización para tratar estos datos." : undefined),
}

const ETIQUETAS: Record<Campo, string> = {
  area: "Área",
  caso: "Su caso",
  nombre: "Nombre",
  celular: "Celular",
  correo: "Correo",
  autorizo: "Autorización de datos",
}

type Enviada = Valores & { radicado: string; fecha: Date }

export function FormularioConsulta({ areaInicial }: { areaInicial?: string }) {
  const [v, setV] = useState<Valores>({
    area: areaInicial && buscarArea(areaInicial) ? areaInicial : "",
    tipo: "persona",
    caso: "",
    nombre: "",
    celular: "",
    correo: "",
    modalidad: "oficina",
    autorizo: false,
  })
  const [errores, setErrores] = useState<Errores<Campo>>({})
  const [enviada, setEnviada] = useState<Enviada | null>(null)
  const resumen = useRef<HTMLDivElement>(null)
  const confirmacion = useRef<HTMLDivElement>(null)

  const cambiar = <K extends keyof Valores>(k: K, x: Valores[K]) => setV((p) => ({ ...p, [k]: x }))

  function enviar(e: FormEvent) {
    e.preventDefault()
    const errs = validar(v, REGLAS)
    setErrores(errs)
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => resumen.current?.focus())
      return
    }
    const fecha = new Date()
    setEnviada({ ...v, radicado: radicado("RD", fecha), fecha })
    requestAnimationFrame(() => {
      confirmacion.current?.focus()
      confirmacion.current?.scrollIntoView({ block: "start" })
    })
  }

  if (enviada) return <Confirmacion ref={confirmacion} c={enviada} otra={() => {
    setEnviada(null)
    setV((p) => ({ ...p, caso: "" }))
  }} />

  const campos = Object.keys(errores) as Campo[]
  const aria = (c: Campo) => ({ "aria-invalid": errores[c] ? true : undefined, "aria-describedby": errores[c] ? `${c}-error` : undefined })
  const error = (c: Campo) =>
    errores[c] && (
      <p id={`${c}-error`} className="mt-1.5 text-[0.9375rem] font-medium text-rd-vino">
        {errores[c]}
      </p>
    )

  return (
    <form onSubmit={enviar} noValidate className="space-y-7">
      {campos.length > 0 && (
        <div ref={resumen} tabIndex={-1} role="alert" className="rounded-[2px] border-l-2 border-rd-vino bg-rd-vino-suave p-5 outline-none">
          <p className="font-semibold text-rd-vino">{campos.length === 1 ? "Falta un dato" : `Faltan ${campos.length} datos`}</p>
          <ul className="mt-2 space-y-1 text-[0.9375rem]">
            {campos.map((c) => (
              <li key={c}>
                <a href={`#${c}`} className="text-rd-vino underline underline-offset-4">
                  {ETIQUETAS[c]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Punto id="formulario">
        <div className="space-y-7">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="area" className="font-semibold">
                Área
              </label>
              <select id="area" value={v.area} onChange={(e) => cambiar("area", e.target.value)} className={`${campo} h-12`} {...aria("area")}>
                <option value="">Elija una</option>
                {AREAS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
                <option value="no-se">No estoy seguro</option>
              </select>
              {error("area")}
            </div>
            <fieldset>
              <legend className="font-semibold">Consulta como</legend>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {(["persona", "empresa"] as const).map((t) => (
                  <label key={t} className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[3px] border border-rd-gris/50 bg-white has-[:checked]:border-rd-vino has-[:checked]:bg-rd-vino-suave has-[:checked]:font-semibold has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-rd-vino">
                    <input type="radio" name="tipo" className="sr-only" checked={v.tipo === t} onChange={() => cambiar("tipo", t)} />
                    {t === "persona" ? "Persona" : "Empresa"}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div>
            <label htmlFor="caso" className="font-semibold">
              Su caso
            </label>
            <p className="text-[0.875rem] text-rd-gris">Qué pasó, desde cuándo y qué le gustaría lograr. No hace falta usar términos legales.</p>
            <textarea id="caso" rows={5} value={v.caso} onChange={(e) => cambiar("caso", e.target.value)} className={`${campo} py-3 leading-relaxed`} {...aria("caso")} />
            <p className="mt-1 text-right text-[0.8125rem] text-rd-gris" aria-hidden>
              {v.caso.trim().length} caracteres
            </p>
            {error("caso")}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="nombre" className="font-semibold">
                Nombre y apellido
              </label>
              <input id="nombre" autoComplete="name" value={v.nombre} onChange={(e) => cambiar("nombre", e.target.value)} className={`${campo} h-12`} {...aria("nombre")} />
              {error("nombre")}
            </div>
            <div>
              <label htmlFor="celular" className="font-semibold">
                Celular
              </label>
              <input id="celular" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="300 123 4567" value={v.celular} onChange={(e) => cambiar("celular", e.target.value)} className={`${campo} h-12`} {...aria("celular")} />
              {error("celular")}
            </div>
            <div>
              <label htmlFor="correo" className="font-semibold">
                Correo
              </label>
              <input id="correo" type="email" autoComplete="email" value={v.correo} onChange={(e) => cambiar("correo", e.target.value)} className={`${campo} h-12`} {...aria("correo")} />
              {error("correo")}
            </div>
          </div>

          <fieldset>
            <legend className="font-semibold">¿Cómo prefiere la primera consulta?</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["oficina", "En la oficina de Chapinero"],
                  ["videollamada", "Por videollamada"],
                ] as const
              ).map(([m, t]) => (
                <label key={m} className="flex cursor-pointer items-center gap-3 rounded-[3px] border border-rd-gris/50 bg-white px-4 py-3 has-[:checked]:border-rd-vino has-[:checked]:bg-rd-vino-suave has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-rd-vino">
                  <input type="radio" name="modalidad" checked={v.modalidad === m} onChange={() => cambiar("modalidad", m)} className="h-4 w-4 accent-rd-vino" />
                  {t}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label className="flex cursor-pointer gap-3">
              <input id="autorizo" type="checkbox" checked={v.autorizo} onChange={(e) => cambiar("autorizo", e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-rd-vino" {...aria("autorizo")} />
              <span className="text-[0.9375rem] leading-relaxed">
                Autorizo a {EMPRESA.nombre} a usar estos datos para responder mi consulta, según la Ley 1581 de 2012. Lo que cuente aquí queda bajo secreto profesional.
              </span>
            </label>
            {error("autorizo")}
          </div>
        </div>
      </Punto>

      <button type="submit" className={`${botonVino} w-full sm:w-auto`}>
        Enviar la consulta
      </button>
    </form>
  )
}

const formatoFecha = new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" })

function Confirmacion({ c, otra, ref }: { c: Enviada; otra: () => void; ref: React.Ref<HTMLDivElement> }) {
  const a = buscarArea(c.area)
  const responsable = a ? persona(a.responsable) : null
  const primerNombre = c.nombre.trim().split(/\s+/)[0]
  return (
    <div className="space-y-10">
      <div ref={ref} tabIndex={-1} className="scroll-mt-20 outline-none">
        <CircleCheck className="h-10 w-10 text-rd-exito" aria-hidden />
        <h2 className="mt-4 font-rd-titulo text-[2.25rem] leading-tight">Recibimos su consulta, {primerNombre}</h2>
        <p className="mt-3 text-[1.0625rem] leading-relaxed text-rd-gris">
          Su número de radicado es <strong className="font-semibold text-rd-tinta">{c.radicado}</strong>. {responsable ? `${responsable.nombre} la revisa` : "La revisamos"} y le escribimos al {textoCelular(c.celular)} antes de que termine el siguiente día hábil, con la fecha para la consulta de {EMPRESA.consultaMin} minutos ({pesos(EMPRESA.consulta)}).
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <BotonWhatsappFirma mensaje={`Hola, Rojas & Duarte. Les escribo por la consulta ${c.radicado}.`} className={botonVino}>
            Escribir por WhatsApp
          </BotonWhatsappFirma>
          <button type="button" onClick={otra} className={botonBorde}>
            Enviar otra consulta
          </button>
        </div>
      </div>

      <Punto id="correo">
        <section aria-labelledby="correo-titulo" className="rounded-[2px] bg-white ring-1 ring-rd-linea">
          <h3 id="correo-titulo" className="flex items-center gap-2 border-b border-rd-linea px-5 py-3 text-[0.9375rem] font-semibold">
            <Mail className="h-4 w-4 text-rd-vino" aria-hidden />
            Así le llega a la firma
          </h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 px-5 py-4 text-[0.9375rem]">
            <dt className="text-rd-gris">Para</dt>
            <dd>{EMPRESA.correo}</dd>
            <dt className="text-rd-gris">Asunto</dt>
            <dd className="font-semibold">
              {c.radicado}: {a?.nombre ?? "Área por definir"}, {c.tipo === "empresa" ? "empresa" : "persona"}
            </dd>
            <dt className="text-rd-gris">Recibida</dt>
            <dd>{formatoFecha.format(c.fecha)}</dd>
          </dl>
          <div className="border-t border-rd-linea px-5 py-4 text-[0.9375rem] leading-relaxed">
            <p>
              <strong className="font-semibold">{c.nombre.trim()}</strong>, {textoCelular(c.celular)}, {c.correo.trim()}
            </p>
            <p className="mt-1 text-rd-gris">Prefiere {c.modalidad === "oficina" ? "venir a la oficina" : "videollamada"}. Asignada a {responsable?.nombre ?? "recepción, para clasificar"}.</p>
            <blockquote className="mt-3 border-l-2 border-rd-linea pl-4 whitespace-pre-line">{c.caso.trim()}</blockquote>
          </div>
        </section>
      </Punto>
    </div>
  )
}

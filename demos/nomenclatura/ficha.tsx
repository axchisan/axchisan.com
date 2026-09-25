"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { CalendarCheck, Check, MessageCircle } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { claveDia, sumarDias, textoDia, textoHora } from "@/demos/motores/agenda/tiempo"
import { cuotaMensual, ingresosNecesarios } from "@/demos/motores/listados/listados"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import { horasVisita, registrarInteres, useInmobiliaria, vigente } from "./estado"
import { asesor, TASA_REFERENCIA, type Inmueble } from "./modelo"
import { BotonWhatsappInmobiliaria, botonBorde, botonPetroleo, campo, MapaValle, precioTexto } from "./publico"

const CORTO = new Intl.DateTimeFormat("es-CO", { weekday: "short" })

export function FichaInmueble({ inmueble }: { inmueble: Inmueble }) {
  const e = useInmobiliaria()
  const x = vigente(e, inmueble)
  const [foto, setFoto] = useState(0)
  const a = asesor(x.asesorId)
  const cerrado = x.estado !== "disponible"

  const datos: [string, string][] = [
    ["Área", `${x.area} m²`],
    ["Alcobas", String(x.habitaciones)],
    ["Baños", String(x.banos)],
    ["Parqueaderos", x.parqueaderos ? String(x.parqueaderos) : "No tiene"],
    ["Estrato", String(x.estrato)],
    ["Administración", x.administracion ? `${pesos(x.administracion)} al mes` : "Incluida o no aplica"],
    ["Piso", x.piso ? String(x.piso) : "Casa"],
    ["Antigüedad", x.antiguedad === 0 ? "Para estrenar" : `${x.antiguedad} años`],
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-20 sm:px-6">
      <p className="text-[0.9375rem] text-nm-gris">
        <Link href={`${RAIZ}/inmuebles?operacion=${x.operacion}`} className="underline underline-offset-4 hover:text-nm-tinta">
          {x.operacion === "venta" ? "Venta" : "Arriendo"}
        </Link>{" "}
        / {x.zona} / Código {x.codigo}
      </p>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="relative aspect-[3/2] overflow-hidden rounded-[8px] bg-nm-linea">
            <Image key={foto} src={x.fotos[foto].src} alt={x.fotos[foto].alt} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
          </div>
          <div className="mt-3 flex gap-3" role="group" aria-label="Fotos">
            {x.fotos.map((f, i) => (
              <button key={f.src} type="button" aria-pressed={foto === i} onClick={() => setFoto(i)} className={`relative h-20 w-28 overflow-hidden rounded-[6px] ring-2 ${foto === i ? "ring-nm-petroleo" : "ring-transparent hover:ring-nm-linea"}`}>
                <Image src={f.src} alt={f.alt} fill sizes="112px" className="object-cover" />
              </button>
            ))}
          </div>

          <h1 className="mt-8 text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.03em]">{x.titulo}</h1>
          <p className="mt-2 text-nm-gris">
            {x.barrio}, {x.zona}
          </p>
          <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-relaxed">{x.descripcion}</p>

          <Punto id="datos" className="mt-8">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[8px] bg-nm-linea ring-1 ring-nm-linea sm:grid-cols-4">
              {datos.map(([t, v]) => (
                <div key={t} className="bg-white p-4">
                  <dt className="text-[0.8125rem] text-nm-gris">{t}</dt>
                  <dd className="mt-0.5 font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </Punto>

          <h2 className="mt-10 text-[1.25rem] font-bold">Lo que tiene</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {x.caracteristicas.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-nm-petroleo" aria-hidden />
                {c}
              </li>
            ))}
          </ul>

          <Punto id="credito" className="mt-10">
            {x.operacion === "venta" ? <Simulador precio={x.precio} /> : <CostosArriendo canon={x.precio} administracion={x.administracion} />}
          </Punto>
        </div>

        <aside aria-label="Contacto" className="space-y-5 lg:sticky lg:top-16 lg:self-start">
          <div className="rounded-[8px] bg-white p-5 ring-1 ring-nm-linea">
            <p className="text-[2rem] leading-none font-extrabold tracking-[-0.02em]">{precioTexto(x)}</p>
            {x.administracion > 0 && <p className="mt-1 text-[0.9375rem] text-nm-gris">Más {pesos(x.administracion)} de administración</p>}
            {cerrado && (
              <p className="mt-3 rounded-[6px] bg-nm-alerta-suave px-3 py-2 font-semibold text-nm-alerta">
                {x.estado === "reservado" ? "Reservado: hay una oferta en curso." : x.operacion === "venta" ? "Este inmueble ya se vendió." : "Este inmueble ya se arrendó."}
              </p>
            )}
            <div className="mt-5 flex items-center gap-3 border-t border-nm-linea pt-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-nm-agua-suave font-bold text-nm-petroleo" aria-hidden>
                {a.iniciales}
              </span>
              <span>
                <span className="block font-semibold">{a.nombre}</span>
                <span className="text-[0.875rem] text-nm-gris">Atiende {a.zonas}</span>
              </span>
            </div>
            <Punto id="visita" className="mt-5">
              {!cerrado && <Contacto x={x} />}
            </Punto>
          </div>
          <div className="aspect-square overflow-hidden rounded-[8px] ring-1 ring-nm-linea">
            <MapaValle inmuebles={[x]} activo={x.id} />
          </div>
        </aside>
      </div>
    </div>
  )
}

/** Según el plan: WhatsApp, formulario de interés o visita agendada en línea. */
function Contacto({ x }: { x: Inmueble }) {
  const { incluye } = useDemo()
  const e = useInmobiliaria()
  const [dia, setDia] = useState<string | null>(null)
  const [hora, setHora] = useState<string | null>(null)
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [error, setError] = useState("")
  const [listo, setListo] = useState<{ inicio?: string } | null>(null)

  const dias = useMemo(() => {
    if (!e) return []
    const hoy = claveDia(new Date())
    return Array.from({ length: 10 }, (_, i) => sumarDias(hoy, i))
      .map((d) => ({ dia: d, horas: horasVisita(e, d, x) }))
      .filter((d) => d.horas.length > 0)
      .slice(0, 6)
  }, [e, x])

  if (!incluye("panel")) {
    return (
      <BotonWhatsappInmobiliaria mensaje={`Hola, Nomenclatura. Me interesa el inmueble ${x.codigo}, ${x.titulo.toLowerCase()}. ¿Cuándo lo puedo ver?`} className={`${botonPetroleo} w-full`}>
        <MessageCircle className="h-5 w-5" aria-hidden />
        Preguntar por WhatsApp
      </BotonWhatsappInmobiliaria>
    )
  }

  if (listo) {
    return (
      <div role="status" className="rounded-[6px] bg-nm-exito-suave p-4 text-nm-exito">
        <p className="flex items-center gap-2 font-semibold">
          <CalendarCheck className="h-5 w-5" aria-hidden />
          {listo.inicio ? "Visita agendada" : "Recibimos tus datos"}
        </p>
        <p className="mt-1 text-[0.9375rem]">
          {listo.inicio
            ? `Te enviamos la dirección exacta por WhatsApp. Te esperamos el ${textoDia(listo.inicio.slice(0, 10)).toLowerCase()} a las ${textoHora(listo.inicio)}`
            : "Te escribimos por WhatsApp hoy mismo, en horario de oficina."}
        </p>
        <Link href={`${RAIZ}/panel/${listo.inicio ? "visitas" : "interesados"}`} className="mt-2 inline-block text-[0.9375rem] font-semibold underline underline-offset-4">
          Verlo en el panel
        </Link>
      </div>
    )
  }

  const conVisita = incluye("sistema")
  const diaActual = dia ?? dias[0]?.dia
  const horas = dias.find((d) => d.dia === diaActual)?.horas ?? []

  return (
    <form
      noValidate
      onSubmit={(ev) => {
        ev.preventDefault()
        setError("")
        if (conVisita && !hora) return setError("Elige una hora para la visita.")
        if (nombre.trim().length < 3) return setError("Escribe tu nombre.")
        const d = telefono.replace(/\D/g, "")
        if (d.length !== 10 || !d.startsWith("3")) return setError("Escribe un celular de 10 dígitos que empiece por 3.")
        const { visita } = registrarInteres({ inmuebleId: x.id, nombre, telefono, inicio: conVisita ? hora! : undefined, asesorId: x.asesorId })
        setListo({ inicio: visita?.inicio })
      }}
    >
      {conVisita && (
        <fieldset>
          <legend className="font-semibold">Agenda una visita</legend>
          <div role="radiogroup" aria-label="Día de la visita" className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
            {dias.map((d) => (
              <button
                key={d.dia}
                type="button"
                role="radio"
                aria-checked={diaActual === d.dia}
                aria-label={textoDia(d.dia)}
                onClick={() => {
                  setDia(d.dia)
                  setHora(null)
                }}
                className={`flex w-14 shrink-0 flex-col items-center rounded-[6px] border py-1.5 ${diaActual === d.dia ? "border-nm-petroleo bg-nm-petroleo text-white" : "border-nm-linea hover:border-nm-petroleo"}`}
              >
                <span className="text-[0.75rem]">{CORTO.format(new Date(`${d.dia}T12:00`))}</span>
                <span className="font-bold">{Number(d.dia.slice(8))}</span>
              </button>
            ))}
          </div>
          <div role="radiogroup" aria-label="Hora de la visita" className="mt-3 grid grid-cols-3 gap-1.5">
            {horas.slice(0, 9).map((h) => (
              <button
                key={h.inicio}
                type="button"
                role="radio"
                aria-checked={hora === h.inicio}
                onClick={() => setHora(h.inicio)}
                className={`h-9 rounded-[6px] border text-[0.875rem] font-semibold ${hora === h.inicio ? "border-nm-petroleo bg-nm-petroleo text-white" : "border-nm-linea hover:border-nm-petroleo"}`}
              >
                {textoHora(h.inicio)}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {!conVisita && <p className="font-semibold">¿Te interesa? Déjanos tus datos</p>}
      <label className="mt-4 block">
        <span className="text-[0.9375rem] font-semibold">Nombre</span>
        <input value={nombre} onChange={(ev) => setNombre(ev.target.value)} autoComplete="name" className={campo} />
      </label>
      <label className="mt-3 block">
        <span className="text-[0.9375rem] font-semibold">Celular</span>
        <input value={telefono} onChange={(ev) => setTelefono(ev.target.value)} inputMode="tel" autoComplete="tel" placeholder="300 000 0000" className={campo} />
      </label>
      {error && (
        <p role="alert" className="mt-3 text-[0.9375rem] font-semibold text-nm-ladrillo">
          {error}
        </p>
      )}
      <button type="submit" className={`${botonPetroleo} mt-4 w-full`}>
        {conVisita ? "Agendar visita" : "Quiero que me contacten"}
      </button>
    </form>
  )
}

function Simulador({ precio }: { precio: number }) {
  const [inicial, setInicial] = useState(30)
  const [años, setAños] = useState(20)
  const prestamo = precio * (1 - inicial / 100)
  const cuota = cuotaMensual(prestamo, TASA_REFERENCIA, años)
  return (
    <section aria-labelledby="simulador" className="rounded-[8px] bg-white p-5 ring-1 ring-nm-linea">
      <h2 id="simulador" className="text-[1.25rem] font-bold">
        ¿Te alcanza? Simula el crédito
      </h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="flex justify-between text-[0.9375rem] font-semibold">
            Cuota inicial <span className="tabular-nums">{inicial} %</span>
          </span>
          <input type="range" min={20} max={70} step={5} value={inicial} onChange={(ev) => setInicial(Number(ev.target.value))} className="mt-2 w-full accent-nm-petroleo" />
          <span className="text-[0.875rem] text-nm-gris tabular-nums">{pesos(precio * (inicial / 100))}</span>
        </label>
        <label className="block">
          <span className="flex justify-between text-[0.9375rem] font-semibold">
            Plazo <span className="tabular-nums">{años} años</span>
          </span>
          <input type="range" min={5} max={30} step={5} value={años} onChange={(ev) => setAños(Number(ev.target.value))} className="mt-2 w-full accent-nm-petroleo" />
          <span className="text-[0.875rem] text-nm-gris tabular-nums">Préstamo de {pesos(prestamo)}</span>
        </label>
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[6px] bg-nm-agua-suave p-4">
          <dt className="text-[0.875rem] text-nm-gris">Cuota mensual aproximada</dt>
          <dd className="mt-1 text-[1.5rem] font-extrabold tabular-nums" aria-live="polite">
            {pesos(Math.round(cuota / 1000) * 1000)}
          </dd>
        </div>
        <div className="rounded-[6px] bg-nm-fondo p-4">
          <dt className="text-[0.875rem] text-nm-gris">Ingresos del hogar que pide el banco</dt>
          <dd className="mt-1 text-[1.5rem] font-extrabold tabular-nums">{pesos(Math.round(ingresosNecesarios(cuota) / 1000) * 1000)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-[0.8125rem] text-nm-gris">
        Con una tasa de referencia de {(TASA_REFERENCIA * 100).toLocaleString("es-CO")} % efectivo anual y cuota fija. Es una guía: la tasa final la da tu banco.
      </p>
    </section>
  )
}

function CostosArriendo({ canon, administracion }: { canon: number; administracion: number }) {
  return (
    <section aria-labelledby="costos" className="rounded-[8px] bg-white p-5 ring-1 ring-nm-linea">
      <h2 id="costos" className="text-[1.25rem] font-bold">
        Lo que pagas al mes y lo que te piden
      </h2>
      <dl className="mt-4 space-y-2">
        <div className="flex justify-between">
          <dt>Canon</dt>
          <dd className="tabular-nums">{pesos(canon)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Administración</dt>
          <dd className="tabular-nums">{administracion ? pesos(administracion) : "Incluida"}</dd>
        </div>
        <div className="flex justify-between border-t-2 border-nm-tinta pt-2 text-[1.125rem] font-bold">
          <dt>Total al mes</dt>
          <dd className="tabular-nums">{pesos(canon + administracion)}</dd>
        </div>
      </dl>
      <ul className="mt-4 space-y-1.5 text-[0.9375rem] text-nm-gris">
        <li>Estudio con póliza de arrendamiento, o un fiador con finca raíz en el valle.</li>
        <li>Ingresos de al menos {pesos(Math.ceil(((canon + administracion) * 3) / 100_000) * 100_000)} al mes, tres veces el total.</li>
        <li>Contrato a doce meses. Sin depósito.</li>
      </ul>
      <p className="mt-4">
        <Link href={`${RAIZ}/inmuebles?operacion=arriendo`} className={`${botonBorde} h-10 text-[0.9375rem]`}>
          Ver más en arriendo
        </Link>
      </p>
    </section>
  )
}

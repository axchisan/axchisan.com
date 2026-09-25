"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { useAhora } from "@/demos/comun/reloj"
import { claveDia, claveInstante, sumarDias, textoDia, textoHora } from "@/demos/motores/agenda/tiempo"
import { enEspera, ocupados, reservaDe, sesionesDelDia, type Sesion } from "@/demos/motores/clases/cupos"
import { RAIZ } from "./config"
import { estadoDe, puedeReservar, reservarClase, reservarComoInvitado, socioPorDocumento, useGimnasio, type Resultado } from "./estado"
import { coach, HORARIO, tipo } from "./modelo"
import { BotonWhatsappPalanca, botonRojo, campo, EtiquetaTipo } from "./publico"

const CORTO = new Intl.DateTimeFormat("es-CO", { weekday: "short" })

export function HorarioPalanca() {
  const { incluye } = useDemo()
  const e = useGimnasio()
  const ahora = useAhora()
  const [dia, setDia] = useState<string | null>(null)
  const [elegida, setElegida] = useState<Sesion | null>(null)
  const hoy = ahora ? claveDia(ahora) : null
  const dias = hoy ? Array.from({ length: 7 }, (_, i) => sumarDias(hoy, i)) : []
  const actual = dia ?? hoy
  const sesiones = actual ? sesionesDelDia(HORARIO, actual) : []
  const ahoraClave = ahora ? claveInstante(ahora) : ""

  return (
    <section id="horario" aria-labelledby="horario-titulo" className="scroll-mt-12 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="horario-titulo" className="pa-ancha font-pa-titulo text-[2.5rem] leading-none font-extrabold">
            HORARIO
          </h2>
          <ul className="flex flex-wrap gap-2" aria-label="Tipos de clase">
            {["fuerza", "funcional", "movilidad", "hiit"].map((t) => (
              <li key={t}>
                <EtiquetaTipo tipo={tipo(t)} />
              </li>
            ))}
          </ul>
        </div>

        <div role="radiogroup" aria-label="Día" className="mt-8 grid grid-cols-7 gap-1.5">
          {dias.map((d) => {
            const activo = d === actual
            return (
              <button
                key={d}
                type="button"
                role="radio"
                aria-checked={activo}
                aria-label={textoDia(d)}
                onClick={() => setDia(d)}
                className={`flex flex-col items-center rounded-[4px] border-2 py-2 ${activo ? "border-pa-hierro bg-pa-hierro text-white" : "border-pa-linea hover:border-pa-hierro"}`}
              >
                <span className="text-[0.75rem] sm:text-[0.8125rem]">{d === hoy ? "Hoy" : CORTO.format(new Date(`${d}T12:00`))}</span>
                <span className="text-[1.125rem] font-bold">{Number(d.slice(8))}</span>
              </button>
            )
          })}
        </div>

        <Punto id="horario" className="mt-6">
          {!e || !actual ? (
            <div className="min-h-[18rem]" aria-busy="true" />
          ) : sesiones.length === 0 ? (
            <p className="rounded-[4px] bg-pa-tiza p-6 text-pa-gris">Los domingos descansamos. El sábado hay clases hasta el mediodía.</p>
          ) : (
            <ul className="divide-y divide-pa-linea border-y border-pa-linea">
              {sesiones.map((s, i) => {
                const t = tipo(s.tipo)
                const tomados = ocupados(e.reservas, s.sesionId)
                const quedan = s.cupo - tomados
                const espera = enEspera(e.reservas, s.sesionId).length
                const pasada = s.inicio <= ahoraClave
                const fila = (
                  <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 py-4 ${pasada ? "opacity-60" : ""}`}>
                    <span className="w-24 font-pa-titulo text-[1.25rem] font-bold tabular-nums">{textoHora(s.inicio).replace(" ", " ")}</span>
                    <span className="h-10 w-1.5 rounded-full" style={{ background: t.color }} aria-hidden />
                    <span className="min-w-[10rem] flex-1">
                      <span className="block font-bold">{t.nombre}</span>
                      <span className="text-[0.875rem] text-pa-gris">
                        {coach(s.coachId).nombre}, {s.duracionMin} min
                      </span>
                    </span>
                    <span className={`w-36 text-[0.9375rem] font-semibold ${quedan <= 0 ? "text-pa-rojo" : quedan <= 3 ? "text-pa-alerta" : "text-pa-gris"}`}>
                      {pasada ? "Ya empezó" : quedan <= 0 ? `Llena${espera ? `, ${espera} en espera` : ""}` : quedan <= 3 ? `Quedan ${quedan}` : `${quedan} de ${s.cupo} libres`}
                    </span>
                    {!pasada &&
                      (incluye("reservas") ? (
                        <button type="button" onClick={() => setElegida(s)} className="h-10 w-36 rounded-[4px] border-2 border-pa-hierro text-[0.9375rem] font-bold hover:bg-pa-hierro hover:text-white">
                          {quedan <= 0 ? "Lista de espera" : "Reservar"}
                          <span className="sr-only">
                            {" "}
                            {t.nombre} de las {textoHora(s.inicio)}
                          </span>
                        </button>
                      ) : (
                        <BotonWhatsappPalanca
                          mensaje={`Hola, Palanca. Quiero reservar la clase de ${t.nombre.toLowerCase()} del ${textoDia(s.inicio.slice(0, 10)).toLowerCase()} a las ${textoHora(s.inicio)}`}
                          className="h-10 w-36 rounded-[4px] border-2 border-pa-hierro text-[0.9375rem] font-bold hover:bg-pa-hierro hover:text-white"
                        >
                          Reservar
                        </BotonWhatsappPalanca>
                      ))}
                  </div>
                )
                return <li key={s.sesionId}>{i === sesiones.findIndex((x) => x.inicio > ahoraClave) ? <Punto id="reservar">{fila}</Punto> : fila}</li>
              })}
            </ul>
          )}
        </Punto>
      </div>
      {elegida && <DialogoReserva sesion={elegida} alCerrar={() => setElegida(null)} />}
    </section>
  )
}

function DialogoReserva({ sesion: s, alCerrar }: { sesion: Sesion; alCerrar: () => void }) {
  const e = useGimnasio()
  const dialogo = useRef<HTMLDialogElement>(null)
  const [documento, setDocumento] = useState("")
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [error, setError] = useState("")
  const [resultado, setResultado] = useState<Resultado | null>(null)

  useEffect(() => {
    dialogo.current?.showModal()
  }, [])

  if (!e) return null
  const t = tipo(s.tipo)
  const socio = socioPorDocumento(e, documento)
  const llena = ocupados(e.reservas, s.sesionId) >= s.cupo
  const ya = socio ? reservaDe(e.reservas, s.sesionId, socio.id) : null

  function confirmar() {
    setError("")
    if (socio) {
      setResultado(reservarClase(s.sesionId, socio.id))
      return
    }
    if (documento.replace(/\D/g, "").length < 6) return setError("Escribe tu número de documento.")
    if (nombre.trim().length < 3) return setError("Escribe tu nombre completo.")
    const d = telefono.replace(/\D/g, "")
    if (d.length !== 10 || !d.startsWith("3")) return setError("Escribe un celular de 10 dígitos que empiece por 3.")
    setResultado(reservarComoInvitado(s.sesionId, { nombre, documento, telefono }))
  }

  return (
    <dialog
      ref={dialogo}
      onClose={alCerrar}
      aria-labelledby="reserva-titulo"
      onClick={(ev) => ev.target === ev.currentTarget && ev.currentTarget.close()}
      className="m-0 mt-auto w-full max-w-none rounded-t-[10px] bg-white p-0 font-pa-texto text-pa-hierro backdrop:bg-black/60 sm:m-auto sm:max-w-[460px] sm:rounded-[6px]"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <EtiquetaTipo tipo={t} grande />
            <h2 id="reserva-titulo" className="mt-3 text-[1.375rem] leading-tight font-bold">
              {textoDia(s.inicio.slice(0, 10))}, {textoHora(s.inicio)}
            </h2>
            <p className="text-[0.9375rem] text-pa-gris">
              Con {coach(s.coachId).nombre}, {s.duracionMin} minutos.
            </p>
          </div>
          <button type="button" onClick={() => dialogo.current?.close()} className="rounded-[4px] p-1 text-pa-gris hover:text-pa-hierro" aria-label="Cerrar">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {resultado ? (
          <div role="status" className="mt-6">
            {resultado.tipo === "no-puede" ? (
              <p className="rounded-[4px] bg-pa-rojo-suave p-4 font-semibold text-pa-rojo">{resultado.motivo}</p>
            ) : resultado.tipo === "espera" ? (
              <p className="rounded-[4px] bg-pa-alerta-suave p-4 font-semibold text-pa-alerta">
                Estás en la lista de espera, puesto {enEspera(e.reservas, s.sesionId).findIndex((r) => r.id === resultado.reserva.id) + 1}. Si alguien cancela, te avisamos por WhatsApp.
              </p>
            ) : (
              <p className="rounded-[4px] bg-pa-exito-suave p-4 font-semibold text-pa-exito">Tu puesto quedó reservado. Si no puedes venir, cancela hasta dos horas antes para dárselo a otro.</p>
            )}
            <Link href={`${RAIZ}/mis-clases?documento=${encodeURIComponent(documento)}`} className="mt-4 inline-block font-semibold underline underline-offset-4">
              Ver mis clases
            </Link>
          </div>
        ) : (
          <form
            className="mt-6"
            noValidate
            onSubmit={(ev) => {
              ev.preventDefault()
              confirmar()
            }}
          >
            <label className="block">
              <span className="font-semibold">Número de documento</span>
              <input value={documento} onChange={(ev) => setDocumento(ev.target.value)} inputMode="numeric" autoComplete="off" className={campo} />
            </label>
            {socio ? (
              <p className="mt-4 rounded-[4px] bg-pa-tiza px-4 py-3">
                <span className="font-semibold">Hola, {socio.nombre.split(" ")[0]}.</span>{" "}
                {ya
                  ? ya.estado === "espera"
                    ? "Ya estás en la lista de espera de esta clase."
                    : "Ya tienes esta clase reservada."
                  : socio.invitado
                    ? "Tu clase gratis ya está usada o reservada."
                    : puedeReservar(e, socio)
                      ? estadoDe(socio) === "por-vencer"
                        ? "Tu plan vence pronto: renuévalo en recepción."
                        : "Tu plan está al día."
                      : "Tu plan está vencido o sin clases."}
              </p>
            ) : (
              documento.replace(/\D/g, "").length >= 6 && (
                <div className="mt-4 space-y-4">
                  <p className="rounded-[4px] bg-pa-tiza px-4 py-3 text-[0.9375rem]">
                    <span className="font-semibold">¿Primera vez?</span> Tu primera clase es gratis. Déjanos tu nombre y tu celular.
                  </p>
                  <label className="block">
                    <span className="font-semibold">Nombre completo</span>
                    <input value={nombre} onChange={(ev) => setNombre(ev.target.value)} autoComplete="name" className={campo} />
                  </label>
                  <label className="block">
                    <span className="font-semibold">Celular</span>
                    <input value={telefono} onChange={(ev) => setTelefono(ev.target.value)} inputMode="tel" autoComplete="tel" placeholder="300 000 0000" className={campo} />
                  </label>
                </div>
              )
            )}
            {error && (
              <p role="alert" className="mt-3 font-semibold text-pa-rojo">
                {error}
              </p>
            )}
            <button type="submit" disabled={Boolean(ya)} className={`${botonRojo} mt-6 w-full`}>
              {llena ? "Entrar a la lista de espera" : "Reservar mi puesto"}
            </button>
          </form>
        )}
      </div>
    </dialog>
  )
}

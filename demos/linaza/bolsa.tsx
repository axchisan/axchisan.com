"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useId, useRef, useState } from "react"
import { Lock, Minus, Plus, Trash2 } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { disponible } from "@/demos/motores/catalogo/variantes"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import { cambiarCantidad, envioPara, hacerPedido, subtotalBolsa, useBolsa, useTienda } from "./estado"
import { CIUDADES, GRATIS_DESDE, PAGO, prendaPorId, type MetodoPago } from "./modelo"
import { botonTinta, campo } from "./publico"

const BANCOS = ["Bancolombia", "Banco de Bogotá", "Davivienda", "BBVA", "Banco de Occidente", "Banco Caja Social", "Nequi", "Daviplata"]

export function BolsaLinaza() {
  const router = useRouter()
  const { incluye } = useDemo()
  const e = useTienda()
  const bolsa = useBolsa()
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [correo, setCorreo] = useState("")
  const [direccion, setDireccion] = useState("")
  const [ciudadId, setCiudad] = useState("")
  const [pago, setPago] = useState<MetodoPago>("pse")
  const [banco, setBanco] = useState(BANCOS[0])
  const [intento, setIntento] = useState(false)
  const [pasarela, setPasarela] = useState(false)
  const id = useId()
  const enLinea = incluye("tienda")

  if (!bolsa || !e) return <div className="min-h-[60vh]" aria-busy="true" />

  if (bolsa.lineas.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-[2.25rem] font-bold tracking-[-0.03em]">Tu bolsa está vacía</h1>
        <p className="mt-3 text-[1.0625rem] text-li-gris">Elige una prenda, su color y tu talla, y aparece aquí.</p>
        <Link href={`${RAIZ}#coleccion`} className={`${botonTinta} mt-8`}>
          Ver la colección
        </Link>
      </div>
    )
  }

  const subtotal = subtotalBolsa(bolsa.lineas)
  const envio = ciudadId ? envioPara(ciudadId, subtotal) : 0
  const total = subtotal + envio
  const ciudad = CIUDADES.find((c) => c.id === ciudadId)
  const digitos = telefono.replace(/\D/g, "")
  const faltan = bolsa.lineas.filter((l) => l.cantidad > disponible(e.existencias, l.productoId, l.color, l.talla))

  const errores: Record<string, string> = {}
  if (nombre.trim().length < 3) errores.nombre = "Escribe tu nombre completo, como sale en tu documento."
  if (digitos.length !== 10 || !digitos.startsWith("3")) errores.telefono = "Escribe un celular de 10 dígitos que empiece por 3."
  if (enLinea && !/^\S+@\S+\.\S+$/.test(correo.trim())) errores.correo = "Escribe un correo válido: ahí te llega la confirmación."
  if (direccion.trim().length < 6) errores.direccion = "Escribe la dirección completa, con apartamento o casa."
  if (!ciudadId) errores.ciudad = "Elige la ciudad para calcular el envío."
  const error = (k: string) =>
    intento && errores[k] ? (
      <p id={`${id}-${k}`} className="mt-1.5 text-[0.875rem] font-semibold text-li-rojo">
        {errores[k]}
      </p>
    ) : null
  const inv = (k: string) => ({ "aria-invalid": intento && Boolean(errores[k]), "aria-describedby": intento && errores[k] ? `${id}-${k}` : undefined })

  const terminar = (metodo: MetodoPago) => {
    const pedido = hacerPedido({ nombre, correo, telefono, direccion, ciudadId, pago: metodo })
    router.push(`${RAIZ}/pedido/${pedido.id}`)
  }

  return (
    <form
      noValidate
      onSubmit={(ev) => {
        ev.preventDefault()
        setIntento(true)
        if (Object.keys(errores).length || faltan.length) {
          document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus()
          return
        }
        if (enLinea) setPasarela(true)
        else terminar("whatsapp")
      }}
      className="mx-auto grid max-w-7xl gap-12 px-4 pt-10 pb-24 sm:px-6 lg:grid-cols-[1fr_420px]"
    >
      <div>
        <h1 className="text-[2.5rem] leading-none font-bold tracking-[-0.04em]">Tu bolsa</h1>
        <ul className="mt-8 divide-y divide-li-linea border-y border-li-linea">
          {bolsa.lineas.map((l, i) => {
            const p = prendaPorId(l.productoId)!
            const c = p.colores.find((x) => x.id === l.color)!
            const hay = disponible(e.existencias, p.id, l.color, l.talla)
            return (
              <li key={`${l.productoId}-${l.color}-${l.talla}`} className="flex gap-4 py-5">
                <div className="relative h-32 w-24 shrink-0 bg-li-niebla">
                  <Image src={c.fotos[0].src} alt="" fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <Link href={`${RAIZ}/producto/${p.id}`} className="font-semibold hover:underline hover:underline-offset-4">
                      {p.nombre}
                    </Link>
                    <span className="font-semibold tabular-nums">{pesos(p.precio * l.cantidad)}</span>
                  </div>
                  <p className="mt-1 text-[0.9375rem] text-li-gris">
                    {c.nombre}, talla {l.talla}
                  </p>
                  {l.cantidad > hay && <p className="mt-1 text-[0.875rem] font-semibold text-li-rojo">{hay ? `Solo quedan ${hay} en esta talla.` : "Esta talla se agotó mientras elegías."}</p>}
                  <div className="mt-auto flex items-center gap-3 pt-3">
                    <div className="flex items-center border border-li-linea" role="group" aria-label={`Cantidad de ${p.nombre}`}>
                      <button type="button" onClick={() => cambiarCantidad(i, l.cantidad - 1)} className="flex h-9 w-9 items-center justify-center hover:bg-li-niebla" aria-label="Una menos">
                        <Minus className="h-4 w-4" aria-hidden />
                      </button>
                      <span className="w-8 text-center tabular-nums">{l.cantidad}</span>
                      <button type="button" onClick={() => cambiarCantidad(i, l.cantidad + 1)} disabled={l.cantidad >= hay} className="flex h-9 w-9 items-center justify-center hover:bg-li-niebla disabled:opacity-40" aria-label="Una más">
                        <Plus className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                    <button type="button" onClick={() => cambiarCantidad(i, 0)} className="inline-flex items-center gap-1 text-[0.875rem] text-li-gris underline underline-offset-4 hover:text-li-rojo">
                      <Trash2 className="h-4 w-4" aria-hidden />
                      Quitar
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <Punto id="envio" className="mt-10">
          <fieldset>
            <legend className="text-[1.375rem] font-bold tracking-[-0.02em]">Envío</legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="font-semibold">Nombre completo</span>
                <input value={nombre} onChange={(ev) => setNombre(ev.target.value)} autoComplete="name" className={campo} {...inv("nombre")} />
                {error("nombre")}
              </label>
              <label className="block">
                <span className="font-semibold">Celular</span>
                <input value={telefono} onChange={(ev) => setTelefono(ev.target.value)} inputMode="tel" autoComplete="tel" placeholder="300 000 0000" className={campo} {...inv("telefono")} />
                {error("telefono")}
              </label>
              {enLinea && (
                <label className="block sm:col-span-2">
                  <span className="font-semibold">Correo</span>
                  <input value={correo} onChange={(ev) => setCorreo(ev.target.value)} type="email" autoComplete="email" className={campo} {...inv("correo")} />
                  {error("correo")}
                </label>
              )}
              <label className="block">
                <span className="font-semibold">Ciudad</span>
                <select value={ciudadId} onChange={(ev) => setCiudad(ev.target.value)} className={campo} {...inv("ciudad")}>
                  <option value="">Elige la ciudad</option>
                  {CIUDADES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
                {error("ciudad")}
              </label>
              <label className="block">
                <span className="font-semibold">Dirección</span>
                <input value={direccion} onChange={(ev) => setDireccion(ev.target.value)} autoComplete="street-address" className={campo} {...inv("direccion")} />
                {error("direccion")}
              </label>
            </div>
          </fieldset>
        </Punto>

        <Punto id="pago" className="mt-10">
          <fieldset>
            <legend className="text-[1.375rem] font-bold tracking-[-0.02em]">Pago</legend>
            {enLinea ? (
              <>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {(["pse", "nequi", "tarjeta"] as const).map((m) => (
                    <label key={m} className="flex cursor-pointer items-center gap-2.5 border border-li-linea px-4 py-3.5 has-[:checked]:border-li-tinta has-[:checked]:ring-1 has-[:checked]:ring-li-tinta">
                      <input type="radio" name={`${id}-pago`} checked={pago === m} onChange={() => setPago(m)} className="h-4 w-4 accent-li-tinta" />
                      <span className="font-semibold">{PAGO[m]}</span>
                    </label>
                  ))}
                </div>
                {pago === "pse" && (
                  <label className="mt-4 block max-w-sm">
                    <span className="font-semibold">Tu banco</span>
                    <select value={banco} onChange={(ev) => setBanco(ev.target.value)} className={campo}>
                      {BANCOS.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </label>
                )}
                <p className="mt-4 flex items-start gap-2 text-[0.9375rem] text-li-gris">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  Pagas en la pasarela de pagos, no en esta página: los datos de tu tarjeta o tu banco nunca pasan por la tienda.
                </p>
              </>
            ) : (
              <p className="mt-3 max-w-[56ch] text-[0.9375rem] text-li-gris">
                Te escribimos por WhatsApp para confirmar que hay todo y enviarte los datos para pagar por Nequi o transferencia. Despachamos cuando llega el pago.
              </p>
            )}
          </fieldset>
        </Punto>
      </div>

      <aside aria-label="Resumen" className="lg:sticky lg:top-32 lg:self-start">
        <div className="bg-li-niebla p-6">
          <h2 className="text-[1.375rem] font-bold tracking-[-0.02em]">Resumen</h2>
          <dl className="mt-4 space-y-2 text-[1rem]">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{pesos(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Envío{ciudad ? ` a ${ciudad.nombre.split(" ")[0]}` : ""}</dt>
              <dd className="tabular-nums">{!ciudad ? "Elige la ciudad" : envio === 0 ? "Gratis" : pesos(envio)}</dd>
            </div>
            <div className="flex justify-between border-t border-li-tinta pt-3 text-[1.25rem] font-bold">
              <dt>Total</dt>
              <dd className="tabular-nums">{pesos(total)}</dd>
            </div>
          </dl>
          {ciudad && <p className="mt-2 text-[0.875rem] text-li-gris">Llega en {ciudad.dias}.</p>}
          {subtotal < GRATIS_DESDE && <p className="mt-2 text-[0.875rem] text-li-gris">Te faltan {pesos(GRATIS_DESDE - subtotal)} para el envío gratis.</p>}
          <button type="submit" className={`${botonTinta} mt-6 w-full`}>
            {enLinea ? `Pagar ${pesos(total)}` : "Enviar pedido por WhatsApp"}
          </button>
          {intento && (Object.keys(errores).length > 0 || faltan.length > 0) && (
            <p role="alert" className="mt-3 text-[0.9375rem] font-semibold text-li-rojo">
              {faltan.length ? "Ajusta las prendas marcadas: no hay tantas." : "Revisa los datos marcados."}
            </p>
          )}
        </div>
      </aside>

      {pasarela && <Pasarela total={total} metodo={pago} banco={banco} alAprobar={() => terminar(pago)} alCerrar={() => setPasarela(false)} />}
    </form>
  )
}

/**
 * La pasarela de pagos, simulada. En la tienda real es la página del proveedor
 * de pagos; aquí se aprueba con un botón y no se cobra nada.
 */
function Pasarela({ total, metodo, banco, alAprobar, alCerrar }: { total: number; metodo: MetodoPago; banco: string; alAprobar: () => void; alCerrar: () => void }) {
  const dialogo = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    dialogo.current?.showModal()
  }, [])
  return (
    <dialog ref={dialogo} onClose={alCerrar} aria-labelledby="pasarela-titulo" className="m-auto w-[min(92vw,420px)] rounded-[18px] bg-card p-0 font-sans text-ink backdrop:bg-black/60">
      <div className="p-6">
        <p className="text-[0.8125rem] font-semibold text-mid">Pasarela de pagos simulada por Axchi</p>
        <h2 id="pasarela-titulo" className="mt-1 text-[1.25rem] font-semibold">
          Pagar {pesos(total)} con {metodo === "pse" ? `PSE, ${banco}` : PAGO[metodo]}
        </h2>
        <p className="mt-3 text-[0.9375rem] text-mid">
          En la tienda real aquí se abre la página segura del proveedor de pagos. En la demo no se cobra nada: aprueba el pago de prueba para ver qué pasa después.
        </p>
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={() => dialogo.current?.close()} className="h-11 flex-1 rounded-[10px] border border-line text-[0.9375rem] font-semibold hover:bg-paper">
            Cancelar
          </button>
          <button type="button" onClick={alAprobar} className="h-11 flex-1 rounded-[10px] bg-accent text-[0.9375rem] font-semibold text-on-accent hover:bg-accent-hover">
            Aprobar pago de prueba
          </button>
        </div>
      </div>
    </dialog>
  )
}

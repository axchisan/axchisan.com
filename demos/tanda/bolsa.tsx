"use client"

import Link from "next/link"
import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { useAhora } from "@/demos/comun/reloj"
import { mensajePedido } from "@/demos/motores/pedidos/mensaje"
import { PAGO, type MetodoPago, type Pedido } from "@/demos/motores/pedidos/pedido"
import { textoSeleccion } from "@/demos/motores/pedidos/carrito"
import { claveInstante, textoHora } from "@/demos/motores/agenda/tiempo"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import { cambiar, enviarPedido, precioLinea, subtotal, useBolsa } from "./estado"
import { PANADERIA, productoPorId, ZONAS_DOMICILIO } from "./modelo"
import { botonBorde, botonCacao, campo } from "./publico"

const PAGOS: MetodoPago[] = ["nequi", "daviplata", "efectivo"]

/** Horas para recoger: cada media hora desde dentro de 30 minutos hasta el cierre. */
function horasRecoger(ahora: Date) {
  const out: string[] = []
  const d = new Date(ahora)
  d.setMinutes(Math.ceil((d.getMinutes() + 30) / 30) * 30, 0, 0)
  while (d.getHours() < PANADERIA.cierra && d.getDate() === ahora.getDate()) {
    if (d.getHours() >= PANADERIA.abre) out.push(claveInstante(d))
    d.setMinutes(d.getMinutes() + 30)
  }
  return out
}

export function BolsaTanda() {
  const bolsa = useBolsa()
  const ahora = useAhora()
  const [canal, setCanal] = useState<"recoger" | "domicilio">("recoger")
  const [zonaId, setZona] = useState(ZONAS_DOMICILIO[0].id)
  const [direccion, setDireccion] = useState("")
  const [hora, setHora] = useState("")
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [pago, setPago] = useState<MetodoPago>("nequi")
  const [error, setError] = useState("")
  const [hecho, setHecho] = useState<Pedido | null>(null)

  if (!bolsa || !ahora) return <div className="min-h-[60vh]" aria-busy="true" />

  if (hecho) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="font-ta-titulo text-[2.5rem] leading-none font-bold">¡Pedido recibido!</h1>
        <p className="mt-4 text-[1.0625rem] text-ta-miga">
          Pedido #{hecho.numero}. {hecho.canal === "domicilio" ? "Sale en el próximo domicilio, en unos 40 minutos." : `Te lo tenemos listo ${hecho.hora ? `a las ${textoHora(hecho.hora)}` : "en 20 minutos"}.`} Así nos llegó por WhatsApp:
        </p>
        <div className="mt-6 rounded-[16px] rounded-tr-[4px] bg-[#dcf8c6] p-5 text-[0.9375rem] leading-relaxed whitespace-pre-line text-[#111b21]">{mensajePedido("Tanda", hecho)}</div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={RAIZ} className={botonCacao}>
            Volver a la vitrina
          </Link>
          <Link href={`${RAIZ}/panel`} className={botonBorde}>
            Verlo en el panel
          </Link>
        </div>
      </div>
    )
  }

  if (bolsa.lineas.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-ta-titulo text-[2.5rem] leading-none font-bold">Tu bolsa está vacía</h1>
        <p className="mt-4 text-ta-miga">Elige en la vitrina lo que quieres llevar.</p>
        <Link href={`${RAIZ}#vitrina`} className={`${botonCacao} mt-8`}>
          Ir a la vitrina
        </Link>
      </div>
    )
  }

  const zona = ZONAS_DOMICILIO.find((z) => z.id === zonaId)!
  const sub = subtotal(bolsa.lineas)
  const envio = canal === "domicilio" ? zona.costo : 0
  const horas = horasRecoger(ahora)
  const abierto = ahora.getHours() >= PANADERIA.abre && ahora.getHours() < PANADERIA.cierra

  return (
    <form
      noValidate
      onSubmit={(ev) => {
        ev.preventDefault()
        setError("")
        if (nombre.trim().length < 2) return setError("Escribe tu nombre.")
        const d = telefono.replace(/\D/g, "")
        if (d.length !== 10 || !d.startsWith("3")) return setError("Escribe un celular de 10 dígitos que empiece por 3.")
        if (canal === "domicilio" && direccion.trim().length < 6) return setError("Escribe la dirección de entrega.")
        setHecho(enviarPedido({ canal, nombre, telefono, zonaId, direccion, pago, hora: hora || undefined }))
      }}
      className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 pb-20 sm:px-6 lg:grid-cols-[1fr_360px]"
    >
      <div>
        <h1 className="font-ta-titulo text-[2.5rem] leading-none font-bold">Tu bolsa</h1>
        {!abierto && <p className="mt-3 rounded-[14px] bg-ta-alerta-suave px-4 py-3 font-bold text-ta-alerta">Ya cerramos por hoy. Tu pedido queda para mañana a primera hora.</p>}
        <ul className="mt-6 divide-y divide-ta-linea rounded-[20px] ring-2 ring-ta-linea">
          {bolsa.lineas.map((l) => {
            const p = productoPorId(l.productoId)!
            const detalle = textoSeleccion(p, l.seleccion)
            return (
              <li key={l.clave} className="flex flex-wrap items-center gap-3 px-4 py-3.5">
                <span className="min-w-[10rem] flex-1">
                  <span className="block font-bold">{p.nombre}</span>
                  {detalle && <span className="text-[0.875rem] text-ta-miga">{detalle}</span>}
                </span>
                <span className="flex items-center rounded-full border-2 border-ta-linea" role="group" aria-label={`Cantidad de ${p.nombre}`}>
                  <button type="button" onClick={() => cambiar(l.clave, l.cantidad - 1)} className="flex h-9 w-9 items-center justify-center" aria-label={`Uno menos de ${p.nombre}`}>
                    <Minus className="h-4 w-4" aria-hidden />
                  </button>
                  <span className="w-7 text-center font-bold tabular-nums">{l.cantidad}</span>
                  <button type="button" onClick={() => cambiar(l.clave, l.cantidad + 1)} className="flex h-9 w-9 items-center justify-center" aria-label={`Uno más de ${p.nombre}`}>
                    <Plus className="h-4 w-4" aria-hidden />
                  </button>
                </span>
                <span className="w-24 text-right font-bold tabular-nums">{pesos(precioLinea(l) * l.cantidad)}</span>
              </li>
            )
          })}
        </ul>

        <fieldset className="mt-10">
          <legend className="font-ta-titulo text-[1.5rem] font-bold">¿Cómo lo quieres?</legend>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {(["recoger", "domicilio"] as const).map((c) => (
              <label key={c} className="cursor-pointer rounded-[16px] border-2 border-ta-linea p-4 has-[:checked]:border-ta-cacao has-[:checked]:bg-ta-mantequilla-suave">
                <input type="radio" name="canal" className="sr-only" checked={canal === c} onChange={() => setCanal(c)} />
                <span className="block font-extrabold">{c === "recoger" ? "Paso a recoger" : "A domicilio"}</span>
                <span className="text-[0.875rem] text-ta-miga">{c === "recoger" ? "Te lo tenemos empacado" : "Cabecera y alrededores"}</span>
              </label>
            ))}
          </div>
          {canal === "recoger" ? (
            <label className="mt-4 block max-w-xs">
              <span className="font-bold">¿A qué hora pasas?</span>
              <select value={hora} onChange={(ev) => setHora(ev.target.value)} className={campo}>
                <option value="">Lo antes posible</option>
                {horas.map((h) => (
                  <option key={h} value={h}>
                    {textoHora(h)}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="font-bold">Barrio</span>
                <select value={zonaId} onChange={(ev) => setZona(ev.target.value)} className={campo}>
                  {ZONAS_DOMICILIO.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.barrio}, {pesos(z.costo)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="font-bold">Dirección</span>
                <input value={direccion} onChange={(ev) => setDireccion(ev.target.value)} autoComplete="street-address" className={campo} />
              </label>
            </div>
          )}
        </fieldset>

        <fieldset className="mt-8">
          <legend className="font-ta-titulo text-[1.5rem] font-bold">Tus datos</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-bold">Nombre</span>
              <input value={nombre} onChange={(ev) => setNombre(ev.target.value)} autoComplete="name" className={campo} />
            </label>
            <label className="block">
              <span className="font-bold">Celular</span>
              <input value={telefono} onChange={(ev) => setTelefono(ev.target.value)} inputMode="tel" autoComplete="tel" placeholder="300 000 0000" className={campo} />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Cómo pagas">
            {PAGOS.map((m) => (
              <label key={m} className="cursor-pointer rounded-full border-2 border-ta-linea px-4 py-2 font-bold has-[:checked]:border-ta-cacao has-[:checked]:bg-ta-cacao has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ta-fresa">
                <input type="radio" name="pago" className="sr-only" checked={pago === m} onChange={() => setPago(m)} />
                {PAGO[m]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <aside aria-label="Resumen" className="lg:sticky lg:top-16 lg:self-start">
        <div className="rounded-[20px] bg-ta-mantequilla p-5">
          <dl className="space-y-1.5">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{pesos(sub)}</dd>
            </div>
            {canal === "domicilio" && (
              <div className="flex justify-between">
                <dt>Domicilio</dt>
                <dd className="tabular-nums">{pesos(envio)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-ta-cacao pt-2 text-[1.25rem] font-extrabold">
              <dt>Total</dt>
              <dd className="tabular-nums">{pesos(sub + envio)}</dd>
            </div>
          </dl>
          {error && (
            <p role="alert" className="mt-3 font-bold text-ta-fresa">
              {error}
            </p>
          )}
          <button type="submit" className={`${botonCacao} mt-5 w-full`}>
            Enviar pedido
          </button>
          <p className="mt-3 text-[0.8125rem]">Llega completo al WhatsApp de la panadería. Abrimos todos los días de 6:00 a. m. a 8:00 p. m.</p>
        </div>
      </aside>
    </form>
  )
}

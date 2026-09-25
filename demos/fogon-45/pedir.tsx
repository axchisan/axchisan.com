"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useId, useState, type ReactNode } from "react"
import { Bike, ShoppingBag, Utensils } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { useAhora } from "@/demos/comun/reloj"
import { claveInstante, textoHora } from "@/demos/motores/agenda/tiempo"
import { unidades } from "@/demos/motores/pedidos/carrito"
import { PAGO, type Canal, type MetodoPago } from "@/demos/motores/pedidos/pedido"
import { pesos } from "@/lib/catalogo/planes"
import { LineasCarrito } from "./carta"
import { RAIZ } from "./config"
import { enviarPedido, subtotalCarrito, tiempoEstimado, useCarrito, useRestaurante } from "./estado"
import { HORARIO, RESTAURANTE, ZONAS } from "./modelo"
import { botonPrincipal } from "./publico"

const CANALES: { id: Canal; nombre: string; texto: string; icono: typeof Bike }[] = [
  { id: "domicilio", nombre: "A domicilio", texto: "Chapinero y Teusaquillo", icono: Bike },
  { id: "recoger", nombre: "Para recoger", texto: "Lo pagas al llegar", icono: ShoppingBag },
  { id: "mesa", nombre: "En la mesa", texto: "Ya estás en el restaurante", icono: Utensils },
]

const PAGOS: MetodoPago[] = ["nequi", "daviplata", "efectivo", "datafono"]

const campo =
  "mt-1.5 block h-12 w-full rounded-[12px] border border-fg-linea bg-white px-3 text-[1rem] placeholder:text-fg-ceniza focus:border-fg-cobalto focus:outline-2 focus:outline-fg-cobalto aria-[invalid=true]:border-fg-aji"

/** Horas para recoger: cada 15 minutos desde dentro de media hora hasta el cierre. */
function horasParaRecoger(ahora: Date) {
  const h = HORARIO[ahora.getDay()]
  if (!h) return []
  const inicio = new Date(ahora)
  inicio.setMinutes(Math.ceil((ahora.getMinutes() + 30) / 15) * 15, 0, 0)
  const cierre = new Date(ahora)
  cierre.setHours(Math.floor(h.cierra), (h.cierra % 1) * 60, 0, 0)
  const apertura = new Date(ahora)
  apertura.setHours(h.abre, 0, 0, 0)
  const out: string[] = []
  for (let t = Math.max(inicio.getTime(), apertura.getTime() + 30 * 60_000); t <= cierre.getTime() - 15 * 60_000; t += 15 * 60_000) {
    out.push(claveInstante(new Date(t)))
  }
  return out
}

export function PedirFogon() {
  const router = useRouter()
  const ahora = useAhora()
  const e = useRestaurante()
  const carrito = useCarrito()
  const [canalElegido, setCanal] = useState<Canal | null>(null)
  const [mesaElegida, setMesa] = useState<number | null>(null)
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [zonaId, setZona] = useState(ZONAS[0].id)
  const [direccion, setDireccion] = useState("")
  const [indicaciones, setIndicaciones] = useState("")
  const [hora, setHora] = useState("")
  const [pago, setPago] = useState<MetodoPago>("nequi")
  const [pagaCon, setPagaCon] = useState("")
  const [intento, setIntento] = useState(false)
  const id = useId()

  if (!carrito || !e) return <div className="min-h-[70vh]" aria-busy="true" />

  const lineas = carrito.lineas
  if (lineas.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-fg-letrero text-[2.5rem] leading-none text-fg-cobalto">Tu pedido está vacío</h1>
        <p className="mt-4 text-[1.0625rem] text-fg-ceniza">Elige en la carta lo que quieres y vuelve aquí para enviarlo.</p>
        <Link href={`${RAIZ}#carta`} className={`${botonPrincipal} mt-8`}>
          Ir a la carta
        </Link>
      </div>
    )
  }

  const canal: Canal = canalElegido ?? (carrito.mesa ? "mesa" : "domicilio")
  const mesa = mesaElegida ?? carrito.mesa ?? null
  const zona = ZONAS.find((z) => z.id === zonaId)!
  const subtotal = subtotalCarrito(e, lineas)
  const domicilio = canal === "domicilio" ? zona.costo : 0
  const total = subtotal + domicilio
  const [min, max] = tiempoEstimado(e, lineas, canal, zonaId)
  const horas = ahora ? horasParaRecoger(ahora) : []
  const digitos = telefono.replace(/\D/g, "")

  const errores: Record<string, string> = {}
  if (canal === "mesa" && !mesa) errores.mesa = "Elige tu mesa. Está en el QR o en el centro de la mesa."
  if (canal !== "mesa") {
    if (nombre.trim().length < 2) errores.nombre = "Escribe tu nombre para saber de quién es el pedido."
    if (digitos.length !== 10 || !digitos.startsWith("3")) errores.telefono = "Escribe un celular de 10 dígitos que empiece por 3."
  }
  if (canal === "domicilio" && direccion.trim().length < 6) errores.direccion = "Escribe la dirección completa, con número de apartamento si lo hay."
  const pagaConNumero = Number(pagaCon.replace(/\D/g, ""))
  if (pago === "efectivo" && canal !== "mesa" && pagaCon && pagaConNumero < total) errores.pagaCon = `Debe ser igual o mayor que el total, ${pesos(total)}.`

  const error = (k: string) =>
    intento && errores[k] ? (
      <p id={`${id}-${k}-error`} className="mt-1.5 text-[0.875rem] font-semibold text-fg-aji">
        {errores[k]}
      </p>
    ) : null
  const invalido = (k: string) => ({
    "aria-invalid": intento && Boolean(errores[k]),
    "aria-describedby": intento && errores[k] ? `${id}-${k}-error` : undefined,
  })

  function enviar(ev: React.FormEvent) {
    ev.preventDefault()
    setIntento(true)
    if (Object.keys(errores).length) {
      document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus()
      return
    }
    const pedido = enviarPedido({
      canal,
      mesa: mesa ?? undefined,
      cliente: { nombre, telefono },
      zonaId,
      direccion,
      indicaciones,
      hora: hora || undefined,
      pago,
      pagaCon: pagaConNumero || undefined,
    })
    router.push(`${RAIZ}/pedido/${pedido.id}`)
  }

  return (
    <form onSubmit={enviar} noValidate className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 pb-24 sm:px-6 lg:grid-cols-[1fr_380px] lg:pt-14">
      <div>
        <Link href={`${RAIZ}#carta`} className="text-[0.9375rem] font-semibold text-fg-cobalto underline underline-offset-4 hover:no-underline">
          Volver a la carta
        </Link>
        <h1 className="mt-4 font-fg-letrero text-[2.75rem] leading-none text-fg-cobalto">Tu pedido</h1>

        <Punto id="entrega">
          <Bloque titulo="¿Cómo lo quieres?">
            <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Cómo lo quieres">
              {CANALES.map((c) => {
                const Icono = c.icono
                return (
                  <label key={c.id} className="flex cursor-pointer flex-col gap-1 rounded-[16px] border-2 border-fg-linea bg-white p-4 has-[:checked]:border-fg-cobalto has-[:checked]:bg-fg-peltre has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-fg-cobalto">
                    <input type="radio" name={`${id}-canal`} className="sr-only" checked={canal === c.id} onChange={() => setCanal(c.id)} />
                    <Icono className="h-6 w-6 text-fg-cobalto" aria-hidden />
                    <span className="mt-1 text-[1.0625rem] font-bold">{c.nombre}</span>
                    <span className="text-[0.875rem] text-fg-ceniza">{c.texto}</span>
                  </label>
                )
              })}
            </div>

            {canal === "mesa" && (
              <label className="mt-5 block max-w-xs">
                <span className="font-semibold">Tu mesa</span>
                <select value={mesa ?? ""} onChange={(ev) => setMesa(Number(ev.target.value) || null)} className={campo} {...invalido("mesa")}>
                  <option value="">Elige la mesa</option>
                  {Array.from({ length: RESTAURANTE.mesas }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Mesa {i + 1}
                    </option>
                  ))}
                </select>
                {error("mesa")}
              </label>
            )}

            {canal === "domicilio" && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="font-semibold">Barrio</span>
                  <select value={zonaId} onChange={(ev) => setZona(ev.target.value)} className={campo}>
                    {ZONAS.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.barrio}, domicilio {pesos(z.costo)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="font-semibold">Dirección</span>
                  <input value={direccion} onChange={(ev) => setDireccion(ev.target.value)} autoComplete="street-address" placeholder="Carrera 13 # 45-20, apto 301" className={campo} {...invalido("direccion")} />
                  {error("direccion")}
                </label>
                <label className="block sm:col-span-2">
                  <span className="font-semibold">Indicaciones</span> <span className="text-[0.875rem] text-fg-ceniza">Opcional</span>
                  <input value={indicaciones} onChange={(ev) => setIndicaciones(ev.target.value)} placeholder="Portería, timbre que no suena…" className={campo} />
                </label>
              </div>
            )}

            {canal === "recoger" && (
              <label className="mt-5 block max-w-xs">
                <span className="font-semibold">¿A qué hora pasas?</span>
                <select value={hora} onChange={(ev) => setHora(ev.target.value)} className={campo}>
                  <option value="">Lo antes posible</option>
                  {horas.map((h) => (
                    <option key={h} value={h}>
                      {textoHora(h)}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </Bloque>
        </Punto>

        {canal !== "mesa" ? (
          <Bloque titulo="Tus datos">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="font-semibold">Nombre</span>
                <input value={nombre} onChange={(ev) => setNombre(ev.target.value)} autoComplete="name" className={campo} {...invalido("nombre")} />
                {error("nombre")}
              </label>
              <label className="block">
                <span className="font-semibold">Celular</span>
                <input value={telefono} onChange={(ev) => setTelefono(ev.target.value)} inputMode="tel" autoComplete="tel" placeholder="300 000 0000" className={campo} {...invalido("telefono")} />
                {error("telefono")}
              </label>
            </div>
          </Bloque>
        ) : (
          <Bloque titulo="¿A nombre de quién?">
            <label className="block max-w-sm">
              <span className="font-semibold">Nombre</span> <span className="text-[0.875rem] text-fg-ceniza">Opcional</span>
              <input value={nombre} onChange={(ev) => setNombre(ev.target.value)} autoComplete="given-name" className={campo} />
            </label>
          </Bloque>
        )}

        <Punto id="pago">
          <Bloque titulo="¿Cómo pagas?">
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Cómo pagas">
              {PAGOS.map((m) => (
                <label key={m} className="flex cursor-pointer items-center gap-3 rounded-[14px] border-2 border-fg-linea bg-white px-4 py-3.5 has-[:checked]:border-fg-cobalto has-[:checked]:bg-fg-peltre">
                  <input type="radio" name={`${id}-pago`} checked={pago === m} onChange={() => setPago(m)} className="h-5 w-5 accent-fg-cobalto" />
                  <span className="font-semibold">{PAGO[m]}</span>
                </label>
              ))}
            </div>
            {pago === "nequi" || pago === "daviplata" ? (
              <p className="mt-3 text-[0.9375rem] text-fg-ceniza">Al confirmar el pedido te enviamos el número para transferir. El pedido entra a la cocina cuando llega el pago.</p>
            ) : null}
            {pago === "efectivo" && canal !== "mesa" && (
              <label className="mt-4 block max-w-xs">
                <span className="font-semibold">¿Con cuánto pagas?</span> <span className="text-[0.875rem] text-fg-ceniza">Para llevar el cambio</span>
                <input value={pagaCon} onChange={(ev) => setPagaCon(ev.target.value)} inputMode="numeric" placeholder="100.000" className={campo} {...invalido("pagaCon")} />
                {error("pagaCon")}
              </label>
            )}
          </Bloque>
        </Punto>
      </div>

      <aside aria-label="Resumen del pedido" className="lg:sticky lg:top-16 lg:self-start">
        <div className="rounded-[20px] border-2 border-fg-cobalto bg-white p-5">
          <h2 className="font-fg-letrero text-[1.5rem] text-fg-cobalto">Resumen</h2>
          <LineasCarrito />
          <dl className="mt-3 space-y-1.5 border-t border-fg-linea pt-4 text-[1rem]">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{pesos(subtotal)}</dd>
            </div>
            {canal === "domicilio" && (
              <div className="flex justify-between">
                <dt>Domicilio a {zona.barrio}</dt>
                <dd className="tabular-nums">{pesos(domicilio)}</dd>
              </div>
            )}
            <div className="flex justify-between pt-1 text-[1.1875rem] font-bold">
              <dt>Total</dt>
              <dd className="tabular-nums">{pesos(total)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-[0.9375rem] text-fg-ceniza">
            {canal === "domicilio" ? "Llega" : canal === "recoger" ? "Listo" : "A tu mesa"} en unos {min} a {max} minutos.
          </p>
          <button type="submit" className={`${botonPrincipal} mt-5 w-full`}>
            Enviar pedido de {unidades(lineas)} {unidades(lineas) === 1 ? "plato" : "platos"}
          </button>
          {intento && Object.keys(errores).length > 0 && (
            <p role="alert" className="mt-3 text-[0.9375rem] font-semibold text-fg-aji">
              Revisa los datos marcados antes de enviar.
            </p>
          )}
        </div>
      </aside>
    </form>
  )
}

function Bloque({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <fieldset className="mt-10">
      <legend className="font-fg-letrero text-[1.5rem] text-fg-tizne">{titulo}</legend>
      <div className="mt-4">{children}</div>
    </fieldset>
  )
}

"use client"

import Link from "next/link"
import { Check, MessageCircle } from "lucide-react"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { textoFecha, textoHora } from "@/demos/motores/agenda/tiempo"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import { pedidoPorId, useTienda } from "./estado"
import { CIUDADES, ESTADO, PAGO, type EstadoPedido, type Pedido } from "./modelo"
import { botonBorde, botonTinta } from "./publico"

const PASOS: EstadoPedido[] = ["pagado", "alistado", "enviado", "entregado"]

export function mensajePedido(p: Pedido) {
  const ciudad = CIUDADES.find((c) => c.id === p.ciudadId)?.nombre
  const subtotal = p.lineas.reduce((t, l) => t + l.precio * l.cantidad, 0)
  return [
    `Hola, Linaza. Soy ${p.cliente.nombre} (${p.cliente.telefono}). Pedido #${p.numero}:`,
    "",
    ...p.lineas.map((l) => `${l.cantidad} × ${l.nombre}, ${l.colorNombre.toLowerCase()}, talla ${l.talla}: ${pesos(l.precio * l.cantidad)}`),
    "",
    `Envío a ${p.direccion}, ${ciudad}: ${p.envio ? pesos(p.envio) : "gratis"}.`,
    `Total ${pesos(subtotal + p.envio)}.`,
  ].join("\n")
}

export function PedidoLinaza({ id }: { id: string }) {
  const e = useTienda()
  if (!e) return <div className="min-h-[60vh]" aria-busy="true" />
  const p = pedidoPorId(e, id)
  if (!p) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-[2.25rem] font-bold tracking-[-0.03em]">No encontramos ese pedido</h1>
        <p className="mt-3 text-li-gris">Puede que la demo se haya restablecido.</p>
        <Link href={`${RAIZ}#coleccion`} className={`${botonTinta} mt-8`}>
          Ver la colección
        </Link>
      </div>
    )
  }
  const subtotal = p.lineas.reduce((t, l) => t + l.precio * l.cantidad, 0)
  const porWhatsapp = p.pago === "whatsapp"
  const actual = PASOS.indexOf(p.estado)

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-[0.9375rem] text-li-gris">
        Pedido #{p.numero}, {textoFecha(p.fecha.slice(0, 10))}, {textoHora(p.fecha)}
      </p>
      <h1 className="mt-2 text-[2.5rem] leading-none font-bold tracking-[-0.04em]">
        {porWhatsapp && p.estado === "por-confirmar" ? "Recibimos tu pedido" : p.estado === "cancelado" ? "Pedido cancelado" : "Gracias por tu compra"}
      </h1>
      <p className="mt-4 max-w-[52ch] text-[1.0625rem] text-li-gris">
        {porWhatsapp && p.estado === "por-confirmar"
          ? "Te escribimos por WhatsApp en menos de una hora, en horario de tienda, para confirmar y enviarte los datos de pago."
          : `El pago quedó aprobado y las prendas apartadas. Te avisamos por correo y WhatsApp cuando salga, con el número de guía.`}
      </p>

      {!porWhatsapp && p.estado !== "cancelado" && (
        <ol className="mt-10 grid grid-cols-4 gap-2" aria-label="Estado del pedido">
          {PASOS.map((s, i) => (
            <li key={s} className="text-[0.875rem]">
              <span className={`block h-1.5 ${i <= actual ? "bg-li-azul" : "bg-li-linea"}`} aria-hidden />
              <span className={`mt-2 flex items-center gap-1 ${i === actual ? "font-semibold" : i < actual ? "" : "text-li-gris"}`}>
                {i <= actual && <Check className="h-3.5 w-3.5" aria-hidden />}
                {ESTADO[s]}
                {i === actual && <span className="sr-only"> (estado actual)</span>}
              </span>
            </li>
          ))}
        </ol>
      )}
      {p.guia && <p className="mt-4 text-[0.9375rem]">Guía de envío: <span className="font-semibold tabular-nums">{p.guia}</span></p>}

      <ul className="mt-10 divide-y divide-li-linea border-y border-li-linea">
        {p.lineas.map((l, i) => (
          <li key={i} className="flex justify-between gap-4 py-3.5">
            <span>
              <span className="font-semibold">{l.nombre}</span>
              <span className="block text-[0.9375rem] text-li-gris">
                {l.colorNombre}, talla {l.talla}, {l.cantidad} {l.cantidad === 1 ? "unidad" : "unidades"}
              </span>
            </span>
            <span className="tabular-nums">{pesos(l.precio * l.cantidad)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-1.5">
        <div className="flex justify-between">
          <dt>Envío a {CIUDADES.find((c) => c.id === p.ciudadId)?.nombre}</dt>
          <dd className="tabular-nums">{p.envio ? pesos(p.envio) : "Gratis"}</dd>
        </div>
        <div className="flex justify-between text-[1.25rem] font-bold">
          <dt>Total</dt>
          <dd className="tabular-nums">{pesos(subtotal + p.envio)}</dd>
        </div>
        <div className="flex justify-between text-[0.9375rem] text-li-gris">
          <dt>Pago</dt>
          <dd>{PAGO[p.pago]}</dd>
        </div>
      </dl>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={`${RAIZ}#coleccion`} className={botonTinta}>
          Seguir mirando
        </Link>
        {porWhatsapp && (
          <WhatsappSimulado negocio="la tienda" mensaje={mensajePedido(p)} className={botonBorde}>
            <MessageCircle className="h-5 w-5" aria-hidden />
            Cómo le llega a la tienda
          </WhatsappSimulado>
        )}
        <Link href={`${RAIZ}/panel`} className="inline-flex h-12 items-center px-2 font-semibold underline underline-offset-4">
          Verlo en el panel
        </Link>
      </div>
    </div>
  )
}

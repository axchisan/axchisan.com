"use client"

import Link from "next/link"
import { Check, MessageCircle } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { textoHora } from "@/demos/motores/agenda/tiempo"
import { mensajePedido } from "@/demos/motores/pedidos/mensaje"
import { CANAL, ESTADO, pasos, PAGO, subtotal, total } from "@/demos/motores/pedidos/pedido"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import { pedidoPorId, useRestaurante } from "./estado"
import { BotonWhatsappFogon, botonPrincipal, botonSecundario } from "./publico"

const TITULO = {
  recibido: "Recibimos tu pedido",
  preparando: "Tu pedido está en el fogón",
  listo: "Tu pedido está listo",
  "en-camino": "Tu pedido va en camino",
  entregado: "Pedido entregado",
  cancelado: "Pedido cancelado",
} as const

export function SeguimientoFogon({ id }: { id: string }) {
  const e = useRestaurante()
  const { incluye } = useDemo()
  if (!e) return <div className="min-h-[70vh]" aria-busy="true" />
  const p = pedidoPorId(e, id)
  if (!p) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-fg-letrero text-[2.5rem] leading-none text-fg-cobalto">No encontramos ese pedido</h1>
        <p className="mt-4 text-[1.0625rem] text-fg-ceniza">Puede que la demo se haya restablecido. Haz uno nuevo desde la carta.</p>
        <Link href={`${RAIZ}#carta`} className={`${botonPrincipal} mt-8`}>
          Ir a la carta
        </Link>
      </div>
    )
  }

  const ps = pasos(p.canal)
  const actual = ps.indexOf(p.estado)
  const enQue = (estado: string) => p.historial.find((h) => h.estado === estado)?.en

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 pb-24 sm:px-6 lg:grid-cols-[1fr_380px] lg:pt-14">
      <div>
        <p className="text-[1rem] font-semibold text-fg-ceniza">Pedido #{p.numero}</p>
        <h1 className="mt-2 font-fg-letrero text-[2.75rem] leading-none text-fg-cobalto" aria-live="polite">
          {TITULO[p.estado]}
        </h1>
        <p className="mt-4 max-w-[48ch] text-[1.0625rem] text-fg-ceniza">
          {p.canal === "mesa"
            ? `Te lo llevamos a la mesa ${p.mesa}.`
            : p.canal === "recoger"
              ? `Para recoger ${p.hora ? `a las ${textoHora(p.hora)}` : "lo antes posible"} en la calle 45 con carrera 13.`
              : `A ${p.direccion?.direccion}, ${p.direccion?.barrio}.`}
        </p>

        <Punto id="estado" className="mt-10">
          <ol className="relative space-y-0">
            {p.estado === "cancelado" ? (
              <li className="rounded-[14px] bg-fg-aji-suave px-4 py-3 font-semibold text-fg-aji">El restaurante canceló este pedido. Si ya pagaste, te devolvemos el dinero.</li>
            ) : (
              ps.map((estado, i) => {
                const hecho = i <= actual
                const en = enQue(estado)
                return (
                  <li key={estado} className="relative flex gap-4 pb-7 last:pb-0">
                    {i < ps.length - 1 && <span className={`absolute top-8 left-[15px] h-[calc(100%-2rem)] w-0.5 ${i < actual ? "bg-fg-cobalto" : "bg-fg-linea"}`} aria-hidden />}
                    <span className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${hecho ? "border-fg-cobalto bg-fg-cobalto text-white" : "border-fg-linea bg-white"}`}>
                      {hecho && <Check className="h-4 w-4" aria-hidden />}
                    </span>
                    <div className="pt-1">
                      <p className={`text-[1.0625rem] ${i === actual ? "font-bold" : hecho ? "font-semibold" : "text-fg-ceniza"}`}>
                        {ESTADO[estado]}
                        {i === actual && <span className="sr-only"> (estado actual)</span>}
                      </p>
                      {en && <p className="text-[0.875rem] text-fg-ceniza">{textoHora(en)}</p>}
                    </div>
                  </li>
                )
              })
            )}
          </ol>
        </Punto>

        <div className="mt-10 rounded-[16px] bg-band p-5 font-sans text-on-band">
          <p className="text-[1rem] font-semibold">Pruébalo desde el otro lado</p>
          <p className="mt-1 text-[0.9375rem] leading-relaxed text-on-band-mid">
            Abre la {incluye("sistema") ? "pantalla de la cocina" : "lista de pedidos"} en otra pestaña y mueve este pedido. Esta pantalla cambia sola, como la vería tu cliente.
          </p>
          <Link
            href={incluye("sistema") ? `${RAIZ}/panel/cocina` : `${RAIZ}/panel`}
            target="_blank"
            className="mt-4 inline-flex h-10 items-center rounded-[8px] bg-accent px-4 text-[0.9375rem] font-semibold text-on-accent hover:bg-accent-hover"
          >
            Abrir {incluye("sistema") ? "la cocina" : "los pedidos"} en otra pestaña
          </Link>
        </div>
      </div>

      <aside aria-label="Detalle del pedido" className="lg:sticky lg:top-16 lg:self-start">
        <div className="rounded-[20px] border-2 border-fg-cobalto bg-white p-5">
          <h2 className="font-fg-letrero text-[1.5rem] text-fg-cobalto">Detalle</h2>
          <ul className="mt-3 divide-y divide-fg-linea">
            {p.lineas.map((l, i) => (
              <li key={i} className="flex justify-between gap-3 py-3 text-[0.9375rem]">
                <span>
                  <span className="font-semibold">
                    {l.cantidad} × {l.nombre}
                  </span>
                  {(l.detalle || l.nota) && <span className="block text-fg-ceniza">{[l.detalle, l.nota && `Nota: ${l.nota}`].filter(Boolean).join(". ")}</span>}
                </span>
                <span className="tabular-nums">{pesos(l.precio * l.cantidad)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-1.5 border-t border-fg-linea pt-4">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{pesos(subtotal(p))}</dd>
            </div>
            {p.domicilio > 0 && (
              <div className="flex justify-between">
                <dt>Domicilio</dt>
                <dd className="tabular-nums">{pesos(p.domicilio)}</dd>
              </div>
            )}
            <div className="flex justify-between text-[1.1875rem] font-bold">
              <dt>Total</dt>
              <dd className="tabular-nums">{pesos(total(p))}</dd>
            </div>
            <div className="flex justify-between pt-2 text-[0.9375rem] text-fg-ceniza">
              <dt>{CANAL[p.canal]}</dt>
              <dd>{PAGO[p.pago]}</dd>
            </div>
          </dl>
          <Punto id="whatsapp" className="mt-5">
            <BotonWhatsappFogon mensaje={mensajePedido("Fogón 45", p)} className={`${botonSecundario} w-full`}>
              <MessageCircle className="h-5 w-5" aria-hidden />
              Cómo le llega al restaurante
            </BotonWhatsappFogon>
          </Punto>
          <Link href={`${RAIZ}#carta`} className="mt-4 block text-center text-[0.9375rem] font-semibold text-fg-cobalto underline underline-offset-4 hover:no-underline">
            Pedir algo más
          </Link>
        </div>
      </aside>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useId, useState } from "react"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import { enviarPedidoWeb, fijarCantidadLista, precioDe, useFerreteria, useLista } from "./estado"
import { productoPorId, type EstadoFerreteria, type PedidoWeb } from "./modelo"
import { botonBorde, botonVerde, campo } from "./publico"

export function mensajeLista(e: EstadoFerreteria | null, p: PedidoWeb) {
  const lineas = p.lineas.map((l) => {
    const prod = productoPorId(l.productoId)!
    return `${l.cantidad} × ${prod.nombre} (${prod.sku}): ${pesos(precioDe(e, prod) * l.cantidad)}`
  })
  const total = p.lineas.reduce((t, l) => t + precioDe(e, productoPorId(l.productoId)!) * l.cantidad, 0)
  return [
    `Hola, Doble Rosca. Soy ${p.cliente.nombre} (${p.cliente.telefono}). Pedido web #${p.numero}:`,
    "",
    ...lineas,
    "",
    `Total ${pesos(total)}.`,
    p.entrega === "domicilio" ? `Para llevar a ${p.direccion}.` : "Paso a recogerlo.",
  ].join("\n")
}

export function ListaFerreteria() {
  const e = useFerreteria()
  const lista = useLista()
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [entrega, setEntrega] = useState<PedidoWeb["entrega"]>("recoger")
  const [direccion, setDireccion] = useState("")
  const [intento, setIntento] = useState(false)
  const [enviado, setEnviado] = useState<PedidoWeb | null>(null)
  const id = useId()

  if (!lista || !e) return <div className="min-h-[60vh]" aria-busy="true" />

  if (enviado) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="dr-ancha text-[2.25rem] leading-none font-extrabold">Lista enviada</h1>
        <p className="mt-4 text-[1.0625rem] text-dr-acero">
          Le confirmamos por WhatsApp cuando esté lista{enviado.entrega === "domicilio" ? " y a qué hora sale el domicilio" : " para recoger"}. Así nos llegó:
        </p>
        <div className="mt-6 rounded-[14px] rounded-tr-[4px] bg-[#dcf8c6] p-5 text-[0.9375rem] leading-relaxed whitespace-pre-line text-[#111b21]">{mensajeLista(e, enviado)}</div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={RAIZ} className={botonVerde}>
            Volver a los productos
          </Link>
          <Link href={`${RAIZ}/panel/pedidos`} className={botonBorde}>
            Verla en el panel
          </Link>
        </div>
      </div>
    )
  }

  if (lista.lineas.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="dr-ancha text-[2.25rem] leading-none font-extrabold">Su lista está vacía</h1>
        <p className="mt-4 text-[1.0625rem] text-dr-acero">Busque los productos y agréguelos. Aquí aparecen con el total.</p>
        <Link href={`${RAIZ}#productos`} className={`${botonVerde} mt-8`}>
          Buscar productos
        </Link>
      </div>
    )
  }

  const total = lista.lineas.reduce((t, l) => t + precioDe(e, productoPorId(l.productoId)!) * l.cantidad, 0)
  const digitos = telefono.replace(/\D/g, "")
  const errores: Record<string, string> = {}
  if (nombre.trim().length < 2) errores.nombre = "Escriba su nombre."
  if (digitos.length !== 10 || !digitos.startsWith("3")) errores.telefono = "Escriba un celular de 10 dígitos que empiece por 3."
  if (entrega === "domicilio" && direccion.trim().length < 6) errores.direccion = "Escriba la dirección de entrega."
  const error = (k: string) =>
    intento && errores[k] ? (
      <p id={`${id}-${k}`} className="mt-1.5 text-[0.875rem] font-semibold text-dr-rojo">
        {errores[k]}
      </p>
    ) : null
  const inv = (k: string) => ({ "aria-invalid": intento && Boolean(errores[k]), "aria-describedby": intento && errores[k] ? `${id}-${k}` : undefined })

  return (
    <form
      noValidate
      onSubmit={(ev) => {
        ev.preventDefault()
        setIntento(true)
        if (Object.keys(errores).length) return
        setEnviado(enviarPedidoWeb({ nombre, telefono, entrega, direccion }))
      }}
      className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 pb-24 sm:px-6 lg:grid-cols-[1fr_360px]"
    >
      <div>
        <Link href={`${RAIZ}#productos`} className="text-[0.9375rem] font-semibold text-dr-verde underline underline-offset-4 hover:no-underline">
          Seguir buscando
        </Link>
        <h1 className="dr-ancha mt-4 text-[2.25rem] leading-none font-extrabold">Mi lista</h1>
        <Punto id="resumen" className="mt-8">
          <ul className="divide-y divide-dr-linea rounded-[8px] bg-white ring-1 ring-dr-linea">
            {lista.lineas.map((l) => {
              const p = productoPorId(l.productoId)!
              return (
                <li key={l.productoId} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5">
                  <div className="min-w-[12rem] flex-1">
                    <p className="font-semibold">{p.nombre}</p>
                    <p className="text-[0.875rem] text-dr-acero">
                      {pesos(precioDe(e, p))} por {p.unidad}
                    </p>
                  </div>
                  <div className="flex items-center rounded-[6px] border border-dr-linea" role="group" aria-label={`Cantidad de ${p.nombre}`}>
                    <button type="button" onClick={() => fijarCantidadLista(p.id, l.cantidad - 1)} className="flex h-10 w-9 items-center justify-center hover:bg-dr-zinc" aria-label={`Uno menos de ${p.nombre}`}>
                      <Minus className="h-4 w-4" aria-hidden />
                    </button>
                    <span className="w-9 text-center font-semibold tabular-nums">{l.cantidad}</span>
                    <button type="button" onClick={() => fijarCantidadLista(p.id, l.cantidad + 1)} className="flex h-10 w-9 items-center justify-center hover:bg-dr-zinc" aria-label={`Uno más de ${p.nombre}`}>
                      <Plus className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                  <p className="w-28 text-right font-bold tabular-nums">{pesos(precioDe(e, p) * l.cantidad)}</p>
                  <button type="button" onClick={() => fijarCantidadLista(p.id, 0)} className="rounded-[6px] p-2 text-dr-acero hover:text-dr-rojo" aria-label={`Quitar ${p.nombre}`}>
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              )
            })}
          </ul>
        </Punto>
      </div>

      <aside aria-label="Datos del pedido" className="lg:sticky lg:top-16 lg:self-start">
        <div className="rounded-[8px] border-2 border-dr-tinta bg-white p-5">
          <p className="flex justify-between text-[1.1875rem] font-bold">
            <span>Total</span>
            <span className="tabular-nums">{pesos(total)}</span>
          </p>
          <p className="mt-1 text-[0.875rem] text-dr-acero">IVA incluido. El domicilio se cobra aparte según el barrio.</p>
          <label className="mt-5 block">
            <span className="font-semibold">Nombre</span>
            <input value={nombre} onChange={(ev) => setNombre(ev.target.value)} autoComplete="name" className={campo} {...inv("nombre")} />
            {error("nombre")}
          </label>
          <label className="mt-4 block">
            <span className="font-semibold">Celular</span>
            <input value={telefono} onChange={(ev) => setTelefono(ev.target.value)} inputMode="tel" autoComplete="tel" placeholder="300 000 0000" className={campo} {...inv("telefono")} />
            {error("telefono")}
          </label>
          <fieldset className="mt-4">
            <legend className="font-semibold">Entrega</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["recoger", "domicilio"] as const).map((x) => (
                <label key={x} className="flex cursor-pointer items-center gap-2 rounded-[6px] border-2 border-dr-linea px-3 py-2.5 has-[:checked]:border-dr-verde has-[:checked]:bg-dr-exito-suave">
                  <input type="radio" name={`${id}-entrega`} checked={entrega === x} onChange={() => setEntrega(x)} className="accent-dr-verde" />
                  {x === "recoger" ? "Paso a recoger" : "A domicilio"}
                </label>
              ))}
            </div>
          </fieldset>
          {entrega === "domicilio" && (
            <label className="mt-4 block">
              <span className="font-semibold">Dirección</span>
              <input value={direccion} onChange={(ev) => setDireccion(ev.target.value)} autoComplete="street-address" className={campo} {...inv("direccion")} />
              {error("direccion")}
            </label>
          )}
          <button type="submit" className={`${botonVerde} mt-6 w-full`}>
            Enviar por WhatsApp
          </button>
        </div>
      </aside>
    </form>
  )
}

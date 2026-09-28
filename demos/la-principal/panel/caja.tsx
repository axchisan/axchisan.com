"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Printer, Search, Trash2 } from "lucide-react"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { claveDia, textoFecha, textoHora } from "@/demos/motores/agenda/tiempo"
import { ivaIncluido, PAGO, subtotalVenta, totalVenta, type MetodoPago, type Venta } from "@/demos/motores/gestion/inventario"
import { pesos } from "@/lib/catalogo/planes"
import { normalizar } from "../catalogo"
import { precioDe, registrarVenta, useExistencias, useFerreteria, type LineaCaja } from "../estado"
import { FERRETERIA, PRODUCTOS, productoPorId } from "../modelo"
import { botonVerde, campo } from "../publico"
import { Cargando, Encabezado } from "./marco"

const PAGOS: MetodoPago[] = ["efectivo", "nequi", "daviplata", "tarjeta", "transferencia"]
const MAS_VENDIDOS = [...PRODUCTOS].sort((a, b) => b.rotacion - a.rotacion).slice(0, 8)

export function CajaFerreteria({ pedidoInicial }: { pedidoInicial?: string }) {
  return (
    <SoloEnNivel nivel="gestion">
      <Caja pedidoInicial={pedidoInicial} />
    </SoloEnNivel>
  )
}

function Caja({ pedidoInicial }: { pedidoInicial?: string }) {
  const e = useFerreteria()
  const stock = useExistencias(e)
  const [lineas, setLineas] = useState<LineaCaja[]>([])
  const [texto, setTexto] = useState("")
  const [descuento, setDescuento] = useState("")
  const [pago, setPago] = useState<MetodoPago>("efectivo")
  const [recibido, setRecibido] = useState("")
  const [cliente, setCliente] = useState("")
  const [pedidoWebId, setPedidoWebId] = useState<string | undefined>()
  const [recibo, setRecibo] = useState<Venta | null>(null)
  const buscador = useRef<HTMLInputElement>(null)
  const id = useId()

  if (!e || !stock) return <Cargando />

  const q = normalizar(texto.trim())
  const resultados = q ? PRODUCTOS.filter((p) => normalizar(`${p.nombre} ${p.sku}`).includes(q)).slice(0, 8) : []
  const porCobrar = e.pedidosWeb.filter((p) => p.estado === "nuevo" || p.estado === "listo")
  const pendiente = porCobrar.find((p) => p.id === pedidoInicial) ?? null

  const agregar = (productoId: string, cantidad = 1) => {
    setLineas((ls) => (ls.some((l) => l.productoId === productoId) ? ls.map((l) => (l.productoId === productoId ? { ...l, cantidad: l.cantidad + cantidad } : l)) : [...ls, { productoId, cantidad }]))
    setTexto("")
    buscador.current?.focus()
  }

  const borrador = { lineas: lineas.map((l) => ({ ...l, nombre: "", precio: precioDe(e, productoPorId(l.productoId)!), costo: 0 })), descuento: Number(descuento.replace(/\D/g, "")) || 0 }
  const subtotal = subtotalVenta(borrador)
  const total = Math.max(0, totalVenta(borrador))
  const recibidoN = Number(recibido.replace(/\D/g, "")) || 0
  const faltantes = lineas.filter((l) => l.cantidad > (stock.get(l.productoId) ?? 0))
  const puedeCobrar = lineas.length > 0 && faltantes.length === 0 && (pago !== "efectivo" || recibidoN >= total) && borrador.descuento <= subtotal

  function cobrar() {
    const venta = registrarVenta({ lineas, descuento: borrador.descuento, pago, recibido: recibidoN || total, cliente, pedidoWebId })
    setRecibo(venta)
    setLineas([])
    setDescuento("")
    setRecibido("")
    setCliente("")
    setPedidoWebId(undefined)
  }

  return (
    <>
      <Encabezado titulo="Caja" detalle={`${e.ventas.filter((v) => v.fecha.startsWith(claveDia(new Date()))).length} ventas hoy. Cada venta descuenta del inventario al instante.`} />
      {pendiente && pedidoWebId !== pendiente.id && (
        <div className="flex flex-wrap items-center gap-3 border-b border-dr-linea bg-dr-alerta-suave px-4 py-3 sm:px-8">
          <p className="font-semibold text-dr-alerta">
            Pedido web #{pendiente.numero} de {pendiente.cliente.nombre}, {pendiente.lineas.length} productos.
          </p>
          <button
            type="button"
            onClick={() => {
              setLineas(pendiente.lineas.map((l) => ({ ...l })))
              setPedidoWebId(pendiente.id)
              setCliente(pendiente.cliente.nombre)
            }}
            className="h-9 rounded-[6px] bg-dr-tinta px-4 text-[0.875rem] font-bold text-white hover:bg-dr-verde"
          >
            Cargar en la caja
          </button>
        </div>
      )}

      <div className="grid gap-6 px-4 py-6 sm:px-8 xl:grid-cols-[1fr_420px]">
        <div>
          <Punto id="buscar">
            <label className="relative block">
              <span className="sr-only">Buscar por nombre o código</span>
              <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-dr-acero" aria-hidden />
              <input
                ref={buscador}
                value={texto}
                onChange={(ev) => setTexto(ev.target.value)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" && resultados[0]) {
                    ev.preventDefault()
                    agregar(resultados[0].id)
                  }
                }}
                placeholder="Nombre o código (Enter agrega el primero)"
                className="h-14 w-full rounded-[8px] border-2 border-dr-tinta bg-white pr-4 pl-12 text-[1.0625rem] placeholder:text-dr-acero focus:border-dr-verde focus:outline-2 focus:outline-dr-verde"
              />
            </label>
          </Punto>
          <h2 className="mt-6 mb-3 text-[0.9375rem] font-bold text-dr-acero">{q ? `Resultados para «${texto}»` : "Lo que más se vende"}</h2>
          {q && resultados.length === 0 ? (
            <p className="rounded-[8px] bg-white p-4 text-dr-acero ring-1 ring-dr-linea">No hay productos con ese nombre o código.</p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {(q ? resultados : MAS_VENDIDOS).map((p) => {
                const hay = stock.get(p.id) ?? 0
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => agregar(p.id)}
                      disabled={hay <= 0}
                      className="flex w-full items-start justify-between gap-3 rounded-[8px] bg-white p-3 text-left ring-1 ring-dr-linea hover:ring-2 hover:ring-dr-verde disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span>
                        <span className="block font-semibold">{p.nombre}</span>
                        <span className="text-[0.8125rem] text-dr-acero">
                          {p.sku}, {hay > 0 ? `hay ${hay}` : "agotado"}
                        </span>
                      </span>
                      <span className="shrink-0 font-bold tabular-nums">{pesos(precioDe(e, p))}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <Punto id="cobro">
          <section aria-labelledby={`${id}-ticket`} className="rounded-[8px] border-2 border-dr-tinta bg-white p-5">
            <h2 id={`${id}-ticket`} className="dr-ancha text-[1.25rem] font-extrabold">
              Venta actual
            </h2>
            {lineas.length === 0 ? (
              <p className="mt-3 text-[0.9375rem] text-dr-acero">Busque un producto o toque uno de los más vendidos para empezar.</p>
            ) : (
              <ul className="mt-3 divide-y divide-dr-linea">
                {lineas.map((l) => {
                  const p = productoPorId(l.productoId)!
                  const hay = stock.get(p.id) ?? 0
                  return (
                    <li key={l.productoId} className="py-2.5">
                      <div className="flex items-center gap-2">
                        <label className="sr-only" htmlFor={`${id}-${p.id}`}>
                          Cantidad de {p.nombre}
                        </label>
                        <input
                          id={`${id}-${p.id}`}
                          type="number"
                          min={1}
                          value={l.cantidad}
                          onChange={(ev) => setLineas((ls) => ls.map((x) => (x.productoId === p.id ? { ...x, cantidad: Math.max(1, Number(ev.target.value) || 1) } : x)))}
                          className="h-9 w-16 rounded-[6px] border border-dr-linea px-2 text-right tabular-nums"
                        />
                        <span className="min-w-0 flex-1 text-[0.9375rem]">{p.nombre}</span>
                        <span className="font-semibold tabular-nums">{pesos(precioDe(e, p) * l.cantidad)}</span>
                        <button type="button" onClick={() => setLineas((ls) => ls.filter((x) => x.productoId !== p.id))} className="rounded-[6px] p-1.5 text-dr-acero hover:text-dr-rojo" aria-label={`Quitar ${p.nombre}`}>
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                      {l.cantidad > hay && <p className="mt-1 text-[0.8125rem] font-semibold text-dr-rojo">Solo hay {hay} en inventario.</p>}
                    </li>
                  )
                })}
              </ul>
            )}

            <dl className="mt-3 space-y-1.5 border-t border-dr-linea pt-3">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{pesos(subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt>
                  <label htmlFor={`${id}-descuento`}>Descuento</label>
                </dt>
                <dd>
                  <input id={`${id}-descuento`} value={descuento} onChange={(ev) => setDescuento(ev.target.value)} inputMode="numeric" placeholder="0" className="h-9 w-28 rounded-[6px] border border-dr-linea px-2 text-right tabular-nums" />
                </dd>
              </div>
              <div className="flex justify-between border-t-2 border-dr-tinta pt-2 text-[1.375rem] font-extrabold">
                <dt>Total</dt>
                <dd className="tabular-nums">{pesos(total)}</dd>
              </div>
              <div className="flex justify-between text-[0.8125rem] text-dr-acero">
                <dt>IVA incluido</dt>
                <dd className="tabular-nums">{pesos(ivaIncluido(total))}</dd>
              </div>
            </dl>

            <fieldset className="mt-4">
              <legend className="text-[0.9375rem] font-semibold">Pago</legend>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PAGOS.map((m) => (
                  <label key={m} className="cursor-pointer rounded-[6px] border-2 border-dr-linea px-3 py-1.5 text-[0.875rem] font-semibold has-[:checked]:border-dr-verde has-[:checked]:bg-dr-verde has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-dr-verde">
                    <input type="radio" name={`${id}-pago`} className="sr-only" checked={pago === m} onChange={() => setPago(m)} />
                    {PAGO[m]}
                  </label>
                ))}
              </div>
            </fieldset>

            {pago === "efectivo" && (
              <div className="mt-4">
                <label className="block">
                  <span className="text-[0.9375rem] font-semibold">Recibido</span>
                  <input value={recibido} onChange={(ev) => setRecibido(ev.target.value)} inputMode="numeric" placeholder="0" className={campo} />
                </label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[total, Math.ceil(total / 10_000) * 10_000, Math.ceil(total / 50_000) * 50_000, 100_000]
                    .filter((v, i, xs) => v >= total && v > 0 && xs.indexOf(v) === i)
                    .map((v) => (
                      <button key={v} type="button" onClick={() => setRecibido(String(v))} className="h-8 rounded-[6px] bg-dr-zinc px-2.5 text-[0.8125rem] font-semibold tabular-nums hover:bg-dr-linea">
                        {v === total ? "Exacto" : pesos(v)}
                      </button>
                    ))}
                </div>
                {recibidoN >= total && total > 0 && (
                  <p className="mt-3 flex justify-between rounded-[6px] bg-dr-cinta px-3 py-2 text-[1.0625rem] font-extrabold">
                    <span>Cambio</span>
                    <span className="tabular-nums">{pesos(recibidoN - total)}</span>
                  </p>
                )}
              </div>
            )}

            <label className="mt-4 block">
              <span className="text-[0.9375rem] font-semibold">Cliente</span> <span className="text-[0.8125rem] text-dr-acero">Opcional</span>
              <input value={cliente} onChange={(ev) => setCliente(ev.target.value)} className={campo} />
            </label>

            <button type="button" onClick={cobrar} disabled={!puedeCobrar} className={`${botonVerde} mt-5 h-12 w-full text-[1.0625rem]`}>
              Cobrar {pesos(total)}
            </button>
          </section>
        </Punto>
      </div>

      {recibo && <Recibo venta={recibo} alCerrar={() => setRecibo(null)} />}
    </>
  )
}

function Recibo({ venta: v, alCerrar }: { venta: Venta; alCerrar: () => void }) {
  const dialogo = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    dialogo.current?.showModal()
  }, [])
  const total = totalVenta(v)
  return (
    <dialog ref={dialogo} onClose={alCerrar} aria-labelledby="recibo-titulo" className="m-auto w-[min(92vw,380px)] rounded-[8px] bg-white p-0 font-dr text-dr-tinta backdrop:bg-black/50 print:static print:m-0 print:w-full print:shadow-none">
      <div className="p-6 font-mono text-[0.875rem] leading-relaxed">
        <p id="recibo-titulo" className="text-center font-dr text-[1.0625rem] font-extrabold">
          {FERRETERIA.nombreCompleto}
        </p>
        <p className="text-center">NIT {FERRETERIA.nit}</p>
        <p className="mt-3 border-t border-dashed border-dr-tinta pt-3">
          Venta #{v.numero}, {textoFecha(v.fecha.slice(0, 10))}, {textoHora(v.fecha)}
        </p>
        {v.cliente && <p>Cliente: {v.cliente}</p>}
        <ul className="mt-3 border-t border-dashed border-dr-tinta pt-3">
          {v.lineas.map((l) => (
            <li key={l.productoId} className="flex justify-between gap-3">
              <span>
                {l.cantidad} {l.nombre}
              </span>
              <span className="tabular-nums">{pesos(l.precio * l.cantidad)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t border-dashed border-dr-tinta pt-3">
          {v.descuento > 0 && (
            <p className="flex justify-between">
              <span>Descuento</span>
              <span>-{pesos(v.descuento)}</span>
            </p>
          )}
          <p className="flex justify-between text-[1rem] font-bold">
            <span>Total</span>
            <span>{pesos(total)}</span>
          </p>
          <p className="flex justify-between">
            <span>IVA incluido</span>
            <span>{pesos(ivaIncluido(total))}</span>
          </p>
          <p className="flex justify-between">
            <span>{PAGO[v.pago]}</span>
            <span>{pesos(v.recibido ?? total)}</span>
          </p>
          {v.pago === "efectivo" && v.recibido !== undefined && (
            <p className="flex justify-between">
              <span>Cambio</span>
              <span>{pesos(v.recibido - total)}</span>
            </p>
          )}
        </div>
        <p className="mt-4 text-center">Gracias por su compra. Documento de ejemplo, no es factura.</p>
      </div>
      <div className="flex gap-2 border-t border-dr-linea p-4 print:hidden">
        <button type="button" onClick={() => window.print()} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[6px] border-2 border-dr-tinta font-bold hover:bg-dr-zinc">
          <Printer className="h-4 w-4" aria-hidden />
          Imprimir
        </button>
        <button type="button" onClick={() => dialogo.current?.close()} className={`${botonVerde} flex-1`}>
          Nueva venta
        </button>
      </div>
    </dialog>
  )
}

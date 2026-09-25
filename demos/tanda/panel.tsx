"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { CakeSlice, ClipboardList, CookingPot, ExternalLink, MessageCircle, RotateCcw, type LucideIcon } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { useAhora } from "@/demos/comun/reloj"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { claveDia, sumarDias, textoDia, textoHora } from "@/demos/motores/agenda/tiempo"
import { accion, activo, CANAL, ESTADO, PAGO, total } from "@/demos/motores/pedidos/pedido"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import { alternarHorneada, avanzarPedido, cambiarEncargo, pedidosDeHoy, restablecerPanaderia, usePanaderia } from "./estado"
import { tandasDelDia, yaSalio } from "./horneadas"
import { CUBIERTAS, PRODUCTOS, RELLENOS, TAMANOS, type Encargo } from "./modelo"
import { Pan } from "./publico"

type Seccion = { href: string; etiqueta: string; icono: LucideIcon; nivel: string }
const SECCIONES: Seccion[] = [
  { href: `${RAIZ}/panel`, etiqueta: "Pedidos", icono: ClipboardList, nivel: "pedidos" },
  { href: `${RAIZ}/panel/produccion`, etiqueta: "Producción", icono: CookingPot, nivel: "sistema" },
  { href: `${RAIZ}/panel/encargos`, etiqueta: "Encargos", icono: CakeSlice, nivel: "sistema" },
]
const esActiva = (ruta: string, href: string) => (href === `${RAIZ}/panel` ? ruta === href : ruta.startsWith(href))
const hora = (hhmm: string) => textoHora(`2000-01-01T${hhmm}`)

export function MarcoTanda({ children }: { children: ReactNode }) {
  const ruta = usePathname()
  const { incluye } = useDemo()
  return (
    <SoloEnNivel nivel="pedidos">
      <div className="min-h-[calc(100vh-3rem)] bg-ta-mantequilla-suave">
        <header className="bg-ta-cacao text-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
            <Link href={`${RAIZ}/panel`} className="flex items-center gap-2 text-ta-mantequilla">
              <Pan className="h-6 w-9" />
              <span className="font-ta-titulo text-[1.375rem] font-bold">tanda</span>
            </Link>
            <Punto id="menu">
              <nav aria-label="Panel" className="flex gap-1">
                {SECCIONES.map((s) => {
                  const Icono = s.icono
                  const es = esActiva(ruta, s.href)
                  return (
                    <Link key={s.href} href={s.href} aria-current={es ? "page" : undefined} className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.9375rem] font-bold ${es ? "bg-ta-mantequilla text-ta-cacao" : "text-white/85 hover:text-white"}`}>
                      <Icono className="h-4 w-4" aria-hidden />
                      {s.etiqueta}
                      {!incluye(s.nivel) && <span className="rounded-full bg-white/15 px-1.5 text-[0.6875rem] font-normal text-white">Sistema</span>}
                    </Link>
                  )
                })}
              </nav>
            </Punto>
            <div className="ml-auto flex items-center gap-1 text-[0.875rem]">
              <Link href={RAIZ} className="inline-flex items-center gap-1.5 px-2 py-2 text-white/85 hover:text-white">
                <ExternalLink className="h-4 w-4" aria-hidden />
                Ver la página
              </Link>
              <button type="button" onClick={restablecerPanaderia} className="inline-flex items-center gap-1.5 px-2 py-2 text-white/85 hover:text-white">
                <RotateCcw className="h-4 w-4" aria-hidden />
                Restablecer
              </button>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
      </div>
    </SoloEnNivel>
  )
}

const Cargando = () => <div className="min-h-[50vh]" aria-busy="true" />

export function PedidosTanda() {
  const e = usePanaderia()
  if (!e) return <Cargando />
  const hoy = pedidosDeHoy(e)
  const abiertos = hoy.filter(activo)
  return (
    <>
      <h1 className="font-ta-titulo text-[2.25rem] leading-none font-bold">Pedidos de hoy</h1>
      <p className="mt-2 text-ta-miga">
        {abiertos.length} por despachar. {pesos(hoy.filter((p) => p.estado !== "cancelado").reduce((t, p) => t + total(p), 0))} en pedidos de la página.
      </p>
      <Punto id="pedidos" className="mt-6">
        {hoy.length === 0 ? (
          <p className="rounded-[16px] bg-white p-6 text-ta-miga">Todavía no hay pedidos hoy. Los primeros llegan con la horneada de las 6:00 a. m.</p>
        ) : (
          <ul className="space-y-3">
            {hoy.map((p) => {
              const verbo = accion(p)
              return (
                <li key={p.id} className="rounded-[16px] bg-white p-4 ring-2 ring-ta-linea">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-extrabold">
                        #{p.numero}, {p.cliente.nombre}
                      </p>
                      <p className="text-[0.875rem] text-ta-miga">
                        {textoHora(p.creado)}. {p.canal === "domicilio" ? `Domicilio a ${p.direccion?.barrio}` : `Recoge ${p.hora ? `a las ${textoHora(p.hora)}` : "lo antes posible"}`}. {PAGO[p.pago]}.
                      </p>
                      <p className="mt-1 text-[0.9375rem]">{p.lineas.map((l) => `${l.cantidad} ${l.nombre.toLowerCase()}`).join(", ")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold tabular-nums">{pesos(total(p))}</p>
                      <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[0.8125rem] font-bold ${p.estado === "recibido" ? "bg-ta-alerta-suave text-ta-alerta" : p.estado === "entregado" ? "bg-ta-exito-suave text-ta-exito" : "bg-ta-mantequilla-suave"}`}>
                        {p.canal === "recoger" && p.estado === "listo" ? "Listo para recoger" : ESTADO[p.estado]}
                      </span>
                    </div>
                  </div>
                  {verbo && (
                    <button type="button" onClick={() => avanzarPedido(p.id)} className="mt-3 h-9 rounded-full bg-ta-cacao px-4 text-[0.875rem] font-bold text-white hover:bg-ta-cacao-2">
                      {verbo === "Marcar listo" ? "Empacado" : verbo}
                      <span className="sr-only"> el pedido {p.numero}</span>
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </Punto>
      <p className="mt-6 text-[0.8125rem] text-ta-miga">{CANAL.recoger} y {CANAL.domicilio.toLowerCase()}: la página pide el celular y lo entrega completo por WhatsApp.</p>
    </>
  )
}

export function ProduccionTanda() {
  const e = usePanaderia()
  const ahora = useAhora()
  return (
    <SoloEnNivel nivel="sistema">
      {!e || !ahora ? (
        <Cargando />
      ) : (
        (() => {
          const manana = sumarDias(claveDia(ahora), 1)
          const tortasManana = e.encargos.filter((x) => x.entrega.startsWith(manana) && x.estado !== "entregado")
          const reservado = (id: string) => pedidosDeHoy(e).filter(activo).reduce((t, p) => t + p.lineas.filter((l) => l.productoId === id).reduce((s, l) => s + l.cantidad, 0), 0)
          return (
            <>
              <h1 className="font-ta-titulo text-[2.25rem] leading-none font-bold">Producción de hoy</h1>
              <p className="mt-2 text-ta-miga">{textoDia(claveDia(ahora))}. Cada tanda con lo que hay que meter al horno.</p>
              <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <Punto id="plan">
                  <ol className="space-y-3">
                    {tandasDelDia(PRODUCTOS).map((t) => (
                      <li key={t.hora} className={`rounded-[16px] bg-white p-4 ring-2 ${yaSalio(t.hora, ahora) ? "ring-ta-linea" : "ring-ta-cacao"}`}>
                        <h2 className="font-ta-titulo text-[1.375rem] font-bold">{hora(t.hora)}</h2>
                        <ul className="mt-2 space-y-1.5">
                          {t.productos.map((p) => {
                            const clave = `${p.id}@${t.hora}`
                            const hecha = e.horneadas.includes(clave)
                            const extra = reservado(p.id)
                            return (
                              <li key={p.id}>
                                <label className="flex cursor-pointer items-center gap-3">
                                  <input type="checkbox" checked={hecha} onChange={() => alternarHorneada(clave)} className="h-5 w-5 accent-ta-cacao" />
                                  <span className={`flex-1 ${hecha ? "text-ta-miga line-through" : "font-bold"}`}>
                                    {p.porTanda} {p.nombre.toLowerCase()}
                                  </span>
                                  {extra > 0 && !yaSalio(t.hora, ahora) && <span className="rounded-full bg-ta-fresa-suave px-2 text-[0.8125rem] font-bold text-ta-fresa">{extra} pedidos por la página</span>}
                                </label>
                              </li>
                            )
                          })}
                        </ul>
                      </li>
                    ))}
                  </ol>
                </Punto>
                <Punto id="bizcochos">
                  <section aria-labelledby="bizcochos-titulo" className="rounded-[16px] bg-ta-mantequilla p-5">
                    <h2 id="bizcochos-titulo" className="font-ta-titulo text-[1.375rem] font-bold">
                      Bizcochos para mañana
                    </h2>
                    {tortasManana.length === 0 ? (
                      <p className="mt-2">No hay tortas para mañana.</p>
                    ) : (
                      <ul className="mt-3 space-y-3">
                        {tortasManana.map((x) => (
                          <li key={x.id} className="rounded-[12px] bg-white p-3">
                            <p className="font-bold">
                              {TAMANOS.find((t) => t.id === x.tamano)!.nombre}, {x.sabor.toLowerCase()}
                            </p>
                            <p className="text-[0.875rem] text-ta-miga">
                              Para {x.cliente.nombre}, a las {textoHora(x.entrega)} {x.estado === "por-anticipo" ? "Sin anticipo todavía." : "Anticipo recibido."}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                </Punto>
              </div>
            </>
          )
        })()
      )}
    </SoloEnNivel>
  )
}

const ESTADO_ENCARGO: Record<Encargo["estado"], { texto: string; clase: string }> = {
  "por-anticipo": { texto: "Sin anticipo", clase: "bg-ta-alerta-suave text-ta-alerta" },
  confirmado: { texto: "Confirmado", clase: "bg-ta-mantequilla-suave text-ta-cacao" },
  listo: { texto: "Lista", clase: "bg-ta-exito-suave text-ta-exito" },
  entregado: { texto: "Entregada", clase: "bg-white text-ta-miga ring-1 ring-ta-linea" },
}

export function EncargosPanel() {
  const e = usePanaderia()
  return (
    <SoloEnNivel nivel="sistema">
      {!e ? (
        <Cargando />
      ) : (
        (() => {
          const pendientes = e.encargos.filter((x) => x.estado !== "entregado")
          return (
            <>
              <h1 className="font-ta-titulo text-[2.25rem] leading-none font-bold">Encargos</h1>
              <p className="mt-2 text-ta-miga">
                {pendientes.length} tortas por entregar. {pendientes.filter((x) => x.estado === "por-anticipo").length} sin anticipo.
              </p>
              <Punto id="anticipo" className="mt-6">
                <ul className="space-y-3">
                  {e.encargos.map((x) => {
                    const t = TAMANOS.find((y) => y.id === x.tamano)!
                    return (
                      <li key={x.id} className="rounded-[16px] bg-white p-4 ring-2 ring-ta-linea">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-[14rem] flex-1">
                            <p className="font-extrabold">
                              {textoDia(x.entrega.slice(0, 10))}, {textoHora(x.entrega)}
                            </p>
                            <p className="text-[0.9375rem]">
                              #{x.numero}. {t.nombre} de {x.sabor.toLowerCase()} con {RELLENOS.find((r) => r.id === x.relleno)!.nombre.toLowerCase()}, {CUBIERTAS.find((c) => c.id === x.cubierta)!.nombre.toLowerCase()}.
                              {x.mensaje && ` «${x.mensaje}»`}
                            </p>
                            <p className="text-[0.875rem] text-ta-miga">
                              {x.cliente.nombre}, {x.cliente.telefono}. Total {pesos(x.total)}, abonado {pesos(x.anticipo)}.
                            </p>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-[0.8125rem] font-bold ${ESTADO_ENCARGO[x.estado].clase}`}>{ESTADO_ENCARGO[x.estado].texto}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {x.estado === "por-anticipo" && (
                            <>
                              <button type="button" onClick={() => cambiarEncargo(x.id, { estado: "confirmado", anticipo: Math.round(x.total / 2) })} className="h-9 rounded-full bg-ta-cacao px-4 text-[0.875rem] font-bold text-white hover:bg-ta-cacao-2">
                                Llegó el anticipo<span className="sr-only"> del encargo {x.numero}</span>
                              </button>
                              <WhatsappSimulado
                                negocio="el cliente"
                                mensaje={`Hola, ${x.cliente.nombre.split(" ")[0]}. Te escribimos de Tanda por tu torta del ${textoDia(x.entrega.slice(0, 10)).toLowerCase()}. Para confirmarla, envía el anticipo de ${pesos(Math.round(x.total / 2))} al Nequi 300 000 0000.`}
                                className="inline-flex h-9 items-center gap-1.5 rounded-full border-2 border-ta-linea px-3 text-[0.875rem] font-bold hover:border-ta-cacao"
                              >
                                <MessageCircle className="h-4 w-4" aria-hidden />
                                Recordar anticipo
                              </WhatsappSimulado>
                            </>
                          )}
                          {x.estado === "confirmado" && (
                            <button type="button" onClick={() => cambiarEncargo(x.id, { estado: "listo" })} className="h-9 rounded-full bg-ta-cacao px-4 text-[0.875rem] font-bold text-white hover:bg-ta-cacao-2">
                              Marcar lista<span className="sr-only"> la torta {x.numero}</span>
                            </button>
                          )}
                          {x.estado === "listo" && (
                            <button type="button" onClick={() => cambiarEncargo(x.id, { estado: "entregado", anticipo: x.total })} className="h-9 rounded-full bg-ta-cacao px-4 text-[0.875rem] font-bold text-white hover:bg-ta-cacao-2">
                              Entregada y pagada<span className="sr-only">: torta {x.numero}</span>
                            </button>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </Punto>
            </>
          )
        })()
      )}
    </SoloEnNivel>
  )
}

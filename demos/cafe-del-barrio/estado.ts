"use client"

import { crearAlmacen, useAlmacen } from "@/demos/comun/almacen"
import { claveDia, claveInstante, diasEntre, sumarDias } from "@/demos/motores/agenda/tiempo"
import {
  codigoCupon,
  nivelDe,
  porVencer,
  puntosPorCompra,
  saldo,
  sellos,
  validarCupon,
  type Cupon,
} from "@/demos/motores/fidelizacion/programa"
import { BONO_REFERIDO, CAMPANAS, CARTA, PROGRAMA, recompensa, type Cliente, type EstadoCafe } from "./modelo"
import { generarCafe, ponerAlDia } from "./semilla"

export const almacenCafe = crearAlmacen<EstadoCafe>(
  "axchi-demo:cafe-del-barrio:programa:v1",
  () => generarCafe(),
  (guardado) => ponerAlDia(guardado),
)

export const useCafe = () => useAlmacen(almacenCafe)

const hoy = () => claveDia(new Date())
const ahora = () => claveInstante(new Date())
const nuevoId = (p: string) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
const soloDigitos = (t: string) => t.replace(/\D/g, "")

/** Un código de cupón que no exista ya. */
function codigoLibre(cupones: Cupon[]) {
  let c = codigoCupon()
  while (cupones.some((x) => x.codigo === c)) c = codigoCupon()
  return c
}

export const clientePorId = (e: EstadoCafe | null, id: string) => e?.clientes.find((c) => c.id === id) ?? null

/** La caja busca por el código de la app (CB-2718, o solo 2718) o por el celular. */
export function buscarCliente(e: EstadoCafe | null, texto: string): Cliente | null {
  if (!e) return null
  const d = soloDigitos(texto)
  if (d.length === 4) return e.clientes.find((c) => soloDigitos(c.codigo) === d) ?? null
  if (d.length === 10) return e.clientes.find((c) => c.telefono === d) ?? null
  return null
}

/** Todo lo que la app y la caja muestran de un cliente. */
export function resumenCliente(e: EstadoCafe, clienteId: string) {
  const h = hoy()
  const nivel = nivelDe(PROGRAMA, e.movimientos, clienteId, h)
  const propios = e.movimientos.filter((m) => m.clienteId === clienteId)
  const ultima = propios.filter((m) => m.tipo === "compra").at(-1)?.fecha ?? null
  return {
    saldo: saldo(PROGRAMA, e.movimientos, clienteId, h),
    sellos: sellos(PROGRAMA, e.movimientos, clienteId),
    nivel,
    porVencer: porVencer(PROGRAMA, e.movimientos, clienteId, h),
    ultimaVisita: ultima,
    diasSinVenir: ultima ? diasEntre(ultima, h) : null,
    visitas: propios.filter((m) => m.tipo === "compra").length,
    cupones: e.cupones.filter((c) => c.clienteId === clienteId),
  }
}

export type ResultadoCompra = { puntos: number; sello: boolean; tarjetaLlena: boolean; subioA: string | null; monto: number }

/** Registrar una compra en caja: suma puntos según el nivel y, si alcanza, un sello. */
export function registrarCompra(clienteId: string, pedido: Record<string, number>): ResultadoCompra {
  const e = almacenCafe.leer()
  const monto = Object.entries(pedido).reduce((t, [id, n]) => t + (CARTA.find((c) => c.id === id)?.precio ?? 0) * n, 0)
  const antes = resumenCliente(e, clienteId)
  const puntos = puntosPorCompra(PROGRAMA, monto, antes.nivel.actual)
  const sello = monto >= PROGRAMA.compraMinimaSello
  const concepto = Object.entries(pedido)
    .filter(([, n]) => n > 0)
    .map(([id, n]) => `${n > 1 ? `${n} ` : ""}${CARTA.find((c) => c.id === id)!.nombre}`)
    .join(", ")
  almacenCafe.escribir((x) => ({
    ...x,
    movimientos: [...x.movimientos, { id: nuevoId("m"), clienteId, fecha: ahora(), tipo: "compra", puntos, monto, sello, concepto }],
  }))
  const despues = resumenCliente(almacenCafe.leer(), clienteId)
  return {
    puntos,
    sello,
    tarjetaLlena: despues.sellos.llena,
    subioA: despues.nivel.actual.id !== antes.nivel.actual.id ? despues.nivel.actual.nombre : null,
    monto,
  }
}

export type ResultadoCanje = { ok: true; cupon: Cupon } | { ok: false; motivo: string }

/** Cambiar puntos por una recompensa: se descuentan y queda un cupón para mostrar en caja. */
export function canjearRecompensa(clienteId: string, recompensaId: string): ResultadoCanje {
  const e = almacenCafe.leer()
  const r = recompensa(recompensaId)
  if (!r) return { ok: false, motivo: "Esa recompensa ya no está." }
  const disponible = saldo(PROGRAMA, e.movimientos, clienteId, hoy())
  if (disponible < r.puntos) return { ok: false, motivo: `Te faltan ${r.puntos - disponible} puntos.` }
  const cupon: Cupon = { codigo: codigoLibre(e.cupones), clienteId, titulo: r.nombre, origen: "recompensa", creado: ahora(), vence: sumarDias(hoy(), 15) }
  almacenCafe.escribir((x) => ({
    ...x,
    cupones: [...x.cupones, cupon],
    movimientos: [...x.movimientos, { id: nuevoId("m"), clienteId, fecha: ahora(), tipo: "canje", puntos: -r.puntos, concepto: `Canje: ${r.nombre}` }],
  }))
  return { ok: true, cupon }
}

/** Tarjeta de sellos llena: se cambia por un cupón de café gratis. */
export function canjearSellos(clienteId: string): ResultadoCanje {
  const e = almacenCafe.leer()
  if (!sellos(PROGRAMA, e.movimientos, clienteId).llena) return { ok: false, motivo: "La tarjeta todavía no está llena." }
  const cupon: Cupon = { codigo: codigoLibre(e.cupones), clienteId, titulo: "Café gratis de la tarjeta de sellos", origen: "sellos", creado: ahora(), vence: sumarDias(hoy(), 30) }
  almacenCafe.escribir((x) => ({
    ...x,
    cupones: [...x.cupones, cupon],
    movimientos: [...x.movimientos, { id: nuevoId("m"), clienteId, fecha: ahora(), tipo: "sello-canjeado", puntos: 0, concepto: "Tarjeta de sellos cambiada por un café" }],
  }))
  return { ok: true, cupon }
}

/** La caja cobra un cupón: valida que exista, no esté usado ni vencido, y lo marca. */
export function usarCupon(codigo: string) {
  const e = almacenCafe.leer()
  const r = validarCupon(e.cupones, codigo, hoy())
  if (!r.ok) return r
  const usado = ahora()
  almacenCafe.escribir((x) => ({ ...x, cupones: x.cupones.map((c) => (c.codigo === r.cupon.codigo ? { ...c, usado } : c)) }))
  return { ok: true as const, cupon: { ...r.cupon, usado }, cliente: clientePorId(e, r.cupon.clienteId) }
}

/**
 * Inscribir a un cliente en caja. Si trae el código de quien lo invitó, los
 * dos reciben el bono de bienvenida.
 */
export function inscribirCliente(datos: { nombre: string; telefono: string; cumple: string; codigoInvitacion?: string }) {
  const e = almacenCafe.leer()
  const telefono = soloDigitos(datos.telefono)
  if (e.clientes.some((c) => c.telefono === telefono)) return { ok: false as const, motivo: "Ese celular ya está inscrito." }
  const invito = datos.codigoInvitacion ? buscarCliente(e, datos.codigoInvitacion) : null
  if (datos.codigoInvitacion && !invito) return { ok: false as const, motivo: "Ese código de invitación no existe." }
  let codigo = ""
  do codigo = `CB-${String(1000 + Math.floor(Math.random() * 9000))}`
  while (e.clientes.some((c) => c.codigo === codigo))
  const cliente: Cliente = { id: nuevoId("c"), nombre: datos.nombre.trim(), telefono, codigo, cumple: datos.cumple, alta: hoy(), referidoPor: invito?.id }
  const bonos = invito
    ? [
        { id: nuevoId("m"), clienteId: cliente.id, fecha: ahora(), tipo: "bono" as const, puntos: BONO_REFERIDO, concepto: `Bienvenida: te invitó ${invito.nombre}` },
        { id: nuevoId("m"), clienteId: invito.id, fecha: ahora(), tipo: "bono" as const, puntos: BONO_REFERIDO, concepto: `Invitaste a ${cliente.nombre}` },
      ]
    : []
  almacenCafe.escribir((x) => ({ ...x, clientes: [...x.clientes, cliente], movimientos: [...x.movimientos, ...bonos] }))
  return { ok: true as const, cliente, invito }
}

/** Quiénes reciben una campaña. */
export function segmentoDe(e: EstadoCafe, segmento: (typeof CAMPANAS)[number]["segmento"]) {
  const h = hoy()
  const mes = h.slice(5, 7)
  return e.clientes.filter((c) => {
    const r = resumenCliente(e, c.id)
    if (segmento === "inactivos") return r.diasSinVenir !== null && r.diasSinVenir >= 30
    if (segmento === "cumpleanos") return c.cumple.slice(0, 2) === mes
    if (segmento === "por-vencer") return r.porVencer.puntos > 0
    return r.visitas > 0
  })
}

/** Enviar una campaña: un cupón por cliente del segmento y el mensaje de WhatsApp listo. */
export function enviarCampana(campanaId: string) {
  const e = almacenCafe.leer()
  const campana = CAMPANAS.find((c) => c.id === campanaId)!
  const destinatarios = segmentoDe(e, campana.segmento)
  const cupones: Cupon[] = []
  for (const c of destinatarios) {
    cupones.push({ codigo: codigoLibre([...e.cupones, ...cupones]), clienteId: c.id, titulo: campana.premio, origen: "campana", creado: ahora(), vence: sumarDias(hoy(), campana.dias - 1) })
  }
  almacenCafe.escribir((x) => ({
    ...x,
    cupones: [...x.cupones, ...cupones],
    envios: [...x.envios, { id: nuevoId("e"), campanaId, fecha: ahora(), enviados: destinatarios.length }],
  }))
  const ejemplo = destinatarios[0]
    ? campana.mensaje.replace("{nombre}", destinatarios[0].nombre.split(" ")[0]).replace("{codigo}", cupones[0].codigo)
    : null
  return { enviados: destinatarios.length, ejemplo }
}

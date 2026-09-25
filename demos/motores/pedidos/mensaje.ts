import { pesos } from "@/lib/catalogo/planes"
import { textoHora } from "@/demos/motores/agenda/tiempo"
import { CANAL, PAGO, subtotal, total, type Pedido } from "./pedido"

/**
 * El pedido como llega al WhatsApp del negocio: completo, en el orden en que
 * lo lee quien lo prepara, sin que nadie tenga que preguntar nada.
 */
export function mensajePedido(negocio: string, p: Pedido) {
  const lineas = p.lineas.map((l) => {
    const extra = [l.detalle, l.nota && `nota: ${l.nota}`].filter(Boolean).join("; ")
    return `${l.cantidad} × ${l.nombre}${extra ? ` (${extra})` : ""}: ${pesos(l.precio * l.cantidad)}`
  })

  const entrega =
    p.canal === "mesa"
      ? `Mesa ${p.mesa}`
      : p.canal === "recoger"
        ? p.hora
          ? `a las ${textoHora(p.hora)}`
          : "lo antes posible"
        : `${p.direccion?.direccion}, ${p.direccion?.barrio}${p.direccion?.indicaciones ? ` (${p.direccion.indicaciones})` : ""}`

  const pago =
    p.pago === "efectivo" && p.pagaCon ? `${PAGO.efectivo}, paga con ${pesos(p.pagaCon)}` : PAGO[p.pago]

  return [
    `Hola, ${negocio}. Pedido #${p.numero} de ${p.cliente.nombre}${p.cliente.telefono ? ` (${p.cliente.telefono})` : ""}.`,
    "",
    ...lineas,
    "",
    // Una hora ya termina en punto ("3:00 p. m."): no se le agrega otro.
    `${CANAL[p.canal]}: ${entrega}${entrega.endsWith(".") ? "" : "."}`,
    p.domicilio ? `Subtotal ${pesos(subtotal(p))} y domicilio ${pesos(p.domicilio)}.` : "",
    `Total ${pesos(total(p))}. Pago: ${pago}.`,
  ]
    .filter((x, i, xs) => x !== "" || xs[i - 1] !== "")
    .join("\n")
}

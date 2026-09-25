/**
 * Datos de ejemplo de Tanda: pedidos de la página de hoy y encargos de tortas
 * para la semana, en todos sus estados.
 */
import { claveDia, claveInstante, generador, sumarDias, sumarMinutos } from "@/demos/motores/agenda/tiempo"
import type { Canal, EstadoPedido, Pedido } from "@/demos/motores/pedidos/pedido"
import { CUBIERTAS, precioEncargo, PRODUCTOS, RELLENOS, SABORES, TAMANOS, ZONAS_DOMICILIO, type Encargo, type EstadoPanaderia } from "./modelo"

const NOMBRES = ["Sergio Rueda", "Lina Duarte", "Camilo Serrano", "Paola Ardila", "Andrés Gómez", "Viviana Plata", "Jhon Jaimes", "Marcela Ortiz", "Daniel Pinzón", "Laura Vesga"]
const MENSAJES = ["Feliz cumpleaños, Mariana", "Felices 15, Sofía", "¡Felicidades, abuela!", "Bienvenido, Tomás", undefined]

export function generarPanaderia(ahora = new Date()): EstadoPanaderia {
  const r = generador(48)
  const hoy = claveDia(ahora)
  const ref = claveInstante(ahora)
  const pedidos: Pedido[] = []
  const vendibles = PRODUCTOS.filter((p) => p.categoria !== "cafe")
  const edades = [4, 18, 45, 90, 150, 240].filter((m) => ahora.getHours() * 60 + ahora.getMinutes() - m > 6 * 60)
  edades.forEach((edad, i) => {
    const creado = sumarMinutos(ref, -edad)
    const canal: Canal = r.prob(0.5) ? "domicilio" : "recoger"
    const lineas = Array.from({ length: r.entero(1, 3) }, () => {
      const p = r.uno(vendibles)
      // Pan menudo por docenas; masa madre y dulces, de a pocos.
      const menudo = ["pandebono", "pan-leche", "frances"].includes(p.id)
      return { productoId: p.id, nombre: p.nombre, cantidad: menudo ? r.uno([6, 10, 12]) : r.entero(1, 3), precio: p.precio }
    })
    const zona = r.uno(ZONAS_DOMICILIO)
    const estado: EstadoPedido = edad < 15 ? "recibido" : edad < 40 ? "preparando" : canal === "domicilio" && edad < 70 ? "en-camino" : "entregado"
    pedidos.push({
      id: `t${201 + i}`,
      numero: 201 + i,
      creado,
      canal,
      cliente: { nombre: r.uno(NOMBRES), telefono: `3${r.entero(0, 2)}${r.entero(0, 9)} ${r.entero(100, 999)} ${r.entero(1000, 9999)}` },
      direccion: canal === "domicilio" ? { barrio: zona.barrio, direccion: `Calle ${r.entero(30, 60)} # ${r.entero(20, 40)}-${r.entero(10, 90)}` } : undefined,
      lineas,
      domicilio: canal === "domicilio" ? zona.costo : 0,
      pago: r.uno(["nequi", "nequi", "efectivo", "daviplata"] as const),
      estado,
      historial: [{ estado: "recibido", en: creado }],
      origen: "web",
    })
  })

  const encargos: Encargo[] = Array.from({ length: 9 }, (_, i) => {
    const dias = [0, 0, 1, 1, 2, 3, 4, 5, 6][i]
    const tamano = r.uno(TAMANOS).id
    const relleno = r.uno(RELLENOS).id
    const cubierta = r.uno(CUBIERTAS).id
    const total = precioEncargo({ tamano, relleno, cubierta })
    const estado: Encargo["estado"] = dias === 0 ? (i === 0 ? "listo" : "confirmado") : i % 4 === 3 ? "por-anticipo" : "confirmado"
    return {
      id: `e${31 + i}`,
      numero: 31 + i,
      creado: `${sumarDias(hoy, -r.entero(2, 6))}T${String(r.entero(8, 19)).padStart(2, "0")}:15`,
      entrega: `${sumarDias(hoy, dias)}T${r.uno(["10:00", "12:00", "15:00", "17:00"])}`,
      tamano,
      sabor: r.uno(SABORES),
      relleno,
      cubierta,
      mensaje: r.uno(MENSAJES),
      cliente: { nombre: r.uno(NOMBRES), telefono: `3${r.entero(0, 2)}${r.entero(0, 9)} ${r.entero(100, 999)} ${r.entero(1000, 9999)}` },
      total,
      anticipo: estado === "por-anticipo" ? 0 : Math.round(total / 2),
      estado,
    }
  })

  return { referencia: hoy, pedidos, encargos: encargos.sort((a, b) => a.entrega.localeCompare(b.entrega)), siguientePedido: 207, siguienteEncargo: 40, horneadas: [] }
}

/** Otro día, otra vitrina: se regenera todo. */
export function ponerAlDia(e: EstadoPanaderia): EstadoPanaderia {
  return e.referencia === claveDia(new Date()) ? e : generarPanaderia()
}

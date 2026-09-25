import type { ConfigDemo } from "@/demos/comun/contexto"

export const RAIZ = "/demo/fogon-45"

export const CONFIG_FOGON: ConfigDemo = {
  slug: "fogon-45",
  nombre: "Fogón 45, cocina colombiana",
  paraQuien: "un restaurante",
  niveles: [
    { id: "carta", etiqueta: "Carta digital", planes: ["pagina-profesional", "sitio-con-panel"] },
    { id: "pedidos", etiqueta: "Carta + pedidos", planes: ["catalogo-whatsapp"] },
    { id: "sistema", etiqueta: "Sistema con cocina", planes: ["sistema-de-gestion", "sistema-completo"] },
  ],
  nivelDeRuta: {
    [`${RAIZ}/panel`]: "pedidos",
    [`${RAIZ}/panel/carta`]: "carta",
    [`${RAIZ}/panel/mesas`]: "carta",
    [`${RAIZ}/pedir`]: "pedidos",
    [`${RAIZ}/pedido`]: "pedidos",
    [`${RAIZ}/reservar`]: "sistema",
    [`${RAIZ}/panel/cocina`]: "sistema",
    [`${RAIZ}/panel/reservas`]: "sistema",
    [`${RAIZ}/panel/ventas`]: "sistema",
  },
  recorrido: {
    [RAIZ]: [
      {
        id: "portada",
        titulo: "Lo que hace falta para decidir",
        texto: "Qué se come, si está abierto ahora y cómo pedir. Quien llega desde Google Maps o Instagram no tiene que escribir para preguntar.",
      },
      {
        id: "carta",
        titulo: "La carta que se actualiza sola",
        texto: "Cada plato con foto, precio y opciones. Cuando algo se acaba o sube de precio, se cambia desde el panel y la carta lo muestra al instante, sin reimprimir nada.",
      },
      {
        id: "plato",
        titulo: "El pedido llega completo",
        texto: "Término de la carne, acompañamiento y notas se eligen al pedir. La cocina no tiene que llamar a preguntar cómo quería el churrasco.",
      },
      {
        id: "carrito",
        titulo: "Mesa, recoger o domicilio",
        texto: "El mismo carrito sirve para los tres. Con el QR de la mesa, el pedido ya sabe a qué mesa va.",
      },
      {
        id: "reservas",
        titulo: "Reservas sin llamadas",
        texto: "En hora pico nadie contesta el teléfono. La reserva en línea solo ofrece las horas con mesas libres.",
      },
    ],
    [`${RAIZ}/pedir`]: [
      {
        id: "entrega",
        titulo: "Cada zona con su costo",
        texto: "El domicilio se cobra según el barrio y el tiempo estimado tiene en cuenta cuántos pedidos hay en la cocina.",
      },
      {
        id: "pago",
        titulo: "Como se paga en Colombia",
        texto: "Nequi, Daviplata, efectivo con el cambio listo o datáfono. Con el sistema completo también se cobra en línea con PSE o tarjeta.",
      },
    ],
    [`${RAIZ}/reservar`]: [
      {
        id: "horas",
        titulo: "Solo horas con mesa",
        texto: "El restaurante decide cuántas mesas se reservan por franja; el resto queda para quien llega. Cuando una hora se llena, deja de ofrecerse.",
      },
    ],
    [`${RAIZ}/pedido/:id`]: [
      {
        id: "estado",
        titulo: "El cliente ve cómo va su pedido",
        texto: "Cada vez que la cocina lo mueve, aquí cambia. Menos mensajes de «¿ya viene mi pedido?».",
      },
      {
        id: "whatsapp",
        titulo: "Y también llega por WhatsApp",
        texto: "El pedido completo llega al WhatsApp del restaurante, listo para leer. Con el plan de pedidos queda además guardado en el panel.",
      },
    ],
    [`${RAIZ}/panel`]: [
      {
        id: "lista",
        titulo: "Todos los pedidos en un lugar",
        texto: "Los de las mesas, los de recoger y los domicilios, con su estado. Ninguno se pierde entre los mensajes de WhatsApp.",
      },
    ],
    [`${RAIZ}/panel/cocina`]: [
      {
        id: "columnas",
        titulo: "La pantalla de la cocina",
        texto: "Una tablet en la cocina reemplaza las comandas de papel. Cada pedido con sus notas, en el orden en que llegó.",
      },
      {
        id: "tiempo",
        titulo: "Lo que lleva esperando",
        texto: "Cada pedido cuenta sus minutos y se marca cuando pasa de 20. Se ve de lejos qué se está quedando.",
      },
    ],
    [`${RAIZ}/panel/carta`]: [
      {
        id: "agotado",
        titulo: "Agotado en un toque",
        texto: "Se acabó la mojarra: se marca aquí y deja de ofrecerse en la carta y en los pedidos, en ese mismo momento.",
      },
      {
        id: "precio",
        titulo: "Precios sin reimprimir",
        texto: "Se cambia el número y listo. Los pedidos que ya entraron conservan el precio con que se pidieron.",
      },
    ],
    [`${RAIZ}/panel/mesas`]: [
      {
        id: "qr",
        titulo: "Un QR por mesa",
        texto: "Se imprime y se pone en la mesa. Quien lo escanea ve la carta y, con el plan de pedidos, pide desde su celular a esa mesa.",
      },
    ],
    [`${RAIZ}/panel/reservas`]: [
      {
        id: "dia",
        titulo: "Las reservas del día",
        texto: "Quién viene, a qué hora y cuántos son. Al llegar se marca, y las que no llegan quedan registradas.",
      },
    ],
    [`${RAIZ}/panel/ventas`]: [
      {
        id: "resumen",
        titulo: "Cuánto se vendió hoy",
        texto: "Total, número de pedidos y cuánto gasta cada cliente en promedio, sin sumar comandas al final de la noche.",
      },
      {
        id: "platos",
        titulo: "Qué se vende y cómo se paga",
        texto: "Los platos que más salen y cuánto entró por Nequi, efectivo o datáfono, para cuadrar la caja.",
      },
    ],
  },
}

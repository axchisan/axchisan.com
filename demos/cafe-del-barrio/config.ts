import type { ConfigDemo } from "@/demos/comun/contexto"

export const RAIZ = "/demo/cafe-del-barrio"

export const CONFIG_CAFE_DEL_BARRIO: ConfigDemo = {
  slug: "cafe-del-barrio",
  nombre: "Café del Barrio",
  paraQuien: "un programa de puntos para mi negocio",
  niveles: [
    { id: "puntos", etiqueta: "App de puntos y caja", planes: ["sistema-de-gestion"] },
    { id: "completo", etiqueta: "Con campañas e invitaciones", planes: ["sistema-completo"] },
  ],
  nivelDeRuta: {
    [`${RAIZ}/panel/campanas`]: "completo",
  },
  recorrido: {
    [RAIZ]: [
      {
        id: "tarjeta",
        titulo: "La tarjeta en el celular",
        texto: "Puntos, sellos y nivel del cliente, siempre a mano. Se acabaron las tarjetas de cartón que se pierden en la billetera.",
      },
      {
        id: "codigo",
        titulo: "Un código para la caja",
        texto: "El cliente muestra su código y en caja se suman los puntos de la compra. Abre la caja en otra pestaña y pruébalo: la app se actualiza sola.",
      },
      {
        id: "premios",
        titulo: "Premios que se canjean solos",
        texto: "Con los puntos, el cliente elige su premio y le queda un cupón de un solo uso para mostrar en caja.",
      },
      {
        id: "vencen",
        titulo: "Puntos que vencen",
        texto: "El aviso de que unos puntos están por vencer es la razón más fuerte para volver esta semana.",
      },
    ],
    [`${RAIZ}/caja`]: [
      {
        id: "buscar",
        titulo: "Cliente en un segundo",
        texto: "Por el código de su app o por su celular. Sin inscribirlo de nuevo cada vez.",
      },
      {
        id: "pedido",
        titulo: "Toca lo que pidió",
        texto: "Los productos suman el total y los puntos salen según el nivel del cliente. Si la compra alcanza, se le pone un sello.",
      },
      {
        id: "cupon",
        titulo: "Cupones que no se usan dos veces",
        texto: "La caja valida el código: si ya se usó o venció, lo dice y no entrega el premio.",
      },
    ],
    [`${RAIZ}/panel`]: [
      {
        id: "resumen",
        titulo: "Si el programa funciona",
        texto: "Cuántos clientes volvieron este mes, cuántas visitas trae cada uno y cuántos puntos se canjearon.",
      },
      {
        id: "clientes",
        titulo: "Quién dejó de venir",
        texto: "Cada cliente con su nivel, sus puntos y su última visita. Los que no vienen hace un mes, marcados.",
      },
    ],
    [`${RAIZ}/panel/campanas`]: [
      {
        id: "campana",
        titulo: "Campañas con un toque",
        texto: "Te extrañamos, cumpleaños del mes, puntos por vencer: cada cliente recibe su cupón y el mensaje de WhatsApp listo.",
      },
    ],
  },
}

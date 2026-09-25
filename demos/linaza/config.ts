import type { ConfigDemo } from "@/demos/comun/contexto"

export const RAIZ = "/demo/linaza"

export const CONFIG_LINAZA: ConfigDemo = {
  slug: "linaza",
  nombre: "Linaza, lino y algodón",
  paraQuien: "una tienda de ropa",
  niveles: [
    { id: "catalogo", etiqueta: "Catálogo + WhatsApp", planes: ["catalogo-whatsapp"] },
    { id: "tienda", etiqueta: "Tienda con pagos", planes: ["tienda-con-pagos"] },
  ],
  nivelDeRuta: {
    [`${RAIZ}/panel`]: "catalogo",
    [`${RAIZ}/panel/inventario`]: "tienda",
  },
  recorrido: {
    [RAIZ]: [
      {
        id: "coleccion",
        titulo: "La colección, sin catálogo en PDF",
        texto: "Cada prenda con sus fotos, sus colores y lo que cuesta. Se comparte el enlace de una prenda por Instagram o WhatsApp y abre directo.",
      },
      {
        id: "filtros",
        titulo: "Filtrar por talla",
        texto: "Quien usa M solo ve lo que hay en M. Nadie se enamora de una prenda para descubrir al final que su talla se acabó.",
      },
    ],
    [`${RAIZ}/producto/:id`]: [
      {
        id: "tallas",
        titulo: "Tallas y colores con existencias",
        texto: "Cada combinación de color y talla tiene su propio inventario. La que se acabó aparece tachada, y la última unidad se avisa.",
      },
      {
        id: "guia",
        titulo: "La guía de tallas, en centímetros",
        texto: "Resuelve la pregunta que más llega por mensaje antes de que la hagan, y baja las devoluciones.",
      },
    ],
    [`${RAIZ}/bolsa`]: [
      {
        id: "envio",
        titulo: "Envío por ciudad",
        texto: "El costo y los días dependen de la ciudad, con envío gratis desde un monto. El cliente sabe cuánto paga antes de pagar.",
      },
      {
        id: "pago",
        titulo: "PSE, Nequi o tarjeta",
        texto: "Con la tienda con pagos, el dinero llega antes de despachar y la prenda se aparta sola. Con el catálogo, el pedido llega armado por WhatsApp.",
      },
    ],
    [`${RAIZ}/panel`]: [
      {
        id: "pedidos",
        titulo: "Cada pedido, en qué va",
        texto: "Pagado, empacado, enviado con su número de guía, entregado. El cliente recibe cada cambio sin que nadie le escriba.",
      },
    ],
    [`${RAIZ}/panel/inventario`]: [
      {
        id: "matriz",
        titulo: "El inventario por talla",
        texto: "Una fila por color y una columna por talla. Llegó producción del taller: se suma aquí y la página lo muestra de inmediato.",
      },
    ],
  },
}

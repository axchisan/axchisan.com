import type { ConfigDemo } from "@/demos/comun/contexto"

export const RAIZ = "/demo/doble-rosca"

export const CONFIG_DOBLE_ROSCA: ConfigDemo = {
  slug: "doble-rosca",
  nombre: "Ferretería Doble Rosca",
  paraQuien: "un negocio con inventario",
  niveles: [
    { id: "catalogo", etiqueta: "Catálogo + pedidos", planes: ["catalogo-whatsapp"] },
    { id: "gestion", etiqueta: "Inventario y caja", planes: ["sistema-de-gestion"] },
    { id: "completo", etiqueta: "Sistema completo", planes: ["sistema-completo"] },
  ],
  nivelDeRuta: {
    [`${RAIZ}/panel`]: "gestion",
    [`${RAIZ}/panel/pedidos`]: "catalogo",
    [`${RAIZ}/panel/inventario`]: "catalogo",
    [`${RAIZ}/panel/inventario/`]: "gestion",
    [`${RAIZ}/panel/entradas`]: "gestion",
    [`${RAIZ}/panel/reportes`]: "gestion",
    [`${RAIZ}/panel/reponer`]: "completo",
  },
  recorrido: {
    [RAIZ]: [
      {
        id: "buscar",
        titulo: "¿Lo tienen?",
        texto: "La pregunta que más llega por WhatsApp. El cliente busca, ve el precio y si hay existencias, sin llamar.",
      },
      {
        id: "disponible",
        titulo: "Existencias de verdad",
        texto: "Lo que dice la página sale del mismo inventario de la caja. Si se vendió el último, la página ya lo sabe.",
      },
      {
        id: "lista",
        titulo: "La lista de la obra",
        texto: "El maestro de obra arma su lista y la manda. Llega completa, con cantidades y total, y queda en el panel para alistarla.",
      },
    ],
    [`${RAIZ}/lista`]: [
      {
        id: "resumen",
        titulo: "Un pedido que se entiende",
        texto: "Cada producto con su cantidad y su precio, el total y si pasa a recoger o se lo llevan. Nadie tiene que volver a preguntar.",
      },
    ],
    [`${RAIZ}/panel`]: [
      {
        id: "buscar",
        titulo: "Vender sin buscar en el cuaderno",
        texto: "Se escribe parte del nombre o el código y aparece con su precio y lo que queda. Con lector de código de barras es un pitazo.",
      },
      {
        id: "cobro",
        titulo: "El vuelto, ya calculado",
        texto: "Efectivo con el cambio, Nequi, Daviplata o tarjeta. Cada venta descuenta del inventario en ese momento.",
      },
    ],
    [`${RAIZ}/panel/pedidos`]: [
      {
        id: "lista",
        titulo: "Los pedidos de la página",
        texto: "Cada lista que llega por WhatsApp queda aquí para alistarla. Con el sistema de gestión, se cobra en la caja con un clic.",
      },
    ],
    [`${RAIZ}/panel/inventario`]: [
      {
        id: "alertas",
        titulo: "Lo que se está acabando",
        texto: "La barra muestra cuánto queda frente al mínimo que fijaste. En amarillo, hay que pedir; en rojo, ya no hay.",
      },
      {
        id: "precio",
        titulo: "Precios al día",
        texto: "Subió el cemento: se cambia aquí y la caja y la página cobran el precio nuevo. Las ventas anteriores conservan el suyo.",
      },
    ],
    [`${RAIZ}/panel/inventario/:id`]: [
      {
        id: "kardex",
        titulo: "El kardex, sin hacerlo",
        texto: "Cada entrada, venta y ajuste de este producto, con el saldo después de cada uno. Si algo no cuadra, aquí se ve dónde.",
      },
      {
        id: "conteo",
        titulo: "Conteo físico",
        texto: "Se cuenta lo que hay en el estante y el sistema registra la diferencia como ajuste, con su motivo.",
      },
    ],
    [`${RAIZ}/panel/entradas`]: [
      {
        id: "factura",
        titulo: "Llegó el proveedor",
        texto: "Se elige el proveedor, se anotan las cantidades de la factura y el inventario sube. Lo que estaba por debajo del mínimo aparece primero.",
      },
    ],
    [`${RAIZ}/panel/reportes`]: [
      {
        id: "resumen",
        titulo: "Cuánto se vendió y cuánto quedó",
        texto: "Ventas, número de ventas y utilidad del periodo, calculada con el costo de cada producto.",
      },
      {
        id: "excel",
        titulo: "Para el contador",
        texto: "Todo se descarga en un archivo que abre en Excel, con tildes y comas decimales bien puestas.",
      },
    ],
    [`${RAIZ}/panel/reponer`]: [
      {
        id: "sugerido",
        titulo: "El pedido se arma solo",
        texto: "Por cada proveedor, lo que está bajo el mínimo y cuánto pedir, redondeado a su empaque. Un toque y el mensaje sale por WhatsApp.",
      },
      {
        id: "avisos",
        titulo: "Avisos sin entrar al sistema",
        texto: "Cada mañana llega a tu WhatsApp la lista de lo que hay que reponer. No hay que acordarse de revisar.",
      },
    ],
  },
}

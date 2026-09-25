import type { ConfigDemo } from "@/demos/comun/contexto"

export const RAIZ = "/demo/tanda"

export const CONFIG_TANDA: ConfigDemo = {
  slug: "tanda",
  nombre: "Tanda, panadería y café",
  paraQuien: "una panadería o una cafetería",
  niveles: [
    { id: "pagina", etiqueta: "Página", planes: ["presencia", "pagina-profesional"] },
    { id: "pedidos", etiqueta: "Página + pedidos", planes: ["catalogo-whatsapp"] },
    { id: "sistema", etiqueta: "Sistema de la panadería", planes: ["sistema-de-gestion", "sistema-completo"] },
  ],
  nivelDeRuta: {
    [`${RAIZ}/bolsa`]: "pedidos",
    [`${RAIZ}/panel`]: "pedidos",
    [`${RAIZ}/panel/encargos`]: "sistema",
    [`${RAIZ}/panel/produccion`]: "sistema",
  },
  recorrido: {
    [RAIZ]: [
      {
        id: "tandas",
        titulo: "A qué hora sale cada cosa",
        texto: "El pandebono sale a las 6, a las 10 y a las 4. Quien quiere pan caliente sabe a qué hora pasar, y la página marca lo que acaba de salir.",
      },
      {
        id: "quedan",
        titulo: "Lo que queda, de verdad",
        texto: "Cada producto dice cuántas unidades quedan de la última horneada. Cuando se acaba, dice a qué hora sale la siguiente.",
      },
      {
        id: "encargos",
        titulo: "Tortas sin ir y venir de mensajes",
        texto: "Tamaño, sabor, relleno, cubierta y mensaje, con el precio calculado. El encargo queda con fecha y anticipo.",
      },
    ],
    [`${RAIZ}/encargos`]: [
      {
        id: "armar",
        titulo: "Se arma y se ve el precio",
        texto: "Cada elección cambia el total. El cliente no tiene que preguntar cuánto vale una torta de libra con fresas.",
      },
      {
        id: "fecha",
        titulo: "Con dos días de anticipación",
        texto: "El bizcocho se hornea el día anterior. La página solo ofrece fechas en que se alcanza a hacer.",
      },
    ],
    [`${RAIZ}/panel/produccion`]: [
      {
        id: "plan",
        titulo: "El plan del día",
        texto: "Cada tanda con lo que hay que hornear. El panadero la marca cuando sale del horno.",
      },
      {
        id: "bizcochos",
        titulo: "Los bizcochos de mañana",
        texto: "Las tortas que se entregan mañana aparecen aquí para hornear hoy su bizcocho. Ningún encargo se olvida.",
      },
    ],
    [`${RAIZ}/panel/encargos`]: [
      {
        id: "anticipo",
        titulo: "Encargos con anticipo",
        texto: "Un encargo se confirma cuando llega el anticipo del 50 %. Los que no han pagado aparecen marcados.",
      },
    ],
    [`${RAIZ}/panel`]: [
      {
        id: "pedidos",
        titulo: "Los pedidos de la página",
        texto: "Para recoger a una hora o a domicilio, con sus estados. Llegan también por WhatsApp.",
      },
    ],
  },
}

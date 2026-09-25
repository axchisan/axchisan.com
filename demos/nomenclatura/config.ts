import type { ConfigDemo } from "@/demos/comun/contexto"

export const RAIZ = "/demo/nomenclatura"

export const CONFIG_NOMENCLATURA: ConfigDemo = {
  slug: "nomenclatura",
  nombre: "Nomenclatura, finca raíz",
  paraQuien: "una inmobiliaria",
  niveles: [
    { id: "pagina", etiqueta: "Página con inmuebles", planes: ["pagina-profesional"] },
    { id: "panel", etiqueta: "Sitio con panel", planes: ["sitio-con-panel"] },
    { id: "sistema", etiqueta: "Sistema de la inmobiliaria", planes: ["sistema-de-gestion", "sistema-completo"] },
  ],
  nivelDeRuta: {
    [`${RAIZ}/panel`]: "panel",
    [`${RAIZ}/panel/interesados`]: "sistema",
    [`${RAIZ}/panel/visitas`]: "sistema",
  },
  recorrido: {
    [RAIZ]: [
      {
        id: "buscador",
        titulo: "Buscar como se busca",
        texto: "Arriendo o venta, zona, habitaciones y cuánto quiere pagar. Lo que más preguntan por WhatsApp, resuelto antes de escribir.",
      },
    ],
    [`${RAIZ}/inmuebles`]: [
      {
        id: "filtros",
        titulo: "Filtros que se comparten",
        texto: "La búsqueda queda en el enlace. Un asesor puede mandar por WhatsApp «apartamentos de tres alcobas en Envigado» y se abre tal cual.",
      },
      {
        id: "mapa",
        titulo: "Dónde queda cada uno",
        texto: "El mapa del sur del valle muestra los inmuebles por zona. Se toca uno y se abre su ficha.",
      },
    ],
    [`${RAIZ}/inmuebles/:id`]: [
      {
        id: "datos",
        titulo: "Los datos que deciden",
        texto: "Área, estrato, administración, parqueaderos, piso y antigüedad, a la vista. Menos visitas perdidas a inmuebles que no le servían al cliente.",
      },
      {
        id: "credito",
        titulo: "¿Me alcanza?",
        texto: "El simulador calcula la cuota del crédito y los ingresos que pide el banco. El comprador llega a la visita sabiendo si puede.",
      },
      {
        id: "visita",
        titulo: "Visitas en la agenda del asesor",
        texto: "El cliente elige una hora libre del asesor de esa zona. La visita queda agendada y el interesado, registrado.",
      },
    ],
    [`${RAIZ}/panel`]: [
      {
        id: "inmuebles",
        titulo: "Los inmuebles, sin llamar al programador",
        texto: "Bajó el precio, se arrendó o se reservó: se cambia aquí y la página se actualiza al instante.",
      },
    ],
    [`${RAIZ}/panel/interesados`]: [
      {
        id: "embudo",
        titulo: "Cada interesado, en qué va",
        texto: "Los que llegan por la página, por WhatsApp y por los portales, en una sola lista: nuevo, contactado, visita, oferta. Ninguno se queda sin respuesta.",
      },
    ],
    [`${RAIZ}/panel/visitas`]: [
      {
        id: "agenda",
        titulo: "La semana de cada asesor",
        texto: "Qué inmueble, con quién y a qué hora. Después de la visita se marca y el interesado avanza.",
      },
    ],
  },
}

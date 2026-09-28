import type { ConfigDemo } from "@/demos/comun/contexto"

export const RAIZ = "/demo/rojas-duarte"

export const CONFIG_ROJAS_DUARTE: ConfigDemo = {
  slug: "rojas-duarte",
  nombre: "Rojas & Duarte",
  paraQuien: "una firma de abogados o contadores",
  niveles: [
    { id: "presencia", etiqueta: "Página de presencia", planes: ["presencia"] },
    { id: "profesional", etiqueta: "Página profesional", planes: ["pagina-profesional"] },
  ],
  nivelDeRuta: {
    [`${RAIZ}/areas`]: "profesional",
    [`${RAIZ}/herramientas`]: "profesional",
    [`${RAIZ}/consulta`]: "profesional",
  },
  recorrido: {
    [RAIZ]: [
      {
        id: "confianza",
        titulo: "Lo que decide a un cliente",
        texto: "Cuántos años lleva la firma, cuánto cuesta la primera consulta y en cuánto responde. Dicho arriba, antes de que tenga que preguntarlo.",
      },
      {
        id: "areas",
        titulo: "Cada área, su página",
        texto: "Quien busca «abogado laboral en Bogotá» llega directo a la página de derecho laboral, no a una lista genérica de servicios.",
      },
      {
        id: "herramientas",
        titulo: "Calculadoras que traen clientes",
        texto: "La liquidación y el «¿tengo que declarar?» se comparten por WhatsApp. Quien las usa ya sabe que tiene un caso, y está a un clic de agendar.",
      },
      {
        id: "abierto",
        titulo: "Abierto ahora",
        texto: "El horario se lee con la hora del visitante: sabe si lo atienden hoy sin llamar.",
      },
    ],
    [`${RAIZ}/areas/:id`]: [
      {
        id: "documentos",
        titulo: "Qué traer a la consulta",
        texto: "La lista de documentos evita la segunda cita. El cliente la marca desde el celular mientras los busca.",
      },
      {
        id: "honorarios",
        titulo: "Honorarios de referencia",
        texto: "Un precio orientativo filtra a quien no puede pagar y da confianza a quien sí. Menos llamadas para preguntar cuánto cuesta.",
      },
    ],
    [`${RAIZ}/herramientas/liquidacion`]: [
      {
        id: "calculo",
        titulo: "La cuenta completa",
        texto: "Cesantías, intereses, prima, vacaciones e indemnización, con el salario mínimo y el auxilio de transporte de 2026. Cada rubro dice de dónde sale.",
      },
      {
        id: "siguiente",
        titulo: "Del cálculo a la consulta",
        texto: "Si el resultado no cuadra con lo que le pagaron, el botón lleva a la consulta con el área ya elegida.",
      },
    ],
    [`${RAIZ}/herramientas/renta`]: [
      {
        id: "topes",
        titulo: "Los topes de la DIAN, en pesos",
        texto: "Cinco preguntas y la respuesta con el motivo. Los topes del año gravable 2025, calculados con la UVT de ese año.",
      },
    ],
    [`${RAIZ}/consulta`]: [
      {
        id: "formulario",
        titulo: "Un formulario que filtra",
        texto: "Área, tipo de cliente y el caso contado en pocas líneas. La firma llega a la primera llamada sabiendo de qué se trata.",
      },
      {
        id: "correo",
        titulo: "Así le llega a la firma",
        texto: "Cada consulta llega al correo con un número de radicado y los datos ordenados, lista para asignar a un abogado o a un contador.",
      },
    ],
  },
}

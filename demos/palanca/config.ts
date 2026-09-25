import type { ConfigDemo } from "@/demos/comun/contexto"

export const RAIZ = "/demo/palanca"

export const CONFIG_PALANCA: ConfigDemo = {
  slug: "palanca",
  nombre: "Palanca, entrenamiento funcional",
  paraQuien: "un gimnasio o un estudio",
  niveles: [
    { id: "pagina", etiqueta: "Página", planes: ["presencia", "pagina-profesional"] },
    { id: "reservas", etiqueta: "Página + reservas", planes: ["citas-en-linea"] },
    { id: "sistema", etiqueta: "Sistema del gimnasio", planes: ["sistema-de-gestion", "sistema-completo"] },
  ],
  nivelDeRuta: {
    [`${RAIZ}/mis-clases`]: "reservas",
    [`${RAIZ}/panel`]: "reservas",
    [`${RAIZ}/panel/socios`]: "sistema",
    [`${RAIZ}/panel/resumen`]: "sistema",
  },
  recorrido: {
    [RAIZ]: [
      {
        id: "horario",
        titulo: "El horario, con cupos",
        texto: "Cada clase con su tipo, su coach y los puestos que quedan. Nadie llega a una clase llena.",
      },
      {
        id: "reservar",
        titulo: "Reservar con el documento",
        texto: "El socio escribe su documento y reserva. Si la clase está llena, entra a la lista de espera y se le avisa si se libera un puesto.",
      },
      {
        id: "planes",
        titulo: "Planes claros",
        texto: "Mensualidad, tiquetera o clase suelta, con su precio. La primera clase es gratis y se reserva igual que las demás.",
      },
    ],
    [`${RAIZ}/mis-clases`]: [
      {
        id: "lista",
        titulo: "Sus reservas y su plan",
        texto: "Cuándo vence la membresía, cuántas clases le quedan y sus próximas clases. Puede cancelar hasta dos horas antes.",
      },
    ],
    [`${RAIZ}/panel`]: [
      {
        id: "sesiones",
        titulo: "Las clases de hoy",
        texto: "Cuántos reservaron y quién está en lista de espera. El coach toma asistencia desde el celular al empezar.",
      },
      {
        id: "asistencia",
        titulo: "Asistencia que cuenta",
        texto: "En una tiquetera, cada asistencia descuenta una clase. Quien reserva y no viene queda registrado.",
      },
    ],
    [`${RAIZ}/panel/socios`]: [
      {
        id: "vencimientos",
        titulo: "Quién está por vencer",
        texto: "Los que vencen esta semana aparecen primero, con el mensaje de renovación listo. Renovar antes de tiempo suma los días desde el vencimiento.",
      },
    ],
    [`${RAIZ}/panel/resumen`]: [
      {
        id: "ocupacion",
        titulo: "Qué clases se llenan",
        texto: "La ocupación de cada horario muestra dónde abrir otra clase y cuál conviene mover.",
      },
    ],
  },
}

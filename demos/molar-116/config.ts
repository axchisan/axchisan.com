import type { ConfigDemo } from "@/demos/comun/contexto"

export const RAIZ = "/demo/molar-116"

export const CONFIG_MOLAR: ConfigDemo = {
  slug: "molar-116",
  nombre: "Molar 116, odontología",
  paraQuien: "un consultorio",
  niveles: [
    { id: "pagina", etiqueta: "Página", planes: ["presencia", "pagina-profesional"] },
    { id: "citas", etiqueta: "Página + citas", planes: ["citas-en-linea"] },
    { id: "sistema", etiqueta: "Sistema del consultorio", planes: ["sistema-de-gestion", "sistema-completo"] },
  ],
  nivelDeRuta: {
    [`${RAIZ}/agendar`]: "citas",
    [`${RAIZ}/panel`]: "citas",
    [`${RAIZ}/panel/pacientes`]: "sistema",
    [`${RAIZ}/panel/cartera`]: "sistema",
  },
  recorrido: {
    [RAIZ]: [
      {
        id: "motivos",
        titulo: "Precios a la vista",
        texto: "Lo primero que pregunta un paciente es cuánto cuesta. Cada motivo de consulta con su precio desde y su duración.",
      },
      {
        id: "dolor",
        titulo: "Una puerta para el dolor",
        texto: "Quien tiene dolor no quiere leer: un botón lo lleva a las primeras horas libres de hoy o mañana.",
      },
      {
        id: "equipo",
        titulo: "Quién atiende",
        texto: "Cada odontólogo con su especialidad y su registro. Da confianza y evita llamadas preguntando quién hace endodoncia.",
      },
    ],
    [`${RAIZ}/agendar`]: [
      {
        id: "motivo",
        titulo: "El motivo define el tiempo",
        texto: "Una valoración dura media hora y una endodoncia hora y media. La agenda aparta lo que cada motivo necesita, con quien lo hace.",
      },
      {
        id: "horas",
        titulo: "Solo horas reales",
        texto: "Aparecen los huecos de los odontólogos que atienden ese motivo, los días que atienden.",
      },
      {
        id: "paciente",
        titulo: "Paciente nuevo o de siempre",
        texto: "Con el documento, el sistema reconoce a quien ya es paciente y no le vuelve a pedir los datos.",
      },
    ],
    [`${RAIZ}/panel`]: [
      {
        id: "columnas",
        titulo: "El día por odontólogo",
        texto: "Una columna por profesional, con el motivo de cada cita. Recepción marca quién llegó y quién no vino.",
      },
    ],
    [`${RAIZ}/panel/pacientes/:id`]: [
      {
        id: "odontograma",
        titulo: "El odontograma, en la pantalla",
        texto: "Se elige el hallazgo y se toca la cara del diente. Rojo es lo que hay que hacer, azul lo que ya se hizo, como en papel pero sin tachones.",
      },
      {
        id: "plan",
        titulo: "El presupuesto sale solo",
        texto: "Cada hallazgo en rojo se vuelve un procedimiento con su precio. El paciente se lleva el presupuesto por escrito sin que nadie lo sume a mano.",
      },
      {
        id: "abonos",
        titulo: "Abonos y saldo",
        texto: "Los tratamientos largos se pagan por partes. Cada abono queda registrado y el saldo está siempre al día.",
      },
    ],
    [`${RAIZ}/panel/cartera`]: [
      {
        id: "saldos",
        titulo: "Lo que falta por cobrar",
        texto: "Todos los pacientes con saldo, del mayor al menor, con un recordatorio amable listo para WhatsApp.",
      },
    ],
  },
}

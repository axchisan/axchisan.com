import type { ConfigDemo } from "@/demos/comun/contexto"

export const RAIZ = "/demo/peine-fino"

export const CONFIG_PEINE_FINO: ConfigDemo = {
  slug: "peine-fino",
  nombre: "Peine Fino, salón y barbería",
  paraQuien: "un salón o una barbería",
  niveles: [
    { id: "pagina", etiqueta: "Página", planes: ["presencia", "pagina-profesional"] },
    { id: "citas", etiqueta: "Página + reservas", planes: ["citas-en-linea"] },
    { id: "sistema", etiqueta: "Sistema del salón", planes: ["sistema-de-gestion", "sistema-completo"] },
  ],
  nivelDeRuta: {
    [`${RAIZ}/reservar`]: "citas",
    [`${RAIZ}/panel`]: "citas",
    [`${RAIZ}/panel/caja`]: "sistema",
    [`${RAIZ}/panel/clientes`]: "sistema",
    [`${RAIZ}/panel/volver`]: "sistema",
  },
  recorrido: {
    [RAIZ]: [
      {
        id: "portada",
        titulo: "Lo que buscan desde Instagram",
        texto: "Precio, trabajos y un botón para reservar. Quien llega desde una historia de Instagram no tiene que escribir para preguntar.",
      },
      {
        id: "tablero",
        titulo: "La carta de servicios, a la vista",
        texto: "Cada servicio con su precio y su duración. Se cambia en minutos cuando suben los precios.",
      },
      {
        id: "equipo",
        titulo: "Se elige a la persona",
        texto: "En un salón el cliente sigue a su estilista. Cada profesional con su especialidad, sus días y sus trabajos.",
      },
      {
        id: "horario",
        titulo: "Horario y cómo llegar",
        texto: "Horario de cada día y el mapa, sin tener que preguntar por WhatsApp.",
      },
    ],
    [`${RAIZ}/reservar`]: [
      {
        id: "servicios",
        titulo: "Varios servicios en una reserva",
        texto: "Corte y barba, tinte y cepillado: se eligen juntos y la agenda suma el tiempo. Nadie reserva un corte de 30 minutos para un balayage de tres horas.",
      },
      {
        id: "profesional",
        titulo: "Con quien el cliente quiere",
        texto: "Puede elegir a su estilista o dejar que el sistema le asigne a quien esté libre. Solo aparecen quienes saben hacer todo lo que pidió.",
      },
      {
        id: "horas",
        titulo: "Horas que de verdad caben",
        texto: "Solo se muestran los huecos donde el servicio completo termina antes de cerrar.",
      },
    ],
    [`${RAIZ}/panel`]: [
      {
        id: "columnas",
        titulo: "El día por silla",
        texto: "Una columna por profesional: se ve de un vistazo quién está ocupado, quién tiene un hueco y a qué hora termina cada uno.",
      },
      {
        id: "estados",
        titulo: "De la reserva a la caja",
        texto: "Llegó, en la silla, atendido. Al terminar, el servicio pasa a la caja para cobrarlo.",
      },
    ],
    [`${RAIZ}/panel/caja`]: [
      {
        id: "cobrar",
        titulo: "Cobrar en dos toques",
        texto: "Efectivo, Nequi, Daviplata o tarjeta, con la propina aparte para que llegue a quien corresponde.",
      },
      {
        id: "cierre",
        titulo: "El cierre del día, ya hecho",
        texto: "Cuánto entró por cada medio de pago. Cuadrar la caja deja de ser una hora con la calculadora.",
      },
      {
        id: "comisiones",
        titulo: "Comisiones sin discusiones",
        texto: "Lo que le corresponde a cada profesional según su porcentaje, calculado sobre lo que de verdad se cobró.",
      },
    ],
    [`${RAIZ}/panel/clientes`]: [
      {
        id: "buscar",
        titulo: "Cada cliente, con su historia",
        texto: "Por nombre o teléfono: cuándo vino, qué se hizo y cada cuánto vuelve.",
      },
    ],
    [`${RAIZ}/panel/clientes/:id`]: [
      {
        id: "formula",
        titulo: "La fórmula de color guardada",
        texto: "Tonos, oxidante y tiempos de cada visita. La próxima vez sale igual, aunque la atienda otra persona.",
      },
      {
        id: "historial",
        titulo: "Sus visitas y lo que gasta",
        texto: "Servicios, con quién y cuánto pagó. Útil para saber quiénes son los mejores clientes.",
      },
    ],
    [`${RAIZ}/panel/volver`]: [
      {
        id: "lista",
        titulo: "Clientes que se están perdiendo",
        texto: "Quien no viene hace más de 45 días y no tiene nada agendado, ordenado por lo que gastaba. Recuperar a un cliente cuesta menos que conseguir uno nuevo.",
      },
      {
        id: "mensaje",
        titulo: "El mensaje ya escrito",
        texto: "Un toque abre WhatsApp con un saludo personal y el enlace para reservar.",
      },
    ],
  },
}

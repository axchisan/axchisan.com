import type { ConfigDemo } from "@/demos/comun/contexto"

export const RAIZ = "/demo/canela"

/**
 * Niveles de la demo y textos del recorrido "Cómo funciona". Cada explicación
 * habla del beneficio para la clínica, no de cómo está construido.
 */
export const CONFIG_CANELA: ConfigDemo = {
  slug: "canela",
  nombre: "Canela, clínica veterinaria",
  paraQuien: "una veterinaria",
  niveles: [
    { id: "pagina", etiqueta: "Página", planes: ["presencia", "pagina-profesional"] },
    { id: "citas", etiqueta: "Página + citas", planes: ["citas-en-linea"] },
    { id: "sistema", etiqueta: "Sistema completo", planes: ["sistema-de-gestion"] },
  ],
  nivelDeRuta: {
    [`${RAIZ}/agendar`]: "citas",
    [`${RAIZ}/panel`]: "citas",
    [`${RAIZ}/panel/pacientes`]: "sistema",
    [`${RAIZ}/panel/recordatorios`]: "sistema",
    [`${RAIZ}/panel/resumen`]: "sistema",
  },
  recorrido: {
    [RAIZ]: [
      {
        id: "estado",
        titulo: "Abierto o cerrado, en tiempo real",
        texto:
          "La placa usa la hora de quien visita para decir si la clínica está abierta y hasta cuándo atiende urgencias. Nadie tiene que llamar a preguntarlo.",
      },
      {
        id: "acciones",
        titulo: "Dos formas de contactar",
        texto:
          "Agendar lleva a la reserva en línea; WhatsApp abre el chat con un mensaje ya escrito. En el plan Página, agendar se reemplaza por WhatsApp.",
      },
      {
        id: "servicios",
        titulo: "Precios a la vista",
        texto:
          "Mostrar un precio de referencia ahorra buena parte de los mensajes que llegan solo para preguntar cuánto cuesta.",
      },
      {
        id: "cachorro",
        titulo: "Un plan para el primer año",
        texto:
          "Un paquete claro se vende mejor que una lista de vacunas sueltas, y trae al cachorro de vuelta cinco veces durante su primer año.",
      },
      {
        id: "equipo",
        titulo: "Quién atiende",
        texto:
          "La gente elige veterinaria por confianza: nombre, enfoque y días de atención de cada profesional.",
      },
      {
        id: "ubicacion",
        titulo: "Horario y cómo llegar",
        texto: "Horario de cada día, urgencias y el mapa, en un solo lugar.",
      },
      {
        id: "preguntas",
        titulo: "Preguntas frecuentes",
        texto:
          "Responden antes de que pregunten: formas de pago, si atienden gatos, qué llevar a la primera cita.",
      },
    ],
    [`${RAIZ}/agendar`]: [
      {
        id: "pasos",
        titulo: "Cuatro pasos, un minuto",
        texto: "Servicio, mascota, día y hora, y confirmación. Funciona igual desde el celular.",
      },
      {
        id: "telefono",
        titulo: "Reconoce a quien ya es cliente",
        texto:
          "Con el teléfono, la página encuentra al propietario y a sus mascotas y no le pide todo otra vez. Prueba con 300 000 1037.",
      },
      {
        id: "horas",
        titulo: "Solo horas libres",
        texto:
          "Se muestran únicamente los huecos reales de cada profesional, según su horario. No puede haber dos citas a la misma hora.",
      },
      {
        id: "confirmacion",
        titulo: "Confirmación y calendario",
        texto:
          "El cliente recibe el resumen y lo guarda en su calendario. La cita aparece al instante en el panel de la clínica.",
      },
    ],
    [`${RAIZ}/panel`]: [
      {
        id: "resumen",
        titulo: "El día de un vistazo",
        texto: "Cuántas citas hay, cuántas faltan y quién está en consulta ahora mismo.",
      },
      {
        id: "lista",
        titulo: "Estados con un toque",
        texto:
          "Recepción marca quién llegó, quién pasó a consulta y quién no vino. Las ausencias quedan registradas para el resumen del mes.",
      },
      {
        id: "origen",
        titulo: "De dónde vino cada cita",
        texto:
          "Las citas agendadas desde la página se distinguen de las de recepción: así se ve cuánto trabaja la página por la clínica.",
      },
      {
        id: "menu",
        titulo: "Todo en el mismo lugar",
        texto: "Agenda, pacientes, recordatorios y resumen del mes, con usuarios para recepción y veterinarios.",
      },
    ],
    [`${RAIZ}/panel/agenda`]: [
      {
        id: "semana",
        titulo: "La semana por profesional",
        texto: "Cada color es un profesional. Los huecos libres se ven sin buscar.",
      },
      {
        id: "filtro",
        titulo: "Ver solo una agenda",
        texto: "Cada veterinario puede mirar únicamente sus citas.",
      },
    ],
    [`${RAIZ}/panel/pacientes`]: [
      {
        id: "buscar",
        titulo: "Encontrar cualquier paciente",
        texto: "Por nombre de la mascota, del propietario o por teléfono. Sin carpetas ni cajones.",
      },
      {
        id: "estado-vacunas",
        titulo: "Vacunas pendientes a la vista",
        texto: "La lista marca qué pacientes tienen vacunas vencidas o por vencer.",
      },
    ],
    [`${RAIZ}/panel/pacientes/:id`]: [
      {
        id: "alertas",
        titulo: "Alertas antes de atender",
        texto: "Alergias y cuidados especiales, arriba y en rojo. Lo primero que ve el veterinario.",
      },
      {
        id: "peso",
        titulo: "La curva de peso",
        texto: "Cada consulta registra el peso. Un cambio brusco se ve en la gráfica sin hacer cuentas.",
      },
      {
        id: "carnet",
        titulo: "Carnet de vacunas",
        texto: "Qué se aplicó, cuándo, y cuándo toca la siguiente. Vencidas en rojo, próximas en ámbar.",
      },
      {
        id: "historia",
        titulo: "Historia clínica completa",
        texto: "Cada consulta con motivo, examen, diagnóstico, tratamiento y fórmula. Nada se pierde entre turnos.",
      },
    ],
    [`${RAIZ}/panel/pacientes/:id/consulta`]: [
      {
        id: "formulario",
        titulo: "La consulta en el orden de siempre",
        texto: "Motivo, anamnesis, examen, diagnóstico y tratamiento, con el peso del día.",
      },
      {
        id: "formula",
        titulo: "Fórmula lista para imprimir",
        texto: "Los medicamentos quedan en la historia y salen impresos con los datos de la clínica.",
      },
    ],
    [`${RAIZ}/panel/recordatorios`]: [
      {
        id: "lista",
        titulo: "Quién tiene vacunas por vencer",
        texto:
          "La lista se arma sola cada día. Recordar a tiempo es la forma más barata de que un cliente vuelva.",
      },
      {
        id: "enviar",
        titulo: "El mensaje ya escrito",
        texto:
          "Un toque abre WhatsApp con el mensaje para el propietario. Con el módulo de recordatorios automáticos, se envían solos.",
      },
    ],
    [`${RAIZ}/panel/resumen`]: [
      {
        id: "cifras",
        titulo: "Cómo va el mes",
        texto: "Citas atendidas, ausencias, pacientes nuevos y cuántas citas llegaron por la página.",
      },
      {
        id: "servicios",
        titulo: "Qué se pide más",
        texto: "Los servicios más solicitados, para decidir horarios y personal con datos.",
      },
    ],
  },
}

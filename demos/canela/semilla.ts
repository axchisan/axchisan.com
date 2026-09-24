/**
 * Datos de ejemplo de Canela. Todo es inventado: propietarios, teléfonos y
 * mascotas no corresponden a personas reales.
 *
 * Las fechas se calculan alrededor del día de la visita, para que la agenda
 * tenga siempre citas de hoy y los recordatorios siempre tengan vacunas por
 * vencer. El generador es determinista: dos visitas el mismo día ven lo mismo.
 */
import {
  aFecha,
  claveDia,
  claveInstante,
  franjasDelDia,
  PROFESIONALES,
  SERVICIOS,
  sumarDias,
  sumarMinutos,
  type Cita,
  type Consulta,
  type EstadoClinica,
  type Especie,
  type LineaFormula,
  type Mascota,
  type Propietario,
  type Vacuna,
} from "./modelo"

/** Mulberry32: pseudoaleatorio pequeño y reproducible. */
function generador(semilla: number) {
  let a = semilla >>> 0
  const siguiente = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    n: siguiente,
    entero: (min: number, max: number) => min + Math.floor(siguiente() * (max - min + 1)),
    uno: <T,>(xs: readonly T[]) => xs[Math.floor(siguiente() * xs.length)],
    prob: (p: number) => siguiente() < p,
  }
}

const NOMBRES = [
  "María Fernanda", "Juan Camilo", "Andrea", "Santiago", "Valentina", "Carlos Andrés",
  "Daniela", "Felipe", "Natalia", "Sebastián", "Paola", "Julián", "Catalina", "Diego",
  "Laura Sofía", "Mateo", "Diana", "Alejandro", "Juliana", "Nicolás", "Marcela", "Óscar",
  "Tatiana", "Jorge", "Carolina", "Esteban", "Luisa", "Camilo", "Adriana", "Hernán",
  "Lorena", "Ricardo", "Viviana", "Gustavo",
]
const APELLIDOS = [
  "Gómez", "Rodríguez", "Martínez", "López", "García", "Hernández", "Díaz", "Moreno",
  "Ramírez", "Rojas", "Vargas", "Castro", "Suárez", "Ortiz", "Pardo", "Cárdenas",
  "Beltrán", "Salazar", "Pinzón", "Quintero",
]
const BARRIOS = [
  "Chapinero Alto", "Rosales", "Quinta Camacho", "Chicó", "Galerías", "Teusaquillo",
  "La Soledad", "Palermo", "Marly", "El Lago",
]

type Base = [nombre: string, especie: Especie, raza: string, sexo: "macho" | "hembra", kg: number]

const MASCOTAS: Base[] = [
  ["Luna", "perro", "Criolla", "hembra", 12],
  ["Max", "perro", "Labrador", "macho", 30],
  ["Rocky", "perro", "Pitbull", "macho", 26],
  ["Kira", "perro", "Schnauzer miniatura", "hembra", 8],
  ["Toby", "perro", "Shih Tzu", "macho", 6],
  ["Simón", "perro", "Beagle", "macho", 12],
  ["Lola", "perro", "French poodle", "hembra", 5],
  ["Coco", "perro", "Yorkshire terrier", "macho", 3],
  ["Zeus", "perro", "Golden retriever", "macho", 32],
  ["Nala", "perro", "Criolla", "hembra", 15],
  ["Bruno", "perro", "Bulldog francés", "macho", 12],
  ["Mango", "perro", "Criollo", "macho", 18],
  ["Pepa", "perro", "Pug", "hembra", 8],
  ["Chispa", "perro", "Chihuahua", "hembra", 2.5],
  ["Tomás", "perro", "Border collie", "macho", 18],
  ["Frida", "perro", "Dachshund", "hembra", 7],
  ["Oreo", "perro", "Shih Tzu", "macho", 6.5],
  ["Kaiser", "perro", "Pastor alemán", "macho", 34],
  ["Lupe", "perro", "Schnauzer miniatura", "hembra", 7.5],
  ["Sasha", "perro", "Husky siberiano", "hembra", 21],
  ["Bombón", "perro", "Maltés", "hembra", 3.5],
  ["Thor", "perro", "Rottweiler", "macho", 42],
  ["Maya", "perro", "Labrador", "hembra", 27],
  ["Pancho", "perro", "Criollo", "macho", 10],
  ["Dante", "perro", "Beagle", "macho", 13],
  ["Mía", "gato", "Criolla", "hembra", 4],
  ["Simba", "gato", "Criollo", "macho", 5.2],
  ["Michi", "gato", "Siamés", "macho", 4.5],
  ["Nieve", "gato", "Angora", "hembra", 3.8],
  ["Garfield", "gato", "Criollo", "macho", 6.5],
  ["Kitty", "gato", "Persa", "hembra", 4],
  ["Salem", "gato", "Criollo", "macho", 5],
  ["Mora", "gato", "Criolla", "hembra", 3.6],
  ["Pelusa", "gato", "Angora", "hembra", 4.2],
  ["Tigre", "gato", "Criollo", "macho", 5.8],
  ["Olivia", "gato", "Siamés", "hembra", 3.9],
  ["Milo", "gato", "Criollo", "macho", 4.8],
  ["Canica", "gato", "Criolla", "hembra", 3.4],
]

/** Fotos para algunas mascotas; las demás llevan su placa con la inicial. */
const FOTOS: Record<string, string> = {
  Frida: "https://images.unsplash.com/photo-1770836037793-95bdbf190f71",
  Chispa: "https://images.unsplash.com/photo-1654895716780-b4664497420d",
  Nieve: "https://images.unsplash.com/photo-1733783506192-653df6185a7d",
  Tigre: "https://images.unsplash.com/photo-1515002246390-7bf7e8f87b54",
  Bombón: "https://images.unsplash.com/photo-1588626863948-1d7978596f17",
}

const ALERGIAS = ["Penicilina", "Picadura de pulga", "Pollo en la dieta"]
const ALERTAS_PERRO = [
  "Se estresa al manipularle las orejas: usar bozal suave",
  "Reacción leve a la vacuna de leptospira en 2025",
]
/** Razas de cara chata: la alerta no es azar, la lleva toda la raza. */
const BRAQUICEFALOS = ["Pug", "Bulldog francés", "Shih Tzu", "Persa"]
const ALERTAS_GATO = ["Agresivo en consulta: usar toalla y manejo tranquilo", "Enfermedad renal en seguimiento"]

const VACUNAS: Record<Especie, { nombre: string; cadaDias: number }[]> = {
  perro: [
    { nombre: "Múltiple canina", cadaDias: 365 },
    { nombre: "Rabia", cadaDias: 365 },
    { nombre: "Tos de las perreras", cadaDias: 365 },
    { nombre: "Desparasitación interna", cadaDias: 90 },
  ],
  gato: [
    { nombre: "Triple felina", cadaDias: 365 },
    { nombre: "Rabia", cadaDias: 365 },
    { nombre: "Leucemia felina", cadaDias: 365 },
    { nombre: "Desparasitación interna", cadaDias: 90 },
  ],
}

type Plantilla = Omit<Consulta, "id" | "mascotaId" | "fecha" | "profesionalId"> & {
  profesional: string
  /** Si la consulta solo tiene sentido para ciertas mascotas. */
  aplica?: (m: Pick<Mascota, "sexo" | "raza">) => boolean
}

const f = (medicamento: string, indicacion: string): LineaFormula => ({ medicamento, indicacion })

const CONSULTAS: Record<Especie, Plantilla[]> = {
  perro: [
    {
      profesional: "laura",
      motivo: "Control anual y vacunación",
      anamnesis: "El propietario refiere buen estado general. Come y juega normal, sin vómito ni diarrea.",
      examen: "T 38,6 °C. FC 96 lpm. Mucosas rosadas, TLLC < 2 s. Condición corporal 5/9.",
      diagnostico: "Paciente sano.",
      tratamiento: "Se aplican vacuna múltiple y antirrábica. Próximo control en 12 meses.",
      formula: [],
    },
    {
      profesional: "laura",
      motivo: "Vómito y diarrea desde anoche",
      anamnesis: "Vomitó tres veces desde anoche y tiene heces blandas. Comió algo del suelo en el parque.",
      examen: "T 39,1 °C. Deshidratación leve (5 %). Dolor abdominal leve a la palpación.",
      diagnostico: "Gastroenteritis aguda por indiscreción alimentaria.",
      tratamiento: "Dieta blanda por 3 días e hidratación oral. Volver si no mejora en 48 horas.",
      formula: [
        f("Metoclopramida 5 mg", "Media tableta cada 8 horas por 3 días"),
        f("Probiótico veterinario", "Un sobre al día por 5 días"),
      ],
    },
    {
      profesional: "paula",
      motivo: "Se rasca la oreja derecha",
      anamnesis: "Hace una semana se rasca la oreja derecha y sacude la cabeza.",
      examen: "Conducto auditivo derecho enrojecido, con secreción marrón. Citología: levaduras.",
      diagnostico: "Otitis externa por Malassezia.",
      tratamiento: "Limpieza de oídos en consulta y tratamiento tópico. Control en 10 días.",
      formula: [
        f("Limpiador ótico", "Cada 48 horas por 2 semanas"),
        f("Gotas óticas clotrimazol + gentamicina", "5 gotas en el oído derecho cada 12 horas por 10 días"),
      ],
    },
    {
      profesional: "paula",
      motivo: "Picazón y caída de pelo en la cola",
      anamnesis: "Se muerde la base de la cola. En la casa hay otro perro que sale al parque.",
      examen: "Alopecia y costras en región lumbosacra. Se observan pulgas y excrementos de pulga.",
      diagnostico: "Dermatitis alérgica por picadura de pulga.",
      tratamiento: "Control de pulgas a todos los animales de la casa y limpieza del entorno.",
      formula: [
        f("Fluralaner tableta masticable", "Una tableta según peso, repetir en 12 semanas"),
        f("Champú de clorhexidina 2 %", "Baño cada 3 días por 2 semanas"),
      ],
    },
    {
      profesional: "andres",
      motivo: "Cojea de la pata trasera izquierda",
      anamnesis: "Empezó a cojear ayer después de correr en el parque.",
      examen: "Dolor a la extensión de la rodilla izquierda. Prueba de cajón negativa.",
      diagnostico: "Esguince leve de rodilla izquierda.",
      tratamiento: "Reposo 10 días y paseos cortos con correa. Control si no mejora.",
      formula: [f("Meloxicam 1,5 mg/ml suspensión", "Según peso, una vez al día por 5 días, con comida")],
    },
    {
      profesional: "andres",
      aplica: (m) => m.sexo === "hembra",
      motivo: "Valoración para esterilización",
      anamnesis: "Los propietarios quieren esterilizarla. Sin enfermedades previas.",
      examen: "Examen físico normal. Cuadro hemático y química sanguínea dentro de rangos.",
      diagnostico: "Apta para cirugía.",
      tratamiento: "Se programa ovariohisterectomía. Ayuno de 8 horas antes de la cirugía.",
      formula: [],
    },
  ],
  gato: [
    {
      profesional: "laura",
      motivo: "Control anual y vacunación",
      anamnesis: "Gato de apartamento, sin salidas. Come bien y usa la arena con normalidad.",
      examen: "T 38,4 °C. Condición corporal 5/9. Boca y oídos sin alteraciones.",
      diagnostico: "Paciente sano.",
      tratamiento: "Se aplica triple felina. Próximo control en 12 meses.",
      formula: [],
    },
    {
      profesional: "laura",
      motivo: "No come hace dos días",
      anamnesis: "No come desde hace dos días y se esconde debajo de la cama.",
      examen: "T 39,4 °C. Encías inflamadas, con dolor al abrir la boca.",
      diagnostico: "Gingivoestomatitis.",
      tratamiento: "Analgesia y alimento húmedo. Se programa limpieza dental.",
      formula: [f("Meloxicam oral felino", "Según peso, una vez al día por 4 días")],
    },
    {
      profesional: "laura",
      motivo: "Va mucho a la arena y orina poco",
      anamnesis: "Desde hace dos días entra a la arena muchas veces y sale poca orina.",
      examen: "Vejiga pequeña y dolorosa a la palpación. Uroanálisis sin cristales.",
      diagnostico: "Cistitis idiopática felina.",
      tratamiento: "Aumentar el consumo de agua, dieta húmeda y reducir el estrés en casa.",
      formula: [f("Suplemento urinario felino", "Una cápsula al día por 30 días")],
    },
    {
      profesional: "paula",
      aplica: (m) => m.raza === "Angora" || m.raza === "Persa",
      motivo: "Vomita bolas de pelo",
      anamnesis: "Vomita bolas de pelo dos o tres veces por semana. Pelo largo, se acicala mucho.",
      examen: "Buen estado general. Abdomen sin dolor.",
      diagnostico: "Tricobezoares.",
      tratamiento: "Cepillado diario y alimento con fibra.",
      formula: [f("Pasta de malta", "2 cm al día por 2 semanas, luego 2 veces por semana")],
    },
  ],
}

/** Genera el estado inicial de la clínica alrededor de `hoy`. */
export function generarClinica(ahora = new Date()): EstadoClinica {
  const r = generador(20260924)
  const hoy = claveDia(ahora)

  const propietarios: Propietario[] = []
  const mascotas: Mascota[] = []
  const vacunas: Vacuna[] = []
  const consultas: Consulta[] = []
  const citas: Cita[] = []

  // Cuatro de cada cinco propietarios tienen una mascota; los demás, dos.
  let iProp = 0
  let propActual: Propietario | null = null
  MASCOTAS.forEach(([nombre, especie, raza, sexo, kg], i) => {
    if (!propActual || !r.prob(0.2)) {
      iProp += 1
      propActual = {
        id: `p${iProp}`,
        nombre: `${NOMBRES[(iProp * 7) % NOMBRES.length]} ${r.uno(APELLIDOS)} ${r.uno(APELLIDOS)}`,
        telefono: `300 000 ${String(1000 + iProp * 37).slice(-4)}`,
        barrio: r.uno(BARRIOS),
      }
      propietarios.push(propActual)
    }

    const id = `m${i + 1}`
    const edadMeses = r.prob(0.12) ? r.entero(3, 11) : r.entero(14, 150)
    const nacimiento = sumarDias(hoy, -Math.round(edadMeses * 30.4) - r.entero(0, 20))

    // Curva de peso: sube hasta la edad adulta y oscila después.
    const pesos: Mascota["pesos"] = []
    const tomas = r.entero(3, 6)
    for (let t = tomas; t >= 1; t--) {
      const hace = t * r.entero(70, 130)
      if (hace > edadMeses * 30) continue
      const madurez = Math.min(1, (edadMeses * 30 - hace) / 330)
      const valor = kg * (0.35 + 0.65 * madurez) * (1 + (r.n() - 0.5) * 0.08)
      pesos.push({ fecha: sumarDias(hoy, -hace), kg: Math.round(valor * 10) / 10 })
    }
    if (pesos.length === 0) pesos.push({ fecha: sumarDias(hoy, -r.entero(5, 40)), kg })

    mascotas.push({
      id,
      propietarioId: propActual.id,
      nombre,
      especie,
      raza,
      sexo,
      esterilizado: edadMeses > 12 && r.prob(0.65),
      nacimiento,
      pesos,
      alergias: r.prob(0.15) ? [r.uno(ALERGIAS)] : [],
      alertas: [
        ...(BRAQUICEFALOS.includes(raza) ? ["Braquicéfalo: precaución con la sedación y el calor"] : []),
        ...(r.prob(0.15) ? [r.uno(especie === "perro" ? ALERTAS_PERRO : ALERTAS_GATO)] : []),
      ],
      foto: FOTOS[nombre],
    })

    // Vacunas: la fecha de aplicación reparte las mascotas entre al día,
    // próximas a vencer y vencidas, que es lo que llena los recordatorios.
    if (edadMeses >= 3) {
      VACUNAS[especie].forEach((v, j) => {
        const hace =
          v.cadaDias === 90
            ? r.entero(10, 100)
            : r.prob(0.22)
              ? r.entero(335, 380)
              : r.entero(20, 345)
        const aplicada = sumarDias(hoy, -hace)
        vacunas.push({
          id: `${id}v${j}`,
          mascotaId: id,
          nombre: v.nombre,
          aplicada,
          proxima: sumarDias(aplicada, v.cadaDias),
        })
      })
    }

    // Historia clínica: entre una y cuatro consultas en los últimos dos años,
    // sin repetir motivo en la misma mascota.
    const posibles = CONSULTAS[especie]
      .filter((c) => !c.aplica || c.aplica({ sexo, raza }))
      .map((c) => ({ c, orden: r.n() }))
      .sort((a, b) => a.orden - b.orden)
      .map((x) => x.c)
    const n = Math.min(r.entero(1, 4), posibles.length)
    for (let c = 0; c < n; c++) {
      const p = posibles[c]
      const hace = r.entero(15, Math.min(700, Math.max(20, edadMeses * 30 - 10)))
      const { profesional, ...contenido } = p
      consultas.push({
        id: `${id}c${c}`,
        mascotaId: id,
        fecha: `${sumarDias(hoy, -hace)}T${String(r.entero(8, 18)).padStart(2, "0")}:${r.prob(0.5) ? "00" : "30"}`,
        profesionalId: profesional,
        ...contenido,
      })
    }
  })

  // Agenda: diez días atrás y diez adelante.
  const ocupadas = new Set<string>()
  const pesoServicio: [string, number][] = [
    ["consulta", 5],
    ["vacunacion", 4],
    ["desparasitacion", 2],
    ["dermatologia", 2],
    ["cirugia", 1],
    ["laboratorio", 1],
    ["peluqueria", 3],
  ]
  const total = pesoServicio.reduce((a, [, w]) => a + w, 0)
  const elegirServicio = () => {
    let x = r.n() * total
    for (const [id, w] of pesoServicio) {
      x -= w
      if (x < 0) return id
    }
    return "consulta"
  }

  const ahoraClave = claveInstante(ahora)
  let nCita = 0
  for (let d = -10; d <= 10; d++) {
    const dia = sumarDias(hoy, d)
    const diaSemana = aFecha(dia).getDay()
    const densidad = d < 0 ? 0.75 : d === 0 ? 0.85 : Math.max(0.15, 0.6 - d * 0.05)
    for (const inicio of franjasDelDia(dia)) {
      for (const prof of PROFESIONALES) {
        if (!prof.dias.includes(diaSemana) || !r.prob(densidad / 2)) continue
        const servicioId = elegirServicio()
        const servicio = SERVICIOS.find((s) => s.id === servicioId)!
        if (!servicio.profesionales.includes(prof.id)) continue
        const clave = `${prof.id}|${inicio}`
        const sigue = `${prof.id}|${sumarMinutos(inicio, 30)}`
        if (ocupadas.has(clave) || (servicio.duracionMin === 60 && ocupadas.has(sigue))) continue
        ocupadas.add(clave)
        if (servicio.duracionMin === 60) ocupadas.add(sigue)

        const mascota = r.uno(mascotas)
        if (servicioId === "peluqueria" && mascota.especie === "gato" && r.prob(0.7)) continue

        const fin = sumarMinutos(inicio, servicio.duracionMin)
        const estado: Cita["estado"] =
          fin <= ahoraClave
            ? r.prob(0.9)
              ? "atendida"
              : "no-asistio"
            : inicio <= ahoraClave
              ? "en-sala"
              : "agendada"

        nCita += 1
        citas.push({
          id: `a${nCita}`,
          mascotaId: mascota.id,
          servicioId,
          profesionalId: prof.id,
          inicio,
          estado,
          origen: r.prob(0.45) ? "web" : "recepcion",
        })
      }
    }
  }

  return { referencia: hoy, propietarios, mascotas, vacunas, consultas, citas }
}

/**
 * Corre todas las fechas los días que pasaron desde la última visita. Así una
 * demo abierta hace una semana conserva lo que el visitante hizo y aun así
 * muestra una agenda de hoy.
 */
export function ponerAlDia(estado: EstadoClinica, ahora = new Date()): EstadoClinica {
  const hoy = claveDia(ahora)
  const dias = Math.round((aFecha(hoy).getTime() - aFecha(estado.referencia).getTime()) / 86_400_000)
  if (dias === 0) return estado
  const mover = (c: string) => sumarDias(c, dias)
  return {
    referencia: hoy,
    propietarios: estado.propietarios,
    mascotas: estado.mascotas.map((m) => ({
      ...m,
      nacimiento: mover(m.nacimiento),
      pesos: m.pesos.map((p) => ({ ...p, fecha: mover(p.fecha) })),
    })),
    vacunas: estado.vacunas.map((v) => ({
      ...v,
      aplicada: mover(v.aplicada),
      proxima: mover(v.proxima),
      recordada: v.recordada && mover(v.recordada),
    })),
    consultas: estado.consultas.map((c) => ({ ...c, fecha: mover(c.fecha) })),
    citas: estado.citas.map((c) => ({ ...c, inicio: mover(c.inicio) })),
  }
}

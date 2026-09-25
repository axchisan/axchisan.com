/**
 * Datos de ejemplo de Molar 116: pacientes con su odontograma, presupuestos con
 * abonos y un mes de agenda alrededor del día del visitante.
 */
import { estaLibre, type CitaAgenda } from "@/demos/motores/agenda/disponibilidad"
import { claveDia, claveInstante, finDeFranja, franjasDelDia, generador, sumarDias, sumarMinutos } from "@/demos/motores/agenda/tiempo"
import {
  ARCADA_INFERIOR,
  ARCADA_SUPERIOR,
  FRANJAS,
  MOTIVOS,
  ODONTOLOGOS,
  planDe,
  type Cara,
  type Cita,
  type EstadoConsultorio,
  type MetodoPago,
  type Odontograma,
  type Paciente,
} from "./modelo"

const NOMBRES = ["María Fernanda", "Juan Sebastián", "Valentina", "Carlos Andrés", "Ana María", "Santiago", "Laura", "Felipe", "Natalia", "Andrés", "Daniela", "Ricardo", "Paula", "Mauricio", "Catalina", "Jorge", "Isabel", "Martín", "Gabriela", "Hernán"]
const APELLIDOS = ["Arango", "Holguín", "Pombo", "Samper", "Cuéllar", "Lozano", "Umaña", "Escobar", "Villegas", "Caicedo", "Zuluaga", "Montoya", "Duque", "Téllez", "Serrano", "Gutiérrez"]
const CARAS: Cara[] = ["V", "L", "M", "D", "O"]
const ALERGIAS = ["Penicilina", "Látex", "Ibuprofeno"]
const NOTAS = ["Le da ansiedad la fresa: explicarle cada paso y hacer pausas.", "Aprieta los dientes de noche; se le recomendó placa.", "Prefiere citas temprano, antes de las 8:00 a. m."]

type R = ReturnType<typeof generador>

function odontogramaAlAzar(r: R): Odontograma {
  const o: Odontograma = {}
  for (const n of [...ARCADA_SUPERIOR, ...ARCADA_INFERIOR]) {
    const cordal = n % 10 === 8
    if (cordal && r.prob(0.45)) {
      o[n] = { pieza: r.prob(0.3) ? "extraccion" : "ausente" }
      continue
    }
    if (!cordal && n % 10 >= 6 && r.prob(0.05)) {
      o[n] = { pieza: "ausente" }
      continue
    }
    const caras: Partial<Record<Cara, "caries" | "resina">> = {}
    if (r.prob(0.22)) for (const c of CARAS) if (r.prob(0.35)) caras[c] = "resina"
    if (r.prob(0.08)) caras[r.uno(CARAS)] = "caries"
    const d: Odontograma[number] = Object.keys(caras).length ? { caras } : {}
    if (r.prob(0.03)) d.pieza = "endodoncia-hecha"
    else if (r.prob(0.02)) d.pieza = "corona-hecha"
    else if (n % 10 >= 4 && r.prob(0.015)) d.pieza = "endodoncia"
    if (d.caras || d.pieza) o[n] = d
  }
  return o
}

export function generarConsultorio(ahora = new Date()): EstadoConsultorio {
  const r = generador(116)
  const hoy = claveDia(ahora)
  const ahoraClave = claveInstante(ahora)

  const pacientes: Paciente[] = Array.from({ length: 36 }, (_, i) => {
    const odontograma = odontogramaAlAzar(r)
    const plan = planDe(odontograma)
    const pendiente = plan.reduce((t, x) => t + x.precio, 0)
    // Un tercio aprobó su presupuesto y va abonando.
    const aprobo = pendiente > 0 && r.prob(0.55)
    const aprobado = aprobo ? pendiente + r.uno([0, 150_000, 480_000]) : undefined
    const abonos: Paciente["abonos"] = []
    if (aprobado) {
      let abonado = 0
      for (let k = r.entero(0, 3); k > 0; k--) {
        const valor = Math.min(aprobado - abonado, r.uno([100_000, 150_000, 200_000, 300_000]))
        if (valor <= 0) break
        abonado += valor
        abonos.push({ fecha: sumarDias(hoy, -r.entero(5, 80)), valor, metodo: r.uno<MetodoPago>(["efectivo", "nequi", "tarjeta", "transferencia"]) })
      }
      abonos.sort((a, b) => a.fecha.localeCompare(b.fecha))
    }
    const nombre = `${r.uno(NOMBRES)} ${r.uno(APELLIDOS)} ${r.uno(APELLIDOS)}`
    return {
      id: `p${i + 1}`,
      nombre,
      documento: `${r.entero(10, 1_100)}.${r.entero(100, 999)}.${r.entero(100, 999)}`,
      telefono: `3${r.entero(0, 2)}${r.entero(0, 9)} ${r.entero(100, 999)} ${r.entero(1000, 9999)}`,
      nacimiento: `${r.entero(1958, 2012)}-${String(r.entero(1, 12)).padStart(2, "0")}-${String(r.entero(1, 28)).padStart(2, "0")}`,
      alergias: r.prob(0.12) ? r.uno(ALERGIAS) : undefined,
      odontograma,
      aprobado,
      abonos,
      hechos: [],
      ultimaLimpieza: r.prob(0.7) ? sumarDias(hoy, -r.entero(20, 320)) : undefined,
      notas: r.prob(0.1) ? r.uno(NOTAS) : undefined,
    }
  })

  // Agenda: tres semanas atrás y dos adelante, sin cruces por odontólogo.
  const citas: Cita[] = []
  const agenda: CitaAgenda[] = []
  let id = 1
  for (let d = -21; d <= 14; d++) {
    const dia = sumarDias(hoy, d)
    const franjas = franjasDelDia(dia, FRANJAS)
    if (!franjas.length) continue
    const cuantas = d === 0 ? 14 : d > 0 ? Math.max(2, 10 - d / 2) : r.entero(8, 13)
    for (let k = 0; k < cuantas * 3 && citas.filter((c) => c.inicio.startsWith(dia)).length < cuantas; k++) {
      const m = r.uno(MOTIVOS)
      const odontologoId = r.uno(m.odontologos)
      const dias = ODONTOLOGOS.find((o) => o.id === odontologoId)!.dias
      if (!dias.includes(new Date(`${dia}T12:00`).getDay())) continue
      const inicio = r.uno(franjas)
      const cierre = finDeFranja(dia, FRANJAS)
      if (!cierre || sumarMinutos(inicio, m.duracionMin) > cierre) continue
      if (!estaLibre(agenda, odontologoId, inicio, m.duracionMin)) continue
      const pasada = inicio < ahoraClave
      const enCurso = pasada && sumarMinutos(inicio, m.duracionMin) > ahoraClave
      const estado = enCurso ? "llego" : pasada ? (r.prob(0.9) ? "atendida" : "no-asistio") : "agendada"
      agenda.push({ profesionalId: odontologoId, inicio, duracionMin: m.duracionMin, ocupa: true })
      citas.push({ id: `c${id++}`, pacienteId: r.uno(pacientes).id, motivo: m.id, odontologoId, inicio, estado, origen: r.prob(0.45) ? "web" : "recepcion" })
    }
  }
  citas.sort((a, b) => a.inicio.localeCompare(b.inicio))
  return { referencia: hoy, pacientes, citas }
}

/**
 * Otro día: la agenda se regenera, pero los pacientes (con lo que el visitante
 * les haya marcado en el odontograma o abonado) se conservan.
 */
export function ponerAlDia(e: EstadoConsultorio): EstadoConsultorio {
  if (e.referencia === claveDia(new Date())) return e
  const nuevo = generarConsultorio()
  return { ...nuevo, pacientes: e.pacientes }
}


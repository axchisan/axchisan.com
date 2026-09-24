/**
 * Datos de ejemplo de Peine Fino. Clientes, teléfonos y citas son inventados.
 *
 * Cada cliente tiene un ritmo: los de barbería vuelven cada tres o cuatro
 * semanas, los de color cada dos meses, los de uñas cada dos o tres semanas.
 * Con ese ritmo se generan tres meses de historia alrededor del día de la
 * visita, y los que rompieron el ritmo aparecen solos en "Clientes que no
 * vuelven".
 */
import {
  aFecha,
  claveDia,
  claveInstante,
  finDeFranja,
  franjasDelDia,
  generador,
  sumarDias,
  sumarMinutos,
} from "@/demos/motores/agenda/tiempo"
import { estaLibre, type CitaAgenda } from "@/demos/motores/agenda/disponibilidad"
import {
  duracion,
  FRANJAS,
  PROFESIONALES,
  precio,
  quienesHacen,
  type Cita,
  type Cliente,
  type EstadoSalon,
  type MetodoPago,
} from "./modelo"

const NOMBRES_H = ["Santiago", "Juan David", "Andrés Felipe", "Camilo", "Sebastián", "Nicolás", "Julián", "Mateo", "Daniel", "Esteban", "Felipe", "Óscar", "Diego", "Tomás", "Alejandro"]
const NOMBRES_M = ["Valentina", "Daniela", "Laura", "Mariana", "Carolina", "Paula", "Natalia", "Juliana", "Catalina", "Sara", "Diana", "Tatiana", "Luisa", "Andrea", "Lorena", "Gabriela"]
const APELLIDOS = ["Gómez", "Rodríguez", "Martínez", "López", "Ramírez", "Rojas", "Vargas", "Castro", "Suárez", "Ortiz", "Pardo", "Cárdenas", "Beltrán", "Salazar", "Pinzón", "Quintero", "Mejía", "Acosta"]

/** Perfiles de cliente: qué pide y cada cuántos días vuelve. */
const PERFILES: { servicios: string[][]; cada: [number, number]; mujer: boolean; peso: number }[] = [
  { servicios: [["corte-hombre"], ["corte-hombre", "barba"], ["corte-hombre", "cejas-hombre"]], cada: [18, 32], mujer: false, peso: 5 },
  { servicios: [["corte-dama"], ["cepillado"], ["corte-dama", "cepillado"], ["hidratacion"]], cada: [28, 50], mujer: true, peso: 3 },
  { servicios: [["tinte"], ["tinte", "cepillado"], ["balayage"]], cada: [45, 70], mujer: true, peso: 2 },
  { servicios: [["semipermanente"], ["manicure", "pedicure"], ["semipermanente", "cejas"], ["pestanas"]], cada: [14, 28], mujer: true, peso: 3 },
]

const FORMULAS = [
  "Raíz: 6.1 + 7.1 (1:1), oxidante 20 vol, 35 min. Medios y puntas: gloss 9.12 por 15 min.",
  "Balayage a mano alzada: decolorante con oxidante 30 vol en medios y puntas, matiz 10.21 por 20 min.",
  "Raíz: 5.0 cubrir canas, oxidante 20 vol, 40 min. Evitar el 4 rojizo: le dio un tono cobrizo en 2025.",
  "Mechas finas con gorro, oxidante 20 vol, 30 min. Matiz perla 9.2. Cuero cabelludo sensible: usar protector.",
]

const NOTAS = [
  "Prefiere que no le hablen mucho durante el servicio.",
  "Le gusta el degradado bajo, nunca por encima de la sien.",
  "Alérgica al esmalte en gel con HEMA: usar línea hipoalergénica.",
  "Siempre pide café sin azúcar.",
  "Viene con el hijo de 8 años; agendar juntos si se puede.",
]

const METODOS: MetodoPago[] = ["efectivo", "efectivo", "nequi", "nequi", "daviplata", "tarjeta"]

export function generarSalon(ahora = new Date()): EstadoSalon {
  const r = generador(20260925)
  const hoy = claveDia(ahora)
  const ahoraClave = claveInstante(ahora)
  const clientes: Cliente[] = []
  const citas: Cita[] = []
  const agenda: CitaAgenda[] = []

  const pesoTotal = PERFILES.reduce((t, p) => t + p.peso, 0)
  const elegirPerfil = () => {
    let x = r.n() * pesoTotal
    for (const p of PERFILES) {
      x -= p.peso
      if (x < 0) return p
    }
    return PERFILES[0]
  }

  /** Busca la primera hora libre de un día para esos servicios. */
  function ubicar(dia: string, servicios: string[], preferido?: string) {
    const dur = duracion(servicios)
    const candidatos = quienesHacen(servicios)
    const orden = preferido && candidatos.includes(preferido) ? [preferido, ...candidatos.filter((c) => c !== preferido)] : candidatos
    const inicios = franjasDelDia(dia, FRANJAS)
    const cierre = finDeFranja(dia, FRANJAS)
    const desde = r.entero(0, Math.max(0, inicios.length - 1))
    for (let k = 0; k < inicios.length; k++) {
      const inicio = inicios[(desde + k) % inicios.length]
      for (const p of orden) {
        const prof = PROFESIONALES.find((x) => x.id === p)!
        if (!prof.dias.includes(aFecha(dia).getDay())) continue
        if (sumarMinutos(inicio, dur) > cierre!) continue
        if (estaLibre(agenda, p, inicio, dur)) return { inicio, profesionalId: p }
      }
    }
    return null
  }

  let nCita = 0
  const perfilDe = new Map<string, (typeof PERFILES)[number]>()

  function agregar(cliente: Cliente, servicios: string[], hueco: { inicio: string; profesionalId: string }) {
    const dur = duracion(servicios)
    const terminada = sumarMinutos(hueco.inicio, dur) <= ahoraClave
    const empezada = hueco.inicio <= ahoraClave
    const falta = terminada && r.prob(0.06)
    const estado: Cita["estado"] = falta ? "no-asistio" : terminada ? "atendida" : empezada ? "en-silla" : "agendada"
    // Las de hoy ya atendidas quedan por cobrar en algunos casos: así la caja
    // del día tiene algo que hacer.
    const cobrada = estado === "atendida" && !(hueco.inicio.startsWith(hoy) && r.prob(0.25))
    nCita += 1
    citas.push({
      id: `a${nCita}`,
      clienteId: cliente.id,
      servicios,
      profesionalId: hueco.profesionalId,
      inicio: hueco.inicio,
      estado,
      origen: r.prob(0.5) ? "web" : "recepcion",
      pago: cobrada
        ? { metodo: r.uno(METODOS), total: precio(servicios), propina: r.prob(0.35) ? r.uno([2_000, 3_000, 5_000, 10_000]) : 0 }
        : undefined,
    })
    // En los datos de ejemplo una ausencia también ocupa su espacio: si no, la
    // columna del día mostraría dos citas encimadas.
    agenda.push({ profesionalId: hueco.profesionalId, inicio: hueco.inicio, duracionMin: dur, ocupa: true })
    if (estado === "atendida" && servicios.some((x) => x === "tinte" || x === "balayage")) {
      cliente.formulas.push({ fecha: hueco.inicio.slice(0, 10), profesionalId: hueco.profesionalId, texto: r.uno(FORMULAS) })
    }
  }

  for (let i = 1; i <= 72; i++) {
    const perfil = elegirPerfil()
    const nombre = `${r.uno(perfil.mujer ? NOMBRES_M : NOMBRES_H)} ${r.uno(APELLIDOS)}`
    const cliente: Cliente = {
      id: `c${i}`,
      nombre,
      telefono: `301 000 ${String(1000 + i * 29).slice(-4)}`,
      notas: r.prob(0.18) ? r.uno(NOTAS.filter((n) => perfil.mujer || !n.includes("Alérgica"))) : undefined,
      formulas: [],
    }
    clientes.push(cliente)

    // Un cliente de cada cinco rompió su ritmo: su última visita quedó atrás.
    const perdido = r.prob(0.2)
    const [min, max] = perfil.cada
    let dia = sumarDias(hoy, -r.entero(80, 100))
    const fin = perdido ? sumarDias(hoy, -r.entero(50, 75)) : sumarDias(hoy, 10)
    const preferido = r.uno(quienesHacen(perfil.servicios[0]))
    perfilDe.set(cliente.id, perfil)

    while (dia <= fin) {
      const servicios = r.uno(perfil.servicios)
      const hueco = ubicar(dia, servicios, preferido)
      if (hueco) agregar(cliente, servicios, hueco)
      dia = sumarDias(dia, r.entero(min, max))
    }
  }

  // La historia de cada cliente casi nunca cae justo hoy. Se llena la agenda
  // de hoy y de la semana con clientes activos, como estaría un salón real.
  const hace50 = sumarDias(hoy, -50)
  const activos = clientes.filter((c) => citas.some((x) => x.clienteId === c.id && x.inicio.slice(0, 10) > hace50))
  for (let d = -1; d <= 7; d++) {
    const dia = sumarDias(hoy, d)
    const meta = d === 0 ? 18 : d < 0 ? 14 : Math.max(5, 13 - d)
    for (let k = 0; k < meta * 2 && citas.filter((c) => c.inicio.startsWith(dia)).length < meta; k++) {
      const cliente = r.uno(activos)
      const servicios = r.uno(perfilDe.get(cliente.id)!.servicios)
      const hueco = ubicar(dia, servicios)
      if (hueco) agregar(cliente, servicios, hueco)
    }
  }

  return { referencia: hoy, clientes, citas }
}

/** Corre las fechas los días que pasaron desde la última visita a la demo. */
export function ponerAlDia(estado: EstadoSalon, ahora = new Date()): EstadoSalon {
  const hoy = claveDia(ahora)
  const dias = Math.round((aFecha(hoy).getTime() - aFecha(estado.referencia).getTime()) / 86_400_000)
  if (dias === 0) return estado
  const mover = (c: string) => sumarDias(c, dias)
  return {
    referencia: hoy,
    clientes: estado.clientes.map((c) => ({
      ...c,
      contactado: c.contactado && mover(c.contactado),
      formulas: c.formulas.map((f) => ({ ...f, fecha: mover(f.fecha) })),
    })),
    citas: estado.citas.map((c) => ({ ...c, inicio: mover(c.inicio) })),
  }
}

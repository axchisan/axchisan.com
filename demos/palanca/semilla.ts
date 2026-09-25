/**
 * Datos de ejemplo de Palanca: socios con membresías en todos los estados, dos
 * semanas de asistencia y la próxima semana reservada, con alguna clase llena
 * y lista de espera.
 */
import { claveDia, claveInstante, generador, sumarDias, sumarMinutos } from "@/demos/motores/agenda/tiempo"
import { estadoMembresia, sesionesEntre, type Reserva } from "@/demos/motores/clases/cupos"
import { HORARIO, PLANES, type EstadoGimnasio, type MetodoPago, type Pago, type Socio } from "./modelo"

const NOMBRES = ["Juliana", "Andrés", "Mariana", "Camilo", "Isabella", "Santiago", "Valeria", "Sebastián", "Laura", "Mateo", "Daniela", "Felipe", "Sara", "Nicolás", "Paula", "Jorge", "Luisa", "Esteban", "Ana Sofía", "David"]
const APELLIDOS = ["Caicedo", "Lozano", "Mosquera", "Ocampo", "Becerra", "Arboleda", "Garcés", "Valencia", "Cabal", "Satizábal", "Rengifo", "Hurtado", "Zapata", "Muñoz"]

export function generarGimnasio(ahora = new Date()): EstadoGimnasio {
  const r = generador(72)
  const hoy = claveDia(ahora)
  const ahoraClave = claveInstante(ahora)
  const socios: Socio[] = []
  const pagos: Pago[] = []

  for (let i = 0; i < 64; i++) {
    const p = r.uno([PLANES[0], PLANES[0], PLANES[0], PLANES[1], PLANES[1], PLANES[2]])
    // La fecha de pago reparte los vencimientos: unos al día, otros por vencer y otros vencidos.
    const pagado = sumarDias(hoy, -r.entero(0, p.dias + 20))
    const vence = sumarDias(pagado, p.dias - 1)
    const clases = p.clases !== undefined ? Math.max(0, p.clases - r.entero(2, 13)) : undefined
    const id = `s${i + 1}`
    socios.push({
      id,
      nombre: `${r.uno(NOMBRES)} ${r.uno(APELLIDOS)}`,
      documento: `${r.entero(1_000, 1_150)}.${r.entero(100, 999)}.${r.entero(100, 999)}`,
      telefono: `3${r.entero(0, 2)}${r.entero(0, 9)} ${r.entero(100, 999)} ${r.entero(1000, 9999)}`,
      membresia: { planId: p.id, inicio: pagado, vence, clasesRestantes: clases },
      alta: sumarDias(pagado, -r.entero(0, 400)),
    })
    pagos.push({ id: `g${i + 1}`, socioId: id, planId: p.id, valor: p.precio, fecha: pagado, metodo: r.uno<MetodoPago>(["nequi", "nequi", "efectivo", "tarjeta", "transferencia"]) })
  }

  // Reservas: dos semanas atrás y una adelante. Los socios activos reservan
  // más; algunas clases de la noche se llenan.
  const reservas: Reserva[] = []
  let n = 1
  for (const s of sesionesEntre(HORARIO, sumarDias(hoy, -14), 22)) {
    const pasada = s.fin <= ahoraClave
    const futuro = s.inicio > ahoraClave
    const lejos = s.inicio > `${sumarDias(hoy, 3)}T23:59`
    const noche = s.hora >= "17:30"
    const base = noche ? 0.85 : s.hora === "12:15" ? 0.5 : 0.65
    // La clase de las 6:30 p. m. de los próximos días siempre se llena: así la
    // demo muestra la lista de espera.
    const llenaSeguro = futuro && s.hora === "18:30" && s.inicio <= `${sumarDias(hoy, 4)}T23:59`
    const quiere = llenaSeguro ? s.cupo + 2 : Math.round(s.cupo * base * (lejos ? 0.4 : 1) + r.entero(-2, noche && !lejos ? 5 : 1))
    const candidatos = socios.filter((x) => {
      const e = estadoMembresia(x.membresia, s.inicio.slice(0, 10))
      return e === "activa" || e === "por-vencer"
    })
    const elegidos = new Set<string>()
    for (let k = 0; k < quiere && elegidos.size < candidatos.length; k++) elegidos.add(r.uno(candidatos).id)
    let i = 0
    for (const socioId of elegidos) {
      const lleno = i >= s.cupo
      const creada = sumarMinutos(s.inicio, -r.entero(60, 60 * 48))
      i++
      if (pasada && lleno) continue
      // Una clase en curso ya tiene la asistencia tomada.
      const estado: Reserva["estado"] = pasada ? (r.prob(0.9) ? "asistio" : "no-asistio") : lleno ? "espera" : futuro ? "reservada" : "asistio"
      reservas.push({ id: `r${n++}`, sesionId: s.sesionId, socioId, estado, creada })
    }
  }

  return { referencia: hoy, socios, reservas, pagos: pagos.sort((a, b) => a.fecha.localeCompare(b.fecha)) }
}

/** Otro día: se regeneran las reservas; los socios y pagos se conservan. */
export function ponerAlDia(e: EstadoGimnasio): EstadoGimnasio {
  if (e.referencia === claveDia(new Date())) return e
  const nuevo = generarGimnasio()
  return { ...nuevo, socios: e.socios, pagos: e.pagos }
}

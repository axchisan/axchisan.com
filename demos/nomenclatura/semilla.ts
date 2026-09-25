/**
 * Datos de ejemplo de Nomenclatura: interesados que llegaron por la página,
 * por WhatsApp y por los portales, y visitas de la semana.
 */
import { estaLibre, type CitaAgenda } from "@/demos/motores/agenda/disponibilidad"
import { claveDia, franjasDelDia, generador, sumarDias, sumarMinutos } from "@/demos/motores/agenda/tiempo"
import { DURACION_VISITA, FRANJAS_VISITA, INMUEBLES, type EstadoInmobiliaria, type EstadoLead, type Lead, type Visita } from "./modelo"

const NOMBRES = ["Alejandra Posada", "Juan Camilo Tobón", "Mónica Gaviria", "Esteban Arango", "Luisa Fernanda Mejía", "Santiago Uribe", "Paulina Cadavid", "Mauricio Restrepo", "Daniela Echeverri", "Felipe Londoño", "Carolina Jaramillo", "Andrés Vélez", "Natalia Zuluaga", "Sebastián Ochoa"]
const MENSAJES = ["¿Aceptan mascotas?", "¿El precio es negociable?", "¿Se puede ver el sábado?", "Tengo crédito preaprobado.", "¿Tiene parqueadero para dos carros?", undefined, undefined]

export function generarInmobiliaria(ahora = new Date()): EstadoInmobiliaria {
  const r = generador(1043)
  const hoy = claveDia(ahora)
  const leads: Lead[] = []
  const visitas: Visita[] = []
  const agenda: CitaAgenda[] = []
  const estados: EstadoLead[] = ["nuevo", "nuevo", "nuevo", "contactado", "contactado", "visita", "visita", "oferta", "cerrado", "descartado"]

  for (let i = 0; i < 26; i++) {
    const inm = r.uno(INMUEBLES)
    const estado = r.uno(estados)
    const dias = estado === "nuevo" ? r.entero(0, 2) : r.entero(2, 20)
    const lead: Lead = {
      id: `l${i + 1}`,
      nombre: r.uno(NOMBRES),
      telefono: `3${r.entero(0, 2)}${r.entero(0, 9)} ${r.entero(100, 999)} ${r.entero(1000, 9999)}`,
      inmuebleId: inm.id,
      mensaje: r.uno(MENSAJES),
      origen: r.uno(["web", "web", "whatsapp", "portal"] as const),
      estado,
      fecha: `${sumarDias(hoy, -dias)}T${String(r.entero(7, 20)).padStart(2, "0")}:${r.uno(["05", "20", "35", "50"])}`,
    }
    leads.push(lead)
    // Quien está en visita tiene una agendada en los próximos días.
    if (estado === "visita") {
      for (let intento = 0; intento < 20; intento++) {
        const dia = sumarDias(hoy, r.entero(0, 5))
        const franjas = franjasDelDia(dia, FRANJAS_VISITA)
        const a = inm.asesorId
        const inicio = franjas.length ? r.uno(franjas) : null
        if (!inicio) continue
        if (!estaLibre(agenda, a, inicio, DURACION_VISITA)) continue
        agenda.push({ profesionalId: a, inicio, duracionMin: DURACION_VISITA, ocupa: true })
        visitas.push({ id: `v${visitas.length + 1}`, inmuebleId: inm.id, leadId: lead.id, asesorId: a, inicio, estado: "agendada" })
        break
      }
    }
  }
  // Dos visitas ya hechas esta semana, para que la agenda no empiece vacía.
  for (const lead of leads.filter((l) => l.estado === "oferta").slice(0, 2)) {
    const inm = INMUEBLES.find((x) => x.id === lead.inmuebleId)!
    visitas.push({ id: `v${visitas.length + 1}`, inmuebleId: inm.id, leadId: lead.id, asesorId: inm.asesorId, inicio: sumarMinutos(`${sumarDias(hoy, -2)}T10:00`, 0), estado: "realizada" })
  }
  return {
    referencia: hoy,
    ajustes: { "poblado-vista": { destacado: true }, "retiro-finca": { destacado: true }, "loft-ciudad-del-rio": { estado: "reservado" } },
    leads: leads.sort((a, b) => b.fecha.localeCompare(a.fecha)),
    visitas: visitas.sort((a, b) => a.inicio.localeCompare(b.inicio)),
  }
}

/** Otro día: interesados y visitas se regeneran; los cambios a los inmuebles se conservan. */
export function ponerAlDia(e: EstadoInmobiliaria): EstadoInmobiliaria {
  if (e.referencia === claveDia(new Date())) return e
  return { ...generarInmobiliaria(), ajustes: e.ajustes }
}

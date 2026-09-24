import Image from "next/image"
import {
  Bandage,
  Bug,
  FlaskConical,
  HeartPulse,
  Scissors,
  Siren,
  Stethoscope,
  Syringe,
  type LucideIcon,
} from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { pesos } from "@/lib/catalogo/planes"
import {
  CLINICA,
  HORARIO,
  PRECIO_URGENCIA,
  PROFESIONALES,
  SERVICIOS,
  textoHoraDecimal,
} from "@/demos/canela/modelo"
import { AccionesCita, CabeceraCanela, MarcaCanela, PlacaEstado } from "@/demos/canela/publico"

const ICONOS: Record<string, LucideIcon> = {
  consulta: Stethoscope,
  vacunacion: Syringe,
  desparasitacion: Bug,
  dermatologia: Bandage,
  cirugia: HeartPulse,
  laboratorio: FlaskConical,
  peluqueria: Scissors,
}

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
const DIAS_CORTOS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"]

function listaDias(dias: number[]) {
  const nombres = dias.map((d) => DIAS_CORTOS[d])
  if (nombres.length === 1) return nombres[0]
  return `${nombres.slice(0, -1).join(", ")} y ${nombres[nombres.length - 1]}`
}

const PRIMER_ANO = [
  { cuando: "6 semanas", que: "Primera vacuna contra parvovirus y moquillo, y primera desparasitación." },
  { cuando: "9 semanas", que: "Vacuna múltiple, primera dosis. Revisión de peso y crecimiento." },
  { cuando: "12 semanas", que: "Vacuna múltiple, segunda dosis, y desparasitación." },
  { cuando: "16 semanas", que: "Vacuna múltiple, tercera dosis, y vacuna contra la rabia." },
  { cuando: "1 año", que: "Refuerzo anual, control completo y conversación sobre esterilización." },
]

const PREGUNTAS = [
  {
    p: "¿Atienden gatos?",
    r: "Sí. La Dra. Laura Méndez tiene enfoque en pacientes felinos, y las mañanas son más tranquilas para ellos. Tráelo en guacal.",
  },
  {
    p: "¿Atienden urgencias sin cita?",
    r: `Sí, todos los días hasta las 10:00 p. m. La consulta de urgencia cuesta ${pesos(PRECIO_URGENCIA)}. Si puedes, escríbenos por WhatsApp mientras vienes en camino.`,
  },
  {
    p: "¿Qué medios de pago reciben?",
    r: "Efectivo, tarjetas débito y crédito, Nequi, Daviplata y transferencia.",
  },
  {
    p: "¿Qué llevo a la primera cita?",
    r: "El carnet de vacunas si lo tienes y las fórmulas o exámenes anteriores. Si no tienes nada, no importa: abrimos la historia desde cero.",
  },
  {
    p: "¿Vacunan a domicilio?",
    r: "Sí, en Chapinero y barrios cercanos, con un recargo de $ 25.000 por visita.",
  },
]

const FOTOS = {
  portada: "https://images.unsplash.com/photo-1588950538967-ca7f8599c669",
  vacuna: "https://images.unsplash.com/photo-1770836037275-38b44e4b101f",
  gato: "https://images.unsplash.com/photo-1733783506192-653df6185a7d",
}

export default function CanelaInicio() {
  return (
    <>
      <CabeceraCanela />

      <main id="contenido">
        {/* ── Portada ─────────────────────────────────────────────── */}
        <section className="mx-auto grid max-w-6xl gap-8 px-4 pt-4 pb-16 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pt-10 lg:pb-24">
          <div className="relative lg:order-2 lg:col-span-6">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] lg:aspect-[4/5]">
              <Image
                src={FOTOS.portada}
                alt="Veterinaria sosteniendo un cachorro de pelo claro"
                fill
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover object-[50%_30%]"
              />
            </div>
            <Punto id="estado" className="absolute! -top-4 left-4 sm:left-8 lg:top-[-14px] lg:-left-16">
              <PlacaEstado />
            </Punto>
          </div>

          <div className="lg:order-1 lg:col-span-6">
            <h1 className="max-w-[13ch] font-cn-titulo text-[2.4375rem] leading-[1.02] font-extrabold tracking-[-0.035em] [font-stretch:92%] sm:text-[3.0625rem] lg:text-[3.8125rem]">
              Consulta, vacunas y urgencias en Chapinero.
            </h1>
            <p className="mt-5 max-w-[46ch] text-[1.125rem] leading-relaxed text-cn-pizarra">
              Perros y gatos. Pide tu cita en un minuto desde el celular, o escríbenos si es urgente:
              atendemos todos los días hasta las 10:00 p. m.
            </p>
            <Punto id="acciones" className="mt-8 inline-block">
              <AccionesCita />
            </Punto>
          </div>
        </section>

        {/* ── Servicios ───────────────────────────────────────────── */}
        <section id="servicios" className="scroll-mt-20 bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-4">
              <h2 className="font-cn-titulo text-[1.9375rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[2.4375rem]">
                Qué atendemos
              </h2>
              <p className="mt-4 max-w-[36ch] text-[1.0625rem] leading-relaxed text-cn-pizarra">
                Precios de referencia. El valor final depende del peso y de lo que encontremos en la
                consulta, y siempre te lo decimos antes de hacer cualquier cosa.
              </p>
              <div className="relative mt-8 hidden aspect-[4/5] overflow-hidden rounded-[22px] lg:block">
                <Image
                  src={FOTOS.vacuna}
                  alt="Veterinario aplicando una vacuna a un perro pequeño"
                  fill
                  sizes="340px"
                  className="object-cover"
                />
              </div>
            </div>

            <Punto id="servicios" className="lg:col-span-8">
              <ul>
                {SERVICIOS.map((s) => {
                  const Icono = ICONOS[s.id]
                  return (
                    <li
                      key={s.id}
                      className="grid grid-cols-[2.5rem_1fr_auto] items-start gap-x-4 border-b border-cn-linea py-5 first:pt-0"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cn-nube">
                        <Icono className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                      </span>
                      <div>
                        <h3 className="text-[1.125rem] font-bold">{s.nombre}</h3>
                        <p className="mt-0.5 text-[0.9375rem] leading-relaxed text-cn-pizarra">
                          {s.descripcion}
                        </p>
                      </div>
                      <p className="text-right">
                        <span className="block text-[1.125rem] font-bold tabular-nums">
                          {s.desde && <span className="text-[0.875rem] font-normal">desde </span>}
                          {pesos(s.precio)}
                        </span>
                        <span className="block text-[0.875rem] text-cn-pizarra">{s.duracionMin} min</span>
                      </p>
                    </li>
                  )
                })}
                <li className="mt-6 grid grid-cols-[2.5rem_1fr_auto] items-start gap-x-4 rounded-[18px] bg-cn-collar p-5 text-white">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cn-pelota text-cn-collar">
                    <Siren className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-[1.125rem] font-bold">Urgencias</h3>
                    <p className="mt-0.5 text-[0.9375rem] leading-relaxed text-cn-niebla">
                      Sin cita, todos los días hasta las 10:00 p. m.
                    </p>
                  </div>
                  <p className="text-right text-[1.125rem] font-bold tabular-nums">{pesos(PRECIO_URGENCIA)}</p>
                </li>
              </ul>
            </Punto>
          </div>
        </section>

        {/* ── Cachorros ───────────────────────────────────────────── */}
        <section id="cachorros" className="scroll-mt-20 bg-cn-collar text-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <h2 className="font-cn-titulo text-[1.9375rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[2.4375rem] lg:col-span-7">
                El primer año de tu cachorro, resuelto en un solo plan.
              </h2>
              <p className="text-[1.0625rem] leading-relaxed text-cn-niebla lg:col-span-5">
                Cinco visitas con todas las vacunas, desparasitaciones y controles de crecimiento.
                <span className="mt-3 block text-white">
                  <span className="font-cn-titulo text-[1.9375rem] font-extrabold">{pesos(380_000)}</span>{" "}
                  el plan completo. Por separado costaría {pesos(455_000)}.
                </span>
              </p>
            </div>

            <Punto id="cachorro" className="mt-12">
              <ol className="grid gap-px overflow-hidden rounded-[22px] bg-cn-collar-2 sm:grid-cols-5">
                {PRIMER_ANO.map((v, i) => (
                  <li key={v.cuando} className="bg-cn-collar p-5 sm:p-6">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cn-pelota font-cn-titulo text-[1rem] font-extrabold text-cn-collar">
                      {i + 1}
                    </span>
                    <p className="mt-4 font-cn-titulo text-[1.25rem] font-bold">{v.cuando}</p>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-cn-niebla">{v.que}</p>
                  </li>
                ))}
              </ol>
            </Punto>

            <div className="mt-10">
              <AccionesCita servicio="vacunacion" sobreOscuro />
            </div>
          </div>
        </section>

        {/* ── Equipo ──────────────────────────────────────────────── */}
        <section id="equipo" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="font-cn-titulo text-[1.9375rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[2.4375rem]">
                Quién los atiende
              </h2>
              <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[22px]">
                <Image
                  src={FOTOS.gato}
                  alt="Gato blanco durante un examen veterinario"
                  fill
                  sizes="(min-width: 1024px) 340px, 100vw"
                  className="object-cover object-[50%_40%]"
                />
              </div>
            </div>
            <Punto id="equipo" className="lg:col-span-8">
              <ul className="grid gap-x-10 sm:grid-cols-2">
                {PROFESIONALES.map((p) => (
                  <li key={p.id} className="border-t-2 border-cn-collar py-6">
                    <h3 className="font-cn-titulo text-[1.375rem] font-bold tracking-[-0.02em]">{p.nombre}</h3>
                    <p className="mt-1 text-[0.9375rem] font-bold">{p.cargo}</p>
                    <p className="mt-2 text-[1rem] leading-relaxed text-cn-pizarra">{p.enfoque}.</p>
                    <p className="mt-3 text-[0.9375rem] text-cn-pizarra">
                      Atiende {listaDias(p.dias)}.
                    </p>
                  </li>
                ))}
              </ul>
            </Punto>
          </div>
        </section>

        {/* ── Horario y ubicación ─────────────────────────────────── */}
        <section id="horario" className="scroll-mt-20 bg-white">
          <Punto id="ubicacion" className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-5">
              <h2 className="font-cn-titulo text-[1.9375rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[2.4375rem]">
                Horario
              </h2>
              <table className="mt-6 w-full text-[1rem]">
                <caption className="sr-only">Horario de atención por día</caption>
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                    const h = HORARIO[d]
                    return (
                      <tr key={d} className="border-b border-cn-linea">
                        <th scope="row" className="py-3 text-left font-bold">
                          {DIAS[d]}
                        </th>
                        <td className="py-3 text-right tabular-nums text-cn-pizarra">
                          {h ? `${textoHoraDecimal(h.abre)} a ${textoHoraDecimal(h.cierra)}` : "Cerrado"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <p className="mt-5 rounded-[14px] bg-cn-nube p-4 text-[0.9375rem] leading-relaxed">
                <strong>Urgencias todos los días hasta las 10:00 p. m.</strong> Los domingos, de 10:00 a. m. a 2:00 p. m., también atendemos consulta general.
              </p>
            </div>
            <div className="lg:col-span-7">
              <h2 className="font-cn-titulo text-[1.9375rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[2.4375rem]">
                Dónde estamos
              </h2>
              <p className="mt-3 text-[1rem] text-cn-pizarra">{CLINICA.direccion}</p>
              <div className="mt-6 aspect-[4/3] overflow-hidden rounded-[22px] bg-cn-nube sm:aspect-[16/10]">
                <iframe
                  title="Mapa de Chapinero Alto, Bogotá"
                  src="https://maps.google.com/maps?q=Chapinero%20Alto%2C%20Bogot%C3%A1&z=15&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              </div>
            </div>
          </Punto>
        </section>

        {/* ── Preguntas ───────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-12">
            <h2 className="font-cn-titulo text-[1.9375rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[2.4375rem] lg:col-span-4">
              Preguntas frecuentes
            </h2>
            <Punto id="preguntas" className="lg:col-span-8">
              <div className="border-t-2 border-cn-collar">
                {PREGUNTAS.map((q) => (
                  <details key={q.p} className="group border-b border-cn-linea">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[1.125rem] font-bold [&::-webkit-details-marker]:hidden">
                      {q.p}
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[1.25rem] leading-none transition-transform group-open:rotate-45"
                        aria-hidden
                      >
                        +
                      </span>
                    </summary>
                    <p className="max-w-[60ch] pb-6 text-[1rem] leading-relaxed text-cn-pizarra">{q.r}</p>
                  </details>
                ))}
              </div>
            </Punto>
          </div>
        </section>
      </main>

      {/* ── Pie ───────────────────────────────────────────────────── */}
      <footer className="bg-cn-collar text-cn-niebla">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div className="text-white">
            <MarcaCanela />
            <p className="mt-3 text-[0.9375rem] text-cn-niebla">{CLINICA.zona}</p>
          </div>
          <div className="text-[0.9375rem] leading-relaxed">
            <p>Teléfono {CLINICA.telefono}</p>
            <p>WhatsApp {CLINICA.whatsappVisible}</p>
            <p>{CLINICA.correo}</p>
          </div>
          <p className="text-[0.8125rem] leading-relaxed">
            Canela es un negocio ficticio, creado por Axchi como demostración. Datos de contacto de
            ejemplo. Fotografías de DICSON, Alexander Mass y Sueda Güzeldere en Unsplash.
          </p>
        </div>
      </footer>
    </>
  )
}

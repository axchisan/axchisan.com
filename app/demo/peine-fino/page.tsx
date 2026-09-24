import Image from "next/image"
import Link from "next/link"
import { Punto } from "@/demos/comun/recorrido"
import { pesos } from "@/lib/catalogo/planes"
import { textoHoraDecimal } from "@/demos/motores/agenda/tiempo"
import {
  CATEGORIAS,
  FOTOS,
  HORARIO,
  PROFESIONALES,
  SALON,
  SERVICIOS,
  textoDuracion,
} from "@/demos/peine-fino/modelo"
import { AccionesReserva, CabeceraSalon, MarcaPeineFino } from "@/demos/peine-fino/publico"
import { RAIZ } from "@/demos/peine-fino/config"

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
const CORTOS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"]

function listaDias(dias: number[]) {
  const orden = [1, 2, 3, 4, 5, 6, 0].filter((d) => dias.includes(d)).map((d) => CORTOS[d])
  return orden.length > 1 ? `${orden.slice(0, -1).join(", ")} y ${orden.at(-1)}` : orden[0]
}

const PREGUNTAS = [
  { p: "¿Atienden sin cita?", r: "Sí, si hay una silla libre. Con reserva no esperas: tu hora queda apartada con tu estilista." },
  { p: "¿Cuánto dura un balayage?", r: "Unas tres horas, según el largo y el color de partida. Al reservar, la agenda aparta el tiempo completo." },
  { p: "¿Qué pasa si llego tarde?", r: "Te esperamos 15 minutos. Después, según la agenda, puede que haya que acortar el servicio o moverlo." },
  { p: "¿Cómo puedo pagar?", r: "Efectivo, Nequi, Daviplata o tarjeta. La propina es opcional y le llega completa a quien te atendió." },
  { p: "¿Cómo cancelo?", r: "Escríbenos por WhatsApp hasta dos horas antes y liberamos la hora para otra persona." },
]

export default function PeineFinoInicio() {
  return (
    <>
      <CabeceraSalon />

      <main id="contenido">
        {/* ── Portada ─────────────────────────────────────────────── */}
        <Punto id="portada">
          <section className="mx-auto grid max-w-6xl gap-8 px-4 pt-6 pb-16 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pt-12 lg:pb-24">
            <div className="lg:order-2 lg:col-span-6">
              <div className="grid grid-cols-[1.4fr_1fr] gap-3">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[6px]">
                  <Image src={FOTOS.barba.src} alt={FOTOS.barba.alt} fill priority sizes="(min-width: 1024px) 330px, 58vw" className="object-cover" />
                </div>
                <div className="grid gap-3">
                  <div className="relative overflow-hidden rounded-[6px]">
                    <Image src={FOTOS.color.src} alt={FOTOS.color.alt} fill sizes="(min-width: 1024px) 230px, 40vw" className="object-cover" />
                  </div>
                  <div className="relative overflow-hidden rounded-[6px]">
                    <Image src={FOTOS.unas.src} alt={FOTOS.unas.alt} fill sizes="(min-width: 1024px) 230px, 40vw" className="object-cover" />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:order-1 lg:col-span-6">
              <h1 className="max-w-[12ch] font-pf-letrero text-[3.0625rem] leading-[0.92] font-extrabold tracking-[-0.01em] text-pf-cordoban uppercase sm:text-[3.8125rem] lg:text-[4.75rem]">
                Corte, color y barba en Galerías
              </h1>
              <p className="mt-6 max-w-[44ch] text-[1.125rem] leading-relaxed text-pf-humo">
                Reserva con tu estilista en un minuto. Abierto de lunes a sábado desde las 9:00&nbsp;a.&nbsp;m. y los
                domingos hasta las 3:00&nbsp;p.&nbsp;m.
              </p>
              <div className="mt-8">
                <AccionesReserva />
              </div>
            </div>
          </section>
        </Punto>

        {/* ── El tablero de letras ────────────────────────────────── */}
        <section id="servicios" className="scroll-mt-20 bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-pf-letrero text-[2.4375rem] leading-none font-extrabold text-pf-cordoban uppercase">Servicios</h2>
            <p className="mt-3 max-w-[52ch] text-[1.0625rem] text-pf-humo">
              Precios de referencia. En color y keratina el valor final depende del largo; siempre te lo decimos antes.
            </p>
            <Punto id="tablero" className="mx-auto mt-10 max-w-3xl">
              <div className="rounded-[10px] border-[10px] border-[#3a2a1c] shadow-[0_24px_50px_-24px_rgb(0_0_0/0.6)]">
                <div className="pf-fieltro px-5 py-8 font-pf-letrero text-[#f2ede4] sm:px-10">
                  {CATEGORIAS.map((cat) => (
                    <div key={cat} className="mb-7 last:mb-0">
                      <h3 className="text-center text-[1.5625rem] font-bold tracking-[0.08em] text-pf-laton-claro uppercase">{cat}</h3>
                      <ul className="mt-3 space-y-2.5">
                        {SERVICIOS.filter((s) => s.categoria === cat).map((s) => (
                          <li key={s.id} className="flex items-baseline gap-2 text-[1.25rem] font-semibold tracking-[0.03em] uppercase">
                            <span>{s.nombre}</span>
                            <span className="min-w-4 flex-1 border-b-2 border-dotted border-[#f2ede4]/35" aria-hidden />
                            <span className="text-[1rem] text-[#c9b99f] normal-case">{textoDuracion(s.duracionMin)}</span>
                            <span className="tabular-nums">
                              {s.desde && <span className="text-[0.9375rem] normal-case">desde </span>}
                              {pesos(s.precio)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Punto>
            <div className="mt-10 flex justify-center">
              <AccionesReserva />
            </div>
          </div>
        </section>

        {/* ── Equipo ──────────────────────────────────────────────── */}
        <section id="equipo" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="font-pf-letrero text-[2.4375rem] leading-none font-extrabold text-pf-cordoban uppercase">El equipo</h2>
          <p className="mt-3 max-w-[52ch] text-[1.0625rem] text-pf-humo">Reserva con quien ya conoces, o con quien mejor hace lo que buscas.</p>
          <Punto id="equipo" className="mt-10">
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {PROFESIONALES.map((p) => (
                <li key={p.id} className="flex flex-col">
                  <div className="grid grid-cols-2 gap-2">
                    {p.trabajos.slice(0, 2).map((t, i) => (
                      <div
                        key={t.src}
                        className={`relative overflow-hidden rounded-[6px] ${p.trabajos.length === 1 ? "col-span-2 aspect-[2/1]" : "aspect-square"}`}
                      >
                        <Image src={t.src} alt={t.alt} fill sizes="200px" className="object-cover" />
                        {i === 0 && <span className="sr-only">Trabajo de {p.nombre}</span>}
                      </div>
                    ))}
                  </div>
                  <h3 className="mt-4 text-[1.25rem] font-bold">{p.nombre}</h3>
                  <p className="text-[0.9375rem] font-semibold text-pf-cordoban">{p.oficio}</p>
                  <p className="mt-1 text-[0.9375rem] text-pf-humo">{p.especialidad}.</p>
                  <p className="mt-1 text-[0.875rem] text-pf-humo">Atiende {listaDias(p.dias)}.</p>
                  <Link
                    href={`${RAIZ}/reservar?profesional=${p.id}`}
                    className="mt-3 self-start text-[0.9375rem] font-semibold text-pf-cordoban underline underline-offset-4 hover:no-underline"
                  >
                    Reservar con {p.nombre.split(" ")[0]}
                  </Link>
                </li>
              ))}
            </ul>
          </Punto>
        </section>

        {/* ── Promoción ───────────────────────────────────────────── */}
        <section className="bg-pf-cordoban text-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-pf-letrero text-[2.4375rem] leading-none font-extrabold uppercase">Martes de barba</h2>
              <p className="mt-4 max-w-[44ch] text-[1.0625rem] leading-relaxed text-pf-niebla">
                Los martes, la barba con toalla caliente cuesta {pesos(12_000)} en lugar de {pesos(18_000)}. Con cualquier corte
                de hombre.
              </p>
              <div className="mt-6">
                <Link href={`${RAIZ}/reservar?servicios=corte-hombre,barba`} className="inline-flex h-12 items-center rounded-[4px] bg-white px-6 font-semibold text-pf-cordoban hover:bg-pf-porcelana">
                  Reservar corte y barba
                </Link>
              </div>
            </div>
            <div className="relative aspect-[16/9] overflow-hidden rounded-[6px]">
              <Image src={FOTOS.sillas.src} alt={FOTOS.sillas.alt} fill sizes="(min-width: 1024px) 540px, 100vw" className="object-cover" />
            </div>
          </div>
        </section>

        {/* ── Horario y ubicación ─────────────────────────────────── */}
        <section id="horario" className="scroll-mt-20 bg-white">
          <Punto id="horario" className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-5">
              <h2 className="font-pf-letrero text-[2.4375rem] leading-none font-extrabold text-pf-cordoban uppercase">Horario</h2>
              <table className="mt-6 w-full text-[1rem]">
                <caption className="sr-only">Horario de atención por día</caption>
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                    const h = HORARIO[d]
                    return (
                      <tr key={d} className="border-b border-pf-linea">
                        <th scope="row" className="py-3 text-left font-semibold">{DIAS[d]}</th>
                        <td className="py-3 text-right tabular-nums text-pf-humo">
                          {h ? `${textoHoraDecimal(h.abre)} a ${textoHoraDecimal(h.cierra)}` : "Cerrado"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="lg:col-span-7">
              <h2 className="font-pf-letrero text-[2.4375rem] leading-none font-extrabold text-pf-cordoban uppercase">Dónde estamos</h2>
              <p className="mt-3 text-[1rem] text-pf-humo">{SALON.direccion}</p>
              <div className="mt-6 aspect-[4/3] overflow-hidden rounded-[6px] bg-pf-porcelana sm:aspect-[16/10]">
                <iframe
                  title="Mapa de Galerías, Bogotá"
                  src="https://maps.google.com/maps?q=Galer%C3%ADas%2C%20Bogot%C3%A1&z=15&output=embed"
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
            <h2 className="font-pf-letrero text-[2.4375rem] leading-none font-extrabold text-pf-cordoban uppercase lg:col-span-4">
              Preguntas
            </h2>
            <div className="border-t-2 border-pf-tinta lg:col-span-8">
              {PREGUNTAS.map((q) => (
                <details key={q.p} className="group border-b border-pf-linea">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[1.125rem] font-semibold [&::-webkit-details-marker]:hidden">
                    {q.p}
                    <span className="text-[1.5rem] leading-none text-pf-cordoban transition-transform group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="max-w-[60ch] pb-6 text-[1rem] leading-relaxed text-pf-humo">{q.r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-pf-cordoban text-pf-niebla">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <MarcaPeineFino claro />
            <p className="mt-3 text-[0.9375rem]">{SALON.zona}</p>
          </div>
          <div className="text-[0.9375rem] leading-relaxed">
            <p>Teléfono {SALON.telefono}</p>
            <p>WhatsApp {SALON.whatsappVisible}</p>
            <p>Instagram {SALON.instagram}</p>
          </div>
          <p className="text-[0.8125rem] leading-relaxed">
            Peine Fino es un negocio ficticio, creado por Axchi como demostración. Datos de contacto de ejemplo.
            Fotografías de Mr Shave, Gulom Nazarov, Ionela Mat, Stefan Lehner, Giorgio Trovato, Daniel, Nate Johnston y
            Guilherme Petri en Unsplash.
          </p>
        </div>
      </footer>
    </>
  )
}

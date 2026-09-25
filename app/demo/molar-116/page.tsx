import Link from "next/link"
import { Punto } from "@/demos/comun/recorrido"
import { textoHoraDecimal } from "@/demos/motores/agenda/tiempo"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "@/demos/molar-116/config"
import { CONSULTORIO, HORARIO, MOTIVOS, ODONTOLOGOS, textoDuracion } from "@/demos/molar-116/modelo"
import { AccionesCita, Arcada, BotonWhatsappMolar, CabeceraMolar, MarcaMolar } from "@/demos/molar-116/publico"

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

const PREGUNTAS = [
  { p: "¿Atienden por EPS o prepagada?", r: "Somos un consultorio particular. Te damos factura para que la presentes a tu prepagada si tu plan reembolsa odontología." },
  { p: "¿La valoración tiene costo?", r: `Sí, ${pesos(60_000)}, y se descuenta del tratamiento si lo haces con nosotros. Incluye el presupuesto por escrito.` },
  { p: "¿Puedo pagar por cuotas?", r: "Los tratamientos largos se pagan con abonos a lo largo de las citas. Llevamos la cuenta y te decimos siempre cuánto falta." },
  { p: "¿Qué hago si me duele un sábado?", r: "Los sábados atendemos hasta la 1:00 p. m. Agenda con «Tengo dolor» y te damos la primera hora libre." },
]

export default function MolarInicio() {
  return (
    <>
      <CabeceraMolar />
      <main id="contenido">
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-2 lg:pt-20 lg:pb-24">
          <div>
            <h1 className="max-w-[13ch] text-[3rem] leading-[1] font-extrabold tracking-[-0.045em] sm:text-[4rem]">Odontología sin sorpresas en la cuenta</h1>
            <p className="mt-6 max-w-[44ch] text-[1.125rem] leading-relaxed text-mo-gris">
              Te decimos qué tienes, qué hay que hacer y cuánto cuesta antes de empezar. Consultorio en Usaquén con general, ortodoncia y endodoncia.
            </p>
            <Punto id="dolor" className="mt-8">
              <AccionesCita />
            </Punto>
          </div>
          <div className="relative rounded-[32px] bg-white p-8 ring-1 ring-mo-linea">
            <Arcada className="mx-auto w-full max-w-[420px]" />
            <p className="mt-4 text-center text-[0.9375rem] text-mo-gris">
              Así vemos tu boca en la valoración: diente por diente, y en el presupuesto solo lo que de verdad hace falta.
            </p>
          </div>
        </section>

        <section id="tratamientos" className="scroll-mt-12 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <h2 className="text-[2.25rem] leading-none font-extrabold tracking-[-0.04em]">Tratamientos y precios</h2>
            <p className="mt-3 max-w-[52ch] text-mo-gris">Precios de referencia en pesos. El valor final queda en el presupuesto de tu valoración.</p>
            <Punto id="motivos" className="mt-10">
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {MOTIVOS.map((m) => (
                  <li key={m.id} className={`flex flex-col rounded-[20px] p-5 ${m.id === "dolor" ? "bg-mo-rojo-suave" : "bg-mo-fondo"}`}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-[1.125rem] font-bold">{m.nombre}</h3>
                      <p className="font-semibold tabular-nums">
                        {m.desde && <span className="text-[0.8125rem] font-normal">desde </span>}
                        {pesos(m.precio)}
                      </p>
                    </div>
                    <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-mo-gris">{m.descripcion}</p>
                    <p className="mt-3 text-[0.8125rem] text-mo-gris">{textoDuracion(m.duracionMin)}</p>
                  </li>
                ))}
              </ul>
            </Punto>
          </div>
        </section>

        <section id="equipo" className="mx-auto max-w-6xl scroll-mt-12 px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="text-[2.25rem] leading-none font-extrabold tracking-[-0.04em]">Quién te atiende</h2>
          <Punto id="equipo" className="mt-10">
            <ul className="grid gap-4 md:grid-cols-3">
              {ODONTOLOGOS.map((o) => (
                <li key={o.id} className="rounded-[20px] bg-white p-6 ring-1 ring-mo-linea">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mo-lila text-[1.125rem] font-bold text-mo-violeta" aria-hidden>
                    {o.iniciales}
                  </span>
                  <h3 className="mt-4 text-[1.125rem] font-bold">{o.nombre}</h3>
                  <p className="text-mo-violeta">{o.especialidad}</p>
                  <p className="mt-2 text-[0.875rem] text-mo-gris">
                    Atiende {o.dias.map((d) => DIAS[d].toLowerCase()).join(", ").replace(/, ([^,]*)$/, " y $1")}.
                  </p>
                  <p className="mt-1 text-[0.8125rem] text-mo-gris">{o.registro}</p>
                </li>
              ))}
            </ul>
          </Punto>
        </section>

        <section id="ubicacion" className="scroll-mt-12 bg-mo-tinta text-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
            <div>
              <h2 className="text-[2rem] leading-none font-extrabold tracking-[-0.03em]">Horario</h2>
              <table className="mt-6 w-full">
                <caption className="sr-only">Horario de atención por día</caption>
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                    <tr key={d} className="border-b border-white/15">
                      <th scope="row" className="py-2.5 text-left font-semibold">{DIAS[d]}</th>
                      <td className="py-2.5 text-right text-mo-lila-claro tabular-nums">{HORARIO[d] ? `${textoHoraDecimal(HORARIO[d]!.abre)} a ${textoHoraDecimal(HORARIO[d]!.cierra)}` : "Cerrado"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h2 className="text-[2rem] leading-none font-extrabold tracking-[-0.03em]">Preguntas</h2>
              <div className="mt-4">
                {PREGUNTAS.map((q) => (
                  <details key={q.p} className="group border-b border-white/15">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                      {q.p}
                      <span className="text-[1.375rem] leading-none text-mo-lila-claro transition-transform group-open:rotate-45" aria-hidden>
                        +
                      </span>
                    </summary>
                    <p className="pb-5 text-[0.9375rem] leading-relaxed text-mo-lila-claro">{q.r}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-mo-linea bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <MarcaMolar />
            <p className="mt-3 text-[0.9375rem] text-mo-gris">{CONSULTORIO.direccion}</p>
            <Link href={`${RAIZ}/panel`} className="mt-4 inline-block text-[0.9375rem] font-semibold text-mo-violeta underline underline-offset-4">
              Ver el sistema del consultorio
            </Link>
          </div>
          <div className="text-[0.9375rem] leading-relaxed text-mo-gris">
            <p>Teléfono {CONSULTORIO.telefono}</p>
            <div>
              WhatsApp{" "}
              <BotonWhatsappMolar className="underline underline-offset-4 hover:text-mo-tinta">{CONSULTORIO.whatsappVisible}</BotonWhatsappMolar>
            </div>
            <p>{CONSULTORIO.correo}</p>
          </div>
          <p className="text-[0.8125rem] leading-relaxed text-mo-gris">
            Molar 116 es un consultorio ficticio, creado por Axchi como demostración. Odontólogos, registros y datos de contacto de ejemplo.
          </p>
        </div>
      </footer>
    </>
  )
}

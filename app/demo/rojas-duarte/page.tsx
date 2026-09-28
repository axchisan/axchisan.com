import Image from "next/image"
import Link from "next/link"
import { Calculator, FileCheck2, MapPin, MessageCircle } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "@/demos/rojas-duarte/config"
import { AREAS, EMPRESA, EQUIPO, FOTOS, PREGUNTAS } from "@/demos/rojas-duarte/modelo"
import {
  BotonConsulta,
  BotonWhatsappFirma,
  CabeceraRojasDuarte,
  EstadoAbierto,
  PieRojasDuarte,
  PlanoChapinero,
  TablaHorario,
  botonBorde,
} from "@/demos/rojas-duarte/publico"

export default function RojasDuarteInicio() {
  return (
    <>
      <CabeceraRojasDuarte />
      <main id="contenido">
        <section className="mx-auto grid max-w-6xl gap-10 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pt-20 lg:pb-24">
          <div className="flex flex-col justify-center">
            <h1 className="font-rd-titulo text-[2.75rem] leading-[1.02] font-normal tracking-[-0.02em] sm:text-[4rem]">Lo legal y lo contable, en la misma oficina</h1>
            <p className="mt-6 max-w-[46ch] text-[1.125rem] leading-relaxed text-rd-gris">
              Abogados y contadores en Chapinero desde {EMPRESA.desde}. Despidos, divorcios, sucesiones, empresas, contabilidad y declaración de renta, para personas y pequeñas empresas de Bogotá.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BotonConsulta />
              <BotonWhatsappFirma className={botonBorde}>
                <MessageCircle className="h-5 w-5" aria-hidden />
                WhatsApp
              </BotonWhatsappFirma>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-rd-niebla sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image src={FOTOS.portada.src} alt={FOTOS.portada.alt} fill priority sizes="(min-width: 1024px) 480px, 100vw" className="object-cover object-[65%_center]" />
          </div>
        </section>

        <Punto id="confianza" className="mx-auto max-w-6xl px-4 sm:px-6">
          <dl className="grid border-y border-rd-linea sm:grid-cols-3">
            {[
              { n: `${new Date().getFullYear() - EMPRESA.desde} años`, t: "atendiendo en la misma oficina de Chapinero" },
              { n: pesos(EMPRESA.consulta), t: `la primera consulta de ${EMPRESA.consultaMin} minutos, descontable de los honorarios` },
              { n: "Un día hábil", t: "para responder cada consulta, con la propuesta por escrito" },
            ].map((d, i) => (
              <div key={d.n} className={`py-6 sm:px-6 ${i ? "border-t border-rd-linea sm:border-t-0 sm:border-l" : "sm:pl-0"}`}>
                <dt className="font-rd-titulo text-[1.75rem] leading-tight">{d.n}</dt>
                <dd className="mt-1 text-[0.9375rem] text-rd-gris">{d.t}</dd>
              </div>
            ))}
          </dl>
        </Punto>

        <section id="areas" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <div>
              <h2 className="font-rd-titulo text-[2.25rem] leading-tight">Áreas de práctica</h2>
              <p className="mt-3 max-w-[34ch] text-rd-gris">Tres en derecho y dos en contabilidad. Cada una con su responsable, lo que hay que traer y lo que cuesta.</p>
            </div>
            <Punto id="areas">
              <ol className="border-t border-rd-tinta">
                {AREAS.map((a, i) => (
                  <li key={a.id} className="border-b border-rd-linea">
                    <Link href={`${RAIZ}/areas/${a.id}`} className="group grid grid-cols-[2.5rem_1fr] gap-x-4 py-6 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-vino sm:grid-cols-[3rem_1fr_auto]">
                      <span className="font-rd-titulo text-[1.25rem] text-rd-vino tabular-nums" aria-hidden>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="block font-rd-titulo text-[1.625rem] leading-tight group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{a.nombre}</span>
                        <span className="mt-1.5 block max-w-[56ch] text-rd-gris">{a.resumen}</span>
                      </span>
                      <span className="col-start-2 mt-2 text-[0.875rem] text-rd-gris sm:col-start-3 sm:mt-1.5">{a.profesion}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </Punto>
          </div>
        </section>

        <section className="bg-rd-tinta text-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:py-20">
            <h2 className="font-rd-titulo text-[2.25rem] leading-tight">Así trabajamos</h2>
            <ol className="grid gap-8 sm:grid-cols-3">
              {[
                { t: "Nos cuenta el caso", x: "En la oficina, por videollamada o con el formulario. Si no es para nosotros, se lo decimos y le recomendamos a quién ir." },
                { t: "Le damos el precio por escrito", x: "Qué haremos, cuánto cuesta y cuánto tarda, antes de empezar. Sin cobros que no estén en la propuesta." },
                { t: "Le contamos cada avance", x: "Por WhatsApp o correo, con la copia de cada documento radicado." },
              ].map((p, i) => (
                <li key={p.t}>
                  <span className="font-rd-titulo text-[2.5rem] leading-none text-rd-rosa" aria-hidden>
                    {i + 1}
                  </span>
                  <h3 className="mt-3 text-[1.125rem] font-semibold">{p.t}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-rd-rosa">{p.x}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="herramientas" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="font-rd-titulo text-[2.25rem] leading-tight">Haga la cuenta antes de venir</h2>
          <p className="mt-3 max-w-[52ch] text-rd-gris">Dos calculadoras con las cifras oficiales de 2026. Si el resultado le genera dudas, tráigalo a la consulta.</p>
          <Punto id="herramientas" className="mt-8">
            <SoloEnNivel nivel="profesional" compacto>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    href: `${RAIZ}/herramientas/liquidacion`,
                    icono: Calculator,
                    t: "¿Le pagaron bien la liquidación?",
                    x: "Cesantías, intereses, prima, vacaciones y la indemnización si lo despidieron sin justa causa.",
                  },
                  {
                    href: `${RAIZ}/herramientas/renta`,
                    icono: FileCheck2,
                    t: "¿Tiene que declarar renta en 2026?",
                    x: "Cinco preguntas con los topes de la DIAN para el año gravable 2025, en pesos.",
                  },
                ].map((h) => (
                  <Link key={h.href} href={h.href} className="group flex gap-5 rounded-[2px] border border-rd-linea bg-white p-6 hover:border-rd-tinta focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-vino">
                    <h.icono className="h-7 w-7 shrink-0 text-rd-vino" aria-hidden />
                    <span>
                      <span className="block font-rd-titulo text-[1.5rem] leading-tight group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{h.t}</span>
                      <span className="mt-2 block text-rd-gris">{h.x}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </SoloEnNivel>
          </Punto>
        </section>

        <section id="equipo" className="scroll-mt-16 border-t border-rd-linea bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <h2 className="font-rd-titulo text-[2.25rem] leading-tight">Quién lo atiende</h2>
            <ul className="mt-10 grid gap-10 sm:grid-cols-3">
              {EQUIPO.map((p) => (
                <li key={p.id}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-rd-niebla sm:aspect-[4/5]">
                    <Image src={p.foto.src} alt={p.foto.alt} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover object-[center_25%]" />
                  </div>
                  <h3 className="mt-4 font-rd-titulo text-[1.5rem] leading-tight">{p.nombre}</h3>
                  <p className="mt-1 font-semibold text-rd-vino">{p.cargo}</p>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-rd-gris">{p.formacion}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_2fr] lg:py-24">
          <h2 className="font-rd-titulo text-[2.25rem] leading-tight">Preguntas frecuentes</h2>
          <div className="border-t border-rd-tinta">
            {PREGUNTAS.map((q) => (
              <details key={q.p} className="group border-b border-rd-linea">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[1.125rem] font-semibold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-vino [&::-webkit-details-marker]:hidden">
                  {q.p}
                  <span className="font-rd-titulo text-[1.5rem] leading-none text-rd-vino transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="max-w-[62ch] pb-6 leading-relaxed text-rd-gris">{q.r}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="contacto" className="scroll-mt-16 bg-rd-niebla">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
            <div>
              <h2 className="font-rd-titulo text-[2.25rem] leading-tight">Visítenos en Chapinero</h2>
              <p className="mt-4 flex gap-2">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-rd-vino" aria-hidden />
                <span>
                  {EMPRESA.direccion}
                  <span className="block text-[0.875rem] text-rd-gris">A una cuadra de la estación Calle 63 de TransMilenio ({EMPRESA.nota}).</span>
                </span>
              </p>
              <div className="mt-8">
                <Punto id="abierto">
                  <EstadoAbierto />
                </Punto>
                <div className="mt-4">
                  <TablaHorario />
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <BotonConsulta />
              </div>
            </div>
            <div className="aspect-square overflow-hidden rounded-[2px] ring-1 ring-rd-linea lg:aspect-auto">
              <PlanoChapinero />
            </div>
          </div>
        </section>
      </main>
      <PieRojasDuarte />
    </>
  )
}

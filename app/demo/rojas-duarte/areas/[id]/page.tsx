import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calculator, FileCheck2 } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { RAIZ } from "@/demos/rojas-duarte/config"
import { ListaDocumentos } from "@/demos/rojas-duarte/documentos"
import { AREAS, area as buscarArea, persona } from "@/demos/rojas-duarte/modelo"
import { BotonConsulta, CabeceraRojasDuarte, PieRojasDuarte } from "@/demos/rojas-duarte/publico"

export function generateStaticParams() {
  return AREAS.map((a) => ({ id: a.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const a = buscarArea((await params).id)
  return a ? { title: a.nombre, description: a.resumen } : {}
}

const HERRAMIENTA = {
  liquidacion: { href: `${RAIZ}/herramientas/liquidacion`, icono: Calculator, texto: "Calcule su liquidación antes de venir" },
  renta: { href: `${RAIZ}/herramientas/renta`, icono: FileCheck2, texto: "Revise si tiene que declarar renta" },
}

export default async function AreaPagina({ params }: { params: Promise<{ id: string }> }) {
  const a = buscarArea((await params).id)
  if (!a) notFound()
  const r = persona(a.responsable)
  const h = a.herramienta ? HERRAMIENTA[a.herramienta] : null

  return (
    <>
      <CabeceraRojasDuarte />
      <main id="contenido">
        <SoloEnNivel nivel="profesional">
          <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
            <nav aria-label="Ruta" className="text-[0.9375rem] text-rd-gris">
              <Link href={`${RAIZ}#areas`} className="underline underline-offset-4 hover:text-rd-vino">
                Áreas de práctica
              </Link>
              <span aria-hidden> / </span>
              <span aria-current="page">{a.nombre}</span>
            </nav>
          </div>

          <section className="mx-auto grid max-w-6xl gap-10 px-4 pt-8 pb-14 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div>
              <p className="font-semibold text-rd-vino">{a.profesion}</p>
              <h1 className="mt-2 font-rd-titulo text-[2.75rem] leading-[1.02] tracking-[-0.02em] sm:text-[3.75rem]">{a.nombre}</h1>
              <p className="mt-5 max-w-[48ch] text-[1.125rem] leading-relaxed text-rd-gris">{a.resumen}</p>
              <h2 className="mt-10 text-[1.125rem] font-semibold">Le ayudamos si</h2>
              <ul className="mt-3 space-y-2.5">
                {a.casos.map((c) => (
                  <li key={c} className="flex gap-3">
                    <span className="mt-[0.7rem] h-px w-4 shrink-0 bg-rd-vino" aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <BotonConsulta area={a.id}>Consultar sobre {a.nombre.toLowerCase()}</BotonConsulta>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-rd-niebla lg:aspect-[4/5]">
              <Image src={a.foto.src} alt={a.foto.alt} fill priority sizes="(min-width: 1024px) 440px, 100vw" className="object-cover" />
            </div>
          </section>

          <section className="bg-rd-tinta text-white">
            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
              <h2 className="font-rd-titulo text-[2rem] leading-tight">Cómo lo llevamos</h2>
              <ol className="mt-8 grid gap-8 md:grid-cols-3">
                {a.pasos.map((p, i) => (
                  <li key={p.titulo} className="border-t border-rd-rosa/40 pt-5">
                    <span className="font-rd-titulo text-[1.25rem] text-rd-rosa" aria-hidden>
                      {i + 1}.
                    </span>
                    <h3 className="mt-1 text-[1.125rem] font-semibold">{p.titulo}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-rd-rosa">{p.texto}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <Punto id="documentos">
              <h2 className="font-rd-titulo text-[2rem] leading-tight">Qué traer a la primera consulta</h2>
              <div className="mt-6">
                <ListaDocumentos documentos={a.documentos} />
              </div>
            </Punto>
            <div className="space-y-8">
              <Punto id="honorarios">
                <div className="border-l-2 border-rd-vino bg-white p-6">
                  <h2 className="font-rd-titulo text-[1.5rem] leading-tight">Honorarios de referencia</h2>
                  <p className="mt-3 leading-relaxed text-rd-gris">{a.honorarios}</p>
                </div>
              </Punto>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-rd-niebla">
                  <Image src={r.foto.src} alt="" fill sizes="80px" className="object-cover" />
                </div>
                <p>
                  <span className="block text-[0.9375rem] text-rd-gris">Lo atiende</span>
                  <span className="block font-rd-titulo text-[1.375rem] leading-tight">{r.nombre}</span>
                  <span className="text-[0.9375rem] text-rd-gris">{r.cargo}</span>
                </p>
              </div>
              {h && (
                <Link href={h.href} className="flex items-center gap-3 rounded-[2px] border border-rd-linea bg-white p-5 font-semibold hover:border-rd-tinta">
                  <h.icono className="h-6 w-6 shrink-0 text-rd-vino" aria-hidden />
                  {h.texto}
                </Link>
              )}
            </div>
          </section>
        </SoloEnNivel>
      </main>
      <PieRojasDuarte />
    </>
  )
}

import Image from "next/image"
import Link from "next/link"
import { Punto } from "@/demos/comun/recorrido"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "@/demos/palanca/config"
import { HorarioPalanca } from "@/demos/palanca/horario"
import { CENTRO, COACHES, FOTOS, PLANES, TIPOS } from "@/demos/palanca/modelo"
import { AccionesPortada } from "@/demos/palanca/portada"
import { CabeceraPalanca, MarcaPalanca } from "@/demos/palanca/publico"

const CREDITOS = Object.values(FOTOS).map((f) => f.autor)

export default function PalancaInicio() {
  return (
    <>
      <CabeceraPalanca />
      <main id="contenido">
        <section className="relative isolate overflow-hidden bg-pa-hierro text-white">
          <Image src={FOTOS.portada.src} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-40" />
          <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 lg:pt-28 lg:pb-24">
            <h1 className="pa-ancha max-w-[14ch] font-pa-titulo text-[3rem] leading-[0.95] font-extrabold sm:text-[4.5rem] lg:text-[5.5rem]">ENTRENA CON TÉCNICA</h1>
            <p className="mt-6 max-w-[46ch] text-[1.1875rem] leading-relaxed text-pa-niebla">
              Clases de fuerza, funcional, movilidad y HIIT de máximo 12 personas, con un coach que te corrige. En San Fernando, Cali. La primera clase es gratis.
            </p>
            <div className="mt-8">
              <AccionesPortada />
            </div>
          </div>
        </section>

        <section aria-labelledby="clases-titulo" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 id="clases-titulo" className="pa-ancha font-pa-titulo text-[2.5rem] leading-none font-extrabold">
            CUATRO CLASES
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TIPOS.map((t) => (
              <li key={t.id} className="rounded-[6px] bg-white p-5 ring-1 ring-pa-linea">
                <span className="block h-3 w-12 rounded-full" style={{ background: t.color }} aria-hidden />
                <h3 className="mt-4 text-[1.25rem] font-bold">{t.nombre}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-pa-gris">{t.descripcion}</p>
              </li>
            ))}
          </ul>
        </section>

        <HorarioPalanca />

        <section id="planes" className="mx-auto max-w-6xl scroll-mt-12 px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="pa-ancha font-pa-titulo text-[2.5rem] leading-none font-extrabold">PLANES</h2>
          <p className="mt-3 max-w-[52ch] text-pa-gris">Sin matrícula ni permanencia. Si renuevas antes de que venza, los días se suman: no pierdes ninguno.</p>
          <Punto id="planes" className="mt-10">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PLANES.map((p, i) => (
                <li key={p.id} className={`flex flex-col rounded-[6px] p-5 ${i === 0 ? "bg-pa-hierro text-white" : "bg-white ring-1 ring-pa-linea"}`}>
                  <h3 className="text-[1.125rem] font-bold">{p.nombre}</h3>
                  <p className="mt-3 font-pa-titulo text-[2rem] leading-none font-bold tabular-nums">{pesos(p.precio)}</p>
                  <p className={`mt-3 flex-1 text-[0.9375rem] ${i === 0 ? "text-pa-niebla" : "text-pa-gris"}`}>
                    {p.clases === 1 ? "Una clase, cuando quieras." : p.clases ? `${p.clases} clases para usar en ${p.dias} días.` : `Todas las clases que quieras durante ${p.dias} días.`}
                  </p>
                </li>
              ))}
            </ul>
          </Punto>
        </section>

        <section id="coaches" className="scroll-mt-12 bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[6px]">
              <Image src={FOTOS.tecnica.src} alt={FOTOS.tecnica.alt} fill sizes="(min-width: 1024px) 540px, 100vw" className="object-cover" />
            </div>
            <div>
              <h2 className="pa-ancha font-pa-titulo text-[2.5rem] leading-none font-extrabold">COACHES</h2>
              <ul className="mt-8 grid gap-5 sm:grid-cols-2">
                {COACHES.map((c) => (
                  <li key={c.id} className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pa-hierro text-[0.875rem] font-bold text-white" aria-hidden>
                      {c.iniciales}
                    </span>
                    <span>
                      <span className="block font-bold">{c.nombre}</span>
                      <span className="text-[0.9375rem] text-pa-gris">{c.especialidad}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-pa-hierro text-pa-niebla">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <MarcaPalanca claro />
            <p className="mt-3 text-[0.9375rem]">{CENTRO.direccion}</p>
            <Link href={`${RAIZ}/panel`} className="mt-4 inline-block text-[0.9375rem] font-semibold text-white underline underline-offset-4">
              Ver el sistema del gimnasio
            </Link>
          </div>
          <div className="text-[0.9375rem] leading-relaxed">
            <p>Lunes a viernes, 5:30 a. m. a 8:30 p. m.</p>
            <p>Sábados, 8:00 a. m. a 11:30 a. m.</p>
            <p>WhatsApp {CENTRO.whatsappVisible}</p>
          </div>
          <p className="text-[0.8125rem] leading-relaxed">
            Palanca es un gimnasio ficticio, creado por Axchi como demostración. Datos de ejemplo. Fotografías de {CREDITOS.slice(0, -1).join(", ")} y {CREDITOS.at(-1)} en Unsplash.
          </p>
        </div>
      </footer>
    </>
  )
}

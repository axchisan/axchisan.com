import Image from "next/image"
import Link from "next/link"
import { Punto } from "@/demos/comun/recorrido"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "@/demos/tanda/config"
import { FOTOS, FOTOS_TORTAS, PANADERIA, PRODUCTOS, TAMANOS } from "@/demos/tanda/modelo"
import { CabeceraTanda, Horneadas, MarcaTanda, Vitrina } from "@/demos/tanda/publico"

const CREDITOS = [...new Set([FOTOS.portada.autor, ...FOTOS_TORTAS.map((f) => f.autor), ...PRODUCTOS.flatMap((p) => (p.foto ? [p.foto.autor] : []))])]

export default function TandaInicio() {
  return (
    <>
      <CabeceraTanda />
      <main id="contenido">
        <section className="bg-ta-mantequilla">
          <div className="mx-auto grid max-w-6xl items-end gap-8 px-4 pt-10 pb-0 sm:px-6 lg:grid-cols-2 lg:pt-16">
            <div className="pb-12 lg:pb-20">
              <h1 className="max-w-[12ch] font-ta-titulo text-[3.5rem] leading-[0.95] font-bold sm:text-[4.75rem]">Pan caliente tres veces al día</h1>
              <p className="mt-6 max-w-[42ch] text-[1.125rem] leading-relaxed">
                Pandebono, pan francés y masa madre recién salidos a las 6:00 a. m., a las 10:00 a. m. y a las 4:00 p. m. Y tortas por encargo para los cumpleaños.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#horneadas" className="inline-flex h-12 items-center rounded-full bg-ta-cacao px-6 font-bold text-white hover:bg-ta-cacao-2">
                  Ver las horneadas
                </a>
                <Link href={`${RAIZ}/encargos`} className="inline-flex h-12 items-center rounded-full border-2 border-ta-cacao px-6 font-bold hover:bg-ta-cacao hover:text-white">
                  Encargar una torta
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-t-[32px]">
              <Image src={FOTOS.portada.src} alt={FOTOS.portada.alt} fill priority sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
            </div>
          </div>
        </section>

        <Horneadas />
        <Vitrina />

        <section id="tortas" className="scroll-mt-12 bg-ta-mantequilla">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
            <ul className="grid grid-cols-3 gap-3">
              {FOTOS_TORTAS.map((f) => (
                <li key={f.src} className="relative aspect-[3/4] overflow-hidden rounded-[20px]">
                  <Image src={f.src} alt={f.alt} fill sizes="180px" className="object-cover" />
                </li>
              ))}
            </ul>
            <div>
              <h2 className="font-ta-titulo text-[2.5rem] leading-none font-bold">Tortas por encargo</h2>
              <p className="mt-4 max-w-[46ch] text-[1.0625rem] leading-relaxed">
                Desde {pesos(TAMANOS[0].precio)} la de media libra. Eliges tamaño, sabor, relleno, cubierta y el mensaje, y ves el precio mientras la armas.
              </p>
              <Punto id="encargos" className="mt-7 inline-block">
                <Link href={`${RAIZ}/encargos`} className="inline-flex h-12 items-center rounded-full bg-ta-cacao px-6 font-bold text-white hover:bg-ta-cacao-2">
                  Armar mi torta
                </Link>
              </Punto>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-ta-cacao text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <MarcaTanda claro />
            <p className="mt-3 text-[0.9375rem] text-white/85">{PANADERIA.direccion}</p>
            <Link href={`${RAIZ}/panel`} className="mt-4 inline-block text-[0.9375rem] font-bold text-ta-mantequilla underline underline-offset-4">
              Ver el sistema de la panadería
            </Link>
          </div>
          <div className="text-[0.9375rem] leading-relaxed text-white/85">
            <p>Todos los días, 6:00 a. m. a 8:00 p. m.</p>
            <p>WhatsApp {PANADERIA.whatsappVisible}</p>
            <p>Instagram {PANADERIA.instagram}</p>
          </div>
          <p className="text-[0.8125rem] leading-relaxed text-white/85">
            Tanda es una panadería ficticia, creada por Axchi como demostración. Precios y datos de ejemplo. Fotografías de {CREDITOS.slice(0, -1).join(", ")} y {CREDITOS.at(-1)} en Unsplash.
          </p>
        </div>
      </footer>
    </>
  )
}

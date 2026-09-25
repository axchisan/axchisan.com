import Image from "next/image"
import Link from "next/link"
import { ColeccionLinaza } from "@/demos/linaza/coleccion"
import { CIUDADES, FOTOS, GRATIS_DESDE, MARCA, PRENDAS } from "@/demos/linaza/modelo"
import { MarcaLinaza } from "@/demos/linaza/publico"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "@/demos/linaza/config"
import { CabeceraLinaza } from "@/demos/linaza/publico"

const CREDITOS = [...new Set([...PRENDAS.map((p) => p.autor), ...Object.values(FOTOS).map((f) => f.autor)])]

export default async function LinazaInicio({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams
  return (
    <>
      <CabeceraLinaza />
      <main id="contenido">
        <section className="mx-auto grid max-w-7xl gap-8 px-4 pt-8 sm:px-6 lg:grid-cols-12 lg:items-end lg:pt-12">
          <div className="pb-4 lg:col-span-5 lg:pb-16">
            <h1 className="text-[3.5rem] leading-[0.92] font-bold tracking-[-0.05em] sm:text-[4.75rem] lg:text-[5.5rem]">Lino para tierra caliente</h1>
            <p className="mt-6 max-w-[40ch] text-[1.125rem] leading-relaxed text-li-gris">
              Camisas, pantalones y vestidos de lino y algodón, cortados y cosidos en Medellín. Envío a todo el país, gratis desde {pesos(GRATIS_DESDE)}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#coleccion" className="inline-flex h-12 items-center bg-li-tinta px-6 font-semibold text-white hover:bg-li-azul">
                Ver la colección
              </a>
              <Link href={`/demo/linaza/producto/camisa-manga-corta`} className="inline-flex h-12 items-center border border-li-tinta px-6 font-semibold hover:bg-li-tinta hover:text-white">
                La camisa de siempre
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden bg-li-niebla sm:aspect-[16/11] lg:col-span-7">
            <Image src={FOTOS.portada.src} alt={FOTOS.portada.alt} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
          </div>
        </section>

        <ColeccionLinaza key={categoria ?? "todo"} categoriaInicial={categoria} />

        <section id="taller" className="scroll-mt-28 bg-li-tinta text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src={FOTOS.telas.src} alt={FOTOS.telas.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div>
              <h2 className="text-[2.5rem] leading-none font-bold tracking-[-0.04em]">Un taller, cuatro costureras</h2>
              <p className="mt-6 max-w-[46ch] text-[1.0625rem] leading-relaxed text-li-azul-claro">
                Compramos el lino por rollos y lo cortamos en tandas pequeñas en Provenza. Por eso no todas las tallas están siempre, y por eso cada prenda
                dura años.
              </p>
              <dl className="mt-10 grid gap-6 sm:grid-cols-3">
                {[
                  ["Envíos", `A todo el país. Medellín en ${CIUDADES[0].dias.replace(" hábiles", "")}.`],
                  ["Cambios", "30 días, el primero va por nuestra cuenta."],
                  ["Pagos", "PSE, Nequi o tarjeta, en una pasarela segura."],
                ].map(([t, d]) => (
                  <div key={t}>
                    <dt className="font-semibold">{t}</dt>
                    <dd className="mt-1 text-[0.9375rem] text-li-azul-claro">{d}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-li-linea">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <MarcaLinaza />
            <p className="mt-3 text-[0.9375rem] text-li-gris">{MARCA.taller}</p>
            <Link href={`${RAIZ}/panel`} className="mt-5 inline-block text-[0.9375rem] font-semibold underline underline-offset-4">
              Ver el panel de la tienda
            </Link>
          </div>
          <div className="text-[0.9375rem] leading-relaxed text-li-gris">
            <p>WhatsApp {MARCA.whatsappVisible}</p>
            <p>Instagram {MARCA.instagram}</p>
            <p>{MARCA.correo}</p>
          </div>
          <p className="text-[0.8125rem] leading-relaxed text-li-gris">
              Linaza es una marca ficticia, creada por Axchi como demostración. Precios y datos de ejemplo. Fotografías de {CREDITOS.slice(0, -1).join(", ")} y{" "}
              {CREDITOS.at(-1)} en Unsplash.
            </p>
        </div>
      </footer>
    </>
  )
}

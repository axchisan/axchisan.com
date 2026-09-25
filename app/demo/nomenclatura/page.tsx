import Image from "next/image"
import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { RAIZ } from "@/demos/nomenclatura/config"
import { Destacados } from "@/demos/nomenclatura/destacados"
import { Buscador } from "@/demos/nomenclatura/listado"
import { ASESORES, EMPRESA, FOTOS, INMUEBLES } from "@/demos/nomenclatura/modelo"
import { BotonWhatsappInmobiliaria, CabeceraNomenclatura, MarcaNomenclatura } from "@/demos/nomenclatura/publico"

const CREDITOS = [...new Set([FOTOS.portada.autor, ...INMUEBLES.flatMap((x) => x.fotos.map((f) => f.autor))])]

export default function NomenclaturaInicio() {
  return (
    <>
      <CabeceraNomenclatura />
      <main id="contenido">
        <section className="relative isolate overflow-hidden bg-nm-tinta text-white">
          <Image src={FOTOS.portada.src} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-50" />
          <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-16 pb-16 sm:px-6 lg:grid-cols-2 lg:items-end lg:pt-24 lg:pb-24">
            <div>
              <h1 className="max-w-[14ch] text-[3rem] leading-[0.98] font-extrabold tracking-[-0.045em] sm:text-[4.25rem]">Tu próxima dirección en el sur del valle</h1>
              <p className="mt-6 max-w-[44ch] text-[1.125rem] leading-relaxed text-nm-agua">
                Apartamentos y casas en venta y en arriendo en Laureles, El Poblado, Envigado, Sabaneta y Belén. Con fotos reales, todos los datos y visita cuando te quede bien.
              </p>
            </div>
            <Punto id="buscador">
              <Buscador />
            </Punto>
          </div>
        </section>

        <Destacados />

        <section id="consignar" className="scroll-mt-12 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
            <div>
              <h2 className="text-[2.25rem] leading-none font-extrabold tracking-[-0.03em]">¿Quieres arrendar o vender el tuyo?</h2>
              <p className="mt-4 max-w-[48ch] text-[1.0625rem] leading-relaxed text-nm-gris">
                Lo fotografiamos, lo publicamos aquí y en los portales, filtramos a los interesados y te contamos cada semana cuántas visitas tuvo. Para arriendo, te lo administramos con póliza.
              </p>
              <BotonWhatsappInmobiliaria mensaje="Hola, Nomenclatura. Quiero consignar un inmueble." className="mt-6 inline-flex h-12 items-center gap-2 rounded-[6px] border-2 border-nm-tinta px-6 font-semibold hover:bg-nm-tinta hover:text-white">
                <MessageCircle className="h-5 w-5" aria-hidden />
                Consignar mi inmueble
              </BotonWhatsappInmobiliaria>
            </div>
            <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {ASESORES.map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-[8px] bg-nm-fondo p-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-nm-agua-suave font-bold text-nm-petroleo" aria-hidden>
                    {a.iniciales}
                  </span>
                  <span>
                    <span className="block font-semibold">{a.nombre}</span>
                    <span className="text-[0.875rem] text-nm-gris">{a.zonas}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="bg-nm-tinta text-nm-agua">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <MarcaNomenclatura claro />
            <p className="mt-3 text-[0.9375rem]">{EMPRESA.direccion}</p>
            <Link href={`${RAIZ}/panel`} className="mt-4 inline-block text-[0.9375rem] font-semibold text-white underline underline-offset-4">
              Ver el sistema de la inmobiliaria
            </Link>
          </div>
          <div className="text-[0.9375rem] leading-relaxed">
            <p>WhatsApp {EMPRESA.whatsappVisible}</p>
            <p>{EMPRESA.correo}</p>
            <p>{EMPRESA.matricula}</p>
          </div>
          <p className="text-[0.8125rem] leading-relaxed">
            Nomenclatura es una inmobiliaria ficticia, creada por Axchi como demostración. Inmuebles, precios y asesores de ejemplo. Fotografías de {CREDITOS.slice(0, -1).join(", ")} y {CREDITOS.at(-1)} en Unsplash.
          </p>
        </div>
      </footer>
    </>
  )
}

import Image from "next/image"
import { MessageCircle } from "lucide-react"
import { CatalogoFerreteria } from "@/demos/doble-rosca/catalogo"
import { EntradaPanelFerreteria } from "@/demos/doble-rosca/panel/entrada"
import { FERRETERIA, FOTOS, HORARIO_TEXTO, PRODUCTOS } from "@/demos/doble-rosca/modelo"
import { BotonWhatsappFerreteria, botonBorde, CabeceraFerreteria, MarcaDobleRosca } from "@/demos/doble-rosca/publico"

const CREDITOS = Object.values(FOTOS).map((f) => f.autor)

export default function DobleRoscaInicio() {
  return (
    <>
      <CabeceraFerreteria />
      <main id="contenido">
        <section className="relative isolate overflow-hidden bg-dr-tinta text-white">
          <Image src={FOTOS.estanteria.src} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-45" />
          <div className="mx-auto max-w-6xl px-4 pt-16 pb-14 sm:px-6 lg:pt-24 lg:pb-20">
            <h1 className="dr-ancha max-w-[16ch] text-[2.75rem] leading-[0.95] font-extrabold sm:text-[3.75rem] lg:text-[4.5rem]">
              Lo que la obra necesita, en Kennedy
            </h1>
            <p className="mt-6 max-w-[48ch] text-[1.1875rem] leading-relaxed text-dr-zinc">
              {PRODUCTOS.length} referencias de tornillería, eléctricos, plomería, pinturas y materiales. Mire si hay antes de venir, o arme la lista y se
              la llevamos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#productos" className="inline-flex h-12 items-center rounded-[6px] bg-dr-cinta px-6 text-[1rem] font-bold text-dr-tinta hover:bg-white">
                Buscar un producto
              </a>
              <BotonWhatsappFerreteria className="inline-flex h-12 items-center gap-2 rounded-[6px] border-2 border-white px-6 text-[1rem] font-bold text-white hover:bg-white hover:text-dr-tinta">
                <MessageCircle className="h-5 w-5" aria-hidden />
                Preguntar por WhatsApp
              </BotonWhatsappFerreteria>
            </div>
          </div>
        </section>

        <CatalogoFerreteria />

        <section id="visitenos" className="scroll-mt-12 border-t-4 border-dr-verde bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-3">
            <div>
              <h2 className="dr-ancha text-[1.75rem] leading-none font-extrabold">Horario</h2>
              <dl className="mt-5 space-y-3">
                {HORARIO_TEXTO.map((h) => (
                  <div key={h.dias} className="border-b border-dr-linea pb-3">
                    <dt className="font-semibold">{h.dias}</dt>
                    <dd className="text-dr-acero">{h.horas}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h2 className="dr-ancha text-[1.75rem] leading-none font-extrabold">Para constructores</h2>
              <p className="mt-5 text-[1rem] leading-relaxed text-dr-acero">
                Cuenta de obra con precio especial en compras grandes, domicilio el mismo día en Kennedy, Castilla y Bosa, y cotización por escrito
                para la administración del conjunto.
              </p>
              <BotonWhatsappFerreteria className={`${botonBorde} mt-5`} mensaje="Hola, Doble Rosca. Quiero una cotización para una obra.">
                Pedir cotización
              </BotonWhatsappFerreteria>
            </div>
            <div className="relative min-h-56 overflow-hidden rounded-[8px]">
              <Image src={FOTOS.herramientas.src} alt={FOTOS.herramientas.alt} fill sizes="(min-width: 1024px) 360px, 100vw" className="object-cover" />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-dr-verde text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <MarcaDobleRosca claro />
            <p className="mt-3 text-[0.9375rem] text-dr-verde-claro">{FERRETERIA.direccion}</p>
            <div className="mt-5">
              <EntradaPanelFerreteria />
            </div>
          </div>
          <div className="text-[0.9375rem] leading-relaxed text-dr-verde-claro">
            <p>Teléfono {FERRETERIA.telefono}</p>
            <p>WhatsApp {FERRETERIA.whatsappVisible}</p>
          </div>
          <p className="text-[0.8125rem] leading-relaxed text-dr-verde-claro">
            Doble Rosca es un negocio ficticio, creado por Axchi como demostración. Precios y datos de contacto de ejemplo. Fotografías de{" "}
            {CREDITOS.slice(0, -1).join(", ")} y {CREDITOS.at(-1)} en Unsplash.
          </p>
        </div>
      </footer>
    </>
  )
}

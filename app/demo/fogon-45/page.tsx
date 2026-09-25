import Image from "next/image"
import { Punto } from "@/demos/comun/recorrido"
import { textoHoraDecimal } from "@/demos/motores/agenda/tiempo"
import { pesos } from "@/lib/catalogo/planes"
import { CartaFogon, PlatoPeltre } from "@/demos/fogon-45/carta"
import { FOTOS, HORARIO, platoPorId, RESTAURANTE, ZONAS } from "@/demos/fogon-45/modelo"
import { AccionesPortada, AccionReserva, EntradaPanel } from "@/demos/fogon-45/portada"
import { CabeceraFogon, EstadoHoy, MarcaFogon } from "@/demos/fogon-45/publico"

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

const CREDITOS = [...new Set(Object.values(FOTOS).map((f) => f.autor))]

export default async function FogonInicio({ searchParams }: { searchParams: Promise<{ mesa?: string }> }) {
  const { mesa } = await searchParams
  const numeroMesa = Number(mesa)
  const mesaValida = Number.isInteger(numeroMesa) && numeroMesa >= 1 && numeroMesa <= RESTAURANTE.mesas ? numeroMesa : undefined
  const punta = platoPorId("punta-anca")!
  const bandeja = platoPorId("bandeja")!
  const ajiaco = platoPorId("ajiaco")!

  return (
    <>
      <CabeceraFogon />

      <main id="contenido">
        {/* ── Portada: la mesa vista desde arriba ─────────────────── */}
        <Punto id="portada">
          <section className="mx-auto grid max-w-6xl items-center gap-12 overflow-hidden px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:pt-16 lg:pb-24">
            <div className="lg:col-span-6">
              <EstadoHoy />
              <h1 className="mt-5 max-w-[11ch] font-fg-letrero text-[3.25rem] leading-[0.98] text-fg-cobalto sm:text-[4.25rem] lg:text-[5rem]">
                Cocina de leña en la calle 45
              </h1>
              <p className="mt-6 max-w-[42ch] text-[1.1875rem] leading-relaxed text-fg-ceniza">
                Ajiaco, bandeja y carnes al carbón. Pide desde tu mesa, para recoger o a domicilio en Chapinero y Teusaquillo.
              </p>
              <div className="mt-8">
                <AccionesPortada />
              </div>
            </div>
            <div className="relative mx-auto h-[330px] w-[330px] sm:h-[460px] sm:w-[460px] lg:col-span-6" aria-hidden>
              <div className="absolute top-[4%] right-[2%] scale-[0.72] sm:scale-100 sm:origin-top-right">
                <PlatoPeltre plato={punta} tamano={340} />
              </div>
              <div className="absolute bottom-[2%] left-[0%] origin-bottom-left scale-[0.72] sm:scale-100">
                <PlatoPeltre plato={bandeja} tamano={190} />
              </div>
              <div className="absolute top-[0%] left-[6%] origin-top-left scale-[0.72] sm:scale-100">
                <PlatoPeltre plato={ajiaco} tamano={130} />
              </div>
            </div>
          </section>
        </Punto>

        <CartaFogon mesa={mesaValida} />

        {/* ── Fin de semana ───────────────────────────────────────── */}
        <section className="bg-fg-peltre">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
              <Image src={FOTOS.arepasParrilla.src} alt={FOTOS.arepasParrilla.alt} fill sizes="(min-width: 1024px) 540px, 100vw" className="object-cover" />
            </div>
            <div>
              <h2 className="font-fg-letrero text-[2.5rem] leading-none text-fg-cobalto">Sábados y domingos, sancocho</h2>
              <p className="mt-4 max-w-[46ch] text-[1.0625rem] leading-relaxed text-fg-ceniza">
                Gallina criolla en olla grande, desde las diez de la mañana. Cuando se acaba, se acaba: la carta lo marca como agotado en ese
                momento, para que nadie haga el viaje en vano.
              </p>
            </div>
          </div>
        </section>

        {/* ── Reservas ────────────────────────────────────────────── */}
        <section id="reservas" className="scroll-mt-12 bg-fg-cobalto text-white">
          <Punto id="reservas" className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-20">
            <div className="lg:col-span-5">
              <h2 className="font-fg-letrero text-[2.5rem] leading-none">Reserva tu mesa</h2>
              <p className="mt-4 max-w-[42ch] text-[1.0625rem] leading-relaxed text-fg-niebla">
                Grupos de hasta diez personas en el salón. Para cumpleaños traes la torta y nosotros ponemos los platos y las velas.
              </p>
              <div className="mt-7">
                <AccionReserva />
              </div>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] lg:col-span-7">
              <Image src={FOTOS.salon.src} alt={FOTOS.salon.alt} fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
            </div>
          </Punto>
        </section>

        {/* ── Horario, domicilios y ubicación ─────────────────────── */}
        <section id="llegar" className="scroll-mt-12 bg-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:py-24">
            <div>
              <h2 className="font-fg-letrero text-[2rem] leading-none text-fg-cobalto">Horario</h2>
              <table className="mt-6 w-full text-[1rem]">
                <caption className="sr-only">Horario de la cocina por día</caption>
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                    const h = HORARIO[d]
                    return (
                      <tr key={d} className="border-b border-fg-linea">
                        <th scope="row" className="py-3 text-left font-semibold">{DIAS[d]}</th>
                        <td className="py-3 text-right text-fg-ceniza tabular-nums">{h ? `${textoHoraDecimal(h.abre)} a ${textoHoraDecimal(h.cierra)}` : "Cerrado"}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div>
              <h2 className="font-fg-letrero text-[2rem] leading-none text-fg-cobalto">Domicilios</h2>
              <table className="mt-6 w-full text-[1rem]">
                <caption className="sr-only">Costo y tiempo del domicilio por barrio</caption>
                <tbody>
                  {ZONAS.map((z) => (
                    <tr key={z.id} className="border-b border-fg-linea">
                      <th scope="row" className="py-3 pr-3 text-left font-semibold">{z.barrio}</th>
                      <td className="py-3 text-right text-fg-ceniza tabular-nums whitespace-nowrap">{pesos(z.costo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h2 className="font-fg-letrero text-[2rem] leading-none text-fg-cobalto">Dónde estamos</h2>
              <p className="mt-6 text-[1rem] text-fg-ceniza">{RESTAURANTE.direccion}</p>
              <div className="mt-5 aspect-[4/3] overflow-hidden rounded-[20px] bg-fg-peltre">
                <iframe
                  title="Mapa de Chapinero, Bogotá"
                  src="https://maps.google.com/maps?q=Calle%2045%20con%20carrera%2013%2C%20Bogot%C3%A1&z=16&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-fg-tizne text-fg-linea">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <MarcaFogon claro />
            <p className="mt-3 text-[0.9375rem]">{RESTAURANTE.zona}</p>
            <div className="mt-5">
              <EntradaPanel />
            </div>
          </div>
          <div className="text-[0.9375rem] leading-relaxed">
            <p>Teléfono {RESTAURANTE.telefono}</p>
            <p>WhatsApp {RESTAURANTE.whatsappVisible}</p>
            <p>Instagram {RESTAURANTE.instagram}</p>
          </div>
          <p className="text-[0.8125rem] leading-relaxed">
            Fogón 45 es un negocio ficticio, creado por Axchi como demostración. Datos de contacto de ejemplo. Fotografías de{" "}
            {CREDITOS.slice(0, -1).join(", ")} y {CREDITOS.at(-1)} en Unsplash.
          </p>
        </div>
      </footer>
    </>
  )
}

import type { Metadata } from "next"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { FormularioConsulta } from "@/demos/rojas-duarte/consulta"
import { EMPRESA } from "@/demos/rojas-duarte/modelo"
import { CabeceraRojasDuarte, PieRojasDuarte, TablaHorario } from "@/demos/rojas-duarte/publico"
import { pesos } from "@/lib/catalogo/planes"

export const metadata: Metadata = {
  title: "Agendar una consulta",
  description: "Cuéntenos su caso y le respondemos en un día hábil con la fecha de la primera consulta.",
}

export default async function Consulta({ searchParams }: { searchParams: Promise<{ area?: string }> }) {
  const { area } = await searchParams
  return (
    <>
      <CabeceraRojasDuarte />
      <main id="contenido" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <SoloEnNivel nivel="profesional">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <div>
              <h1 className="font-rd-titulo text-[2.5rem] leading-[1.05] tracking-[-0.02em] sm:text-[3.25rem]">Agendar una consulta</h1>
              <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed text-rd-gris">
                Cuéntenos su caso en pocas líneas. Le respondemos antes de que termine el siguiente día hábil con la fecha y el valor de la consulta.
              </p>
              <div className="mt-10">
                <FormularioConsulta areaInicial={area} />
              </div>
            </div>
            <aside className="space-y-8 lg:pt-4">
              <div className="border-t border-rd-tinta pt-5">
                <h2 className="font-rd-titulo text-[1.5rem] leading-tight">La primera consulta</h2>
                <p className="mt-2 leading-relaxed text-rd-gris">
                  {EMPRESA.consultaMin} minutos por {pesos(EMPRESA.consulta)}, en la oficina o por videollamada. Si nos encarga el caso, se descuentan de los honorarios.
                </p>
              </div>
              <div className="border-t border-rd-tinta pt-5">
                <h2 className="font-rd-titulo text-[1.5rem] leading-tight">Horario</h2>
                <div className="mt-3">
                  <TablaHorario />
                </div>
              </div>
            </aside>
          </div>
        </SoloEnNivel>
      </main>
      <PieRojasDuarte />
    </>
  )
}

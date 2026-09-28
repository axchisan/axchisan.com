import type { Metadata } from "next"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { VerificadorRenta } from "@/demos/rojas-duarte/declarar"
import { CabeceraRojasDuarte, PieRojasDuarte } from "@/demos/rojas-duarte/publico"

export const metadata: Metadata = {
  title: "¿Tengo que declarar renta en 2026?",
  description: "Los cinco topes de la DIAN para el año gravable 2025, en pesos, y la respuesta con el motivo.",
}

export default function Renta() {
  return (
    <>
      <CabeceraRojasDuarte />
      <main id="contenido" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <SoloEnNivel nivel="profesional">
          <p className="font-semibold text-rd-vino">Impuestos y renta</p>
          <h1 className="mt-2 max-w-[20ch] font-rd-titulo text-[2.5rem] leading-[1.05] tracking-[-0.02em] sm:text-[3.25rem]">¿Tiene que declarar renta en 2026?</h1>
          <p className="mt-4 max-w-[58ch] text-[1.0625rem] leading-relaxed text-rd-gris">
            Para personas naturales residentes en Colombia, con lo que tenía y lo que movió en 2025. Si no conoce una cifra exacta, ponga la que más se acerque.
          </p>
          <div className="mt-10">
            <VerificadorRenta />
          </div>
        </SoloEnNivel>
      </main>
      <PieRojasDuarte />
    </>
  )
}

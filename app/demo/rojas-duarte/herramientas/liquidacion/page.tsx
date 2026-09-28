import type { Metadata } from "next"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { CalculadoraLiquidacion } from "@/demos/rojas-duarte/liquidacion"
import { CabeceraRojasDuarte, PieRojasDuarte } from "@/demos/rojas-duarte/publico"

export const metadata: Metadata = {
  title: "Calculadora de liquidación laboral 2026",
  description: "Cesantías, intereses, prima, vacaciones e indemnización por despido sin justa causa, con el salario mínimo y el auxilio de transporte de 2026.",
}

export default function Liquidacion() {
  return (
    <>
      <CabeceraRojasDuarte />
      <main id="contenido" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <SoloEnNivel nivel="profesional">
          <p className="font-semibold text-rd-vino">Derecho laboral</p>
          <h1 className="mt-2 max-w-[20ch] font-rd-titulo text-[2.5rem] leading-[1.05] tracking-[-0.02em] sm:text-[3.25rem]">¿Le pagaron bien la liquidación?</h1>
          <p className="mt-4 max-w-[58ch] text-[1.0625rem] leading-relaxed text-rd-gris">
            Con su salario y las fechas de ingreso y retiro calculamos lo que le corresponde. Es la misma cuenta que hacemos en la primera consulta, y es orientativa: horas extra, comisiones o un salario integral la cambian.
          </p>
          <div className="mt-10">
            <CalculadoraLiquidacion />
          </div>
        </SoloEnNivel>
      </main>
      <PieRojasDuarte />
    </>
  )
}

"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"
import { Printer } from "lucide-react"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { RAIZ } from "../config"
import { RESTAURANTE } from "../modelo"
import { Olla } from "../publico"
import { Encabezado } from "./marco"

/**
 * Un QR por mesa, listo para imprimir. Cada uno abre la carta con el número de
 * la mesa: con el plan de pedidos, lo que se pide desde ahí llega a esa mesa.
 */
export function MesasFogon() {
  const [codigos, setCodigos] = useState<string[] | null>(null)

  useEffect(() => {
    let vigente = true
    const base = `${location.origin}${RAIZ}?mesa=`
    Promise.all(
      Array.from({ length: RESTAURANTE.mesas }, (_, i) =>
        QRCode.toString(`${base}${i + 1}`, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#1f3f8f", light: "#ffffff" } }),
      ),
    ).then((svgs) => {
      if (vigente) setCodigos(svgs)
    })
    return () => {
      vigente = false
    }
  }, [])

  return (
    <SoloEnNivel nivel="carta">
      <Encabezado
        titulo="Mesas y QR"
        detalle="Imprime la hoja, recorta cada código y ponlo en su mesa."
        accion={
          <button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-full bg-fg-cobalto px-4 text-[0.9375rem] font-bold text-white hover:bg-fg-cobalto-2">
            <Printer className="h-4 w-4" aria-hidden />
            Imprimir los QR
          </button>
        }
      />
      <div className="px-4 py-6 sm:px-8 print:p-0">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 print:grid-cols-3 print:gap-3">
          {Array.from({ length: RESTAURANTE.mesas }, (_, i) => {
            const tarjeta = (
              <div className="flex flex-col items-center rounded-[20px] border-2 border-fg-cobalto bg-white p-4 text-center break-inside-avoid">
                <span className="inline-flex items-center gap-1.5 text-fg-cobalto">
                  <Olla className="h-5 w-6" />
                  <span className="font-fg-letrero text-[1.0625rem]">Fogón 45</span>
                </span>
                <div className="mt-3 aspect-square w-full max-w-[160px]">
                  {codigos ? (
                    <div
                      role="img"
                      aria-label={`Código QR de la mesa ${i + 1}`}
                      className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
                      dangerouslySetInnerHTML={{ __html: codigos[i] }}
                    />
                  ) : (
                    <div className="h-full w-full rounded-[8px] bg-fg-peltre" aria-hidden />
                  )}
                </div>
                <p className="mt-3 font-fg-letrero text-[1.5rem] leading-none">Mesa {i + 1}</p>
                <p className="mt-1 text-[0.8125rem] text-fg-ceniza">Escanea para ver la carta y pedir</p>
                <a href={`${RAIZ}?mesa=${i + 1}`} className="mt-2 text-[0.8125rem] font-semibold text-fg-cobalto underline underline-offset-2 print:hidden">
                  Probar el QR de la mesa {i + 1}
                </a>
              </div>
            )
            return <li key={i}>{i === 0 ? <Punto id="qr">{tarjeta}</Punto> : tarjeta}</li>
          })}
        </ul>
      </div>
    </SoloEnNivel>
  )
}

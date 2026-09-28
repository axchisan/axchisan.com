"use client"

import Link from "next/link"
import { useRef, useState, type FormEvent } from "react"
import { Check, X } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import { TOPES, UVT_2025, debeDeclarar, type DatosRenta } from "./renta"
import { botonVino, campo } from "./publico"

const numero = (t: string) => Number(t.replace(/\D/g, "")) || 0

const AYUDA: Record<keyof DatosRenta, string> = {
  patrimonio: "Casa, carro, cuentas, inversiones: todo lo que tenía, sin restar las deudas.",
  ingresos: "Salario, honorarios, arriendos, pensión. Lo que dice su certificado de ingresos, sumado.",
  tarjeta: "La suma de los extractos del año.",
  compras: "Todo lo que gastó en el año, con tarjeta, en efectivo o por transferencia.",
  consignaciones: "Lo que entró a sus cuentas en el año, incluidos los traslados entre ellas.",
}

export function VerificadorRenta() {
  const [v, setV] = useState<Record<keyof DatosRenta, string>>({ patrimonio: "", ingresos: "", tarjeta: "", compras: "", consignaciones: "" })
  const [resultado, setResultado] = useState<ReturnType<typeof debeDeclarar> | null>(null)
  const salida = useRef<HTMLDivElement>(null)

  function revisar(e: FormEvent) {
    e.preventDefault()
    const datos = Object.fromEntries(Object.entries(v).map(([k, x]) => [k, numero(x)])) as DatosRenta
    setResultado(debeDeclarar(datos))
    requestAnimationFrame(() => salida.current?.focus())
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
      <Punto id="topes">
        <form onSubmit={revisar} className="space-y-6">
          {TOPES.map((t) => (
            <div key={t.id}>
              <label htmlFor={t.id} className="font-semibold">
                {t.nombre}
              </label>
              <p id={`${t.id}-ayuda`} className="text-[0.875rem] text-rd-gris">
                {AYUDA[t.id]} Tope: {pesos(t.uvt * UVT_2025)}.
              </p>
              <input
                id={t.id}
                inputMode="numeric"
                autoComplete="off"
                placeholder="0"
                aria-describedby={`${t.id}-ayuda`}
                value={v[t.id]}
                onChange={(e) => {
                  const n = numero(e.target.value)
                  setV((p) => ({ ...p, [t.id]: n ? n.toLocaleString("es-CO") : "" }))
                }}
                className={`${campo} h-12`}
              />
            </div>
          ))}
          <p className="text-[0.875rem] leading-relaxed text-rd-gris">
            Valores del año 2025, que se declara en 2026. Los topes están en UVT y se pasan a pesos con la UVT de 2025, {pesos(UVT_2025)}.
          </p>
          <button type="submit" className={`${botonVino} w-full sm:w-auto`}>
            Revisar si tengo que declarar
          </button>
        </form>
      </Punto>

      <div ref={salida} tabIndex={-1} aria-live="polite" className="self-start rounded-[2px] bg-white p-6 ring-1 ring-rd-linea outline-none sm:p-8">
        {!resultado ? (
          <div className="text-rd-gris">
            <h2 className="font-rd-titulo text-[1.75rem] leading-tight text-rd-tinta">La respuesta</h2>
            <p className="mt-3">Basta con pasar uno de los cinco topes para estar obligado. Aquí verá cuál, si alguno.</p>
          </div>
        ) : (
          <>
            <h2 className="font-rd-titulo text-[2rem] leading-tight">{resultado.debe ? "Sí tiene que declarar renta" : "No está obligado a declarar"}</h2>
            <ul className="mt-5 divide-y divide-rd-linea border-y border-rd-linea">
              {resultado.revision.map((r) => (
                <li key={r.id} className="flex items-start gap-3 py-3 text-[0.9375rem]">
                  {r.supera ? <Check className="mt-0.5 h-5 w-5 shrink-0 text-rd-vino" aria-hidden /> : <X className="mt-0.5 h-5 w-5 shrink-0 text-rd-gris" aria-hidden />}
                  <span>
                    <span className="block font-semibold">{r.nombre}</span>
                    <span className="text-rd-gris">
                      {pesos(r.valor)} {r.supera ? "pasa" : "no pasa"} el tope de {pesos(r.tope)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-rd-gris">
              {resultado.debe
                ? "La fecha límite depende de los dos últimos dígitos de su cédula. Presentarla tarde tiene sanción, aunque no haya impuesto a pagar."
                : "Aun sin estar obligado, le puede convenir declarar si le hicieron retenciones: la DIAN le devuelve lo que le retuvieron de más."}
            </p>
            <Link href={`${RAIZ}/consulta?area=impuestos`} className={`${botonVino} mt-6`}>
              {resultado.debe ? "Que el contador la haga por mí" : "Revisar si tengo saldo a favor"}
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

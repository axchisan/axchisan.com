"use client"

import { useState } from "react"
import { Check, Printer } from "lucide-react"

/**
 * Lista de lo que hay que traer. Se marca mientras se buscan los papeles, y se
 * imprime o se guarda en PDF para llevarla a la oficina.
 */
export function ListaDocumentos({ documentos }: { documentos: string[] }) {
  const [listos, setListos] = useState<Set<number>>(new Set())
  const alternar = (i: number) =>
    setListos((s) => {
      const n = new Set(s)
      if (n.has(i)) n.delete(i)
      else n.add(i)
      return n
    })
  return (
    <div>
      <ul className="divide-y divide-rd-linea border-y border-rd-linea">
        {documentos.map((d, i) => (
          <li key={d}>
            <label className="flex cursor-pointer items-center gap-3 py-3.5 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-rd-vino">
              <input type="checkbox" className="peer sr-only" checked={listos.has(i)} onChange={() => alternar(i)} />
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[2px] border border-rd-gris bg-white peer-checked:border-rd-exito peer-checked:bg-rd-exito" aria-hidden>
                {listos.has(i) && <Check className="h-4 w-4 text-white" />}
              </span>
              <span className={listos.has(i) ? "text-rd-gris line-through" : ""}>{d}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="text-[0.9375rem] text-rd-gris" aria-live="polite">
          {listos.size === documentos.length ? "Tiene todo para la consulta." : `${listos.size} de ${documentos.length} listos`}
        </p>
        <button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-[3px] border border-rd-tinta px-4 text-[0.9375rem] font-semibold hover:bg-rd-tinta hover:text-white">
          <Printer className="h-4 w-4" aria-hidden />
          Imprimir la lista
        </button>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useState } from "react"
import { ExternalLink } from "lucide-react"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { pesos } from "@/lib/catalogo/planes"
import { PlatoPeltre } from "../carta"
import { RAIZ } from "../config"
import { alternarAgotado, cambiarPrecio, estaAgotado, precioDe, useRestaurante } from "../estado"
import { CATEGORIAS, PLATOS, type Plato } from "../modelo"
import { Cargando, Encabezado } from "./marco"

export function CartaPanelFogon() {
  const e = useRestaurante()
  return (
    <SoloEnNivel nivel="carta">
      {!e ? (
        <Cargando />
      ) : (
        <>
          <Encabezado
            titulo="Carta"
            detalle="Lo que cambies aquí se ve al instante en la carta pública y en los pedidos."
            accion={
              <Link href={`${RAIZ}#carta`} target="_blank" className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-fg-cobalto px-4 text-[0.9375rem] font-bold text-fg-cobalto hover:bg-fg-cobalto hover:text-white">
                <ExternalLink className="h-4 w-4" aria-hidden />
                Ver la carta pública
              </Link>
            }
          />
          <div className="space-y-10 px-4 py-6 sm:px-8">
            {CATEGORIAS.map((c, ci) => (
              <section key={c.id} aria-labelledby={`panel-cat-${c.id}`}>
                <h2 id={`panel-cat-${c.id}`} className="font-fg-letrero text-[1.375rem]">
                  {c.nombre}
                </h2>
                <ul className="mt-3 divide-y divide-fg-linea rounded-[16px] bg-white ring-1 ring-fg-linea">
                  {PLATOS.filter((p) => p.categoria === c.id).map((p, i) => (
                    <FilaCarta key={`${p.id}-${precioDe(e, p)}`} plato={p} precio={precioDe(e, p)} agotado={estaAgotado(e, p.id)} marcar={ci === 0 && i === 0} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
    </SoloEnNivel>
  )
}

const miles = (n: number) => n.toLocaleString("es-CO")

function FilaCarta({ plato, precio, agotado, marcar }: { plato: Plato; precio: number; agotado: boolean; marcar: boolean }) {
  const [borrador, setBorrador] = useState(miles(precio))
  const [aviso, setAviso] = useState("")

  function guardar() {
    const valor = Number(borrador.replace(/\D/g, ""))
    if (!valor || valor < 1_000) {
      setBorrador(miles(precio))
      setAviso("El precio debe ser de al menos $ 1.000.")
      return
    }
    setBorrador(miles(valor))
    if (valor !== precio) cambiarPrecio(plato.id, valor)
  }

  const campoPrecio = (
    <label className="block">
      <span className="sr-only">Precio de {plato.nombre}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-ceniza">$</span>
        <input
          value={borrador}
          onChange={(ev) => {
            setBorrador(ev.target.value)
            setAviso("")
          }}
          onBlur={guardar}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") (ev.target as HTMLInputElement).blur()
          }}
          inputMode="numeric"
          className="h-11 w-32 rounded-[10px] border border-fg-linea pr-3 pl-7 text-right text-[1rem] font-semibold tabular-nums focus:border-fg-cobalto focus:outline-2 focus:outline-fg-cobalto"
        />
      </span>
    </label>
  )

  const interruptor = (
    <button
      type="button"
      role="switch"
      aria-checked={agotado}
      onClick={() => alternarAgotado(plato.id)}
      className="inline-flex items-center gap-2.5 rounded-full py-1 pr-1 text-[0.9375rem] font-semibold"
    >
      <span className={`relative h-6 w-11 rounded-full transition-colors ${agotado ? "bg-fg-aji" : "bg-fg-linea"}`} aria-hidden>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left] ${agotado ? "left-[22px]" : "left-0.5"}`} />
      </span>
      <span className={agotado ? "text-fg-aji" : "text-fg-ceniza"}>Agotado hoy</span>
      <span className="sr-only">: {plato.nombre}</span>
    </button>
  )

  return (
    <li className="flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3.5">
      <div className="p-1">
        <PlatoPeltre plato={plato} tamano={44} gris={agotado} />
      </div>
      <div className="min-w-[10rem] flex-1">
        <p className="font-bold">{plato.nombre}</p>
        {precio !== plato.precio && !aviso && <p className="text-[0.8125rem] text-fg-ceniza">Antes {pesos(plato.precio)}</p>}
        {aviso && (
          <p role="alert" className="text-[0.8125rem] font-semibold text-fg-aji">
            {aviso}
          </p>
        )}
      </div>
      {marcar ? <Punto id="precio">{campoPrecio}</Punto> : campoPrecio}
      {marcar ? <Punto id="agotado">{interruptor}</Punto> : interruptor}
    </li>
  )
}

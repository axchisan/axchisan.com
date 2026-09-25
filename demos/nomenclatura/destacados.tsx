"use client"

import Link from "next/link"
import { todos, useInmobiliaria } from "./estado"
import { RAIZ } from "./config"
import { TarjetaInmueble } from "./publico"

/** Los destacados desde el panel primero, después los más recientes. */
export function Destacados() {
  const e = useInmobiliaria()
  const lista = todos(e)
    .filter((x) => x.estado === "disponible")
    .sort((a, b) => Number(b.destacado) - Number(a.destacado) || a.publicado - b.publicado)
    .slice(0, 6)
  return (
    <section aria-labelledby="destacados-titulo" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="destacados-titulo" className="text-[2.25rem] leading-none font-extrabold tracking-[-0.03em]">
          Recién publicados
        </h2>
        <Link href={`${RAIZ}/inmuebles`} className="font-semibold text-nm-petroleo underline underline-offset-4">
          Ver los {todos(e).length} inmuebles
        </Link>
      </div>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((x) => (
          <li key={x.id}>
            <TarjetaInmueble x={x} />
          </li>
        ))}
      </ul>
    </section>
  )
}

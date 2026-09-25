"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { MessageCircle, Search } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { aParams, enRango, numeroDe } from "@/demos/motores/listados/listados"
import { RAIZ } from "./config"
import { todos, useInmobiliaria } from "./estado"
import { ZONAS, type Operacion } from "./modelo"
import { BotonWhatsappInmobiliaria, botonPetroleo, MapaValle, TarjetaInmueble } from "./publico"

const TOPES_VENTA = [300, 450, 600, 900, 1_500].map((m) => m * 1_000_000)
const TOPES_ARRIENDO = [1.5, 2, 2.5, 3.5, 6].map((m) => m * 1_000_000)
const ORDENES = { recientes: "Más recientes", "menor-precio": "Menor precio", "mayor-precio": "Mayor precio", area: "Más área" } as const

const selector = "h-11 rounded-[6px] border border-nm-linea bg-white px-3 text-[0.9375rem] focus:border-nm-petroleo focus:outline-2 focus:outline-nm-petroleo"

/** El buscador de la portada: lleva al listado con los filtros ya puestos. */
export function Buscador() {
  const router = useRouter()
  const [operacion, setOperacion] = useState<Operacion>("venta")
  const [zona, setZona] = useState("")
  const [habitaciones, setHabitaciones] = useState("")
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault()
        router.push(`${RAIZ}/inmuebles?${aParams({ operacion, zona, habitaciones })}`)
      }}
      className="rounded-[10px] bg-white p-4 text-nm-tinta shadow-xl sm:p-5"
    >
      <div role="radiogroup" aria-label="Qué buscas" className="inline-flex rounded-[6px] bg-nm-fondo p-1">
        {(["venta", "arriendo"] as const).map((o) => (
          <button key={o} type="button" role="radio" aria-checked={operacion === o} onClick={() => setOperacion(o)} className={`rounded-[4px] px-4 py-1.5 font-semibold ${operacion === o ? "bg-nm-tinta text-white" : "text-nm-gris hover:text-nm-tinta"}`}>
            {o === "venta" ? "Comprar" : "Arrendar"}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <label className="block">
          <span className="text-[0.875rem] font-semibold">Zona</span>
          <select value={zona} onChange={(ev) => setZona(ev.target.value)} className={`${selector} mt-1 w-full`}>
            <option value="">Todas las zonas</option>
            {ZONAS.map((z) => (
              <option key={z}>{z}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[0.875rem] font-semibold">Alcobas</span>
          <select value={habitaciones} onChange={(ev) => setHabitaciones(ev.target.value)} className={`${selector} mt-1 w-full`}>
            <option value="">Cualquier número</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n} o más
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className={`${botonPetroleo} self-end`}>
          <Search className="h-5 w-5" aria-hidden />
          Buscar
        </button>
      </div>
    </form>
  )
}

export function ListadoInmuebles() {
  const e = useInmobiliaria()
  const params = useSearchParams()
  const router = useRouter()
  const ruta = usePathname()
  const [activo, setActivo] = useState<string | null>(null)

  const operacion = (params.get("operacion") as Operacion | null) ?? ""
  const zona = params.get("zona") ?? ""
  const habitaciones = numeroDe(params, "habitaciones")
  const tope = numeroDe(params, "hasta")
  const orden = (params.get("orden") as keyof typeof ORDENES | null) ?? "recientes"

  const cambiar = (cambio: Record<string, string | number | undefined>) => {
    const siguiente = aParams({ operacion, zona, habitaciones, hasta: tope, orden: orden === "recientes" ? undefined : orden, ...cambio })
    router.replace(`${ruta}?${siguiente}`, { scroll: false })
  }

  const lista = todos(e)
    .filter((x) => (!operacion || x.operacion === operacion) && (!zona || x.zona === zona) && enRango(x.habitaciones, { min: habitaciones }) && enRango(x.precio, { max: tope }))
    .sort((a, b) =>
      orden === "menor-precio" ? a.precio - b.precio : orden === "mayor-precio" ? b.precio - a.precio : orden === "area" ? b.area - a.area : Number(b.destacado) - Number(a.destacado) || a.publicado - b.publicado,
    )
  const topes = operacion === "arriendo" ? TOPES_ARRIENDO : TOPES_VENTA

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 pb-20 sm:px-6">
      <h1 className="text-[2.25rem] leading-none font-extrabold tracking-[-0.03em]">
        {operacion === "arriendo" ? "Inmuebles en arriendo" : operacion === "venta" ? "Inmuebles en venta" : "Todos los inmuebles"}
        {zona ? ` en ${zona}` : ""}
      </h1>

      <Punto id="filtros" className="mt-6">
        <div className="flex flex-wrap items-end gap-3 rounded-[8px] bg-white p-4 ring-1 ring-nm-linea">
          <label className="block">
            <span className="block text-[0.8125rem] font-semibold">Operación</span>
            <select value={operacion} onChange={(ev) => cambiar({ operacion: ev.target.value, hasta: undefined })} className={`${selector} mt-1`}>
              <option value="">Venta y arriendo</option>
              <option value="venta">Venta</option>
              <option value="arriendo">Arriendo</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-[0.8125rem] font-semibold">Zona</span>
            <select value={zona} onChange={(ev) => cambiar({ zona: ev.target.value })} className={`${selector} mt-1`}>
              <option value="">Todas</option>
              {ZONAS.map((z) => (
                <option key={z}>{z}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-[0.8125rem] font-semibold">Alcobas</span>
            <select value={habitaciones ?? ""} onChange={(ev) => cambiar({ habitaciones: ev.target.value })} className={`${selector} mt-1`}>
              <option value="">Cualquiera</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} o más
                </option>
              ))}
            </select>
          </label>
          {operacion && (
            <label className="block">
              <span className="block text-[0.8125rem] font-semibold">Hasta</span>
              <select value={tope ?? ""} onChange={(ev) => cambiar({ hasta: ev.target.value })} className={`${selector} mt-1`}>
                <option value="">Sin tope</option>
                {topes.map((t) => (
                  <option key={t} value={t}>
                    {operacion === "arriendo" ? `$ ${(t / 1_000_000).toLocaleString("es-CO")} millones al mes` : `$ ${(t / 1_000_000).toLocaleString("es-CO")} millones`}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="block sm:ml-auto">
            <span className="block text-[0.8125rem] font-semibold">Ordenar</span>
            <select value={orden} onChange={(ev) => cambiar({ orden: ev.target.value === "recientes" ? undefined : ev.target.value })} className={`${selector} mt-1`}>
              {Object.entries(ORDENES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Punto>

      <p className="mt-4 text-[0.9375rem] text-nm-gris" aria-live="polite">
        {lista.length} {lista.length === 1 ? "inmueble" : "inmuebles"}
      </p>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_380px]">
        {lista.length === 0 ? (
          <div className="rounded-[8px] bg-white p-8 ring-1 ring-nm-linea">
            <p className="text-[1.125rem] font-semibold">No tenemos inmuebles con esos filtros ahora.</p>
            <p className="mt-2 text-nm-gris">Déjanos lo que buscas y te avisamos cuando entre uno. Muchos se arriendan antes de publicarse.</p>
            <BotonWhatsappInmobiliaria mensaje={`Hola, Nomenclatura. Busco ${operacion || "inmueble"}${zona ? ` en ${zona}` : ""}${habitaciones ? ` de ${habitaciones} alcobas o más` : ""}. ¿Me avisan si entra algo?`} className={`${botonPetroleo} mt-5`}>
              <MessageCircle className="h-5 w-5" aria-hidden />
              Avísenme por WhatsApp
            </BotonWhatsappInmobiliaria>
          </div>
        ) : (
          <ul className="grid content-start gap-5 sm:grid-cols-2">
            {lista.map((x, i) => (
              <li key={x.id} onMouseEnter={() => setActivo(x.id)} onMouseLeave={() => setActivo(null)} className={activo === x.id ? "rounded-[8px] ring-2 ring-nm-ladrillo" : ""}>
                <TarjetaInmueble x={x} prioridad={i < 2} />
              </li>
            ))}
          </ul>
        )}
        <aside aria-label="Mapa" className="lg:sticky lg:top-16 lg:self-start">
          <Punto id="mapa">
            <div className="aspect-square overflow-hidden rounded-[8px] ring-1 ring-nm-linea">
              <MapaValle inmuebles={lista} activo={activo} alPasar={setActivo} />
            </div>
          </Punto>
          <p className="mt-2 text-[0.8125rem] text-nm-gris">Mapa esquemático. La dirección exacta se entrega al agendar la visita.</p>
        </aside>
      </div>
    </div>
  )
}

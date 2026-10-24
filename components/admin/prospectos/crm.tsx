"use client"

import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
import { ExternalLink, List, Map as MapIcon, MessageCircle, Phone, Search, X } from "lucide-react"
import { ESTADOS, ESTADOS_WEB, esCelular, mensajeDeEntrada, nombreEstado } from "@/lib/prospectos"

const MapaProspectos = dynamic(() => import("./mapa").then((m) => m.MapaProspectos), { ssr: false })

export type Evento = { id: string; tipo: string; texto: string; createdAt: string }
export type Prospecto = {
  id: string
  nombre: string
  categoria: string | null
  ficha: string | null
  ciudad: string
  zona: string | null
  direccion: string | null
  telefono: string | null
  web: string | null
  estadoWeb: string
  calificacion: number | null
  resenas: number
  lat: number | null
  lng: number | null
  mapsUrl: string | null
  distanciaKm: number | null
  prioridad: string
  puntaje: number
  fortalezas: string | null
  falta: string | null
  plan: string | null
  estado: string
  proximo: string | null
  notas: string | null
  eventos: Evento[]
}

const ACTIVOS = ["escrito", "respondio", "reunion"]
const hoy = () => new Date().toISOString().slice(0, 10)
const sumarDias = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10)
const fecha = (iso: string) => new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short" })
const PRIORIDAD: Record<string, string> = { A: "bg-accent-weak text-accent-ink", B: "bg-[#fbf0dc] text-[#8f5808]", C: "bg-paper text-mid" }

type Orden = "prioridad" | "cerca" | "resenas" | "proximo"

export function ProspectosCRM({ inicial, base }: { inicial: Prospecto[]; base: { lat: number; lng: number } | null }) {
  const [lista, setLista] = useState(inicial)
  const [vista, setVista] = useState<"lista" | "mapa">("lista")
  const [texto, setTexto] = useState("")
  const [estado, setEstado] = useState("activos")
  const [prioridad, setPrioridad] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [zona, setZona] = useState("")
  const [ficha, setFicha] = useState("")
  const [web, setWeb] = useState("")
  const [soloCelular, setSoloCelular] = useState(false)
  const [orden, setOrden] = useState<Orden>("prioridad")
  const [elegido, setElegido] = useState<string | null>(null)

  const opciones = (f: (p: Prospecto) => string | null) => [...new Set(lista.map(f).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b, "es"))
  const ciudades = opciones((p) => p.ciudad)
  const zonas = opciones((p) => (ciudad && p.ciudad !== ciudad ? null : p.zona))
  const fichas = opciones((p) => p.ficha)

  const filtrados = useMemo(() => {
    const t = texto.trim().toLowerCase()
    const r = lista.filter((p) => {
      if (estado === "activos" && p.estado === "descartado") return false
      if (estado === "hoy" && !(p.proximo && p.proximo.slice(0, 10) <= hoy() && p.estado !== "cliente" && p.estado !== "descartado")) return false
      if (estado !== "activos" && estado !== "hoy" && estado && p.estado !== estado) return false
      if (prioridad && p.prioridad !== prioridad) return false
      if (ciudad && p.ciudad !== ciudad) return false
      if (zona && p.zona !== zona) return false
      if (ficha && p.ficha !== ficha) return false
      if (web && p.estadoWeb !== web) return false
      if (soloCelular && !esCelular(p.telefono)) return false
      if (t && !`${p.nombre} ${p.categoria ?? ""} ${p.direccion ?? ""} ${p.zona ?? ""}`.toLowerCase().includes(t)) return false
      return true
    })
    const por: Record<Orden, (a: Prospecto, b: Prospecto) => number> = {
      prioridad: (a, b) => a.prioridad.localeCompare(b.prioridad) || b.puntaje - a.puntaje || b.resenas - a.resenas,
      cerca: (a, b) => (a.distanciaKm ?? 999) - (b.distanciaKm ?? 999),
      resenas: (a, b) => b.resenas - a.resenas,
      proximo: (a, b) => (a.proximo ?? "9999").localeCompare(b.proximo ?? "9999"),
    }
    return r.sort(por[orden])
  }, [lista, texto, estado, prioridad, ciudad, zona, ficha, web, soloCelular, orden])

  const cuenta = (f: (p: Prospecto) => boolean) => lista.filter(f).length
  const resumen = [
    { id: "hoy", nombre: "Para hoy", valor: cuenta((p) => !!p.proximo && p.proximo.slice(0, 10) <= hoy() && !["cliente", "descartado"].includes(p.estado)) },
    { id: "por-contactar", nombre: "Por contactar", valor: cuenta((p) => p.estado === "por-contactar"), extra: `${cuenta((p) => p.estado === "por-contactar" && p.prioridad === "A")} con prioridad A` },
    { id: "activos-conv", nombre: "En conversación", valor: cuenta((p) => ACTIVOS.includes(p.estado)) },
    { id: "propuesta", nombre: "Propuestas", valor: cuenta((p) => p.estado === "propuesta") },
    { id: "cliente", nombre: "Clientes", valor: cuenta((p) => p.estado === "cliente") },
  ]

  const actual = lista.find((p) => p.id === elegido) ?? null
  const reemplazar = (p: Prospecto) => setLista((l) => l.map((x) => (x.id === p.id ? p : x)))

  async function guardar(id: string, cambios: Partial<{ estado: string; proximo: string | null; notas: string; prioridad: string }>) {
    const res = await fetch(`/api/admin/prospectos/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cambios) })
    if (!res.ok) return
    const p = await res.json()
    reemplazar({ ...p, proximo: p.proximo, eventos: p.eventos })
  }

  async function anotar(id: string, tipo: string, textoEvento: string) {
    const res = await fetch(`/api/admin/prospectos/${id}/eventos`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tipo, texto: textoEvento }) })
    if (!res.ok) return
    const e = await res.json()
    setLista((l) => l.map((x) => (x.id === id ? { ...x, eventos: [e, ...x.eventos] } : x)))
  }

  const campo = "h-9 rounded-[8px] border border-line bg-card px-2.5 text-sm"

  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {resumen.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => setEstado(r.id === "activos-conv" ? "escrito" : r.id)}
              className="w-full rounded-[12px] border border-line bg-card p-4 text-left hover:border-line-firm"
            >
              <span className="block text-sm text-mid">{r.nombre}</span>
              <span className="mt-1 block text-2xl font-semibold tabular-nums">{r.valor}</span>
              {r.extra && <span className="text-xs text-mid">{r.extra}</span>}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <label className="relative">
          <span className="sr-only">Buscar</span>
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-faint" aria-hidden />
          <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Buscar negocio, barrio…" className={`${campo} w-56 pl-8`} />
        </label>
        <select aria-label="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} className={campo}>
          <option value="activos">Todos menos descartados</option>
          <option value="hoy">Para hoy</option>
          {ESTADOS.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
        <select aria-label="Prioridad" value={prioridad} onChange={(e) => setPrioridad(e.target.value)} className={campo}>
          <option value="">Toda prioridad</option>
          <option value="A">Prioridad A</option>
          <option value="B">Prioridad B</option>
          <option value="C">Prioridad C</option>
        </select>
        <select aria-label="Ciudad" value={ciudad} onChange={(e) => { setCiudad(e.target.value); setZona("") }} className={campo}>
          <option value="">Todas las ciudades</option>
          {ciudades.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        {zonas.length > 0 && (
          <select aria-label="Zona" value={zona} onChange={(e) => setZona(e.target.value)} className={campo}>
            <option value="">Todas las zonas</option>
            {zonas.map((z) => (
              <option key={z}>{z}</option>
            ))}
          </select>
        )}
        <select aria-label="Sector" value={ficha} onChange={(e) => setFicha(e.target.value)} className={campo}>
          <option value="">Todos los sectores</option>
          {fichas.map((f) => (
            <option key={f} value={f}>
              {f.replace(/-/g, " ")}
            </option>
          ))}
        </select>
        <select aria-label="Página web" value={web} onChange={(e) => setWeb(e.target.value)} className={campo}>
          <option value="">Con o sin página</option>
          {Object.entries(ESTADOS_WEB).map(([id, n]) => (
            <option key={id} value={id}>
              {n}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" checked={soloCelular} onChange={(e) => setSoloCelular(e.target.checked)} />
          Con WhatsApp
        </label>
        <select aria-label="Ordenar" value={orden} onChange={(e) => setOrden(e.target.value as Orden)} className={campo}>
          <option value="prioridad">Ordenar por prioridad</option>
          <option value="cerca">Más cerca de la base</option>
          <option value="resenas">Más reseñas</option>
          <option value="proximo">Próximo contacto</option>
        </select>
        <div className="ml-auto flex rounded-[8px] border border-line bg-card p-0.5" role="group" aria-label="Vista">
          {(
            [
              ["lista", "Lista", List],
              ["mapa", "Mapa", MapIcon],
            ] as const
          ).map(([id, n, I]) => (
            <button key={id} type="button" aria-pressed={vista === id} onClick={() => setVista(id)} className={`flex h-8 items-center gap-1.5 rounded-[6px] px-3 text-sm ${vista === id ? "bg-band text-on-band" : ""}`}>
              <I className="h-4 w-4" aria-hidden />
              {n}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm text-mid" aria-live="polite">
        {filtrados.length} de {lista.length} negocios
      </p>

      <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_26rem]">
        {vista === "lista" ? (
          <ul className="max-h-[70vh] divide-y divide-line overflow-y-auto rounded-[12px] border border-line bg-card" aria-label="Negocios">
            {filtrados.map((p) => (
              <li key={p.id}>
                <button type="button" onClick={() => setElegido(p.id)} aria-current={p.id === elegido ? "true" : undefined} className={`flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-paper ${p.id === elegido ? "bg-paper" : ""}`}>
                  <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${PRIORIDAD[p.prioridad]}`}>{p.prioridad}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{p.nombre}</span>
                    <span className="block truncate text-sm text-mid">
                      {[p.categoria, p.zona ?? p.ciudad].filter(Boolean).join(", ")}
                    </span>
                    <span className="mt-1 flex flex-wrap gap-1.5 text-xs">
                      <span className="rounded-full bg-paper px-2 py-0.5">{ESTADOS_WEB[p.estadoWeb as keyof typeof ESTADOS_WEB]}</span>
                      {p.resenas > 0 && <span className="rounded-full bg-paper px-2 py-0.5">{p.calificacion?.toLocaleString("es-CO")} con {p.resenas} reseñas</span>}
                      {p.estado !== "por-contactar" && <span className="rounded-full bg-band px-2 py-0.5 text-on-band">{nombreEstado(p.estado)}</span>}
                      {p.proximo && <span className="rounded-full bg-[#fbf0dc] px-2 py-0.5 text-[#8f5808]">Volver el {fecha(p.proximo)}</span>}
                    </span>
                  </span>
                  {p.distanciaKm != null && <span className="shrink-0 text-xs text-mid tabular-nums">{p.distanciaKm.toFixed(1)} km</span>}
                </button>
              </li>
            ))}
            {filtrados.length === 0 && <li className="p-6 text-sm text-mid">Ningún negocio con esos filtros.</li>}
          </ul>
        ) : (
          <div className="h-[70vh]">
            <MapaProspectos
              base={base}
              seleccionado={elegido}
              alElegir={setElegido}
              puntos={filtrados.filter((p) => p.lat != null && p.lng != null).map((p) => ({ id: p.id, nombre: p.nombre, lat: p.lat!, lng: p.lng!, prioridad: p.prioridad, estado: p.estado }))}
            />
          </div>
        )}

        {actual ? (
          <Ficha key={actual.id} p={actual} alCerrar={() => setElegido(null)} guardar={guardar} anotar={anotar} />
        ) : (
          <div className="hidden rounded-[12px] border border-dashed border-line p-6 text-sm text-mid lg:block">Elige un negocio para ver su ficha, escribirle y anotar lo que hablaron.</div>
        )}
      </div>
    </div>
  )
}

function Ficha({ p, alCerrar, guardar, anotar }: { p: Prospecto; alCerrar: () => void; guardar: (id: string, c: Partial<{ estado: string; proximo: string | null; notas: string; prioridad: string }>) => Promise<void>; anotar: (id: string, tipo: string, texto: string) => Promise<void> }) {
  const [mensaje, setMensaje] = useState(mensajeDeEntrada(p))
  const [notas, setNotas] = useState(p.notas ?? "")
  const [tipo, setTipo] = useState("llamada")
  const [entrada, setEntrada] = useState("")
  const celular = esCelular(p.telefono)
  const boton = "inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-line px-3 text-sm font-medium hover:border-line-firm"

  async function porWhatsapp() {
    window.open(`https://wa.me/57${p.telefono}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener")
    await anotar(p.id, "whatsapp", "Mensaje de entrada enviado")
    if (p.estado === "por-contactar") await guardar(p.id, { estado: "escrito", proximo: sumarDias(3) })
  }

  return (
    <aside className="fixed inset-0 z-40 overflow-y-auto bg-card p-5 lg:static lg:z-auto lg:max-h-[70vh] lg:rounded-[12px] lg:border lg:border-line" aria-label={`Ficha de ${p.nombre}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-[-0.01em]">{p.nombre}</h2>
          <p className="text-sm text-mid">{[p.categoria, p.zona, p.ciudad].filter(Boolean).join(", ")}</p>
        </div>
        <button type="button" onClick={alCerrar} aria-label="Cerrar ficha" className="rounded-[8px] p-1.5 hover:bg-paper">
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
        <dt className="text-mid">Prioridad</dt>
        <dd>
          <select aria-label="Prioridad" value={p.prioridad} onChange={(e) => void guardar(p.id, { prioridad: e.target.value })} className="rounded border border-line bg-card px-1">
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <span className="ml-2 text-mid">puntaje {p.puntaje}</span>
        </dd>
        {p.direccion && (
          <>
            <dt className="text-mid">Dirección</dt>
            <dd>{p.direccion}</dd>
          </>
        )}
        {p.distanciaKm != null && (
          <>
            <dt className="text-mid">Distancia</dt>
            <dd>{p.distanciaKm.toFixed(1)} km de la base</dd>
          </>
        )}
        <dt className="text-mid">Teléfono</dt>
        <dd>{p.telefono ? `${p.telefono}${celular ? " (celular)" : " (fijo)"}` : "Sin teléfono"}</dd>
        <dt className="text-mid">Web</dt>
        <dd className="break-all">{p.web ? <a href={p.web} target="_blank" rel="noreferrer noopener" className="text-accent-ink underline">{p.web.replace(/^https?:\/\/(www\.)?/, "")}</a> : "No tiene"}</dd>
        {p.resenas > 0 && (
          <>
            <dt className="text-mid">Google</dt>
            <dd>
              {p.calificacion?.toLocaleString("es-CO")} con {p.resenas} reseñas
            </dd>
          </>
        )}
      </dl>

      {p.fortalezas && <p className="mt-4 rounded-[8px] bg-paper p-3 text-sm">{p.fortalezas}.</p>}
      {p.falta && (
        <p className="mt-2 text-sm">
          <span className="font-medium">Qué ofrecerle: </span>
          {p.falta}. Plan sugerido: {p.plan}.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {p.telefono && celular && (
          <button type="button" onClick={() => void porWhatsapp()} className="inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-accent px-3 text-sm font-semibold text-on-accent hover:bg-accent-hover hover:text-on-band">
            <MessageCircle className="h-4 w-4" aria-hidden />
            Escribir por WhatsApp
          </button>
        )}
        {p.telefono && (
          <a href={`tel:${p.telefono}`} className={boton}>
            <Phone className="h-4 w-4" aria-hidden />
            Llamar
          </a>
        )}
        {p.mapsUrl && (
          <a href={p.mapsUrl} target="_blank" rel="noreferrer noopener" className={boton}>
            <ExternalLink className="h-4 w-4" aria-hidden />
            Google Maps
          </a>
        )}
        {p.ficha && (
          <a href={`/soluciones/${p.ficha}`} target="_blank" rel="noreferrer noopener" className={boton}>
            <ExternalLink className="h-4 w-4" aria-hidden />
            Su demo
          </a>
        )}
      </div>

      {celular && (
        <label className="mt-4 block text-sm">
          <span className="font-medium">Mensaje de entrada</span>
          <span className="block text-xs text-mid">Cámbiale una frase por algo que viste en su ficha de Google.</span>
          <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={5} className="mt-1.5 w-full rounded-[8px] border border-line bg-card p-2.5 text-sm" />
        </label>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <label>
          <span className="font-medium">Estado</span>
          <select value={p.estado} onChange={(e) => void guardar(p.id, { estado: e.target.value })} className="mt-1 h-9 w-full rounded-[8px] border border-line bg-card px-2">
            {ESTADOS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="font-medium">Volver a contactar</span>
          <input type="date" value={p.proximo?.slice(0, 10) ?? ""} onChange={(e) => void guardar(p.id, { proximo: e.target.value || null })} className="mt-1 h-9 w-full rounded-[8px] border border-line bg-card px-2" />
        </label>
      </div>

      <label className="mt-4 block text-sm">
        <span className="font-medium">Notas</span>
        <textarea value={notas} onChange={(e) => setNotas(e.target.value)} onBlur={() => notas !== (p.notas ?? "") && void guardar(p.id, { notas })} rows={3} placeholder="El dueño se llama…, le interesa…" className="mt-1.5 w-full rounded-[8px] border border-line bg-card p-2.5 text-sm" />
      </label>

      <section className="mt-4" aria-labelledby={`h-${p.id}`}>
        <h3 id={`h-${p.id}`} className="text-sm font-medium">
          Historial
        </h3>
        <form
          className="mt-2 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (!entrada.trim()) return
            void anotar(p.id, tipo, entrada.trim()).then(() => setEntrada(""))
          }}
        >
          <select aria-label="Tipo de contacto" value={tipo} onChange={(e) => setTipo(e.target.value)} className="h-9 rounded-[8px] border border-line bg-card px-2 text-sm">
            <option value="llamada">Llamada</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="visita">Visita</option>
            <option value="nota">Nota</option>
          </select>
          <input aria-label="Qué pasó" value={entrada} onChange={(e) => setEntrada(e.target.value)} placeholder="Qué pasó" className="h-9 min-w-0 flex-1 rounded-[8px] border border-line bg-card px-2.5 text-sm" />
          <button type="submit" className="h-9 rounded-[8px] bg-band px-3 text-sm font-medium text-on-band">
            Anotar
          </button>
        </form>
        <ol className="mt-3 space-y-2 text-sm">
          {p.eventos.map((e) => (
            <li key={e.id} className="flex gap-2">
              <span className="w-14 shrink-0 text-mid tabular-nums">{fecha(e.createdAt)}</span>
              <span>
                <span className="font-medium capitalize">{e.tipo}</span>: {e.texto}
              </span>
            </li>
          ))}
          {p.eventos.length === 0 && <li className="text-mid">Todavía no hay contactos.</li>}
        </ol>
      </section>
    </aside>
  )
}

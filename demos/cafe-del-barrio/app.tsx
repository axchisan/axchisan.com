"use client"

import { useEffect, useState, type ReactNode } from "react"
import QRCode from "qrcode"
import { Clock3, Gift, History, Home, Share2, Ticket } from "lucide-react"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { textoFecha, textoHora } from "@/demos/motores/agenda/tiempo"
import { estadoCupon, type Cupon, type EstadoCupon } from "@/demos/motores/fidelizacion/programa"
import { claveDia } from "@/demos/motores/agenda/tiempo"
import { BONO_REFERIDO, CLIENTE_DEMO, PROGRAMA, RECOMPENSAS } from "./modelo"
import { canjearRecompensa, canjearSellos, clientePorId, resumenCliente, useCafe } from "./estado"
import { Marca } from "./publico"

type Pestana = "inicio" | "premios" | "cupones" | "historial" | "invitar"

const PESTANAS: { id: Pestana; nombre: string; icono: typeof Home }[] = [
  { id: "inicio", nombre: "Inicio", icono: Home },
  { id: "premios", nombre: "Premios", icono: Gift },
  { id: "cupones", nombre: "Cupones", icono: Ticket },
  { id: "historial", nombre: "Historial", icono: History },
  { id: "invitar", nombre: "Invitar", icono: Share2 },
]

/** Un QR dibujado en el navegador: el de la tarjeta del cliente o el de un cupón. */
function Qr({ texto, className }: { texto: string; className?: string }) {
  const [svg, setSvg] = useState("")
  useEffect(() => {
    let vivo = true
    void QRCode.toString(texto, { type: "svg", margin: 1, color: { dark: "#17211c", light: "#ffffff" } }).then((s) => vivo && setSvg(s))
    return () => {
      vivo = false
    }
  }, [texto])
  return <div className={className} aria-hidden dangerouslySetInnerHTML={{ __html: svg }} />
}

/** Un grano de café: el sello de la tarjeta. */
function Grano({ lleno }: { lleno: boolean }) {
  return (
    <svg viewBox="0 0 32 40" className="h-9 w-7" aria-hidden>
      <ellipse cx="16" cy="20" rx="13" ry="17" fill={lleno ? "var(--color-cb-cereza)" : "none"} stroke={lleno ? "var(--color-cb-cereza)" : "var(--color-cb-linea)"} strokeWidth="2.5" />
      <path d="M16 5c-5 7-5 23 0 30" fill="none" stroke={lleno ? "#fff" : "var(--color-cb-linea)"} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export function AppCliente() {
  const e = useCafe()
  const [pestana, setPestana] = useState<Pestana>("inicio")
  const [cuponNuevo, setCuponNuevo] = useState<Cupon | null>(null)

  const cliente = clientePorId(e, CLIENTE_DEMO)
  if (!e || !cliente) return <div className="h-full min-h-[40rem] animate-pulse bg-cb-fondo" aria-busy="true" />
  const r = resumenCliente(e, cliente.id)

  const irA = (p: Pestana) => {
    setPestana(p)
    setCuponNuevo(null)
    document.getElementById("app-contenido")?.scrollTo({ top: 0 })
  }

  return (
    <div className="flex h-full flex-col bg-cb-fondo text-cb-tinta">
      <header className="flex items-center justify-between bg-cb-cafeto px-5 pt-5 pb-4 text-white">
        <Marca claro />
        <span className="text-[0.875rem] text-cb-menta">Hola, {cliente.nombre.split(" ")[0]}</span>
      </header>

      <div id="app-contenido" className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
        {cuponNuevo ? (
          <CuponGrande cupon={cuponNuevo} alVolver={() => irA("cupones")} />
        ) : pestana === "inicio" ? (
          <Inicio r={r} codigo={cliente.codigo} alCanjearSellos={() => {
            const x = canjearSellos(cliente.id)
            if (x.ok) setCuponNuevo(x.cupon)
          }} irA={irA} />
        ) : pestana === "premios" ? (
          <Premios saldo={r.saldo} alCanjear={(id) => {
            const x = canjearRecompensa(cliente.id, id)
            if (x.ok) setCuponNuevo(x.cupon)
            return x
          }} />
        ) : pestana === "cupones" ? (
          <Cupones cupones={r.cupones} />
        ) : pestana === "historial" ? (
          <Historial clienteId={cliente.id} />
        ) : (
          <Invitar codigo={cliente.codigo} nombre={cliente.nombre} invitados={e.clientes.filter((c) => c.referidoPor === cliente.id).length} />
        )}
      </div>

      <nav aria-label="Secciones de la app" className="grid grid-cols-5 border-t border-cb-linea bg-white">
        {PESTANAS.map((p) => {
          const activa = pestana === p.id && !cuponNuevo
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => irA(p.id)}
              aria-current={activa ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-2.5 text-[0.75rem] font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cb-cafeto ${activa ? "text-cb-cafeto" : "text-cb-gris"}`}
            >
              <p.icono className={`h-5 w-5 ${activa ? "stroke-[2.4]" : ""}`} aria-hidden />
              {p.nombre}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

type Resumen = ReturnType<typeof resumenCliente>

function Tarjeta({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[18px] bg-white p-5 ${className ?? ""}`}>{children}</section>
}

function Inicio({ r, codigo, alCanjearSellos, irA }: { r: Resumen; codigo: string; alCanjearSellos: () => void; irA: (p: Pestana) => void }) {
  const { nivel } = r
  const progreso = nivel.siguiente ? Math.min(1, (nivel.ganados - nivel.actual.desde) / (nivel.siguiente.desde - nivel.actual.desde)) : 1
  const activo = r.cupones.find((c) => estadoCupon(c, claveDia(new Date())) === "activo")
  return (
    <div className="space-y-3">
      <Punto id="tarjeta">
        <section className="rounded-[18px] bg-cb-cafeto p-5 text-white">
          <p className="text-[0.875rem] text-cb-menta">Nivel {nivel.actual.nombre}</p>
          <p className="mt-1 font-cb-marca text-[2.75rem] leading-none" data-saldo>
            {r.saldo.toLocaleString("es-CO")} <span className="text-[1.125rem]">puntos</span>
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20" aria-hidden>
            <div className="h-full rounded-full bg-cb-menta" style={{ width: `${progreso * 100}%` }} />
          </div>
          <p className="mt-2 text-[0.875rem] text-cb-menta">
            {nivel.siguiente ? `Te faltan ${nivel.faltan.toLocaleString("es-CO")} puntos para el nivel ${nivel.siguiente.nombre}.` : "Estás en el nivel más alto."}
          </p>
        </section>
      </Punto>

      <Punto id="codigo">
        <Tarjeta className="flex items-center gap-4">
          <Qr texto={codigo} className="h-24 w-24 shrink-0 [&_svg]:h-full [&_svg]:w-full" />
          <div>
            <p className="text-[0.875rem] text-cb-gris">Tu código para la caja</p>
            <p className="font-cb-marca text-[1.75rem] leading-tight tracking-[0.04em]" data-codigo-cliente>
              {codigo}
            </p>
            <p className="text-[0.875rem] text-cb-gris">Muéstralo al pagar y sumas puntos.</p>
          </div>
        </Tarjeta>
      </Punto>

      <Tarjeta>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-semibold">Tarjeta de sellos</h2>
          <p className="text-[0.875rem] text-cb-gris" data-sellos>
            {r.sellos.tiene} de {PROGRAMA.sellos}
          </p>
        </div>
        <div className="mt-3 flex justify-between" role="img" aria-label={`${r.sellos.tiene} de ${PROGRAMA.sellos} sellos`}>
          {Array.from({ length: PROGRAMA.sellos }, (_, i) => (
            <Grano key={i} lleno={i < r.sellos.tiene} />
          ))}
        </div>
        {r.sellos.llena ? (
          <button type="button" onClick={alCanjearSellos} className="mt-4 h-11 w-full rounded-full bg-cb-cereza font-semibold text-white hover:opacity-90">
            Cambiar por un café gratis
          </button>
        ) : (
          <p className="mt-3 text-[0.875rem] text-cb-gris">
            Te {PROGRAMA.sellos - r.sellos.tiene === 1 ? "falta 1 sello" : `faltan ${PROGRAMA.sellos - r.sellos.tiene} sellos`} para un café gratis. Suma uno con cada compra desde $ 5.000.
          </p>
        )}
      </Tarjeta>

      {r.porVencer.puntos > 0 && (
        <Punto id="vencen">
          <section className="flex gap-3 rounded-[18px] bg-cb-oro-suave p-4 text-cb-oro">
            <Clock3 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <p className="text-[0.9375rem]">
              <strong className="font-semibold">{r.porVencer.puntos} puntos vencen el {textoFecha(r.porVencer.vence!)}.</strong>{" "}
              <button type="button" onClick={() => irA("premios")} className="underline underline-offset-2">
                Úsalos en un premio
              </button>
            </p>
          </section>
        </Punto>
      )}

      {activo && (
        <button type="button" onClick={() => irA("cupones")} className="flex w-full items-center gap-3 rounded-[18px] bg-cb-cereza-suave p-4 text-left text-cb-cereza">
          <Ticket className="h-5 w-5 shrink-0" aria-hidden />
          <span className="text-[0.9375rem]">
            <strong className="font-semibold">Tienes un cupón:</strong> {activo.titulo}. Vence el {textoFecha(activo.vence)}.
          </span>
        </button>
      )}

      <p className="px-1 text-[0.8125rem] text-cb-gris">{r.nivel.actual.beneficio}</p>
    </div>
  )
}

function Premios({ saldo, alCanjear }: { saldo: number; alCanjear: (id: string) => { ok: boolean } }) {
  const [confirmar, setConfirmar] = useState<string | null>(null)
  return (
    <div>
      <h2 className="font-cb-marca text-[1.5rem]">Premios</h2>
      <p className="text-[0.9375rem] text-cb-gris">Tienes {saldo.toLocaleString("es-CO")} puntos.</p>
      <Punto id="premios" className="mt-3">
        <ul className="space-y-2">
          {RECOMPENSAS.map((x) => {
            const alcanza = saldo >= x.puntos
            return (
              <li key={x.id} className="rounded-[18px] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{x.nombre}</p>
                    <p className="text-[0.875rem] text-cb-gris">{x.detalle}</p>
                  </div>
                  <p className="shrink-0 font-semibold text-cb-cereza tabular-nums">{x.puntos} pts</p>
                </div>
                {confirmar === x.id ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => alCanjear(x.id)} className="h-10 flex-1 rounded-full bg-cb-cafeto text-[0.9375rem] font-semibold text-white hover:bg-cb-cafeto-2">
                      Sí, canjear {x.puntos} puntos
                    </button>
                    <button type="button" onClick={() => setConfirmar(null)} className="h-10 rounded-full border border-cb-linea px-4 text-[0.9375rem]">
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={!alcanza}
                    onClick={() => setConfirmar(x.id)}
                    className="mt-3 h-10 w-full rounded-full border-2 border-cb-cafeto text-[0.9375rem] font-semibold text-cb-cafeto enabled:hover:bg-cb-cafeto enabled:hover:text-white disabled:border-cb-linea disabled:text-cb-gris"
                  >
                    {alcanza ? `Canjear ${x.nombre.toLowerCase()}` : `Te faltan ${x.puntos - saldo} puntos`}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </Punto>
    </div>
  )
}

function CuponGrande({ cupon, alVolver }: { cupon: Cupon; alVolver: () => void }) {
  return (
    <div className="rounded-[18px] bg-white p-6 text-center" role="status">
      <p className="text-[0.9375rem] text-cb-gris">Tu cupón</p>
      <h2 className="mt-1 font-cb-marca text-[1.75rem] leading-tight">{cupon.titulo}</h2>
      <Qr texto={cupon.codigo} className="mx-auto mt-4 h-40 w-40 [&_svg]:h-full [&_svg]:w-full" />
      <p className="mt-3 font-cb-marca text-[2rem] tracking-[0.12em]" data-codigo-cupon>
        {cupon.codigo}
      </p>
      <p className="mt-2 text-[0.9375rem] text-cb-gris">Muéstralo en caja antes del {textoFecha(cupon.vence)}. Sirve una sola vez.</p>
      <button type="button" onClick={alVolver} className="mt-5 h-11 w-full rounded-full bg-cb-cafeto font-semibold text-white hover:bg-cb-cafeto-2">
        Ver mis cupones
      </button>
    </div>
  )
}

const ETIQUETA: Record<EstadoCupon, string> = { activo: "Por usar", usado: "Usado", vencido: "Vencido" }

function Cupones({ cupones }: { cupones: Cupon[] }) {
  const hoy = claveDia(new Date())
  const orden: EstadoCupon[] = ["activo", "usado", "vencido"]
  const lista = [...cupones].sort((a, b) => orden.indexOf(estadoCupon(a, hoy)) - orden.indexOf(estadoCupon(b, hoy)) || b.creado.localeCompare(a.creado))
  return (
    <div>
      <h2 className="font-cb-marca text-[1.5rem]">Cupones</h2>
      {lista.length === 0 ? (
        <p className="mt-2 text-cb-gris">Todavía no tienes cupones. Canjea tus puntos en Premios.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {lista.map((c) => {
            const estado = estadoCupon(c, hoy)
            return (
              <li key={c.codigo} className={`rounded-[18px] p-4 ${estado === "activo" ? "bg-white" : "bg-cb-hoja"}`} data-cupon={c.codigo}>
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold">{c.titulo}</p>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.8125rem] font-semibold ${estado === "activo" ? "bg-cb-exito-suave text-cb-exito" : "bg-white text-cb-gris"}`}>
                    {ETIQUETA[estado]}
                  </span>
                </div>
                <p className="mt-1 text-[0.875rem] text-cb-gris">
                  {estado === "usado" ? `Usado el ${textoFecha(c.usado!.slice(0, 10))}` : estado === "vencido" ? `Venció el ${textoFecha(c.vence)}` : `Vence el ${textoFecha(c.vence)}`}
                </p>
                {estado === "activo" && (
                  <div className="mt-3 flex items-center gap-4">
                    <Qr texto={c.codigo} className="h-20 w-20 shrink-0 [&_svg]:h-full [&_svg]:w-full" />
                    <p className="font-cb-marca text-[1.5rem] tracking-[0.12em]">{c.codigo}</p>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function Historial({ clienteId }: { clienteId: string }) {
  const e = useCafe()
  const movimientos = (e?.movimientos ?? []).filter((m) => m.clienteId === clienteId).slice(-25).reverse()
  return (
    <div>
      <h2 className="font-cb-marca text-[1.5rem]">Historial</h2>
      <ul className="mt-3 divide-y divide-cb-linea rounded-[18px] bg-white px-4">
        {movimientos.map((m) => (
          <li key={m.id} className="flex items-start justify-between gap-3 py-3">
            <div>
              <p className="text-[0.9375rem] font-medium">{m.concepto}</p>
              <p className="text-[0.8125rem] text-cb-gris">
                {textoFecha(m.fecha.slice(0, 10))}, {textoHora(m.fecha)}
                {m.sello ? ", con sello" : ""}
              </p>
            </div>
            <p className={`shrink-0 font-semibold tabular-nums ${m.puntos > 0 ? "text-cb-exito" : m.puntos < 0 ? "text-cb-cereza" : "text-cb-gris"}`}>
              {m.puntos > 0 ? `+${m.puntos}` : m.puntos < 0 ? m.puntos : "Sello"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Invitar({ codigo, nombre, invitados }: { codigo: string; nombre: string; invitados: number }) {
  return (
    <div>
      <h2 className="font-cb-marca text-[1.5rem]">Invita a un amigo</h2>
      <SoloEnNivel nivel="completo" compacto>
        <Tarjeta className="mt-3">
          <p>
            Cuando tu amigo se inscriba en caja con tu código, <strong className="font-semibold">los dos ganan {BONO_REFERIDO} puntos</strong>.
          </p>
          <p className="mt-4 text-[0.875rem] text-cb-gris">Tu código de invitación</p>
          <p className="font-cb-marca text-[2rem] tracking-[0.04em]">{codigo}</p>
          <WhatsappSimulado
            negocio="tu amigo"
            mensaje={`Te invito a Café del Barrio: inscríbete en caja con mi código ${codigo} y los dos ganamos ${BONO_REFERIDO} puntos. — ${nombre.split(" ")[0]}`}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-cb-cafeto font-semibold text-white hover:bg-cb-cafeto-2"
          >
            <Share2 className="h-4 w-4" aria-hidden />
            Invitar por WhatsApp
          </WhatsappSimulado>
          <p className="mt-3 text-[0.875rem] text-cb-gris">{invitados === 1 ? "Has invitado a 1 persona." : `Has invitado a ${invitados} personas.`}</p>
        </Tarjeta>
      </SoloEnNivel>
    </div>
  )
}

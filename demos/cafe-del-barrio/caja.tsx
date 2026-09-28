"use client"

import { useState, type FormEvent } from "react"
import { CircleCheck, CircleX, Minus, Plus, Search, UserPlus } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { useDemo } from "@/demos/comun/contexto"
import { textoFecha } from "@/demos/motores/agenda/tiempo"
import { celularValido } from "@/demos/motores/presencia/formulario"
import { estadoCupon, puntosPorCompra } from "@/demos/motores/fidelizacion/programa"
import { claveDia } from "@/demos/motores/agenda/tiempo"
import { pesos } from "@/lib/catalogo/planes"
import { BONO_REFERIDO, CARTA, PROGRAMA } from "./modelo"
import { buscarCliente, clientePorId, inscribirCliente, registrarCompra, resumenCliente, useCafe, usarCupon, type ResultadoCompra } from "./estado"

const caja = "rounded-[16px] bg-white p-5"
const campo = "mt-1.5 block h-11 w-full rounded-[10px] border border-cb-linea bg-white px-3 text-[1rem] focus:border-cb-cafeto focus:outline-2 focus:outline-cb-cafeto"
const botonPrincipal = "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-cb-cafeto px-5 font-semibold text-white hover:bg-cb-cafeto-2 disabled:cursor-not-allowed disabled:bg-cb-linea disabled:text-cb-gris"

export function Caja() {
  const e = useCafe()
  const [busqueda, setBusqueda] = useState("")
  const [clienteId, setClienteId] = useState<string | null>(null)
  const [noEncontrado, setNoEncontrado] = useState(false)
  const [inscribiendo, setInscribiendo] = useState(false)
  const [pedido, setPedido] = useState<Record<string, number>>({})
  const [compra, setCompra] = useState<(ResultadoCompra & { nombre: string }) | null>(null)
  const [aviso, setAviso] = useState("")

  const cliente = clienteId ? clientePorId(e, clienteId) : null
  const r = e && cliente ? resumenCliente(e, cliente.id) : null
  const total = Object.entries(pedido).reduce((t, [id, n]) => t + (CARTA.find((c) => c.id === id)?.precio ?? 0) * n, 0)
  const puntosPrevistos = r ? puntosPorCompra(PROGRAMA, total, r.nivel.actual) : 0

  function buscar(ev: FormEvent) {
    ev.preventDefault()
    const c = buscarCliente(e, busqueda)
    setClienteId(c?.id ?? null)
    setNoEncontrado(!c)
    setInscribiendo(false)
    setCompra(null)
    setAviso("")
  }

  function sumar(id: string, d: number) {
    setCompra(null)
    setPedido((p) => {
      const n = Math.max(0, (p[id] ?? 0) + d)
      const { [id]: _, ...resto } = p
      return n ? { ...resto, [id]: n } : resto
    })
  }

  function cobrar() {
    if (!cliente || !total) return
    setCompra({ ...registrarCompra(cliente.id, pedido), nombre: cliente.nombre.split(" ")[0] })
    setPedido({})
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:py-8">
      <div className="space-y-4">
        <Punto id="buscar">
          <section className={caja} aria-labelledby="t-cliente">
            <h2 id="t-cliente" className="font-cb-marca text-[1.375rem] text-cb-cafeto">
              Cliente
            </h2>
            <form onSubmit={buscar} className="mt-3 flex gap-2">
              <label className="flex-1">
                <span className="text-[0.9375rem] font-medium">Código de la app o celular</span>
                <input value={busqueda} onChange={(ev) => setBusqueda(ev.target.value)} inputMode="numeric" placeholder="CB-2718" className={campo} />
              </label>
              <button type="submit" className={`${botonPrincipal} self-end`} aria-label="Buscar cliente">
                <Search className="h-4 w-4" aria-hidden />
                Buscar
              </button>
            </form>
            <p className="mt-2 text-[0.8125rem] text-cb-gris">En la demo, el código de Valentina es el que muestra la app: CB-2718.</p>

            {noEncontrado && !inscribiendo && (
              <div className="mt-4 rounded-[12px] bg-cb-oro-suave p-4 text-cb-oro" role="status">
                <p className="font-semibold">No hay ningún cliente con ese código o celular.</p>
                <button type="button" onClick={() => setInscribiendo(true)} className="mt-2 inline-flex items-center gap-1.5 font-semibold underline underline-offset-2">
                  <UserPlus className="h-4 w-4" aria-hidden />
                  Inscribir cliente nuevo
                </button>
              </div>
            )}
            {!cliente && !noEncontrado && !inscribiendo && (
              <button type="button" onClick={() => setInscribiendo(true)} className="mt-4 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-cb-cafeto underline underline-offset-2">
                <UserPlus className="h-4 w-4" aria-hidden />
                Inscribir cliente nuevo
              </button>
            )}
            {inscribiendo && (
              <Inscribir
                alInscribir={(id, mensaje) => {
                  setClienteId(id)
                  setInscribiendo(false)
                  setNoEncontrado(false)
                  setAviso(mensaje)
                }}
              />
            )}
            {aviso && (
              <p className="mt-4 flex gap-2 rounded-[12px] bg-cb-exito-suave p-3 text-[0.9375rem] font-medium text-cb-exito" role="status">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {aviso}
              </p>
            )}

            {cliente && r && (
              <div className="mt-4 rounded-[12px] bg-cb-hoja p-4" data-cliente={cliente.codigo}>
                <p className="text-[1.125rem] font-semibold">{cliente.nombre}</p>
                <p className="text-[0.875rem] text-cb-gris">
                  {cliente.codigo}, nivel {r.nivel.actual.nombre}
                  {r.ultimaVisita ? `, última visita ${r.diasSinVenir === 0 ? "hoy" : textoFecha(r.ultimaVisita.slice(0, 10))}` : ", cliente nuevo"}
                </p>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-[10px] bg-white p-2">
                    <dt className="text-[0.75rem] text-cb-gris">Puntos</dt>
                    <dd className="text-[1.25rem] font-semibold tabular-nums" data-puntos-cliente>
                      {r.saldo}
                    </dd>
                  </div>
                  <div className="rounded-[10px] bg-white p-2">
                    <dt className="text-[0.75rem] text-cb-gris">Sellos</dt>
                    <dd className="text-[1.25rem] font-semibold tabular-nums">
                      {r.sellos.tiene}/{PROGRAMA.sellos}
                    </dd>
                  </div>
                  <div className="rounded-[10px] bg-white p-2">
                    <dt className="text-[0.75rem] text-cb-gris">Cupones</dt>
                    <dd className="text-[1.25rem] font-semibold tabular-nums">{r.cupones.filter((c) => estadoCupon(c, claveDia(new Date())) === "activo").length}</dd>
                  </div>
                </dl>
              </div>
            )}
          </section>
        </Punto>

        <Punto id="cupon">
          <CobrarCupon />
        </Punto>
      </div>

      <Punto id="pedido">
        <section className={caja} aria-labelledby="t-pedido">
          <h2 id="t-pedido" className="font-cb-marca text-[1.375rem] text-cb-cafeto">
            Pedido
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CARTA.map((p) => (
              <li key={p.id}>
                <button type="button" onClick={() => sumar(p.id, 1)} className="flex h-full w-full flex-col items-start rounded-[12px] border border-cb-linea p-3 text-left hover:border-cb-cafeto focus-visible:outline-2 focus-visible:outline-cb-cafeto">
                  <span className="font-medium">{p.nombre}</span>
                  <span className="text-[0.875rem] text-cb-gris">{pesos(p.precio)}</span>
                  {pedido[p.id] ? <span className="mt-1 rounded-full bg-cb-cafeto px-2 text-[0.8125rem] font-semibold text-white">× {pedido[p.id]}</span> : null}
                </button>
              </li>
            ))}
          </ul>

          {Object.keys(pedido).length > 0 && (
            <ul className="mt-4 divide-y divide-cb-linea border-y border-cb-linea" aria-label="Productos del pedido">
              {Object.entries(pedido).map(([id, n]) => {
                const p = CARTA.find((c) => c.id === id)!
                return (
                  <li key={id} className="flex items-center justify-between gap-3 py-2">
                    <span>{p.nombre}</span>
                    <span className="flex items-center gap-2">
                      <button type="button" onClick={() => sumar(id, -1)} aria-label={`Quitar un ${p.nombre.toLowerCase()}`} className="flex h-8 w-8 items-center justify-center rounded-full border border-cb-linea">
                        <Minus className="h-4 w-4" aria-hidden />
                      </button>
                      <span className="w-5 text-center tabular-nums">{n}</span>
                      <button type="button" onClick={() => sumar(id, 1)} aria-label={`Agregar un ${p.nombre.toLowerCase()}`} className="flex h-8 w-8 items-center justify-center rounded-full border border-cb-linea">
                        <Plus className="h-4 w-4" aria-hidden />
                      </button>
                      <span className="w-20 text-right tabular-nums">{pesos(p.precio * n)}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[1.5rem] font-semibold tabular-nums" data-total>
                {pesos(total)}
              </p>
              <p className="text-[0.875rem] text-cb-gris">
                {!cliente
                  ? "Busca al cliente para sumarle puntos."
                  : total
                    ? `${puntosPrevistos} puntos${total >= PROGRAMA.compraMinimaSello ? " y un sello" : ""} para ${cliente.nombre.split(" ")[0]}`
                    : "Toca lo que pidió."}
              </p>
            </div>
            <button type="button" disabled={!cliente || !total} onClick={cobrar} className={botonPrincipal}>
              Registrar compra
            </button>
          </div>

          {compra && (
            <div className="mt-4 flex gap-3 rounded-[12px] bg-cb-exito-suave p-4 text-cb-exito" role="status">
              <CircleCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              <p>
                <strong className="font-semibold">
                  {compra.nombre} ganó {compra.puntos} puntos{compra.sello ? " y un sello" : ""}.
                </strong>{" "}
                {compra.tarjetaLlena ? "Su tarjeta está llena: puede cambiarla por un café gratis desde la app." : ""}
                {compra.subioA ? ` ¡Subió al nivel ${compra.subioA}!` : ""}
              </p>
            </div>
          )}
        </section>
      </Punto>
    </div>
  )
}

function CobrarCupon() {
  const [codigo, setCodigo] = useState("")
  const [resultado, setResultado] = useState<ReturnType<typeof usarCupon> | null>(null)
  return (
    <section className={caja} aria-labelledby="t-cupon">
      <h2 id="t-cupon" className="font-cb-marca text-[1.375rem] text-cb-cafeto">
        Cobrar un cupón
      </h2>
      <form
        onSubmit={(ev) => {
          ev.preventDefault()
          setResultado(usarCupon(codigo))
        }}
        className="mt-3 flex gap-2"
      >
        <label className="flex-1">
          <span className="text-[0.9375rem] font-medium">Código del cupón</span>
          <input value={codigo} onChange={(ev) => setCodigo(ev.target.value.toUpperCase())} autoComplete="off" placeholder="K7Q3MD" className={`${campo} tracking-[0.1em] uppercase`} />
        </label>
        <button type="submit" className={`${botonPrincipal} self-end`}>
          Validar
        </button>
      </form>
      {resultado &&
        (resultado.ok ? (
          <div className="mt-4 flex gap-3 rounded-[12px] bg-cb-exito-suave p-4 text-cb-exito" role="status">
            <CircleCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <p>
              <strong className="font-semibold">Entregar: {resultado.cupon.titulo}.</strong> Cupón de {resultado.cliente?.nombre ?? "un cliente"}, marcado como usado.
            </p>
          </div>
        ) : (
          <div className="mt-4 flex gap-3 rounded-[12px] bg-cb-cereza-suave p-4 text-cb-cereza" role="alert">
            <CircleX className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <p className="font-medium">{resultado.motivo} No entregues el premio.</p>
          </div>
        ))}
    </section>
  )
}

function Inscribir({ alInscribir }: { alInscribir: (id: string, mensaje: string) => void }) {
  const { incluye } = useDemo()
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [cumple, setCumple] = useState("")
  const [invitacion, setInvitacion] = useState("")
  const [error, setError] = useState("")

  function enviar(ev: FormEvent) {
    ev.preventDefault()
    if (nombre.trim().split(/\s+/).length < 2) return setError("Escribe nombre y apellido.")
    if (!celularValido(telefono)) return setError("Escribe un celular de diez dígitos que empiece por 3.")
    if (!/^\d{2}-\d{2}$/.test(cumple.slice(5))) return setError("Elige la fecha de cumpleaños.")
    const r = inscribirCliente({ nombre, telefono, cumple: cumple.slice(5), codigoInvitacion: invitacion.trim() || undefined })
    if (!r.ok) return setError(r.motivo)
    alInscribir(r.cliente.id, r.invito ? `Listo: ${r.cliente.nombre} ya está en el programa, con el código ${r.cliente.codigo}. Por la invitación, ${r.cliente.nombre.split(" ")[0]} y ${r.invito.nombre.split(" ")[0]} ganaron ${BONO_REFERIDO} puntos cada uno.` : `Listo: ${r.cliente.nombre} ya está en el programa, con el código ${r.cliente.codigo}.`)
  }

  return (
    <form onSubmit={enviar} noValidate className="mt-4 space-y-3 rounded-[12px] border border-cb-linea p-4" aria-label="Inscribir cliente nuevo">
      <label className="block">
        <span className="text-[0.9375rem] font-medium">Nombre y apellido</span>
        <input value={nombre} onChange={(ev) => setNombre(ev.target.value)} autoComplete="off" className={campo} />
      </label>
      <label className="block">
        <span className="text-[0.9375rem] font-medium">Celular</span>
        <input value={telefono} onChange={(ev) => setTelefono(ev.target.value)} inputMode="tel" autoComplete="off" className={campo} />
      </label>
      <label className="block">
        <span className="text-[0.9375rem] font-medium">Cumpleaños</span>
        <input type="date" value={cumple} onChange={(ev) => setCumple(ev.target.value)} className={campo} />
      </label>
      {incluye("completo") && (
        <label className="block">
          <span className="text-[0.9375rem] font-medium">Código de quien lo invitó (opcional)</span>
          <input value={invitacion} onChange={(ev) => setInvitacion(ev.target.value)} placeholder="CB-2718" autoComplete="off" className={campo} />
        </label>
      )}
      {error && (
        <p className="text-[0.9375rem] font-medium text-cb-cereza" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className={botonPrincipal}>
        Inscribir
      </button>
    </form>
  )
}

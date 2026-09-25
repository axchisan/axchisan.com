"use client"

import Image from "next/image"
import Link from "next/link"
import { useId, useState } from "react"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { useAhora } from "@/demos/comun/reloj"
import { claveDia, sumarDias, textoDia, textoHora } from "@/demos/motores/agenda/tiempo"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import { encargar } from "./estado"
import { ANTELACION_DIAS, CUBIERTAS, FOTOS_TORTAS, precioEncargo, RELLENOS, SABORES, TAMANOS, type Encargo } from "./modelo"
import { BotonWhatsappTanda, botonBorde, botonCacao, campo } from "./publico"

const HORAS = ["09:00", "11:00", "13:00", "15:00", "17:00"]

/** La foto que más se parece a lo elegido. */
const fotoPara = (sabor: string, relleno: string) => (relleno === "fresas" ? FOTOS_TORTAS[1] : sabor === "Naranja" ? FOTOS_TORTAS[2] : FOTOS_TORTAS[0])

function Opciones<T extends string>({ titulo, nombre, opciones, valor, alCambiar }: { titulo: string; nombre: string; opciones: { id: T; texto: string; nota?: string }[]; valor: T; alCambiar: (v: T) => void }) {
  return (
    <fieldset className="mt-6">
      <legend className="font-extrabold">{titulo}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {opciones.map((o) => (
          <label key={o.id} className="cursor-pointer rounded-full border-2 border-ta-linea px-4 py-2 has-[:checked]:border-ta-cacao has-[:checked]:bg-ta-cacao has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ta-fresa">
            <input type="radio" name={nombre} className="sr-only" checked={valor === o.id} onChange={() => alCambiar(o.id)} />
            <span className="font-bold">{o.texto}</span>
            {o.nota && <span className="ml-1.5 text-[0.8125rem] opacity-80">{o.nota}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function EncargosTanda() {
  const { incluye } = useDemo()
  const ahora = useAhora()
  const id = useId()
  const [tamano, setTamano] = useState<Encargo["tamano"]>("libra")
  const [sabor, setSabor] = useState<Encargo["sabor"]>("Chocolate")
  const [relleno, setRelleno] = useState<Encargo["relleno"]>("arequipe")
  const [cubierta, setCubierta] = useState<Encargo["cubierta"]>("chantilly")
  const [mensaje, setMensaje] = useState("")
  const [dia, setDia] = useState<string | null>(null)
  const [hora, setHora] = useState("15:00")
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [error, setError] = useState("")
  const [hecho, setHecho] = useState<Encargo | null>(null)

  if (!ahora) return <div className="min-h-[60vh]" aria-busy="true" />
  const total = precioEncargo({ tamano, relleno, cubierta })
  const dias = Array.from({ length: 10 }, (_, i) => sumarDias(claveDia(ahora), ANTELACION_DIAS + i))
  const diaActual = dia ?? dias[0]
  const foto = fotoPara(sabor, relleno)
  const t = TAMANOS.find((x) => x.id === tamano)!

  if (hecho) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="font-ta-titulo text-[2.5rem] leading-none font-bold">Encargo #{hecho.numero} anotado</h1>
        <p className="mt-4 text-[1.0625rem]">
          Torta de {TAMANOS.find((x) => x.id === hecho.tamano)!.nombre.toLowerCase()}, {hecho.sabor.toLowerCase()} con {RELLENOS.find((x) => x.id === hecho.relleno)!.nombre.toLowerCase()}, para el{" "}
          {textoDia(hecho.entrega.slice(0, 10)).toLowerCase()} a las {textoHora(hecho.entrega)}
        </p>
        <p className="mt-4 rounded-[16px] bg-ta-mantequilla p-4 font-bold">
          Para confirmarla, envía el anticipo de {pesos(Math.round(hecho.total / 2))} por Nequi. El resto lo pagas al recogerla.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={RAIZ} className={botonCacao}>
            Volver a la panadería
          </Link>
          <Link href={`${RAIZ}/panel/encargos`} className={botonBorde}>
            Verlo en el panel
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 pb-20 sm:px-6 lg:grid-cols-[1fr_380px]">
      <form
        noValidate
        onSubmit={(ev) => {
          ev.preventDefault()
          setError("")
          if (nombre.trim().length < 3) return setError("Escribe tu nombre.")
          const d = telefono.replace(/\D/g, "")
          if (d.length !== 10 || !d.startsWith("3")) return setError("Escribe un celular de 10 dígitos que empiece por 3.")
          setHecho(encargar({ entrega: `${diaActual}T${hora}`, tamano, sabor, relleno, cubierta, mensaje, cliente: { nombre, telefono } }))
        }}
      >
        <h1 className="font-ta-titulo text-[2.5rem] leading-none font-bold">Encarga tu torta</h1>
        <p className="mt-3 max-w-[52ch] text-ta-miga">Horneamos el bizcocho el día anterior, por eso se pide con {ANTELACION_DIAS} días de anticipación.</p>

        <Punto id="armar">
          <Opciones titulo="Tamaño" nombre={`${id}-tamano`} opciones={TAMANOS.map((x) => ({ id: x.id, texto: x.nombre, nota: `${x.porciones} porciones` }))} valor={tamano} alCambiar={setTamano} />
          <Opciones titulo="Sabor del bizcocho" nombre={`${id}-sabor`} opciones={SABORES.map((x) => ({ id: x, texto: x }))} valor={sabor} alCambiar={setSabor} />
          <Opciones titulo="Relleno" nombre={`${id}-relleno`} opciones={RELLENOS.map((x) => ({ id: x.id, texto: x.nombre, nota: x.extra ? `+ ${pesos(x.extra)}` : undefined }))} valor={relleno} alCambiar={setRelleno} />
          <Opciones titulo="Cubierta" nombre={`${id}-cubierta`} opciones={CUBIERTAS.map((x) => ({ id: x.id, texto: x.nombre, nota: x.extra ? `+ ${pesos(x.extra)}` : undefined }))} valor={cubierta} alCambiar={setCubierta} />
          <label className="mt-6 block">
            <span className="font-extrabold">Mensaje en la torta</span> <span className="text-[0.875rem] text-ta-miga">Opcional, hasta 30 letras</span>
            <input value={mensaje} maxLength={30} onChange={(ev) => setMensaje(ev.target.value)} placeholder="Feliz cumpleaños, Mariana" className={campo} />
          </label>
        </Punto>

        <Punto id="fecha" className="mt-8">
          <fieldset>
            <legend className="font-extrabold">¿Para cuándo?</legend>
            <div role="radiogroup" aria-label="Día de entrega" className="mt-2 flex gap-2 overflow-x-auto pb-1">
              {dias.map((d) => (
                <button key={d} type="button" role="radio" aria-checked={diaActual === d} aria-label={textoDia(d)} onClick={() => setDia(d)} className={`flex w-16 shrink-0 flex-col items-center rounded-[14px] border-2 py-2 ${diaActual === d ? "border-ta-cacao bg-ta-cacao text-white" : "border-ta-linea hover:border-ta-cacao"}`}>
                  <span className="text-[0.75rem]">{new Intl.DateTimeFormat("es-CO", { weekday: "short" }).format(new Date(`${d}T12:00`))}</span>
                  <span className="text-[1.125rem] font-extrabold">{Number(d.slice(8))}</span>
                </button>
              ))}
            </div>
            <label className="mt-4 block max-w-xs">
              <span className="font-bold">Hora de recogida</span>
              <select value={hora} onChange={(ev) => setHora(ev.target.value)} className={campo}>
                {HORAS.map((h) => (
                  <option key={h} value={h}>
                    {textoHora(`2000-01-01T${h}`)}
                  </option>
                ))}
              </select>
            </label>
          </fieldset>
        </Punto>

        <fieldset className="mt-8">
          <legend className="font-extrabold">Tus datos</legend>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-bold">Nombre</span>
              <input value={nombre} onChange={(ev) => setNombre(ev.target.value)} autoComplete="name" className={campo} />
            </label>
            <label className="block">
              <span className="font-bold">Celular</span>
              <input value={telefono} onChange={(ev) => setTelefono(ev.target.value)} inputMode="tel" autoComplete="tel" placeholder="300 000 0000" className={campo} />
            </label>
          </div>
        </fieldset>
        {error && (
          <p role="alert" className="mt-4 font-bold text-ta-fresa">
            {error}
          </p>
        )}
        {incluye("sistema") ? (
          <button type="submit" className={`${botonCacao} mt-8`}>
            Encargar por {pesos(total)}
          </button>
        ) : (
          <BotonWhatsappTanda className={`${botonCacao} mt-8`} mensaje={`Hola, Tanda. Quiero encargar una torta de ${t.nombre.toLowerCase()}, ${sabor.toLowerCase()}, para el ${textoDia(diaActual).toLowerCase()}.`}>
            Encargar por WhatsApp
          </BotonWhatsappTanda>
        )}
      </form>

      <aside aria-label="Tu torta" className="lg:sticky lg:top-16 lg:self-start">
        <div className="overflow-hidden rounded-[24px] bg-ta-mantequilla">
          <div className="relative aspect-square">
            <Image src={foto.src} alt={foto.alt} fill sizes="380px" className="object-cover" />
          </div>
          <div className="p-5">
            <p className="font-ta-titulo text-[1.5rem] leading-tight font-bold">
              Torta de {sabor.toLowerCase()}, {t.nombre.toLowerCase()}
            </p>
            <p className="mt-1 text-[0.9375rem]">
              {t.porciones} porciones, {RELLENOS.find((x) => x.id === relleno)!.nombre.toLowerCase()} y {CUBIERTAS.find((x) => x.id === cubierta)!.nombre.toLowerCase()}.
              {mensaje && ` Dice «${mensaje}».`}
            </p>
            <p className="mt-4 text-[2rem] leading-none font-extrabold tabular-nums" aria-live="polite">
              {pesos(total)}
            </p>
            <p className="mt-1 text-[0.875rem]">Anticipo de {pesos(Math.round(total / 2))} para confirmar.</p>
          </div>
        </div>
      </aside>
    </div>
  )
}

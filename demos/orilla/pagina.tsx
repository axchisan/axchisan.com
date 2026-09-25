"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { MessageCircle } from "lucide-react"
import { iniciarScrub } from "@/demos/motores/cinematico/scrub"
import { Punto } from "@/demos/comun/recorrido"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { pesos } from "@/lib/catalogo/planes"
import { MEDIA } from "./config"

type Acto = {
  id: string
  nombre: string
  titulo: string
  texto: string
  fotogramas: number
  fotogramasMovil: number
  segundos: number
  largo?: boolean
}

const ACTOS: Acto[] = [
  {
    id: "llegada",
    nombre: "La llegada",
    titulo: "Donde termina el mar.",
    texto: "Desde la bahía, entre veleros, hasta nuestra escalera. Aquí se llega despacio.",
    fotogramas: 192,
    fotogramasMovil: 120,
    segundos: 8,
  },
  {
    id: "piscina",
    nombre: "La piscina",
    titulo: "Un jardín que abraza el agua.",
    texto: "Palmeras, un bar dentro de la piscina y un salón abierto a la brisa, entre columnas blancas.",
    fotogramas: 240,
    fotogramasMovil: 150,
    segundos: 10,
    largo: true,
  },
  {
    id: "suite",
    nombre: "La suite",
    titulo: "Despierta frente al horizonte.",
    texto: "Lino, teca y un balcón curvo que mira a la bahía. El mar entra contigo.",
    fotogramas: 192,
    fotogramasMovil: 120,
    segundos: 8,
  },
]

const HABITACIONES = [
  { nombre: "Habitación Jardín", texto: "Planta baja, terraza privada entre palmeras, a diez pasos de la piscina.", precio: 780_000 },
  { nombre: "Habitación Bahía", texto: "Balcón curvo con buganvillas y vista abierta a los veleros.", precio: 1_050_000 },
  { nombre: "Suite Horizonte", texto: "Quinta planta, ventanal curvo de piso a techo y bañera frente al mar.", precio: 1_620_000 },
  { nombre: "Penthouse Terraza", texto: "Terraza con pérgola de teca, piscina privada y servicio de mayordomo.", precio: 3_200_000 },
]

const EXPERIENCIAS = [
  { hora: "6:30 a. m.", titulo: "Yoga al amanecer", texto: "En la terraza del club de playa, con la bahía todavía en calma." },
  { hora: "5:45 p. m.", titulo: "Velero al atardecer", texto: "Salida desde nuestro muelle, con cócteles a bordo." },
  { hora: "8:00 p. m.", titulo: "Cena en la arena", texto: "Mesa privada junto a la orilla, con cocina del mar." },
]

const MENSAJE = "Hola, quiero consultar disponibilidad en Orilla para estas fechas:"

export function PaginaOrilla() {
  const raiz = useRef<HTMLDivElement>(null)
  const nav = useRef<HTMLElement>(null)
  const [listo, setListo] = useState(false)

  // El motor vive fuera de React: pinta en canvas y escucha el scroll.
  useEffect(() => {
    if (!raiz.current) return
    return iniciarScrub(raiz.current, { alEstarListo: () => setListo(true) })
  }, [])

  // La navegación pasa a tinta oscura sobre las secciones claras.
  useEffect(() => {
    const claras = [...(raiz.current?.querySelectorAll<HTMLElement>("[data-clara]") ?? [])]
    const alDesplazar = () => {
      const el = nav.current
      if (!el) return
      const y = el.getBoundingClientRect().top + el.offsetHeight / 2
      el.classList.toggle(
        "nav--clara",
        claras.some((s) => {
          const r = s.getBoundingClientRect()
          return r.top <= y && r.bottom >= y
        }),
      )
    }
    addEventListener("scroll", alDesplazar, { passive: true })
    alDesplazar()
    return () => removeEventListener("scroll", alDesplazar)
  }, [])

  return (
    <div ref={raiz} className="orilla">
      <div className={`cargador ${listo ? "listo" : ""}`} aria-hidden>
        <span className="cargador__marca">ORILLA</span>
        <span className="cargador__linea" />
      </div>

      <header ref={nav} className="nav">
        <a className="nav__logo" href="#llegada" aria-label="Orilla, inicio">
          ORILLA
        </a>
        <nav className="nav__enlaces" aria-label="Secciones">
          <a href="#llegada">La llegada</a>
          <a href="#piscina">La piscina</a>
          <a href="#suite">La suite</a>
          <a href="#habitaciones">Habitaciones</a>
        </nav>
        <WhatsappSimulado negocio="el hotel" mensaje={MENSAJE} className="nav__cta">
          Reservar
        </WhatsappSimulado>
      </header>

      <main id="contenido">
        {ACTOS.map((a, i) => {
          const seccion = (
            <section
              key={a.id}
              id={a.id}
              className={`acto ${a.largo ? "acto--largo" : ""}`}
              data-scrub
              data-frames={a.fotogramas}
              data-frames-m={a.fotogramasMovil}
              data-path={`${MEDIA}/frames/acto${i + 1}/`}
              data-path-m={`${MEDIA}/frames-m/acto${i + 1}/`}
              data-duration={a.segundos}
              aria-label={a.nombre}
            >
              <div className="acto__escena" style={{ ["--poster" as string]: `url(${MEDIA}/frames/acto${i + 1}/poster.webp)` }}>
                <canvas aria-hidden />
                <div className="acto__sombra" />
                <div className="acto__texto">
                  <p className="acto__nombre">{a.nombre}</p>
                  {i === 0 ? <h1 className="titulo">{a.titulo}</h1> : <h2 className="titulo">{a.titulo}</h2>}
                  <p>{a.texto}</p>
                </div>
                <div className="acto__meta" aria-hidden>
                  <span data-time>00:00 / 00:{String(a.segundos).padStart(2, "0")}</span>
                  <span className="acto__barra">
                    <i data-bar />
                  </span>
                </div>
              </div>
            </section>
          )
          return i === 0 ? (
            <Punto key={a.id} id="acto">
              {seccion}
            </Punto>
          ) : (
            seccion
          )
        })}

        <section className="frase" data-clara>
          <h2 className="titulo">Cada habitación, frente al mar.</h2>
          <p>Ochenta y cuatro habitaciones en dos alas curvas que abrazan un jardín tropical. Ninguna da la espalda al agua.</p>
        </section>

        <section className="galeria" data-clara aria-label="Galería">
          <figure className="g1">
            <Image src={`${MEDIA}/img/00-ancla.webp`} alt="Vista aérea del resort en la bahía al atardecer" fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" />
          </figure>
          <figure className="g2">
            <Image src={`${MEDIA}/img/02-fin.webp`} alt="Salón con escalera curva y bar de teca" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          </figure>
          <figure className="g3">
            <Image src={`${MEDIA}/img/03-fin.webp`} alt="Suite con balcón y vista al mar" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          </figure>
        </section>

        <Punto id="habitaciones">
          <section id="habitaciones" className="lista" data-clara>
            <div className="lista__cabeza">
              <h2 className="titulo">Habitaciones</h2>
              <p>Todas con balcón al mar, desayuno en el jardín y acceso al club de playa. Precio por noche.</p>
            </div>
            <ol>
              {HABITACIONES.map((h) => (
                <li key={h.nombre}>
                  <div>
                    <h3 className="titulo">{h.nombre}</h3>
                    <p>{h.texto}</p>
                  </div>
                  <span className="precio">desde {pesos(h.precio)}</span>
                </li>
              ))}
            </ol>
          </section>
        </Punto>

        <section className="experiencias" aria-labelledby="experiencias">
          <h2 id="experiencias" className="titulo">Experiencias</h2>
          <div className="experiencias__rejilla">
            {EXPERIENCIAS.map((e) => (
              <article key={e.titulo}>
                <span className="hora">{e.hora}</span>
                <h3 className="titulo">{e.titulo}</h3>
                <p>{e.texto}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="llegar" aria-label="Cómo llegar">
          <div>
            <h3 className="titulo">Desde el aeropuerto</h3>
            <p>Veinticinco minutos en carro. Te recogemos si nos avisas el vuelo al reservar.</p>
          </div>
          <div>
            <h3 className="titulo">Entrada y salida</h3>
            <p>Entrada desde las 3:00 p. m., salida hasta las 12:00 m. El club de playa sigue abierto para ti el último día.</p>
          </div>
          <div>
            <h3 className="titulo">Mascotas y niños</h3>
            <p>Niños bienvenidos, con cuna sin costo. Mascotas pequeñas en las habitaciones Jardín.</p>
          </div>
        </section>

        <Punto id="reservar">
          <section className="reservar" data-clara>
            <h2 className="titulo">La bahía te espera.</h2>
            <WhatsappSimulado negocio="el hotel" mensaje={MENSAJE} className="boton">
              <MessageCircle className="h-4 w-4" aria-hidden />
              Consultar disponibilidad
            </WhatsappSimulado>
            <p className="nota">Negocio ficticio creado por Axchi como demostración. Imágenes y video generados con IA.</p>
          </section>
        </Punto>
      </main>

      <footer className="pie">
        <span>ORILLA</span>
        <span>Bahía del Caribe (dirección de ejemplo)</span>
        <span>hola@orilla.example</span>
      </footer>
    </div>
  )
}

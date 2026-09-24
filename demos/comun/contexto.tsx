"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import type { PlanId } from "@/lib/catalogo/planes"
import { crearAlmacen, useAlmacen, type Almacen } from "./almacen"

/**
 * Un nivel es lo que el visitante ve al elegir "Ver como". Son acumulativos:
 * el tercero incluye todo lo del segundo, y el segundo lo del primero. Así un
 * cliente que no sabe qué necesita lo decide mirando qué entra en cada precio.
 */
export type Nivel = {
  id: string
  etiqueta: string
  planes: PlanId[]
}

/** Un punto del recorrido "Cómo funciona", explicado en lenguaje de negocio. */
export type Paso = {
  id: string
  titulo: string
  texto: string
}

export type ConfigDemo = {
  slug: string
  nombre: string
  /** "una veterinaria": completa la frase "algo así para ___". */
  paraQuien: string
  niveles: Nivel[]
  /**
   * Pasos del recorrido por ruta. Las claves admiten segmentos `:param`, por
   * ejemplo `/demo/canela/panel/pacientes/:id`.
   */
  recorrido: Record<string, Paso[]>
  /**
   * Nivel mínimo por prefijo de ruta. Gana el prefijo más largo que coincida;
   * una ruta sin prefijo pertenece al primer nivel.
   */
  nivelDeRuta?: Record<string, string>
}

type Preferencias = { nivel: string; recorrido: boolean }

type ValorDemo = {
  config: ConfigDemo
  nivel: Nivel
  indiceNivel: number
  elegirNivel: (id: string) => void
  /** ¿El nivel elegido incluye lo que pertenece a `id`? */
  incluye: (id: string) => boolean
  recorrido: boolean
  alternarRecorrido: (activo?: boolean) => void
}

const Contexto = createContext<ValorDemo | null>(null)

const almacenes = new Map<string, Almacen<Preferencias>>()

function almacenDe(config: ConfigDemo) {
  let a = almacenes.get(config.slug)
  if (!a) {
    const ultimo = config.niveles[config.niveles.length - 1].id
    a = crearAlmacen<Preferencias>(`axchi-demo:${config.slug}:preferencias`, () => ({
      nivel: ultimo,
      recorrido: false,
    }))
    almacenes.set(config.slug, a)
  }
  return a
}

export function DemoProvider({ config, children }: { config: ConfigDemo; children: ReactNode }) {
  const almacen = almacenDe(config)
  const prefs = useAlmacen(almacen)

  const valor = useMemo<ValorDemo>(() => {
    // Antes de hidratar se muestra el nivel más completo, que es el que el
    // visitante ve la primera vez.
    const idNivel = prefs?.nivel ?? config.niveles[config.niveles.length - 1].id
    const indiceNivel = Math.max(
      0,
      config.niveles.findIndex((n) => n.id === idNivel),
    )
    return {
      config,
      nivel: config.niveles[indiceNivel],
      indiceNivel,
      elegirNivel: (id) => almacen.escribir((p) => ({ ...p, nivel: id })),
      incluye: (id) => config.niveles.findIndex((n) => n.id === id) <= indiceNivel,
      recorrido: prefs?.recorrido ?? false,
      alternarRecorrido: (activo) =>
        almacen.escribir((p) => ({ ...p, recorrido: activo ?? !p.recorrido })),
    }
  }, [config, almacen, prefs])

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useDemo() {
  const v = useContext(Contexto)
  if (!v) throw new Error("useDemo fuera de <DemoProvider>")
  return v
}

/** Nivel mínimo que hace falta para ver una ruta. */
export function nivelDe(config: ConfigDemo, ruta: string): string {
  let mejor = ""
  let nivel = config.niveles[0].id
  for (const [prefijo, n] of Object.entries(config.nivelDeRuta ?? {})) {
    if (ruta.startsWith(prefijo) && prefijo.length > mejor.length) {
      mejor = prefijo
      nivel = n
    }
  }
  return nivel
}

/** Pasos del recorrido para una ruta concreta. */
export function pasosDe(config: ConfigDemo, ruta: string): Paso[] {
  const partes = ruta.replace(/\/$/, "").split("/")
  for (const [patron, pasos] of Object.entries(config.recorrido)) {
    const p = patron.split("/")
    if (p.length === partes.length && p.every((seg, i) => seg.startsWith(":") || seg === partes[i])) {
      return pasos
    }
  }
  return []
}

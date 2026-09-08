import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normaliza a Date lo que viene de una consulta cacheada.
 *
 * `unstable_cache` guarda el resultado serializado, así que en el primer render
 * un campo de fecha llega como Date y en los siguientes —al acertar la caché—
 * llega como string. Todo lo que formatee una fecha tiene que pasar por aquí:
 * de lo contrario `.toISOString()` revienta con un 500 que solo aparece a
 * partir de la segunda visita, que es la peor forma de encontrarlo.
 */
export function toDate(value: Date | string | number): Date {
  return value instanceof Date ? value : new Date(value)
}

const FORMATO_LARGO = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

export function formatDate(date: Date | string | number): string {
  return FORMATO_LARGO.format(toDate(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

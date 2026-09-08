import { revalidateTag } from "next/cache"

/** Etiquetas con las que `lib/data.ts` marca cada consulta cacheada. */
export type ContentTag = "projects" | "blog" | "skills" | "profile" | "services" | "settings"

/**
 * Invalida la caché tras una mutación del contenido.
 *
 * `expire: 0` la vence de inmediato en lugar de servir contenido rancio
 * mientras revalida: al publicar desde el panel, el sitio tiene que reflejar
 * el cambio en la siguiente visita, no en la siguiente a esa.
 *
 * (`updateTag`, que hace justo esto, solo puede llamarse desde Server Actions,
 * y estas son Route Handlers.)
 */
export function invalidate(...tags: ContentTag[]): void {
  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 })
  }
}

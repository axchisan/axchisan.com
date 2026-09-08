import { createHash } from "crypto"

/**
 * Seudonimiza la dirección IP de una visita.
 *
 * La versión anterior guardaba `base64(ip).slice(0, 10)` bajo el nombre
 * `hashedIp`. Base64 es codificación reversible, no un hash: de esos diez
 * caracteres se recuperaba literalmente el principio de la IP. Es decir, se
 * almacenaba un dato personal mientras el código afirmaba lo contrario.
 *
 * Ahora es SHA-256 con sal. La sal sale de `NEXTAUTH_SECRET`, que ya es un
 * secreto del despliegue: sin ella no se puede reconstruir la entrada probando
 * las cuatro mil millones de IPv4 posibles, que es justo lo que haría viable un
 * hash sin sal sobre un espacio tan pequeño.
 *
 * El resultado solo sirve para distinguir visitantes entre sí, que es todo lo
 * que necesita un contador de visitas.
 */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null

  const sal = process.env.NEXTAUTH_SECRET ?? ""
  // Con varios proxies por delante, x-forwarded-for llega como lista.
  const primera = ip.split(",")[0].trim()

  return createHash("sha256").update(`${sal}:${primera}`).digest("hex").slice(0, 32)
}

/** Extrae la IP del visitante de las cabeceras que pone el proxy. */
export function ipDePeticion(headers: Headers): string | null {
  return headers.get("x-forwarded-for") ?? headers.get("x-real-ip")
}

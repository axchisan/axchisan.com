/** URL canónica del sitio en producción. Sobrescribible por env. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://axchisan.com").replace(/\/$/, "")

// "Axchi" es la marca visible: cabe en la cabecera móvil y se recuerda. El
// nombre comercial completo solo aparece en legales y datos estructurados.
export const SITE_NAME = "Axchi"
export const LEGAL_NAME = "Axchi Software Solutions"

/**
 * WhatsApp en formato E.164 sin el "+", que es lo que espera wa.me. Única
 * fuente: antes el número vivía en cuatro sitios con formatos distintos.
 */
export const WHATSAPP = {
  e164: "573183038190",
  visible: "+57 318 303 8190",
} as const

export function whatsappUrl(mensaje?: string) {
  const base = `https://wa.me/${WHATSAPP.e164}`
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base
}

export const PROFILE = {
  name: "Duvan Yair Arciniegas",
  alias: "Axchi",
  role: "Páginas web, tiendas y sistemas para negocios",
  location: "Bogotá, Colombia",
  email: "axchisan923@gmail.com",
  github: "https://github.com/axchisan",
  linkedin: "https://www.linkedin.com/in/duvan-yair-arciniegas-gerena-535690339",
  instagram: "https://www.instagram.com/axchisan",
} as const

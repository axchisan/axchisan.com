// Recursos gráficos reales (fotos de Unsplash, URLs verificadas que devuelven 200).
// Se usan como elementos decorativos para dar atractivo visual. Unsplash está
// habilitado en next.config.mjs (images.unsplash.com). El parámetro auto=format
// sirve WebP/AVIF cuando el navegador lo soporta.

const BASE = "https://images.unsplash.com/photo-"

function unsplash(id: string, w = 900): string {
  return `${BASE}${id}?w=${w}&q=70&auto=format&fit=crop`
}

/** Fotos temáticas de tecnología/desarrollo (verificadas). */
export const stockImages = {
  code: unsplash("1461749280684-dccba630e2f6"), // código en pantalla
  codeNeon: unsplash("1517180102446-f3ece451e9d8"), // laptop con código
  codeJs: unsplash("1555066931-4365d14bab8c"), // código JS
  workspaceMac: unsplash("1498050108023-c5249f4df085"), // MacBook con código
  analytics: unsplash("1551288049-bebda4e38f71"), // dashboard / datos
  workspace: unsplash("1504384308090-c894fdcc538d"), // escritorio de desarrollo
  tech: unsplash("1488590528505-98d2b5aba04b"), // tecnología / laptop
  setup: unsplash("1531297484001-80022131f5a1"), // setup de trabajo
  circuit: unsplash("1518770660439-4636190af475"), // circuitos / hardware
  laptopPerson: unsplash("1581091226825-a6a2a5aee158"), // colaboración
} as const

/** Imagen decorativa de respaldo para tarjetas de blog sin portada (rota por índice). */
const blogFallbacks = [stockImages.code, stockImages.codeJs, stockImages.workspace, stockImages.tech, stockImages.analytics]
export function blogFallbackImage(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return blogFallbacks[h % blogFallbacks.length]
}

/** Imagen por servicio (por clave o índice). */
export const serviceImages = [
  stockImages.code, // Páginas web
  stockImages.laptopPerson, // Apps multiplataforma
  stockImages.analytics, // Automatización
  stockImages.workspaceMac, // Software personalizado
  stockImages.circuit, // IA / extra
  stockImages.setup, // extra
]

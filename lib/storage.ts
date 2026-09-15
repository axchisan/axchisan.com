import { AwsClient } from "aws4fetch"

/**
 * Almacenamiento de archivos sobre Cloudflare R2 (API compatible con S3).
 *
 * El hosting es serverless: el sistema de archivos es efímero y de solo
 * lectura, así que nada puede escribirse en `public/`. Y como el cuerpo de una
 * petición está limitado a unos pocos MB, los archivos grandes no pueden pasar
 * por una API route: el navegador sube directo a R2 con una URL prefirmada y el
 * servidor solo registra los metadatos.
 *
 * Se usa `aws4fetch` (6 KB) en lugar del SDK de AWS (1,4 MB). Todo lo que hace
 * falta aquí es firmar peticiones con SigV4, y el SDK completo no cabía en el
 * presupuesto de tamaño del Worker.
 */

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const BUCKET = process.env.R2_BUCKET ?? "axchisan-media"
const PUBLIC_URL = (process.env.R2_PUBLIC_URL ?? "").replace(/\/+$/, "")

let client: AwsClient | null = null

function firmante(): AwsClient {
  if (client) return client
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  if (!ACCOUNT_ID || !accessKeyId || !secretAccessKey) {
    throw new Error("Faltan las credenciales de R2 (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)")
  }
  client = new AwsClient({ accessKeyId, secretAccessKey, service: "s3", region: "auto" })
  return client
}

/** Endpoint S3 del bucket. */
function urlObjeto(key: string): string {
  return `https://${ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET}/${key.split("/").map(encodeURIComponent).join("/")}`
}

export function isStorageConfigured(): boolean {
  return Boolean(ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && PUBLIC_URL)
}

/** Categorías del esquema Prisma (enum FileCategory) y su carpeta en el bucket. */
export type Folder = "images" | "videos" | "documents" | "executables" | "mobile-apps" | "archives" | "source-code" | "other"

const BY_EXTENSION: Record<string, { folder: Folder; category: string }> = {
  jpg: { folder: "images", category: "IMAGE" },
  jpeg: { folder: "images", category: "IMAGE" },
  png: { folder: "images", category: "IMAGE" },
  gif: { folder: "images", category: "IMAGE" },
  webp: { folder: "images", category: "IMAGE" },
  avif: { folder: "images", category: "IMAGE" },
  svg: { folder: "images", category: "IMAGE" },

  mp4: { folder: "videos", category: "VIDEO" },
  webm: { folder: "videos", category: "VIDEO" },
  ogg: { folder: "videos", category: "VIDEO" },
  mov: { folder: "videos", category: "VIDEO" },
  avi: { folder: "videos", category: "VIDEO" },

  pdf: { folder: "documents", category: "DOCUMENT" },
  doc: { folder: "documents", category: "DOCUMENT" },
  docx: { folder: "documents", category: "DOCUMENT" },
  txt: { folder: "documents", category: "DOCUMENT" },
  rtf: { folder: "documents", category: "DOCUMENT" },

  exe: { folder: "executables", category: "EXECUTABLE" },
  msi: { folder: "executables", category: "EXECUTABLE" },
  dmg: { folder: "executables", category: "EXECUTABLE" },
  deb: { folder: "executables", category: "EXECUTABLE" },
  rpm: { folder: "executables", category: "EXECUTABLE" },
  appimage: { folder: "executables", category: "EXECUTABLE" },

  apk: { folder: "mobile-apps", category: "MOBILE_APP" },
  aab: { folder: "mobile-apps", category: "MOBILE_APP" },
  ipa: { folder: "mobile-apps", category: "MOBILE_APP" },

  zip: { folder: "archives", category: "ARCHIVE" },
  rar: { folder: "archives", category: "ARCHIVE" },
  "7z": { folder: "archives", category: "ARCHIVE" },
  tar: { folder: "archives", category: "ARCHIVE" },
  gz: { folder: "archives", category: "ARCHIVE" },
  bz2: { folder: "archives", category: "ARCHIVE" },
}

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  webm: "video/webm",
  ogg: "video/ogg",
  mov: "video/quicktime",
  avi: "video/x-msvideo",
  pdf: "application/pdf",
  txt: "text/plain",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  zip: "application/zip",
  rar: "application/vnd.rar",
  "7z": "application/x-7z-compressed",
  tar: "application/x-tar",
  gz: "application/gzip",
  exe: "application/vnd.microsoft.portable-executable",
  msi: "application/x-msi",
  dmg: "application/x-apple-diskimage",
  deb: "application/vnd.debian.binary-package",
  apk: "application/vnd.android.package-archive",
}

export function extensionOf(filename: string): string {
  // Sin `path.extname`: el runtime de Workers no necesita cargar el módulo de
  // Node para esto. Un nombre sin punto, o que empiece por punto, no tiene
  // extensión.
  const punto = filename.lastIndexOf(".")
  if (punto <= 0) return ""
  return filename.slice(punto + 1).toLowerCase()
}

export function classify(filename: string): { folder: Folder; category: string } {
  return BY_EXTENSION[extensionOf(filename)] ?? { folder: "other", category: "OTHER" }
}

export function contentTypeOf(filename: string, fallback?: string): string {
  return MIME_BY_EXTENSION[extensionOf(filename)] ?? fallback ?? "application/octet-stream"
}

/** Clave única e higienizada dentro del bucket: `images/1757...-a3f9k.png`. */
export function buildKey(originalName: string, folder?: Folder): string {
  const target = folder ?? classify(originalName).folder
  const ext = extensionOf(originalName)
  const stamp = Date.now()
  const random = Math.random().toString(36).slice(2, 10)
  return `${target}/${stamp}-${random}${ext ? `.${ext}` : ""}`
}

/** URL pública y permanente de un objeto, servida por el dominio del bucket. */
export function publicUrl(key: string): string {
  return `${PUBLIC_URL}/${key.replace(/^\/+/, "")}`
}

/** Extrae la clave a partir de una URL pública (o la devuelve tal cual si ya lo es). */
export function keyFromUrl(url: string): string | null {
  if (!url) return null
  if (PUBLIC_URL && url.startsWith(`${PUBLIC_URL}/`)) return url.slice(PUBLIC_URL.length + 1)
  // Rutas heredadas del despliegue anterior en VPS: /api/files/<carpeta>/<archivo>
  if (url.startsWith("/api/files/")) return url.slice("/api/files/".length)
  if (!url.startsWith("http") && !url.startsWith("/")) return url
  return null
}

/** URL prefirmada para que el navegador suba el archivo directo a R2. */
export async function presignUpload(key: string, contentType: string, expiresIn = 600): Promise<string> {
  const firmada = await firmante().sign(
    new Request(`${urlObjeto(key)}?X-Amz-Expires=${expiresIn}`, { method: "PUT" }),
    // signQuery mete la firma en la query en lugar de en una cabecera, que es
    // lo que permite entregar la URL al navegador.
    { aws: { signQuery: true, allHeaders: false } },
  )
  return firmada.url
}

/** URL prefirmada de lectura. Solo para objetos que no deban ser públicos. */
export async function presignDownload(key: string, expiresIn = 600): Promise<string> {
  const firmada = await firmante().sign(
    new Request(`${urlObjeto(key)}?X-Amz-Expires=${expiresIn}`, { method: "GET" }),
    { aws: { signQuery: true } },
  )
  return firmada.url
}

/** Subida desde el servidor. Para archivos pequeños generados por la propia app. */
export async function putObject(key: string, body: Uint8Array, contentType: string): Promise<string> {
  const res = await firmante().fetch(urlObjeto(key), {
    method: "PUT",
    body: body as BodyInit,
    headers: { "Content-Type": contentType },
  })
  if (!res.ok) throw new Error(`R2 rechazó la subida (HTTP ${res.status})`)
  return publicUrl(key)
}

export async function deleteObject(key: string): Promise<void> {
  const res = await firmante().fetch(urlObjeto(key), { method: "DELETE" })
  // 404 al borrar no es un error: el objetivo era que no estuviera.
  if (!res.ok && res.status !== 404) {
    throw new Error(`R2 rechazó el borrado (HTTP ${res.status})`)
  }
}

export interface StoredObject {
  key: string
  name: string
  url: string
  size: number
  type: string
  category: string
  folder: string
  uploadedAt: string
}

/** Un valor de una etiqueta XML. Evita traer un parser entero para esto. */
function etiqueta(xml: string, nombre: string): string | undefined {
  const m = xml.match(new RegExp(`<${nombre}>([^<]*)</${nombre}>`))
  return m?.[1]
}

/**
 * Inventario del bucket, para el gestor de medios del panel.
 *
 * La API de listado de S3 devuelve XML. Se extrae con expresiones regulares en
 * lugar de añadir un parser: el formato es fijo, los nombres de objeto no
 * contienen `<` porque los genera `buildKey`, y un parser costaría más espacio
 * del que queda en el presupuesto del Worker.
 */
export async function listObjects(prefix?: string, limit = 1000): Promise<StoredObject[]> {
  const out: StoredObject[] = []
  let token: string | undefined

  do {
    const url = new URL(`https://${ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET}`)
    url.searchParams.set("list-type", "2")
    url.searchParams.set("max-keys", String(Math.min(limit - out.length, 1000)))
    if (prefix) url.searchParams.set("prefix", prefix)
    if (token) url.searchParams.set("continuation-token", token)

    const res = await firmante().fetch(url.toString())
    if (!res.ok) throw new Error(`R2 rechazó el listado (HTTP ${res.status})`)
    const xml = await res.text()

    for (const bloque of xml.match(/<Contents>[\s\S]*?<\/Contents>/g) ?? []) {
      const key = etiqueta(bloque, "Key")
      if (!key || key.endsWith("/")) continue
      const name = key.split("/").pop() ?? key
      out.push({
        key,
        name,
        url: publicUrl(key),
        size: Number(etiqueta(bloque, "Size") ?? 0),
        type: contentTypeOf(name),
        category: classify(name).category,
        folder: key.includes("/") ? key.split("/")[0] : "other",
        uploadedAt: etiqueta(bloque, "LastModified") ?? new Date().toISOString(),
      })
    }

    token =
      etiqueta(xml, "IsTruncated") === "true" ? etiqueta(xml, "NextContinuationToken") : undefined
  } while (token && out.length < limit)

  out.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
  return out
}

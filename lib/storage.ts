import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { extname } from "path"

/**
 * Almacenamiento de archivos sobre Cloudflare R2 (API compatible con S3).
 *
 * El hosting es serverless: el sistema de archivos es efímero y de solo lectura,
 * así que nada puede escribirse en `public/`. Y como el cuerpo de una petición
 * está limitado a unos pocos MB, los archivos grandes no pueden pasar por una
 * API route: el navegador sube directo a R2 con una URL prefirmada y el servidor
 * solo registra los metadatos.
 */

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const BUCKET = process.env.R2_BUCKET ?? "axchisan-media"
const PUBLIC_URL = (process.env.R2_PUBLIC_URL ?? "").replace(/\/+$/, "")

let client: S3Client | null = null

function s3(): S3Client {
  if (client) return client
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  if (!ACCOUNT_ID || !accessKeyId || !secretAccessKey) {
    throw new Error("Faltan las credenciales de R2 (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)")
  }
  client = new S3Client({
    region: "auto",
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })
  return client
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
  return extname(filename).toLowerCase().replace(".", "")
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
export async function presignUpload(
  key: string,
  contentType: string,
  expiresIn = 600,
): Promise<string> {
  return getSignedUrl(s3(), new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType }), {
    expiresIn,
  })
}

/** URL prefirmada de lectura. Solo para objetos que no deban ser públicos. */
export async function presignDownload(key: string, expiresIn = 600): Promise<string> {
  return getSignedUrl(s3(), new GetObjectCommand({ Bucket: BUCKET, Key: key }), { expiresIn })
}

/** Subida desde el servidor. Para archivos pequeños generados por la propia app. */
export async function putObject(key: string, body: Buffer | Uint8Array, contentType: string): Promise<string> {
  await s3().send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType }))
  return publicUrl(key)
}

export async function deleteObject(key: string): Promise<void> {
  await s3().send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
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

/** Inventario del bucket, para el gestor de medios del panel. */
export async function listObjects(prefix?: string, limit = 1000): Promise<StoredObject[]> {
  const out: StoredObject[] = []
  let token: string | undefined

  do {
    const page = await s3().send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: prefix,
        ContinuationToken: token,
        MaxKeys: Math.min(limit - out.length, 1000),
      }),
    )
    for (const item of page.Contents ?? []) {
      if (!item.Key || item.Key.endsWith("/")) continue
      const name = item.Key.split("/").pop() ?? item.Key
      out.push({
        key: item.Key,
        name,
        url: publicUrl(item.Key),
        size: item.Size ?? 0,
        type: contentTypeOf(name),
        category: classify(name).category,
        folder: item.Key.includes("/") ? item.Key.split("/")[0] : "other",
        uploadedAt: (item.LastModified ?? new Date()).toISOString(),
      })
    }
    token = page.IsTruncated ? page.NextContinuationToken : undefined
  } while (token && out.length < limit)

  out.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
  return out
}

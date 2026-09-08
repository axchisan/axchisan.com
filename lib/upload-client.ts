"use client"

/**
 * Subida desde el navegador en tres pasos:
 *   1. pedir al servidor una URL prefirmada,
 *   2. subir el archivo directo a R2 (no pasa por el servidor),
 *   3. registrar los metadatos si el archivo pertenece a un proyecto o artículo.
 */

export interface UploadedFile {
  id?: string
  key: string
  filename: string
  originalName: string
  displayName: string
  description?: string | null
  url: string
  size: number
  type: string
  category: string
  platform?: string | null
  version?: string | null
  isDownloadable: boolean
}

export interface UploadOptions {
  /** Rechaza cualquier archivo que no sea imagen. */
  imagesOnly?: boolean
  /** Registra el archivo como descargable del proyecto. */
  projectId?: string
  /** Registra el archivo como adjunto del artículo. */
  blogPostId?: string
  platform?: string | null
  version?: string | null
  isDownloadable?: boolean
  displayName?: string
  description?: string
  /** Progreso de 0 a 1 durante la transferencia. */
  onProgress?: (fraction: number) => void
}

async function presign(file: File, imagesOnly?: boolean) {
  const res = await fetch("/api/admin/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type, imagesOnly }),
  })
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    throw new Error(detail.error || "No se pudo preparar la subida")
  }
  return (await res.json()) as {
    key: string
    uploadUrl: string
    url: string
    contentType: string
    category: string
    folder: string
  }
}

/** PUT a R2. Usa XHR en lugar de fetch porque fetch no reporta progreso de subida. */
function put(uploadUrl: string, file: File, contentType: string, onProgress?: (f: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", uploadUrl)
    xhr.setRequestHeader("Content-Type", contentType)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(e.loaded / e.total)
    }
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`El almacenamiento rechazó el archivo (HTTP ${xhr.status})`))
    xhr.onerror = () => reject(new Error("Se perdió la conexión durante la subida"))
    xhr.send(file)
  })
}

export async function uploadFile(file: File, options: UploadOptions = {}): Promise<UploadedFile> {
  const { key, uploadUrl, url, contentType, category } = await presign(file, options.imagesOnly)

  options.onProgress?.(0)
  await put(uploadUrl, file, contentType, options.onProgress)
  options.onProgress?.(1)

  const uploaded: UploadedFile = {
    key,
    filename: key.split("/").pop() ?? key,
    originalName: file.name,
    displayName: options.displayName || file.name,
    description: options.description ?? null,
    url,
    size: file.size,
    type: contentType,
    category,
    platform: options.platform ?? null,
    version: options.version ?? null,
    isDownloadable: options.isDownloadable ?? true,
  }

  // Solo los archivos que cuelgan de un proyecto o artículo necesitan fila propia.
  if (options.projectId || options.blogPostId) {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...uploaded, projectId: options.projectId, blogPostId: options.blogPostId }),
    })
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}))
      throw new Error(detail.error || "El archivo se subió pero no se pudo registrar")
    }
    const saved = await res.json()
    uploaded.id = saved.id
  }

  return uploaded
}

export async function uploadFiles(files: File[], options: UploadOptions = {}): Promise<UploadedFile[]> {
  const out: UploadedFile[] = []
  for (const file of files) {
    out.push(await uploadFile(file, options))
  }
  return out
}

/** Borra el objeto del almacenamiento. Recibe la URL pública o la clave. */
export async function deleteUpload(urlOrKey: string): Promise<void> {
  const res = await fetch(`/api/upload?path=${encodeURIComponent(urlOrKey)}`, { method: "DELETE" })
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    throw new Error(detail.error || "No se pudo eliminar el archivo")
  }
}

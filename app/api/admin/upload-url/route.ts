import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { buildKey, classify, contentTypeOf, isStorageConfigured, presignUpload, publicUrl } from "@/lib/storage"

export const dynamic = "force-dynamic"

/**
 * Entrega una URL prefirmada para que el navegador suba el archivo directo a R2.
 *
 * El archivo nunca pasa por el servidor: el hosting limita el cuerpo de una
 * petición a unos pocos MB, así que un APK o un instalador no cabría.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: "El almacenamiento de archivos no está configurado (faltan las variables R2_*)" },
      { status: 503 },
    )
  }

  const body = await request.json().catch(() => null)
  const filename = typeof body?.filename === "string" ? body.filename.trim() : ""
  if (!filename) {
    return NextResponse.json({ error: "Falta el nombre del archivo" }, { status: 400 })
  }

  const { folder, category } = classify(filename)

  // Solo se aceptan imágenes cuando quien pide es un campo de imagen.
  if (body?.imagesOnly === true && category !== "IMAGE") {
    return NextResponse.json({ error: "Ese formato no es una imagen" }, { status: 400 })
  }

  const contentType = contentTypeOf(filename, typeof body?.contentType === "string" ? body.contentType : undefined)
  const key = buildKey(filename, folder)

  try {
    const uploadUrl = await presignUpload(key, contentType)
    return NextResponse.json({ key, uploadUrl, url: publicUrl(key), contentType, category, folder })
  } catch (error) {
    console.error("upload-url error:", error)
    return NextResponse.json({ error: "No se pudo preparar la subida" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { deleteObject, isStorageConfigured, keyFromUrl, listObjects } from "@/lib/storage"

export const dynamic = "force-dynamic"

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  return session?.user.role === "ADMIN"
}

/**
 * Registra en la base los metadatos de un archivo ya subido a R2.
 *
 * El binario viaja del navegador a R2 con una URL prefirmada
 * (`/api/admin/upload-url`); aquí solo se guarda la fila.
 */
export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body?.url || !body?.filename) {
    return NextResponse.json({ error: "Faltan datos del archivo" }, { status: 400 })
  }

  const { projectId, blogPostId } = body
  if (!projectId && !blogPostId) {
    return NextResponse.json({ error: "Falta el proyecto o el artículo al que pertenece" }, { status: 400 })
  }

  const common = {
    filename: String(body.filename),
    originalName: String(body.originalName ?? body.filename),
    displayName: body.displayName ? String(body.displayName) : String(body.originalName ?? body.filename),
    description: body.description ? String(body.description) : null,
    url: String(body.url),
    size: Number(body.size) || 0,
    type: String(body.type ?? "application/octet-stream"),
    category: String(body.category ?? "OTHER") as never,
    isDownloadable: body.isDownloadable !== false,
  }

  try {
    const saved = projectId
      ? await prisma.projectFile.create({
          data: {
            ...common,
            platform: body.platform ? String(body.platform) : null,
            version: body.version ? String(body.version) : null,
            projectId: String(projectId),
          },
        })
      : await prisma.blogFile.create({
          data: { ...common, blogPostId: String(blogPostId) },
        })

    return NextResponse.json(saved)
  } catch (error) {
    console.error("upload register error:", error)
    return NextResponse.json({ error: "No se pudo registrar el archivo" }, { status: 500 })
  }
}

/** Inventario del bucket, para el gestor de medios. */
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!isStorageConfigured()) {
    return NextResponse.json({ files: [], error: "Almacenamiento no configurado" })
  }

  try {
    return NextResponse.json({ files: await listObjects() })
  } catch (error) {
    console.error("files list error:", error)
    return NextResponse.json({ error: "No se pudo leer el almacenamiento" }, { status: 500 })
  }
}

/** Borra el objeto de R2 y, si existía, su fila en la base. */
export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let target = request.nextUrl.searchParams.get("path")
  if (!target) {
    const body = await request.json().catch(() => null)
    target = body?.url ?? body?.key ?? null
  }
  if (!target) {
    return NextResponse.json({ error: "Falta la ruta del archivo" }, { status: 400 })
  }

  const key = keyFromUrl(target)
  if (!key) {
    return NextResponse.json({ error: "Ruta de archivo no válida" }, { status: 400 })
  }

  try {
    await deleteObject(key)
    // Las filas asociadas se borran por URL; si no existen, no pasa nada.
    await Promise.all([
      prisma.projectFile.deleteMany({ where: { url: target } }),
      prisma.blogFile.deleteMany({ where: { url: target } }),
    ])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("file delete error:", error)
    return NextResponse.json({ error: "No se pudo eliminar el archivo" }, { status: 500 })
  }
}

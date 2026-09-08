import { type NextRequest, NextResponse } from "next/server"
import { publicUrl } from "@/lib/storage"

export const dynamic = "force-dynamic"

/**
 * Compatibilidad con las URLs del despliegue anterior en VPS, donde los
 * archivos se servían desde el disco local (`/api/files/<carpeta>/<archivo>`).
 * Ahora viven en R2, así que esta ruta solo redirige.
 */
export async function GET(_request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  const key = path.join("/")

  if (!key || key.includes("..")) {
    return NextResponse.json({ error: "Ruta no válida" }, { status: 400 })
  }

  return NextResponse.redirect(publicUrl(key), 308)
}

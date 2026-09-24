import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { hashIp, ipDePeticion } from "@/lib/analytics"
import { EVENTOS } from "@/lib/eventos"

const schema = z.object({
  evento: z.enum(EVENTOS),
  ruta: z.string().max(200).startsWith("/"),
  detalle: z.string().max(120).optional(),
})

/** Rutas que no se miden: el panel y las del propio sistema. */
const EXCLUIDAS = /^\/(admin|api|auth)(\/|$)/

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json())
    if (!parsed.success || EXCLUIDAS.test(parsed.data.ruta)) {
      return new NextResponse(null, { status: 204 })
    }
    const ua = request.headers.get("user-agent") ?? ""
    // Los rastreadores no son clientes: no cuentan en el embudo.
    if (/bot|crawler|spider|preview|lighthouse|headless/i.test(ua)) {
      return new NextResponse(null, { status: 204 })
    }

    await prisma.siteAnalytics.create({
      data: {
        evento: parsed.data.evento,
        detalle: parsed.data.detalle ?? null,
        path: parsed.data.ruta,
        userAgent: ua.slice(0, 300) || null,
        ip: hashIp(ipDePeticion(request.headers)),
        referer: request.headers.get("referer")?.slice(0, 300) ?? null,
        device: /mobile|android|iphone/i.test(ua) ? "movil" : "escritorio",
      },
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("eventos POST error:", error)
    return new NextResponse(null, { status: 204 })
  }
}

import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { notifyContactMessage } from "@/lib/mail"

/**
 * Quien cotiza deja al menos una forma de contacto. Muchos dueños de negocio
 * prefieren WhatsApp y no usan el correo, así que ninguno de los dos es
 * obligatorio por separado.
 */
const schema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().optional().or(z.literal("")),
    telefono: z.string().trim().max(30).optional().or(z.literal("")),
    subject: z.string().max(160).optional().or(z.literal("")),
    message: z.string().trim().min(5).max(5000),
    // Datos de la cotización; todos opcionales y cortos.
    sector: z.string().trim().max(80).optional(),
    necesidad: z.string().trim().max(120).optional(),
    presupuesto: z.string().trim().max(80).optional(),
    plazo: z.string().trim().max(80).optional(),
    origen: z.string().trim().max(200).optional(),
  })
  .refine((d) => Boolean(d.email) || (d.telefono ?? "").replace(/\D/g, "").length >= 7, {
    message: "Falta un correo o un WhatsApp",
  })

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }
    const { name, email, telefono, subject, message, sector, necesidad, presupuesto, plazo, origen } = parsed.data
    const vacio = (v?: string) => v || null

    await prisma.contactMessage.create({
      data: {
        name,
        email: email || "",
        subject: vacio(subject),
        message,
        telefono: vacio(telefono),
        sector: vacio(sector),
        necesidad: vacio(necesidad),
        presupuesto: vacio(presupuesto),
        plazo: vacio(plazo),
        origen: vacio(origen),
      },
    })

    // En el correo van todos los datos juntos: es lo que se lee en el celular
    // antes de responder.
    const cuerpo = [
      telefono && `WhatsApp: ${telefono}`,
      sector && `Negocio: ${sector}`,
      necesidad && `Qué necesita: ${necesidad}`,
      presupuesto && `Presupuesto: ${presupuesto}`,
      plazo && `Plazo: ${plazo}`,
      origen && `Llegó desde: ${origen}`,
    ]
      .filter(Boolean)
      .concat(["", message])
      .join("\n")

    // El aviso por correo no bloquea la respuesta ni puede hacerla fallar:
    // el mensaje ya está guardado y quien escribió no tiene por qué enterarse
    // de un problema con el proveedor de correo.
    await notifyContactMessage({ name, email: email || "", subject, message: cuerpo })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("contact POST error:", error)
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 })
  }
}

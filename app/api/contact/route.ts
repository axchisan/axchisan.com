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
    const { name, email, telefono, subject, message } = parsed.data
    // El modelo guarda un solo campo de mensaje: el WhatsApp va al principio,
    // donde se ve primero desde el panel.
    const cuerpo = telefono ? `WhatsApp: ${telefono}\n\n${message}` : message

    await prisma.contactMessage.create({
      data: {
        name,
        email: email || "",
        subject: subject || null,
        message: cuerpo,
      },
    })

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

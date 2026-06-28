import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  subject: z.string().max(160).optional().or(z.literal("")),
  message: z.string().min(5).max(5000),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }
    const { name, email, subject, message } = parsed.data

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || null,
        message,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("contact POST error:", error)
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 })
  }
}

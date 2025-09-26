import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, projectType, budget, timeline, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Nombre, email y mensaje son requeridos" }, { status: 400 })
    }

    // Create contact message in database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: projectType || "Consulta general",
        message: `
Empresa: ${company || "No especificada"}
Tipo de Proyecto: ${projectType || "No especificado"}
Presupuesto: ${budget || "No especificado"}
Timeline: ${timeline || "No especificado"}

Mensaje:
${message}
        `.trim(),
      },
    })

    // Here you could also send an email notification
    // using a service like Resend, SendGrid, etc.

    return NextResponse.json(
      {
        message: "Mensaje enviado exitosamente",
        id: contactMessage.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error creating contact message:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

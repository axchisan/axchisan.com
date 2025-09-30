import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Debes iniciar sesión para enviar un mensaje" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, company, projectType, budget, timeline, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Nombre, email y mensaje son requeridos" }, { status: 400 })
    }

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
        userId: session.user.id,
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

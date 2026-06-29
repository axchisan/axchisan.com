import { prisma } from "@/lib/prisma"
import { MessagesClient } from "@/components/admin/messages-client"

export const dynamic = "force-dynamic"

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage
    .findMany({ orderBy: { createdAt: "desc" } })
    .catch(() => [])

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-[-0.02em]">Mensajes</h1>
      <p className="mt-1 text-sm text-muted">Mensajes recibidos por el formulario de contacto.</p>
      <div className="mt-7">
        <MessagesClient initial={messages} />
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { MessageCard } from "@/components/admin/message-card"
import { toast } from "sonner"

interface Message {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  replied: boolean
  status: string
  response: string | null
  respondedAt: Date | null
  createdAt: Date
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/contact")
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      } else {
        toast.error("Error al cargar los mensajes")
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast.error("Error al cargar los mensajes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mensajes</h1>
            <p className="text-muted-foreground">Gestiona los mensajes de contacto</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mensajes</h1>
          <p className="text-muted-foreground">Gestiona los mensajes de contacto</p>
        </div>
      </div>

      <div className="grid gap-4">
        {messages && messages.length > 0 ? (
          messages.map((message) => <MessageCard key={message.id} message={message} onUpdate={fetchMessages} />)
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay mensajes</h3>
              <p className="text-muted-foreground text-center">
                Los mensajes de contacto aparecerán aquí cuando los usuarios envíen el formulario.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

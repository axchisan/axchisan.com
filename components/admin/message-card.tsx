"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Clock, User, MessageSquare, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

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

interface MessageCardProps {
  message: Message
  onUpdate: () => void
}

export function MessageCard({ message, onUpdate }: MessageCardProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const getStatusColor = (read: boolean, replied: boolean) => {
    if (replied) return "bg-green-500/10 text-green-500 border-green-500/20"
    if (read) return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    return "bg-red-500/10 text-red-500 border-red-500/20"
  }

  const getStatusText = (read: boolean, replied: boolean) => {
    if (replied) return "Respondido"
    if (read) return "Leído"
    return "No leído"
  }

  const handleAction = async (action: string, additionalData?: any) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/contact/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...additionalData }),
      })

      if (response.ok) {
        toast.success("Mensaje actualizado correctamente")
        onUpdate()
      } else {
        toast.error("Error al actualizar el mensaje")
      }
    } catch (error) {
      console.error("Error updating message:", error)
      toast.error("Error al actualizar el mensaje")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este mensaje?")) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/contact/${message.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Mensaje eliminado correctamente")
        onUpdate()
      } else {
        toast.error("Error al eliminar el mensaje")
      }
    } catch (error) {
      console.error("Error deleting message:", error)
      toast.error("Error al eliminar el mensaje")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error("Por favor escribe una respuesta")
      return
    }

    await handleAction("mark_replied", { response: replyText })
    setIsReplying(false)
    setReplyText("")
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                {message.name}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {message.email}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(message.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <Badge className={getStatusColor(message.read, message.replied)}>
              {getStatusText(message.read, message.replied)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {message.subject && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Asunto:</h4>
              <p className="font-medium">{message.subject}</p>
            </div>
          )}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Mensaje:
            </h4>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
          </div>
          {message.response && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Respuesta:</h4>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.response}</p>
              {message.respondedAt && (
                <p className="text-xs text-muted-foreground mt-2">
                  Respondido el {new Date(message.respondedAt).toLocaleDateString("es-ES")}
                </p>
              )}
            </div>
          )}
          <div className="flex gap-2 pt-2">
            {!message.read && (
              <Button size="sm" variant="outline" onClick={() => handleAction("mark_read")} disabled={isLoading}>
                Marcar como leído
              </Button>
            )}
            {message.read && !message.replied && (
              <Button size="sm" variant="outline" onClick={() => handleAction("mark_unread")} disabled={isLoading}>
                Marcar como no leído
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => setIsReplying(true)} disabled={isLoading}>
              {message.replied ? "Ver/Editar respuesta" : "Responder"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              disabled={isLoading}
              className="text-destructive hover:text-destructive bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isReplying} onOpenChange={setIsReplying}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Responder a {message.name}</DialogTitle>
            <DialogDescription>
              Escribe tu respuesta al mensaje. Esta respuesta se guardará en el sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reply">Respuesta</Label>
              <Textarea
                id="reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplying(false)}>
              Cancelar
            </Button>
            <Button onClick={handleReply} disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar respuesta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Clock, User, MessageSquare, Trash2, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
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
  const [replyText, setReplyText] = useState(message.response || "")
  const [isLoading, setIsLoading] = useState(false)
  const [localStatus, setLocalStatus] = useState(message.status)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "IN_PROGRESS":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "RESOLVED":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "REJECTED":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pendiente"
      case "IN_PROGRESS":
        return "En Progreso"
      case "RESOLVED":
        return "Resuelto"
      case "REJECTED":
        return "Rechazado"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-3 w-3" />
      case "IN_PROGRESS":
        return <Loader2 className="h-3 w-3 animate-spin" />
      case "RESOLVED":
        return <CheckCircle className="h-3 w-3" />
      case "REJECTED":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <MessageSquare className="h-3 w-3" />
    }
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

  const handleStatusChange = async (newStatus: string) => {
    setLocalStatus(newStatus)
    await handleAction("update_status", { status: newStatus })
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
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1 min-w-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{message.name}</span>
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{message.email}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(message.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end flex-shrink-0">
              <Badge className={getStatusColor(localStatus)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(localStatus)}
                  {getStatusText(localStatus)}
                </span>
              </Badge>
              {!message.read && (
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                  Nuevo
                </Badge>
              )}
            </div>
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
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <h4 className="font-medium text-sm">Tu respuesta:</h4>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.response}</p>
              {message.respondedAt && (
                <p className="text-xs text-muted-foreground mt-2">
                  Respondido el {new Date(message.respondedAt).toLocaleDateString("es-ES")}
                </p>
              )}
            </div>
          )}

          {/* Status selector */}
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground">Estado:</Label>
            <Select value={localStatus} onValueChange={handleStatusChange} disabled={isLoading}>
              <SelectTrigger className="w-[180px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                <SelectItem value="RESOLVED">Resuelto</SelectItem>
                <SelectItem value="REJECTED">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Responder a {message.name}</DialogTitle>
            <DialogDescription>
              Escribe tu respuesta al mensaje. El usuario podrá ver esta respuesta en su panel de mensajes.
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
                rows={8}
                className="resize-none"
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

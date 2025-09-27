import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Clock, User, MessageSquare } from "lucide-react"

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

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
          messages.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow">
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
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline">
                    Marcar como leído
                  </Button>
                  <Button size="sm" variant="outline">
                    Responder
                  </Button>
                  <Button size="sm" variant="outline">
                    Archivar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
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

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackgroundEffects } from "@/components/background-effects"
import { PageTransition } from "@/components/page-transition"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Mail,
  Clock,
  MessageSquare,
  LogIn,
  CheckCircle,
  AlertCircle,
  Loader2,
  Search,
  Filter,
  XCircle,
} from "lucide-react"
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

type FilterStatus = "all" | "pending" | "in_progress" | "resolved" | "rejected" | "replied" | "unreplied"

export default function UserMessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchMessages()
    }
  }, [status, router])

  useEffect(() => {
    let filtered = messages

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (msg) =>
          msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.response?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((msg) => {
        switch (filterStatus) {
          case "replied":
            return msg.replied
          case "unreplied":
            return !msg.replied
          case "pending":
            return msg.status === "PENDING"
          case "in_progress":
            return msg.status === "IN_PROGRESS"
          case "resolved":
            return msg.status === "RESOLVED"
          case "rejected":
            return msg.status === "REJECTED"
          default:
            return true
        }
      })
    }

    setFilteredMessages(filtered)
  }, [searchTerm, filterStatus, messages])

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/user/messages")
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
        setFilteredMessages(data)
      } else {
        toast.error("Error al cargar tus mensajes")
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast.error("Error al cargar tus mensajes")
    } finally {
      setLoading(false)
    }
  }

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
        return <Clock className="h-4 w-4" />
      case "IN_PROGRESS":
        return <Loader2 className="h-4 w-4 animate-spin" />
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4" />
      case "REJECTED":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getStatusCounts = () => {
    return {
      total: messages.length,
      replied: messages.filter((m) => m.replied).length,
      pending: messages.filter((m) => m.status === "PENDING").length,
      inProgress: messages.filter((m) => m.status === "IN_PROGRESS").length,
      resolved: messages.filter((m) => m.status === "RESOLVED").length,
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="relative min-h-screen">
        <BackgroundEffects />
        <Header />
        <PageTransition>
          <main className="relative z-10 pt-16">
            <div className="container mx-auto px-4 py-12">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Cargando...</p>
                </div>
              </div>
            </div>
          </main>
        </PageTransition>
        <Footer />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="relative min-h-screen">
        <BackgroundEffects />
        <Header />
        <PageTransition>
          <main className="relative z-10 pt-16">
            <div className="container mx-auto px-4 py-12">
              <Card className="max-w-md mx-auto border-primary/20 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-6">
                    <LogIn className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Inicia Sesión</h3>
                  <p className="text-muted-foreground mb-6">Necesitas iniciar sesión para ver tus mensajes.</p>
                  <Button onClick={() => router.push("/auth/signin")} className="w-full">
                    <LogIn className="h-4 w-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </PageTransition>
        <Footer />
      </div>
    )
  }

  const counts = getStatusCounts()

  return (
    <div className="relative min-h-screen">
      <BackgroundEffects />
      <Header />
      <PageTransition>
        <main className="relative z-10 pt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-5xl mx-auto space-y-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">Mis Mensajes</h1>
                <p className="text-muted-foreground">
                  Aquí puedes ver el estado de todos los mensajes que has enviado y las respuestas recibidas.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold">{counts.total}</p>
                      </div>
                      <Mail className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-green-500/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Respondidos</p>
                        <p className="text-2xl font-bold text-green-500">{counts.replied}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-yellow-500/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pendientes</p>
                        <p className="text-2xl font-bold text-yellow-500">{counts.pending}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-blue-500/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">En progreso</p>
                        <p className="text-2xl font-bold text-blue-500">{counts.inProgress}</p>
                      </div>
                      <Filter className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-green-500/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Resueltos</p>
                        <p className="text-2xl font-bold text-green-500">{counts.resolved}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar en tus mensajes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={(value: FilterStatus) => setFilterStatus(value)}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="replied">Respondidos</SelectItem>
                    <SelectItem value="unreplied">Sin responder</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="in_progress">En progreso</SelectItem>
                    <SelectItem value="resolved">Resueltos</SelectItem>
                    <SelectItem value="rejected">Rechazados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results count */}
              {(searchTerm || filterStatus !== "all") && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {filteredMessages.length} de {messages.length} mensajes
                  </p>
                  {(searchTerm || filterStatus !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchTerm("")
                        setFilterStatus("all")
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              )}

              {/* Messages List */}
              <div className="grid gap-4">
                {filteredMessages && filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => (
                    <Card key={message.id} className="border-primary/20 bg-card/50 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 flex-1 min-w-0">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{message.subject || "Mensaje de contacto"}</span>
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                          <div className="flex flex-col gap-2 items-end flex-shrink-0">
                            <Badge className={getStatusColor(message.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(message.status)}
                                {getStatusText(message.status)}
                              </span>
                            </Badge>
                            {message.replied && (
                              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Respondido
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-2">Tu mensaje:</h4>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                        </div>

                        {message.replied && message.response && (
                          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <h4 className="font-medium text-sm">Respuesta recibida</h4>
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.response}</p>
                            {message.respondedAt && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Respondido el{" "}
                                {new Date(message.respondedAt).toLocaleDateString("es-ES", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            )}
                          </div>
                        )}

                        {!message.replied && message.read && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-500/5 border border-blue-500/20 p-3 rounded-lg">
                            <Mail className="h-4 w-4" />
                            <span>Tu mensaje ha sido leído. Recibirás una respuesta pronto.</span>
                          </div>
                        )}

                        {!message.read && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-yellow-500/5 border border-yellow-500/20 p-3 rounded-lg">
                            <Clock className="h-4 w-4" />
                            <span>Tu mensaje está pendiente de revisión.</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        {searchTerm || filterStatus !== "all" ? "No se encontraron mensajes" : "No tienes mensajes"}
                      </h3>
                      <p className="text-muted-foreground text-center mb-6">
                        {searchTerm || filterStatus !== "all"
                          ? "Intenta ajustar los filtros de búsqueda"
                          : "Aún no has enviado ningún mensaje de contacto."}
                      </p>
                      {!searchTerm && filterStatus === "all" && (
                        <Button onClick={() => router.push("/contact")}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Enviar un mensaje
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {filteredMessages && filteredMessages.length > 0 && (
                <div className="text-center">
                  <Button onClick={() => router.push("/contact")} variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Enviar otro mensaje
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </div>
  )
}

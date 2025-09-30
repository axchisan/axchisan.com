"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Search, Filter, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react"
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

type FilterStatus = "all" | "unread" | "read" | "replied" | "pending" | "in_progress" | "resolved" | "rejected"

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/contact")
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
        setFilteredMessages(data)
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

  useEffect(() => {
    let filtered = messages

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (msg) =>
          msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (msg.subject && msg.subject.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((msg) => {
        switch (filterStatus) {
          case "unread":
            return !msg.read
          case "read":
            return msg.read && !msg.replied
          case "replied":
            return msg.replied
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

  const getStatusCounts = () => {
    return {
      total: messages.length,
      unread: messages.filter((m) => !m.read).length,
      pending: messages.filter((m) => m.status === "PENDING").length,
      inProgress: messages.filter((m) => m.status === "IN_PROGRESS").length,
      resolved: messages.filter((m) => m.status === "RESOLVED").length,
    }
  }

  const counts = getStatusCounts()

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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-primary/20">
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
        <Card className="border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">No leídos</p>
                <p className="text-2xl font-bold text-red-500">{counts.unread}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/20">
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
        <Card className="border-blue-500/20">
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
        <Card className="border-green-500/20">
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
            placeholder="Buscar por nombre, email o mensaje..."
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
            <SelectItem value="all">Todos los mensajes</SelectItem>
            <SelectItem value="unread">No leídos</SelectItem>
            <SelectItem value="read">Leídos</SelectItem>
            <SelectItem value="replied">Respondidos</SelectItem>
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
          filteredMessages.map((message) => <MessageCard key={message.id} message={message} onUpdate={fetchMessages} />)
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm || filterStatus !== "all" ? "No se encontraron mensajes" : "No hay mensajes"}
              </h3>
              <p className="text-muted-foreground text-center">
                {searchTerm || filterStatus !== "all"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Los mensajes de contacto aparecerán aquí cuando los usuarios envíen el formulario."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

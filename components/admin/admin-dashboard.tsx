"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FolderOpen, BookOpen, Mail, MessageSquare, Eye, Heart, TrendingUp, Plus, User, Settings } from "lucide-react"
import Link from "next/link"

// Mock data - in real app this would come from API
const stats = [
  {
    title: "Proyectos",
    value: "12",
    change: "+2 este mes",
    icon: FolderOpen,
    color: "text-blue-500",
  },
  {
    title: "Artículos",
    value: "8",
    change: "+1 esta semana",
    icon: BookOpen,
    color: "text-green-500",
  },
  {
    title: "Mensajes",
    value: "24",
    change: "+5 nuevos",
    icon: Mail,
    color: "text-purple-500",
  },
  {
    title: "Comentarios",
    value: "156",
    change: "+12 hoy",
    icon: MessageSquare,
    color: "text-orange-500",
  },
]

const recentProjects = [
  {
    id: "1",
    title: "E-commerce Platform",
    status: "COMPLETED",
    likes: 12,
    views: 245,
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Task Management App",
    status: "IN_PROGRESS",
    likes: 8,
    views: 189,
    updatedAt: "2024-01-14",
  },
  {
    id: "3",
    title: "Portfolio Website",
    status: "IN_PROGRESS",
    likes: 20,
    views: 567,
    updatedAt: "2024-01-13",
  },
]

const recentMessages = [
  {
    id: "1",
    name: "Carlos Mendoza",
    email: "carlos@example.com",
    subject: "Consulta sobre desarrollo web",
    createdAt: "2024-01-15T10:30:00Z",
    read: false,
  },
  {
    id: "2",
    name: "Ana García",
    email: "ana@example.com",
    subject: "Propuesta de colaboración",
    createdAt: "2024-01-15T09:15:00Z",
    read: true,
  },
  {
    id: "3",
    name: "Luis Rodríguez",
    email: "luis@example.com",
    subject: "Presupuesto para app móvil",
    createdAt: "2024-01-14T16:45:00Z",
    read: false,
  },
]

export function AdminDashboard() {
  const statusColors = {
    COMPLETED: "bg-green-500/10 text-green-500 border-green-500/20",
    IN_PROGRESS: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    ARCHIVED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  }

  const statusLabels = {
    COMPLETED: "Completado",
    IN_PROGRESS: "En Progreso",
    ARCHIVED: "Archivado",
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido de vuelta, administra tu contenido desde aquí.</p>
        </div>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href="/admin/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Proyecto
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/blog/new">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Artículo
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Proyectos Recientes</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/projects">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{project.title}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <Badge className={`${statusColors[project.status as keyof typeof statusColors]} border text-xs`}>
                      {statusLabels[project.status as keyof typeof statusLabels]}
                    </Badge>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {project.likes}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {project.views}
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/projects/${project.id}`}>Editar</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Mensajes Recientes</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/messages">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMessages.map((message) => (
              <div key={message.id} className="flex items-start justify-between p-3 rounded-lg border border-border/50">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{message.name}</h4>
                    {!message.read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                  </div>
                  <p className="text-sm text-muted-foreground">{message.subject}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/messages/${message.id}`}>Ver</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
              <Link href="/admin/profile">
                <User className="h-6 w-6 mb-2" />
                Editar Perfil
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
              <Link href="/admin/projects/new">
                <FolderOpen className="h-6 w-6 mb-2" />
                Nuevo Proyecto
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
              <Link href="/admin/blog/new">
                <BookOpen className="h-6 w-6 mb-2" />
                Nuevo Artículo
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
              <Link href="/admin/settings">
                <Settings className="h-6 w-6 mb-2" />
                Configuración
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

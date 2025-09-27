"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FolderOpen, BookOpen, Mail, MessageSquare, Eye, Heart, TrendingUp, Plus, User, Settings } from "lucide-react"
import Link from "next/link"

interface Stat {
  title: string
  value: string
  change: string
  icon: string
  color: string
}

interface Project {
  id: string
  title: string
  status: string
  likes: number
  views: number
  updatedAt: string
}

interface Message {
  id: string
  name: string
  email: string
  subject: string | null
  createdAt: string
  read: boolean
}

interface DashboardData {
  stats: Stat[]
  recentProjects: Project[]
  recentMessages: Message[]
}

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const dashboardData = await response.json()
        setData(dashboardData)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

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

  const iconComponents = {
    FolderOpen,
    BookOpen,
    Mail,
    MessageSquare,
  }

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Bienvenido de vuelta, administra tu contenido desde aquí.</p>
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-primary/20">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Error al cargar los datos del dashboard</p>
      </div>
    )
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
        {data.stats.map((stat) => {
          const IconComponent = iconComponents[stat.icon as keyof typeof iconComponents]
          return (
            <Card key={stat.title} className="border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {IconComponent && <IconComponent className={`h-4 w-4 ${stat.color}`} />}
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
            {data.recentProjects.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No hay proyectos recientes</p>
            ) : (
              data.recentProjects.map((project) => (
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
              ))
            )}
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
            {data.recentMessages.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No hay mensajes recientes</p>
            ) : (
              data.recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start justify-between p-3 rounded-lg border border-border/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{message.name}</h4>
                      {!message.read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                    </div>
                    <p className="text-sm text-muted-foreground">{message.subject || "Sin asunto"}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(message.createdAt).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/messages/${message.id}`}>Ver</Link>
                  </Button>
                </div>
              ))
            )}
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

"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, ExternalLink, Eye } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Project {
  id: string
  title: string
  description: string
  shortDesc?: string
  coverImage?: string | null
  images: string[]
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  downloadUrl?: string
  category?: string
  status: string
  featured: boolean
  order: number
  createdAt: string
}

const statusColors = {
  COMPLETED: "bg-green-500/20 text-green-400 border-green-500/30",
  IN_PROGRESS: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  ARCHIVED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
}

const statusLabels = {
  COMPLETED: "Completado",
  IN_PROGRESS: "En Progreso",
  ARCHIVED: "Archivado",
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      } else {
        toast.error("Error al cargar los proyectos")
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast.error("Error al cargar los proyectos")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProjects(projects.filter((project) => project.id !== projectId))
        toast.success("Proyecto eliminado exitosamente")
      } else {
        toast.error("Error al eliminar el proyecto")
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      toast.error("Error al eliminar el proyecto")
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando proyectos...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold neon-text">Proyectos</h1>
            <p className="text-muted-foreground">Gestiona tu portafolio de proyectos</p>
          </div>
          <Link href="/admin/projects/new">
            <Button className="neon-glow">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar proyectos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="bg-card/50 backdrop-blur-sm border-primary/20 transition-neon hover:neon-glow"
            >
              <CardHeader className="pb-3">
                <div className="aspect-video relative overflow-hidden rounded-lg mb-3">
                  <img
                    src={
                      project.coverImage || project.images[0] || "/placeholder.svg?height=200&width=300&query=project"
                    }
                    alt={project.title}
                    className="object-cover w-full h-full"
                  />
                  {project.featured && (
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">Destacado</Badge>
                  )}
                </div>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                      {statusLabels[project.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="mb-4">{project.shortDesc || project.description}</CardDescription>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    {project.liveUrl && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/projects/${project.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/admin/projects/${project.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm ? "No se encontraron proyectos" : "No hay proyectos creados aún"}
            </p>
            {!searchTerm && (
              <Link href="/admin/projects/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear tu primer proyecto
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

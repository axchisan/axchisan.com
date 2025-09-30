"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CommentSection } from "@/components/comments/comment-section"
import { ProjectFilesDisplay } from "@/components/projects/project-files-display"
import { ArrowLeft, ExternalLink, Github, Download, Calendar, Tag, Eye, Heart, Star } from "lucide-react"
import { toast } from "sonner"
import { LikeButton } from "@/components/ui/like-button"

interface ProjectFile {
  id: string
  filename: string
  originalName: string
  displayName?: string
  description?: string
  url: string
  size: number
  type: string
  category: string
  platform?: string
  version?: string
  isDownloadable: boolean
  downloadCount: number
  order: number
}

interface Project {
  id: string
  title: string
  description: string
  shortDesc?: string
  content?: string
  images: string[]
  videos: string[]
  files: ProjectFile[]
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  downloadUrl?: string
  category?: string
  status: string
  featured: boolean
  order: number
  views: number
  createdAt: string
  comments: any[]
  likes: any[]
  favorites: any[]
  _count: {
    likes: number
    comments: number
    favorites: number
    projectViews: number
  }
}

export default function ProjectDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string)
    }
  }, [params.id])

  const fetchProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      } else {
        toast.error("Proyecto no encontrado")
      }
    } catch (error) {
      console.error("Error fetching project:", error)
      toast.error("Error al cargar el proyecto")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Cargando proyecto...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Proyecto no encontrado</p>
            <Link href="/projects">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a proyectos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
        </div>

        {/* Project Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {project.featured && <Badge className="bg-primary text-primary-foreground">Destacado</Badge>}
            {project.category && (
              <Badge variant="outline">
                <Tag className="h-3 w-3 mr-1" />
                {project.category}
              </Badge>
            )}
            <Badge variant="outline">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(project.createdAt).toLocaleDateString()}
            </Badge>
          </div>

          <h1 className="text-4xl font-bold text-balance">{project.title}</h1>

          {project.shortDesc && <p className="text-xl text-muted-foreground text-pretty">{project.shortDesc}</p>}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{project.views || project._count?.projectViews || 0} visualizaciones</span>
            </div>
            <LikeButton
              projectId={project.id}
              initialCount={project._count?.likes || project.likes?.length || 0}
              showCount={true}
            />
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>{project._count?.favorites || project.favorites?.length || 0} favoritos</span>
            </div>
            {project.files && project.files.length > 0 && (
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>{project.files.reduce((total, file) => total + file.downloadCount, 0)} descargas</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {project.liveUrl && (
              <Button asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver en vivo
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button variant="outline" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  Código fuente
                </a>
              </Button>
            )}
            {project.downloadUrl && (
              <Button variant="outline" asChild>
                <a href={project.downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            {project.images.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video relative overflow-hidden rounded-lg">
                    <Image
                      src={project.images[currentImageIndex] || "/placeholder.svg"}
                      alt={`${project.title} - Imagen ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {project.images.length > 1 && (
                    <div className="p-4">
                      <div className="flex space-x-2 overflow-x-auto">
                        {project.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                              index === currentImageIndex ? "border-primary" : "border-transparent hover:border-border"
                            }`}
                          >
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Thumbnail ${index + 1}`}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Descripción</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-pretty">{project.content || project.description}</p>
                </div>
              </CardContent>
            </Card>

            {project.files && project.files.length > 0 && (
              <ProjectFilesDisplay files={project.files} projectTitle={project.title} />
            )}

            {/* Comments */}
            <CommentSection projectId={project.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technologies */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Tecnologías</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Estadísticas del Proyecto</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Visualizaciones</span>
                    </div>
                    <span className="font-medium">{project.views || project._count?.projectViews || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Me gusta</span>
                    </div>
                    <span className="font-medium">{project._count?.likes || project.likes?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Favoritos</span>
                    </div>
                    <span className="font-medium">{project._count?.favorites || project.favorites?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Comentarios</span>
                    </div>
                    <span className="font-medium">{project._count?.comments || project.comments?.length || 0}</span>
                  </div>
                  {project.files && project.files.length > 0 && (
                    <>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Archivos disponibles</span>
                          <span className="font-medium">{project.files.length}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2">
                            <Download className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Descargas totales</span>
                          </div>
                          <span className="font-medium">
                            {project.files.reduce((total, file) => total + file.downloadCount, 0)}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Información del Proyecto</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Estado:</span>
                    <Badge variant="outline" className="ml-2">
                      {project.status === "COMPLETED"
                        ? "Completado"
                        : project.status === "IN_PROGRESS"
                          ? "En progreso"
                          : project.status === "DRAFT"
                            ? "Borrador"
                            : project.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fecha de creación:</span>
                    <span className="ml-2">
                      {new Date(project.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {project.category && (
                    <div>
                      <span className="text-muted-foreground">Categoría:</span>
                      <span className="ml-2">{project.category}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { X, Plus, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

interface Project {
  id: string
  title: string
  description: string
  shortDesc?: string
  content?: string
  images: string[]
  videos: string[]
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  downloadUrl?: string
  category?: string
  status: string
  featured: boolean
  order: number
}

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newTech, setNewTech] = useState("")
  const [newImage, setNewImage] = useState("")

  useEffect(() => {
    fetchProject()
  }, [params.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      } else {
        toast.error("Error al cargar el proyecto")
        router.push("/admin/projects")
      }
    } catch (error) {
      console.error("Error fetching project:", error)
      toast.error("Error al cargar el proyecto")
      router.push("/admin/projects")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project) return

    setSaving(true)
    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      })

      if (response.ok) {
        toast.success("Proyecto actualizado exitosamente")
        router.push("/admin/projects")
      } else {
        toast.error("Error al actualizar el proyecto")
      }
    } catch (error) {
      console.error("Error updating project:", error)
      toast.error("Error al actualizar el proyecto")
    } finally {
      setSaving(false)
    }
  }

  const handleAddTechnology = () => {
    if (newTech.trim() && project && !project.technologies.includes(newTech.trim())) {
      setProject({
        ...project,
        technologies: [...project.technologies, newTech.trim()],
      })
      setNewTech("")
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    if (project) {
      setProject({
        ...project,
        technologies: project.technologies.filter((t) => t !== tech),
      })
    }
  }

  const handleAddImage = () => {
    if (newImage.trim() && project && !project.images.includes(newImage.trim())) {
      setProject({
        ...project,
        images: [...project.images, newImage.trim()],
      })
      setNewImage("")
    }
  }

  const handleRemoveImage = (image: string) => {
    if (project) {
      setProject({
        ...project,
        images: project.images.filter((img) => img !== image),
      })
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando proyecto...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!project) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Proyecto no encontrado</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold neon-text">Editar Proyecto</h1>
            <p className="text-muted-foreground">Modifica los detalles de tu proyecto</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>Detalles principales del proyecto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Proyecto</Label>
                  <Input
                    id="title"
                    value={project.title}
                    onChange={(e) => setProject({ ...project, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDesc">Descripción Corta</Label>
                  <Textarea
                    id="shortDesc"
                    value={project.shortDesc || ""}
                    onChange={(e) => setProject({ ...project, shortDesc: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción Completa</Label>
                  <Textarea
                    id="description"
                    value={project.description}
                    onChange={(e) => setProject({ ...project, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Contenido Detallado</Label>
                  <Textarea
                    id="content"
                    value={project.content || ""}
                    onChange={(e) => setProject({ ...project, content: e.target.value })}
                    rows={6}
                    placeholder="Descripción técnica, desafíos, soluciones implementadas..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Project Settings */}
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>Estado y configuración del proyecto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select value={project.status} onValueChange={(value) => setProject({ ...project, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                      <SelectItem value="COMPLETED">Completado</SelectItem>
                      <SelectItem value="ARCHIVED">Archivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    value={project.category || ""}
                    onChange={(e) => setProject({ ...project, category: e.target.value })}
                    placeholder="Web, Mobile, Desktop, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Orden de visualización</Label>
                  <Input
                    id="order"
                    type="number"
                    value={project.order}
                    onChange={(e) => setProject({ ...project, order: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={project.featured}
                    onCheckedChange={(checked) => setProject({ ...project, featured: checked })}
                  />
                  <Label htmlFor="featured">Proyecto destacado</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* URLs */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Enlaces</CardTitle>
              <CardDescription>URLs relacionadas con el proyecto</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="liveUrl">URL en vivo</Label>
                <Input
                  id="liveUrl"
                  type="url"
                  value={project.liveUrl || ""}
                  onChange={(e) => setProject({ ...project, liveUrl: e.target.value })}
                  placeholder="https://ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl">URL de GitHub</Label>
                <Input
                  id="githubUrl"
                  type="url"
                  value={project.githubUrl || ""}
                  onChange={(e) => setProject({ ...project, githubUrl: e.target.value })}
                  placeholder="https://github.com/usuario/repo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="downloadUrl">URL de descarga</Label>
                <Input
                  id="downloadUrl"
                  type="url"
                  value={project.downloadUrl || ""}
                  onChange={(e) => setProject({ ...project, downloadUrl: e.target.value })}
                  placeholder="https://releases.com/download"
                />
              </div>
            </CardContent>
          </Card>

          {/* Technologies */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Tecnologías</CardTitle>
              <CardDescription>Stack tecnológico utilizado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="Agregar tecnología"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTechnology())}
                />
                <Button type="button" onClick={handleAddTechnology} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnology(tech)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Imágenes</CardTitle>
              <CardDescription>Capturas de pantalla y media del proyecto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="URL de la imagen"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddImage())}
                />
                <Button type="button" onClick={handleAddImage} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {project.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${project.title} - ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image)}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={saving} className="neon-glow">
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

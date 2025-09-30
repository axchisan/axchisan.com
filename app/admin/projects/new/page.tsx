"use client"

import type React from "react"

import { useState } from "react"
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
import { AdvancedFileManager } from "@/components/admin/advanced-file-manager"
import { CoverImageUpload } from "@/components/admin/cover-image-upload"

interface ProjectFile {
  id?: string
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
  downloadCount?: number
  order: number
}

export default function NewProjectPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [shortDesc, setShortDesc] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [status, setStatus] = useState("IN_PROGRESS")
  const [category, setCategory] = useState("")
  const [liveUrl, setLiveUrl] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [downloadUrl, setDownloadUrl] = useState("")
  const [technologies, setTechnologies] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([])
  const [featured, setFeatured] = useState(false)
  const [order, setOrder] = useState(0)
  const [newTech, setNewTech] = useState("")
  const [newImage, setNewImage] = useState("")
  const [saving, setSaving] = useState(false)

  const handleAddTechnology = () => {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      setTechnologies([...technologies, newTech.trim()])
      setNewTech("")
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech))
  }

  const handleAddImage = () => {
    if (newImage.trim() && !images.includes(newImage.trim())) {
      setImages([...images, newImage.trim()])
      setNewImage("")
    }
  }

  const handleRemoveImage = (image: string) => {
    setImages(images.filter((img) => img !== image))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description) {
      toast.error("Título y descripción son requeridos")
      return
    }

    setSaving(true)
    try {
      const projectData = {
        title,
        description,
        shortDesc,
        content,
        coverImage,
        status,
        category,
        liveUrl,
        githubUrl,
        downloadUrl,
        technologies,
        images,
        files: projectFiles,
        featured,
        order,
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        toast.success("Proyecto creado exitosamente")
        router.push("/admin/projects")
      } else {
        toast.error("Error al crear el proyecto")
      }
    } catch (error) {
      console.error("Error creating project:", error)
      toast.error("Error al crear el proyecto")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold neon-text">Nuevo Proyecto</h1>
            <p className="text-muted-foreground">Agrega un nuevo proyecto a tu portafolio</p>
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nombre del proyecto"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDesc">Descripción Corta</Label>
                  <Textarea
                    id="shortDesc"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    placeholder="Descripción breve del proyecto"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción Completa</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción detallada del proyecto"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Contenido Detallado</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
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
                  <Select value={status} onValueChange={setStatus} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el estado" />
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
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Web, Mobile, Desktop, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Orden de visualización</Label>
                  <Input
                    id="order"
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number.parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
                  <Label htmlFor="featured">Proyecto destacado</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <CoverImageUpload onImageChange={setCoverImage} />

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
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl">URL de GitHub</Label>
                <Input
                  id="githubUrl"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/usuario/repo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="downloadUrl">URL de descarga</Label>
                <Input
                  id="downloadUrl"
                  type="url"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
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
              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
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
              <CardTitle>Imágenes Adicionales</CardTitle>
              <CardDescription>Capturas de pantalla y media adicional del proyecto (opcional)</CardDescription>
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
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
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

          {/* Archivos del Proyecto */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Archivos del Proyecto</CardTitle>
              <CardDescription>
                Sube archivos descargables como APK, EXE, ZIP, etc. Organiza por plataforma y controla la descarga.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedFileManager initialFiles={projectFiles} onFilesChange={setProjectFiles} maxFiles={20} />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={saving} className="neon-glow">
              {saving ? "Creando..." : "Crear Proyecto"}
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

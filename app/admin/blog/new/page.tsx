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
import { ImageUpload } from "@/components/admin/image-upload"
import { X, Plus, Eye } from "lucide-react"
import { toast } from "sonner"

export default function NewBlogPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("draft")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [featuredImage, setFeaturedImage] = useState("")
  const [readTime, setReadTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleImageUpload = (images: string[]) => {
    if (images.length > 0) {
      setFeaturedImage(images[0])
      toast.success("Imagen subida exitosamente")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const postData = {
        title,
        slug: title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        excerpt,
        content,
        coverImage: featuredImage,
        tags,
        published: status === "published",
        featured: false,
        readTime: Number.parseInt(readTime) || 5,
      }

      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      if (response.ok) {
        toast.success("Artículo creado exitosamente")
        router.push("/admin/blog")
      } else {
        const error = await response.json()
        toast.error(error.message || "Error al crear el artículo")
      }
    } catch (error) {
      console.error("Error creating blog post:", error)
      toast.error("Error al crear el artículo")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePreview = () => {
    console.log("[v0] Preview blog post")
    // Here you would open a preview modal or new tab
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold neon-text">Nuevo Artículo</h1>
            <p className="text-muted-foreground">Crea un nuevo artículo para tu blog</p>
          </div>
          <Button onClick={handlePreview} variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Vista Previa
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle>Contenido del Artículo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Título del artículo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Extracto</Label>
                    <Textarea
                      id="excerpt"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Breve descripción del artículo"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Contenido</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Escribe el contenido completo del artículo aquí..."
                      rows={20}
                      className="font-mono text-sm"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Puedes usar Markdown para formatear el contenido</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle>Configuración</CardTitle>
                  <CardDescription>Ajustes de publicación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Borrador</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                        <SelectItem value="archived">Archivado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="React">React</SelectItem>
                        <SelectItem value="Next.js">Next.js</SelectItem>
                        <SelectItem value="Python">Python</SelectItem>
                        <SelectItem value="JavaScript">JavaScript</SelectItem>
                        <SelectItem value="TypeScript">TypeScript</SelectItem>
                        <SelectItem value="Automatización">Automatización</SelectItem>
                        <SelectItem value="Tutorial">Tutorial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="readTime">Tiempo de Lectura (minutos)</Label>
                    <Input
                      id="readTime"
                      type="number"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      placeholder="5"
                      min="1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle>Imagen Destacada</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ImageUpload
                    initialImages={featuredImage ? [featuredImage] : []}
                    onImagesChange={handleImageUpload}
                    maxImages={1}
                    label="Subir imagen destacada"
                  />

                  {featuredImage && (
                    <div className="aspect-video relative overflow-hidden rounded-lg">
                      <img
                        src={featuredImage || "/placeholder.svg"}
                        alt="Vista previa"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle>Etiquetas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Agregar etiqueta"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
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
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="neon-glow" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : status === "published" ? "Publicar Artículo" : "Guardar Borrador"}
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

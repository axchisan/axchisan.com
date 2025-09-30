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
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CoverImageUpload } from "@/components/admin/cover-image-upload"
import { X, Plus, Eye, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  coverImage?: string | null
  tags: string[]
  published: boolean
  featured: boolean
  views: number
  readTime?: number | null
  createdAt: string
  updatedAt: string
  publishedAt?: string | null
}

export default function EditBlogPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    fetchPost()
  }, [params.slug])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      } else {
        toast.error("Error al cargar el artículo")
        router.push("/admin/blog")
      }
    } catch (error) {
      console.error("Error fetching blog post:", error)
      toast.error("Error al cargar el artículo")
      router.push("/admin/blog")
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && post && !post.tags.includes(newTag.trim())) {
      setPost({
        ...post,
        tags: [...post.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    if (post) {
      setPost({
        ...post,
        tags: post.tags.filter((t) => t !== tag),
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!post) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/blog/${params.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      })

      if (response.ok) {
        toast.success("Artículo actualizado exitosamente")
        router.push("/admin/blog")
      } else {
        const error = await response.json()
        toast.error(error.message || "Error al actualizar el artículo")
      }
    } catch (error) {
      console.error("Error updating blog post:", error)
      toast.error("Error al actualizar el artículo")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePreview = () => {
    if (post?.published) {
      window.open(`/blog/${post.slug}`, "_blank")
    } else {
      toast.info("El artículo debe estar publicado para ver la vista previa")
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando artículo...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!post) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Artículo no encontrado</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold neon-text">Editar Artículo</h1>
              <p className="text-muted-foreground">Modifica los detalles de tu artículo</p>
            </div>
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
                      value={post.title}
                      onChange={(e) => setPost({ ...post, title: e.target.value })}
                      placeholder="Título del artículo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input
                      id="slug"
                      value={post.slug}
                      onChange={(e) => setPost({ ...post, slug: e.target.value })}
                      placeholder="slug-del-articulo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Extracto</Label>
                    <Textarea
                      id="excerpt"
                      value={post.excerpt || ""}
                      onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                      placeholder="Breve descripción del artículo"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Contenido</Label>
                    <Textarea
                      id="content"
                      value={post.content}
                      onChange={(e) => setPost({ ...post, content: e.target.value })}
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
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={post.published}
                      onCheckedChange={(checked) => setPost({ ...post, published: checked })}
                    />
                    <Label htmlFor="published">Publicado</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={post.featured}
                      onCheckedChange={(checked) => setPost({ ...post, featured: checked })}
                    />
                    <Label htmlFor="featured">Destacado</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="readTime">Tiempo de Lectura (minutos)</Label>
                    <Input
                      id="readTime"
                      type="number"
                      value={post.readTime || ""}
                      onChange={(e) => setPost({ ...post, readTime: Number.parseInt(e.target.value) || null })}
                      placeholder="5"
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Estadísticas</Label>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Vistas: {post.views}</p>
                      <p>Creado: {new Date(post.createdAt).toLocaleDateString()}</p>
                      <p>Actualizado: {new Date(post.updatedAt).toLocaleDateString()}</p>
                      {post.publishedAt && <p>Publicado: {new Date(post.publishedAt).toLocaleDateString()}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <CoverImageUpload
                initialImage={post.coverImage || ""}
                onImageChange={(url) => setPost({ ...post, coverImage: url })}
              />

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
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
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
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
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

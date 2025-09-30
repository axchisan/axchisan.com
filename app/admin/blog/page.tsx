"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
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

const statusColors = {
  published: "bg-green-500/20 text-green-400 border-green-500/30",
  draft: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  archived: "bg-gray-500/20 text-gray-400 border-gray-500/30",
}

const statusLabels = {
  published: "Publicado",
  draft: "Borrador",
  archived: "Archivado",
}

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog")
      if (response.ok) {
        const data = await response.json()
        if (data.posts && Array.isArray(data.posts)) {
          setPosts(data.posts)
        } else if (Array.isArray(data)) {
          setPosts(data)
        } else {
          console.error("Datos recibidos no son válidos:", data)
          toast.error("Formato inválido de datos de la API")
          setPosts([])
        }
      } else {
        toast.error("Error al cargar los artículos")
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      toast.error("Error al cargar los artículos")
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este artículo?")) {
      return
    }

    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId))
        toast.success("Artículo eliminado exitosamente")
      } else {
        toast.error("Error al eliminar el artículo")
      }
    } catch (error) {
      console.error("Error deleting blog post:", error)
      toast.error("Error al eliminar el artículo")
    }
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando artículos...</p>
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
            <h1 className="text-3xl font-bold neon-text">Blog</h1>
            <p className="text-muted-foreground">Gestiona tus artículos y publicaciones</p>
          </div>
          <Link href="/admin/blog/new">
            <Button className="neon-glow">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Artículo
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar artículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="bg-card/50 backdrop-blur-sm border-primary/20 transition-neon hover:neon-glow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={statusColors[post.published ? "published" : "draft"]}>
                        {statusLabels[post.published ? "published" : "draft"]}
                      </Badge>
                      {post.featured && <Badge className="bg-primary text-primary-foreground">Destacado</Badge>}
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && <Badge variant="outline">+{post.tags.length - 3}</Badge>}
                    </div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription>{post.excerpt || post.content.substring(0, 150) + "..."}</CardDescription>
                  </div>
                  {post.coverImage && (
                    <div className="ml-4 w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={post.coverImage || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {post.readTime && <span>{post.readTime} min lectura</span>}
                    <span>{post.views} vistas</span>
                    <span>Actualizado: {new Date(post.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {post.published && (
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/blog/${post.slug}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/admin/blog/${post.slug}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm ? "No se encontraron artículos" : "No hay artículos creados aún"}
            </p>
            {!searchTerm && (
              <Link href="/admin/blog/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear tu primer artículo
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

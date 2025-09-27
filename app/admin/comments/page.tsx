"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Search, Trash2, Edit, X, Check, MessageCircle, FolderOpen, BookOpen } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

interface Comment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string | null
    email: string
  }
  project?: {
    id: string
    title: string
  }
  blogPost?: {
    id: string
    title: string
  }
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [filteredComments, setFilteredComments] = useState<Comment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [])

  useEffect(() => {
    const filtered = comments.filter(
      (comment) =>
        comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.project?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.blogPost?.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredComments(filtered)
  }, [comments, searchTerm])

  const fetchComments = async () => {
    try {
      // Fetch all comments for admin view
      const response = await fetch("/api/comments")
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      } else {
        toast.error("Error al cargar los comentarios")
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast.error("Error al cargar los comentarios")
    } finally {
      setLoading(false)
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editContent,
        }),
      })

      if (response.ok) {
        const updatedComment = await response.json()
        setComments(comments.map((c) => (c.id === commentId ? { ...c, ...updatedComment } : c)))
        setEditingId(null)
        setEditContent("")
        toast.success("Comentario actualizado")
      } else {
        toast.error("Error al actualizar el comentario")
      }
    } catch (error) {
      console.error("Error updating comment:", error)
      toast.error("Error al actualizar el comentario")
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este comentario?")) {
      return
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setComments(comments.filter((c) => c.id !== commentId))
        toast.success("Comentario eliminado")
      } else {
        toast.error("Error al eliminar el comentario")
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast.error("Error al eliminar el comentario")
    }
  }

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id)
    setEditContent(comment.content)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditContent("")
  }

  const getUserInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return email[0].toUpperCase()
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando comentarios...</p>
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
            <h1 className="text-3xl font-bold neon-text">Comentarios</h1>
            <p className="text-muted-foreground">Gestiona todos los comentarios del sitio</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">Total: {comments.length}</Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar comentarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredComments.length === 0 ? (
            <Card className="border-primary/20">
              <CardContent className="p-12 text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  {searchTerm ? "No se encontraron comentarios" : "No hay comentarios aún"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredComments.map((comment) => (
              <Card key={comment.id} className="border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{getUserInitials(comment.user.name, comment.user.email)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{comment.user.name || comment.user.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                          {comment.updatedAt !== comment.createdAt && " (editado)"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => startEdit(comment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Content source */}
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    {comment.project && (
                      <>
                        <FolderOpen className="h-4 w-4" />
                        <span>Proyecto:</span>
                        <Link href={`/projects/${comment.project.id}`} className="text-primary hover:underline">
                          {comment.project.title}
                        </Link>
                      </>
                    )}
                    {comment.blogPost && (
                      <>
                        <BookOpen className="h-4 w-4" />
                        <span>Artículo:</span>
                        <Link href={`/blog/${comment.blogPost.id}`} className="text-primary hover:underline">
                          {comment.blogPost.title}
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Comment content */}
                  {editingId === comment.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={cancelEdit}>
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                        <Button size="sm" onClick={() => handleEditComment(comment.id)} disabled={!editContent.trim()}>
                          <Check className="h-4 w-4 mr-2" />
                          Guardar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

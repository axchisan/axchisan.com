"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"

// Mock data - will be replaced with real database data
const mockPosts = [
  {
    id: 1,
    title: "Cómo optimizar aplicaciones React para mejor rendimiento",
    excerpt: "Técnicas avanzadas para mejorar el rendimiento de tus aplicaciones React",
    status: "published",
    category: "React",
    readTime: "8 min",
    views: 1250,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-16",
  },
  {
    id: 2,
    title: "Introducción a Next.js 14 y sus nuevas características",
    excerpt: "Explora las últimas funcionalidades de Next.js 14 y cómo implementarlas",
    status: "draft",
    category: "Next.js",
    readTime: "12 min",
    views: 0,
    createdAt: "2024-02-10",
    updatedAt: "2024-02-10",
  },
  {
    id: 3,
    title: "Automatización de procesos con Python y Selenium",
    excerpt: "Guía completa para automatizar tareas web usando Python",
    status: "published",
    category: "Python",
    readTime: "15 min",
    views: 890,
    createdAt: "2024-03-05",
    updatedAt: "2024-03-06",
  },
]

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
  const [posts] = useState(mockPosts)

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[post.status as keyof typeof statusColors]}>
                        {statusLabels[post.status as keyof typeof statusLabels]}
                      </Badge>
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{post.readTime} lectura</span>
                    <span>{post.views} vistas</span>
                    <span>Actualizado: {new Date(post.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {post.status === "published" && (
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron artículos</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

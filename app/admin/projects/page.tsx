"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"

// Mock data - will be replaced with real database data
const mockProjects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "Plataforma completa de comercio electrónico con panel de administración",
    status: "completed",
    technologies: ["Next.js", "TypeScript", "Stripe"],
    image: "/ecommerce-platform-concept.png",
    url: "https://example.com",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Aplicación de gestión de tareas con colaboración en tiempo real",
    status: "in-progress",
    technologies: ["React", "Node.js", "Socket.io"],
    image: "/task-management-app-interface.png",
    url: "https://example.com",
    createdAt: "2024-02-10",
  },
  {
    id: 3,
    title: "AI Chatbot",
    description: "Chatbot inteligente para atención al cliente automatizada",
    status: "draft",
    technologies: ["Python", "OpenAI", "FastAPI"],
    image: "/ai-chatbot.png",
    url: "",
    createdAt: "2024-03-05",
  },
]

const statusColors = {
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  "in-progress": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
}

const statusLabels = {
  completed: "Completado",
  "in-progress": "En Progreso",
  draft: "Borrador",
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [projects] = useState(mockProjects)

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="object-cover w-full h-full"
                  />
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
                <CardDescription className="mb-4">{project.description}</CardDescription>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    {project.url && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
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

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron proyectos</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

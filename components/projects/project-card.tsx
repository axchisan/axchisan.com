"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, ExternalLink, Github, Download, Eye } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  shortDesc: string
  images: string[]
  technologies: string[]
  category: string
  status: "IN_PROGRESS" | "COMPLETED" | "ARCHIVED"
  featured: boolean
  githubUrl?: string
  liveUrl?: string
  downloadUrl?: string
  likes: number
  comments: number
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(project.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const statusColors = {
    IN_PROGRESS: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    COMPLETED: "bg-green-500/10 text-green-500 border-green-500/20",
    ARCHIVED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  }

  const statusLabels = {
    IN_PROGRESS: "En Progreso",
    COMPLETED: "Completado",
    ARCHIVED: "Archivado",
  }

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 group overflow-hidden">
      {/* Project Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.images[0] || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${statusColors[project.status]} border`}>{statusLabels[project.status]}</Badge>
        </div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary/90 text-primary-foreground">Destacado</Badge>
          </div>
        )}

        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          <Button size="sm" variant="secondary" asChild>
            <Link href={`/projects/${project.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              Ver detalles
            </Link>
          </Button>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
              <Link href={`/projects/${project.id}`}>{project.title}</Link>
            </h3>
            <p className="text-sm text-muted-foreground mb-3">{project.shortDesc}</p>
          </div>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.technologies.length - 3}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          {/* Engagement */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span>{likes}</span>
            </button>

            <Link
              href={`/projects/${project.id}#comments`}
              className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{project.comments}</span>
            </Link>
          </div>

          {/* External links */}
          <div className="flex items-center space-x-2">
            {project.githubUrl && (
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
            )}

            {project.liveUrl && (
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Ver en vivo</span>
                </a>
              </Button>
            )}

            {project.downloadUrl && (
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                <a href={project.downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Descargar</span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

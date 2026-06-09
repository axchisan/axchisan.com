"use client"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LikeButton } from "@/components/ui/like-button"
import { MessageCircle, ExternalLink, Github, Download, Eye, Monitor, Smartphone, Globe } from "lucide-react"

interface ProjectFile {
  id: string
  category: string
  platform?: string
  isDownloadable: boolean
}

interface Project {
  id: string
  title: string
  description: string
  shortDesc: string
  coverImage?: string | null
  images: string[]
  files?: ProjectFile[]
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

  const availablePlatforms = project.files ? [...new Set(project.files.map((f) => f.platform).filter(Boolean))] : []

  const downloadableFiles = project.files ? project.files.filter((f) => f.isDownloadable) : []

  const getPlatformIcon = (platform: string | null | undefined) => {
    switch (platform) {
      case "Android":
      case "iOS":
        return Smartphone
      case "Windows":
      case "macOS":
      case "Linux":
        return Monitor
      case "Web":
        return Globe
      default:
        return Monitor
    }
  }

  const displayImage = project.coverImage || project.images[0] || "/placeholder.svg"

  return (
    <Card className="group flex flex-col overflow-hidden rounded-2xl border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/40 transition-colors duration-300">
      {/* Project Image */}
      <Link href={`/projects/${project.id}`} className="relative block aspect-video overflow-hidden">
        <Image
          src={displayImage || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Discrete status + featured badges, single row */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge className={`${statusColors[project.status]} border text-[11px] font-medium`}>
            {statusLabels[project.status]}
          </Badge>
          {project.featured && (
            <Badge className="bg-primary/15 text-primary border border-primary/30 text-[11px] font-medium">
              Destacado
            </Badge>
          )}
        </div>

        {availablePlatforms.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1">
            {availablePlatforms.slice(0, 3).map((platform) => {
              const Icon = getPlatformIcon(platform)
              return (
                <div key={platform} className="rounded-full bg-black/50 backdrop-blur-sm p-1.5">
                  <Icon className="h-3 w-3 text-white" />
                </div>
              )
            })}
            {availablePlatforms.length > 3 && (
              <div className="rounded-full bg-black/50 backdrop-blur-sm px-2 py-1">
                <span className="text-xs text-white">+{availablePlatforms.length - 3}</span>
              </div>
            )}
          </div>
        )}

        {/* Desktop hover overlay: external actions */}
        <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-1.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          {project.githubUrl && (
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 rounded-lg"
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 rounded-lg"
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Ver en vivo</span>
              </a>
            </Button>
          )}
          {project.downloadUrl && (
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 rounded-lg"
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <a href={project.downloadUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
                <span className="sr-only">Descargar</span>
              </a>
            </Button>
          )}
        </div>
      </Link>

      <CardHeader className="pb-2 pt-4">
        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
          <Link href={`/projects/${project.id}`}>{project.title}</Link>
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1">{project.shortDesc}</p>
      </CardHeader>

      <CardContent className="flex-1 pt-0 pb-3 space-y-3">
        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="outline" className="text-[11px] border-border/60">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <Badge variant="outline" className="text-[11px] border-border/60">
              +{project.technologies.length - 3}
            </Badge>
          )}
        </div>

        <p className="hidden sm:block text-sm text-muted-foreground line-clamp-2">{project.description}</p>

        {downloadableFiles.length > 0 && (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/5 px-2 py-1 text-xs text-primary">
            <Download className="h-3 w-3" />
            <span>
              {downloadableFiles.length} archivo{downloadableFiles.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <div className="flex items-center justify-between w-full">
          {/* Engagement — single clean row */}
          <div className="flex items-center gap-4">
            <LikeButton
              projectId={project.id}
              initialCount={project.likes}
              showCount={true}
              className="h-auto p-0 hover:bg-transparent"
            />

            <Link
              href={`/projects/${project.id}#comments`}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{project.comments}</span>
            </Link>
          </div>

          {/* External links — compact row on mobile, hover overlay handles desktop */}
          <div className="flex sm:hidden items-center gap-1">
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

          {/* Desktop CTA */}
          <Link
            href={`/projects/${project.id}`}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <Eye className="h-4 w-4" />
            Ver detalles
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

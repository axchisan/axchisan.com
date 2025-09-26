"use client"

import { motion } from "framer-motion"
import { ProjectCard } from "./project-card"

// Mock data - in real app this would come from API/database
const projects = [
  {
    id: "1",
    title: "E-commerce Platform",
    description: "Plataforma de comercio electrónico completa con panel de administración y pasarela de pagos.",
    shortDesc: "E-commerce moderno con React y Node.js",
    images: ["/ecommerce-platform-concept.png"],
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
    category: "Web",
    status: "COMPLETED" as const,
    featured: true,
    githubUrl: "https://github.com/axchisan/ecommerce",
    liveUrl: "https://ecommerce-demo.axchi.dev",
    likes: 12,
    comments: 5,
  },
  {
    id: "2",
    title: "Task Management App",
    description: "Aplicación móvil para gestión de tareas con sincronización en tiempo real.",
    shortDesc: "App de productividad con Flutter",
    images: ["/task-management-app.png"],
    technologies: ["Flutter", "Firebase", "Dart"],
    category: "Móvil",
    status: "COMPLETED" as const,
    featured: true,
    githubUrl: "https://github.com/axchisan/task-app",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.axchi.tasks",
    likes: 8,
    comments: 3,
  },
  {
    id: "3",
    title: "Automation Workflow",
    description: "Sistema de automatización para procesos empresariales usando n8n y APIs.",
    shortDesc: "Automatización de procesos con n8n",
    images: ["/automation-workflow-dashboard.png"],
    technologies: ["n8n", "Python", "API", "Webhooks"],
    category: "Automatización",
    status: "COMPLETED" as const,
    featured: false,
    likes: 15,
    comments: 7,
  },
  {
    id: "4",
    title: "Portfolio Website",
    description: "Sitio web personal con sistema de blog y panel de administración.",
    shortDesc: "Portfolio personal con Next.js",
    images: ["/portfolio-website-showcase.png"],
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    category: "Web",
    status: "IN_PROGRESS" as const,
    featured: true,
    githubUrl: "https://github.com/axchisan/portfolio",
    liveUrl: "https://axchi.dev",
    likes: 20,
    comments: 12,
  },
  {
    id: "5",
    title: "Indie Game Project",
    description: "Juego indie 2D desarrollado con Unity y C#.",
    shortDesc: "Juego 2D con Unity",
    images: ["/indie-2d-game.jpg"],
    technologies: ["Unity", "C#", "2D Graphics"],
    category: "Juegos",
    status: "IN_PROGRESS" as const,
    featured: false,
    likes: 25,
    comments: 18,
  },
  {
    id: "6",
    title: "REST API Service",
    description: "API RESTful para gestión de usuarios y autenticación con JWT.",
    shortDesc: "API REST con Python y FastAPI",
    images: ["/rest-api-documentation.jpg"],
    technologies: ["Python", "FastAPI", "JWT", "PostgreSQL"],
    category: "API",
    status: "COMPLETED" as const,
    featured: false,
    githubUrl: "https://github.com/axchisan/api-service",
    likes: 6,
    comments: 2,
  },
]

export function ProjectsGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  )
}

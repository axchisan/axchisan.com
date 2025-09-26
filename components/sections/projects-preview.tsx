"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/projects/project-card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

// Mock featured projects
const featuredProjects = [
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
]

export function ProjectsPreview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Proyectos <span className="text-primary">Destacados</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Una selección de mis trabajos más recientes y representativos
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" className="transition-neon hover:neon-glow" asChild>
            <Link href="/projects">
              Ver todos los proyectos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

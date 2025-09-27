"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

const blogPosts = [
  {
    id: 1,
    title: "Introducción a Next.js 14: App Router y Server Components",
    excerpt:
      "Descubre las nuevas características de Next.js 14 y cómo el App Router revoluciona el desarrollo web moderno.",
    category: "Web Development",
    date: "2024-01-15",
    readTime: "5 min",
    image: "/nextjs-app-router.jpg",
    slug: "introduccion-nextjs-14-app-router",
  },
  {
    id: 2,
    title: "Flutter vs React Native: ¿Cuál elegir en 2024?",
    excerpt:
      "Comparación detallada entre Flutter y React Native para ayudarte a elegir la mejor opción para tu proyecto móvil.",
    category: "Mobile Development",
    date: "2024-01-10",
    readTime: "8 min",
    image: "/flutter-vs-react-native.jpg",
    slug: "flutter-vs-react-native-2024",
  },
  {
    id: 3,
    title: "Automatización de Procesos con n8n: Guía Completa",
    excerpt:
      "Aprende a automatizar tus procesos empresariales utilizando n8n, la herramienta de automatización de código abierto.",
    category: "Automation",
    date: "2024-01-05",
    readTime: "12 min",
    image: "/n8n-automation-workflow.jpg",
    slug: "automatizacion-procesos-n8n-guia",
  },
  {
    id: 4,
    title: "TypeScript: Mejores Prácticas para Desarrolladores",
    excerpt: "Consejos y mejores prácticas para escribir código TypeScript limpio, mantenible y escalable.",
    category: "Programming",
    date: "2023-12-28",
    readTime: "6 min",
    image: "/typescript-best-practices.jpg",
    slug: "typescript-mejores-practicas",
  },
  {
    id: 5,
    title: "Diseño de APIs RESTful: Principios y Buenas Prácticas",
    excerpt: "Guía completa para diseñar APIs RESTful robustas, escalables y fáciles de mantener.",
    category: "Backend",
    date: "2023-12-20",
    readTime: "10 min",
    image: "/restful-api-design.jpg",
    slug: "diseno-apis-restful-principios",
  },
  {
    id: 6,
    title: "PostgreSQL vs MongoDB: Cuándo usar cada uno",
    excerpt: "Análisis comparativo entre PostgreSQL y MongoDB para ayudarte a elegir la base de datos correcta.",
    category: "Database",
    date: "2023-12-15",
    readTime: "7 min",
    image: "/postgresql-vs-mongodb.jpg",
    slug: "postgresql-vs-mongodb-comparacion",
  },
]

export function BlogGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(blogPosts.map((post) => post.category)))

  const filteredPosts = selectedCategory ? blogPosts.filter((post) => post.category === selectedCategory) : blogPosts

  return (
    <div className="space-y-8">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
          className="transition-neon hover:neon-glow"
        >
          Todos
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="transition-neon hover:neon-glow"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <Card
            key={post.id}
            className="border-primary/20 hover:border-primary/40 transition-all duration-300 group overflow-hidden"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <Badge variant="secondary">{post.category}</Badge>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString("es-ES")}</span>
                </div>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{post.excerpt}</p>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <Button size="sm" className="transition-neon hover:neon-glow">
                    Leer más
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

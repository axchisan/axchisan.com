"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import type { BlogPost } from "@/types/blog-post" // Declare the BlogPost variable

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
          // Fallback for backward compatibility
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
}

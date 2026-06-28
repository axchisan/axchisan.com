"use client"

import { useState, useEffect } from "react"

interface Project {
  id: string
  title: string
  description: string
  shortDesc?: string
  images: string[]
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  downloadUrl?: string
  category?: string
  status: string
  featured: boolean
  order: number
  createdAt: string
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects")
        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }
        const data = await response.json()
        setProjects(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return { projects, loading, error, setProjects }
}

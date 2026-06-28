"use client"

import { useState, useEffect } from "react"

interface Skill {
  id: string
  name: string
  category: string
  level: number
  icon?: string
  color?: string
  order: number
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/skills")
        if (!response.ok) {
          throw new Error("Failed to fetch skills")
        }
        const data = await response.json()
        setSkills(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  return { skills, loading, error, setSkills }
}

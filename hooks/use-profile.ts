"use client"

import { useState, useEffect } from "react"

interface Profile {
  id: string
  name: string
  title: string
  bio: string
  email: string
  phone?: string
  whatsapp?: string
  instagram?: string
  github?: string
  linkedin?: string
  avatar?: string
  resumeUrl?: string
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile")
        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }
        const data = await response.json()
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return { profile, loading, error, setProfile }
}

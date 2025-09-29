"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  projectId?: string
  blogPostId?: string
  initialFavorited?: boolean
  initialCount?: number
  className?: string
  showCount?: boolean
}

export function FavoriteButton({
  projectId,
  blogPostId,
  initialFavorited = false,
  initialCount = 0,
  className,
  showCount = true,
}: FavoriteButtonProps) {
  const { data: session } = useSession()
  const [favorited, setFavorited] = useState(initialFavorited)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session && (projectId || blogPostId)) {
      checkFavoriteStatus()
    }
  }, [session, projectId, blogPostId])

  const checkFavoriteStatus = async () => {
    try {
      const params = new URLSearchParams()
      if (projectId) params.set("projectId", projectId)
      if (blogPostId) params.set("blogPostId", blogPostId)

      const response = await fetch(`/api/favorites?${params}`)
      if (response.ok) {
        const data = await response.json()
        setFavorited(data.favorited)
      }
    } catch (error) {
      console.error("Error checking favorite status:", error)
    }
  }

  const toggleFavorite = async () => {
    if (!session) {
      toast.error("Debes iniciar sesión para agregar a favoritos")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, blogPostId }),
      })

      if (response.ok) {
        const data = await response.json()
        setFavorited(data.favorited)
        setCount((prev) => (data.favorited ? prev + 1 : prev - 1))
        toast.success(data.message)
      } else {
        toast.error("Error al procesar la acción")
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast.error("Error al procesar la acción")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleFavorite} disabled={loading} className={cn("gap-2", className)}>
      <Star
        className={cn(
          "h-4 w-4 transition-colors",
          favorited ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground",
        )}
      />
      {showCount && <span>{count}</span>}
    </Button>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface LikeButtonProps {
  projectId?: string
  blogPostId?: string
  initialLiked?: boolean
  initialCount?: number
  className?: string
  showCount?: boolean
}

export function LikeButton({
  projectId,
  blogPostId,
  initialLiked = false,
  initialCount = 0,
  className,
  showCount = true,
}: LikeButtonProps) {
  const { data: session } = useSession()
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session && (projectId || blogPostId)) {
      checkLikeStatus()
    }
  }, [session, projectId, blogPostId])

  const checkLikeStatus = async () => {
    try {
      const params = new URLSearchParams()
      if (projectId) params.set("projectId", projectId)
      if (blogPostId) params.set("blogPostId", blogPostId)

      const response = await fetch(`/api/likes?${params}`)
      if (response.ok) {
        const data = await response.json()
        setLiked(data.liked)
      }
    } catch (error) {
      console.error("Error checking like status:", error)
    }
  }

  const toggleLike = async () => {
    if (!session) {
      toast.error("Debes iniciar sesión para dar me gusta")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, blogPostId }),
      })

      if (response.ok) {
        const data = await response.json()
        setLiked(data.liked)
        setCount((prev) => (data.liked ? prev + 1 : prev - 1))
        toast.success(data.message)
      } else {
        toast.error("Error al procesar la acción")
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      toast.error("Error al procesar la acción")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleLike} disabled={loading} className={cn("gap-2", className)}>
      <Heart
        className={cn("h-4 w-4 transition-colors", liked ? "fill-red-500 text-red-500" : "text-muted-foreground")}
      />
      {showCount && <span>{count}</span>}
    </Button>
  )
}

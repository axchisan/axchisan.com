"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuroraBackground } from "@/components/aurora-background"
import { PageTransition } from "@/components/page-transition"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FavoriteButton } from "@/components/ui/favorite-button"
import { EmptyIllustration } from "@/components/illustrations"
import { Bookmark, FolderOpen, BookOpen, LogIn } from "lucide-react"

interface FavoriteItem {
  id: string
  createdAt: string
  project: { id: string; title: string; shortDesc: string | null; images: string[]; category: string | null } | null
  blogPost: { id: string; title: string; excerpt: string | null; coverImage: string | null; slug: string; tags: string[] } | null
}

export default function SavedPage() {
  const { status } = useSession()
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false)
      return
    }
    fetch("/api/favorites?user=true")
      .then((r) => (r.ok ? r.json() : { favorites: [] }))
      .then((d) => setFavorites(d.favorites || []))
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false))
  }, [status])

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <Header />

      <PageTransition>
        <main className="relative z-10 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10 text-center">
              <div className="mb-5 flex justify-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 glow">
                  <Bookmark className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
                Mis <span className="text-gradient">Guardados</span>
              </h1>
              <p className="text-muted-foreground">Proyectos y artículos que marcaste como favoritos</p>
            </div>

            {status === "unauthenticated" ? (
              <Card className="border-border/60 bg-card/60 backdrop-blur-sm max-w-md mx-auto">
                <CardContent className="p-8 text-center space-y-4">
                  <p className="text-muted-foreground">Inicia sesión para ver tus elementos guardados.</p>
                  <Button asChild>
                    <Link href="/auth/signin?callbackUrl=/saved">
                      <LogIn className="h-4 w-4 mr-2" />
                      Iniciar sesión
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : loading ? (
              <div className="flex justify-center py-16">
                <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              </div>
            ) : favorites.length === 0 ? (
              <Card className="border-border/60 bg-card/60 backdrop-blur-sm max-w-md mx-auto">
                <CardContent className="p-8 text-center space-y-3">
                  <EmptyIllustration className="mx-auto" />
                  <p className="text-muted-foreground">
                    Aún no has guardado nada. Explora{" "}
                    <Link href="/projects" className="text-primary hover:underline">
                      proyectos
                    </Link>{" "}
                    o el{" "}
                    <Link href="/blog" className="text-primary hover:underline">
                      blog
                    </Link>
                    .
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {favorites.map((fav) => {
                  const isProject = !!fav.project
                  const item = fav.project || fav.blogPost
                  if (!item) return null
                  const href = isProject ? `/projects/${fav.project!.id}` : `/blog/${fav.blogPost!.slug}`
                  const image = isProject ? fav.project!.images?.[0] : fav.blogPost!.coverImage
                  const desc = isProject ? fav.project!.shortDesc : fav.blogPost!.excerpt
                  return (
                    <Card
                      key={fav.id}
                      className="group overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/40 transition-colors duration-300"
                    >
                      <Link href={href} className="relative block aspect-video overflow-hidden bg-muted">
                        {image ? (
                          <Image
                            src={image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground">
                            {isProject ? <FolderOpen className="h-10 w-10" /> : <BookOpen className="h-10 w-10" />}
                          </div>
                        )}
                      </Link>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {isProject ? "Proyecto" : "Artículo"}
                          </Badge>
                          <FavoriteButton
                            projectId={fav.project?.id}
                            blogPostId={fav.blogPost?.id}
                            initialFavorited
                            showCount={false}
                            className="h-auto p-0 hover:bg-transparent"
                          />
                        </div>
                        <Link href={href}>
                          <h3 className="font-semibold tracking-tight line-clamp-1 hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                        </Link>
                        {desc && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{desc}</p>}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  )
}

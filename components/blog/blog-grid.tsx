"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight, MessageCircle, Tag } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { SectionReveal, SectionRevealItem } from "@/components/motion/section-reveal"
import { EmptyIllustration } from "@/components/illustrations"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string | null
  published: boolean
  featured: boolean
  readTime: number
  createdAt: string
  tags: string[]
  _count: {
    comments: number
  }
}

interface BlogGridProps {
  posts: BlogPost[]
  featured?: boolean
}

export function BlogGrid({ posts, featured = false }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-12">
        <EmptyIllustration className="mb-4" />
        <p className="text-muted-foreground">No hay artículos disponibles</p>
      </div>
    )
  }

  if (featured) {
    const featuredPost = posts[0]
    const otherPosts = posts.slice(1)

    return (
      <div className="space-y-10">
        {/* Featured Post */}
        <SectionReveal>
          <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/40 transition-colors duration-300 group">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative aspect-video md:aspect-auto md:h-full overflow-hidden">
                <img
                  src={featuredPost.coverImage || "/placeholder.svg?height=400&width=600&query=blog featured image"}
                  alt={featuredPost.title}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent md:bg-gradient-to-r" />
              </div>
              <CardContent className="p-6 sm:p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <Badge variant="secondary" className="w-fit border-primary/30 bg-primary/10 text-primary">
                    Destacado
                  </Badge>

                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight group-hover:text-gradient transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="text-muted-foreground leading-relaxed">{featuredPost.excerpt}</p>

                  {/* Tags */}
                  {featuredPost.tags && featuredPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {featuredPost.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-border/60">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {featuredPost.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs border-border/60">
                          +{featuredPost.tags.length - 3} más
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDistanceToNow(new Date(featuredPost.createdAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{featuredPost.readTime} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{featuredPost._count.comments}</span>
                      </div>
                    </div>

                    <Button asChild variant="ghost" className="group/btn">
                      <Link href={`/blog/${featuredPost.slug}`}>
                        Leer más
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </SectionReveal>

        {/* Other Posts Grid */}
        {otherPosts.length > 0 && (
          <SectionReveal stagger className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {otherPosts.map((post) => (
              <SectionRevealItem key={post.id} className="h-full">
                <BlogCard post={post} />
              </SectionRevealItem>
            ))}
          </SectionReveal>
        )}
      </div>
    )
  }

  return (
    <SectionReveal stagger className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {posts.map((post) => (
        <SectionRevealItem key={post.id} className="h-full">
          <BlogCard post={post} />
        </SectionRevealItem>
      ))}
    </SectionReveal>
  )
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/40 transition-colors duration-300 group h-full flex flex-col overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={post.coverImage || "/placeholder.svg?height=200&width=400&query=blog post image"}
          alt={post.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent" />
      </div>

      <CardHeader className="flex-1">
        <h3 className="text-xl font-semibold tracking-tight group-hover:text-gradient transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs border-border/60">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 2 && (
              <Badge variant="outline" className="text-xs border-border/60">
                +{post.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{post.readTime}m</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-3 w-3" />
              <span>{post._count.comments}</span>
            </div>
          </div>

          <Button asChild variant="ghost" size="sm" className="group/btn">
            <Link href={`/blog/${post.slug}`}>
              Leer
              <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

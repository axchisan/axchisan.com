"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight, MessageCircle, Tag } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

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
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay artículos disponibles</p>
      </div>
    )
  }

  if (featured) {
    const featuredPost = posts[0]
    const otherPosts = posts.slice(1)

    return (
      <div className="space-y-8">
        {/* Featured Post */}
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 group">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="aspect-video md:aspect-auto relative overflow-hidden">
              <img
                src={featuredPost.coverImage || "/placeholder.svg?height=400&width=600&query=blog featured image"}
                alt={featuredPost.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-8 flex flex-col justify-center">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  Destacado
                </Badge>

                <h2 className="text-2xl font-bold neon-text group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>

                <p className="text-muted-foreground leading-relaxed">{featuredPost.excerpt}</p>

                {/* Tags */}
                {featuredPost.tags && featuredPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {featuredPost.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {featuredPost.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{featuredPost.tags.length - 3} más
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
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

        {/* Other Posts Grid */}
        {otherPosts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  )
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 group h-full flex flex-col">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={post.coverImage || "/placeholder.svg?height=200&width=400&query=blog post image"}
          alt={post.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <CardHeader className="flex-1">
        <h3 className="text-xl font-semibold neon-text group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
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

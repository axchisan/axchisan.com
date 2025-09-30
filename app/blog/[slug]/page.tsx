import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CommentSection } from "@/components/comments/comment-section"
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  published: boolean
  featured: boolean
  readTime: number
  createdAt: string
  updatedAt: string
  tags: string[]
  _count: {
    comments: number
  }
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/${slug}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return {
      title: "Post no encontrado",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post || !post.published) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Blog
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 border mb-8">
            <CardContent className="p-8">
              {/* Cover Image */}
              {post.coverImage && (
                <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
                  <img
                    src={post.coverImage || "/placeholder.svg"}
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl font-bold mb-4 neon-text">{post.title}</h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime} min de lectura</span>
                </div>

                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post._count.comments} comentarios</span>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Excerpt */}
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</p>
            </CardContent>
          </Card>

          {/* Article Content */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 border mb-8">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:neon-text prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-primary prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-img:rounded-lg prose-blockquote:border-l-primary space-y-4">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <CommentSection blogPostId={post.id} />
        </article>
      </div>
    </div>
  )
}
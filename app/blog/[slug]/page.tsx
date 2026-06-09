import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getBlogPostBySlug } from "@/lib/data"
import { SITE_URL } from "@/lib/site"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CommentSection } from "@/components/comments/comment-section"
import { ArrowLeft, Calendar, Clock, User, Tag, Eye } from "lucide-react"
import { ViewTracker } from "@/components/view-tracker"
import { LikeButton } from "@/components/ui/like-button"
import { FavoriteButton } from "@/components/ui/favorite-button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post no encontrado",
    }
  }

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : [],
      publishedTime: (post.publishedAt ?? post.createdAt).toISOString(),
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post || !post.published) {
    notFound()
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: (post.publishedAt ?? post.createdAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: "Duvan Yair Arciniegas", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <ViewTracker endpoint={`/api/blog/${post.slug}/view`} storageKey={`blog-${post.id}`} />
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
          <Card className="bg-card/60 backdrop-blur-sm border-border/60 border mb-8">
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
              <h1 className="text-4xl font-bold tracking-tight mb-4 text-gradient">{post.title}</h1>

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

                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} visualizaciones</span>
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
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{post.excerpt}</p>

              {/* Acciones */}
              <div className="flex items-center gap-4 border-t border-border/60 pt-4">
                <LikeButton blogPostId={post.id} initialCount={post._count.likes} showCount />
                <FavoriteButton blogPostId={post.id} initialCount={post._count.favorites} showCount />
              </div>
            </CardContent>
          </Card>

          {/* Article Content */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/60 border mb-8">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-primary prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-img:rounded-lg prose-blockquote:border-l-primary space-y-4">
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
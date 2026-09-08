import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { BlogForm } from "@/components/admin/blog-form"

export const dynamic = "force-dynamic"

export default async function EditBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } }).catch(() => null)
  if (!post) notFound()

  return (
    <div className="max-w-4xl">
      <Link href="/admin/blog" className="text-[0.875rem] text-faint inline-flex items-center gap-2 text-graphite transition-colors hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Blog
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-[-0.02em]">Editar post</h1>
      <div className="mt-7">
        <BlogForm
          initial={{
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage,
            tags: post.tags,
            published: post.published,
            featured: post.featured,
            readTime: post.readTime,
          }}
        />
      </div>
    </div>
  )
}

import { Plus } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { BlogList } from "@/components/admin/blog-list"

export const dynamic = "force-dynamic"

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost
    .findMany({ orderBy: [{ createdAt: "desc" }] })
    .catch(() => [])

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">Blog</h1>
          <p className="mt-1 text-sm text-graphite">{posts.length} post(s).</p>
        </div>
        <Button href="/admin/blog/new">
          <Plus className="h-4 w-4" /> Nuevo
        </Button>
      </div>
      <div className="mt-7">
        <BlogList items={posts} />
      </div>
    </div>
  )
}

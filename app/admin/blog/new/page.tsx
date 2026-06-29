import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BlogForm } from "@/components/admin/blog-form"

export const dynamic = "force-dynamic"

export default function NewBlogPage() {
  return (
    <div className="max-w-4xl">
      <Link href="/admin/blog" className="mono-label inline-flex items-center gap-2 text-muted transition-colors hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" /> Blog
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold tracking-[-0.02em]">Nuevo post</h1>
      <div className="mt-7">
        <BlogForm />
      </div>
    </div>
  )
}

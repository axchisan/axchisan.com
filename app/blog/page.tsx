import type { Metadata } from "next"
import { getBlogPosts } from "@/lib/data"
import { BlogPageClient } from "@/components/blog/blog-page-client"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artículos sobre desarrollo web, tecnología y aprendizajes. Tutoriales, ideas y experiencias de mi camino como desarrollador.",
  alternates: { canonical: "/blog" },
}

export const revalidate = 300

export default async function BlogPage() {
  const { posts, categories } = await getBlogPosts()

  return <BlogPageClient posts={posts} categories={categories} />
}

"use client"

import { useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuroraBackground } from "@/components/aurora-background"
import { PageTransition } from "@/components/page-transition"
import { BlogHero } from "@/components/blog/blog-hero"
import { BlogGrid } from "@/components/blog/blog-grid"
import { BlogFilters } from "@/components/blog/blog-filters"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  tags: string[]
  published: boolean
  featured: boolean
  views: number
  readTime: number | null
  // Las fechas llegan serializadas desde el Server Component.
  createdAt: string | Date
  updatedAt: string | Date
  publishedAt: string | Date | null
  _count: {
    comments: number
    likes: number
  }
}

interface BlogPageClientProps {
  posts: BlogPost[]
  categories: string[]
}

export function BlogPageClient({ posts, categories }: BlogPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrado en memoria (sin re-fetch): por categoría (tags) y por búsqueda
  // sobre título/excerpt/tags, case-insensitive.
  const filteredPosts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return posts.filter((post) => {
      const matchesCategory = selectedCategory ? post.tags.includes(selectedCategory) : true

      if (!term) return matchesCategory

      const matchesSearch =
        post.title.toLowerCase().includes(term) ||
        (post.excerpt?.toLowerCase().includes(term) ?? false) ||
        post.tags.some((tag) => tag.toLowerCase().includes(term))

      return matchesCategory && matchesSearch
    })
  }, [posts, selectedCategory, searchTerm])

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <Header />

      <PageTransition>
        <main className="relative z-10 pt-16">
          <BlogHero />
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1">
                  <BlogFilters
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    categories={categories}
                  />
                </aside>
                <div className="lg:col-span-3">
                  <BlogGrid posts={filteredPosts as any} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  )
}

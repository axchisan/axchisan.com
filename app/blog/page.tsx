"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackgroundEffects } from "@/components/background-effects"
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
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  _count: {
    comments: number
    likes: number
  }
}

interface BlogData {
  posts: BlogPost[]
  categories: string[]
}

export default function BlogPage() {
  const [blogData, setBlogData] = useState<BlogData>({ posts: [], categories: [] })
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchBlogData()
  }, [selectedCategory, searchTerm])

  const fetchBlogData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory) params.append("category", selectedCategory)
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`/api/blog?${params}`)
      if (response.ok) {
        const data = await response.json()
        setBlogData(data)
      }
    } catch (error) {
      console.error("Error fetching blog data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen">
      <BackgroundEffects />
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
                    categories={blogData.categories}
                  />
                </aside>
                <div className="lg:col-span-3">
                  <BlogGrid posts={blogData.posts} loading={loading} />
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

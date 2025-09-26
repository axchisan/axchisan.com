import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackgroundEffects } from "@/components/background-effects"
import { PageTransition } from "@/components/page-transition"
import { BlogHero } from "@/components/blog/blog-hero"
import { BlogGrid } from "@/components/blog/blog-grid"
import { BlogFilters } from "@/components/blog/blog-filters"

export const metadata = {
  title: "Blog - Axchi",
  description: "Artículos sobre desarrollo de software, tecnología y programación por Duvan Yair Arciniegas.",
}

export default function BlogPage() {
  return (
    <div className="relative min-h-screen">
      <BackgroundEffects />
      <Header />

      <PageTransition>
        <main className="relative z-10 pt-16">
          <BlogHero />
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <BlogFilters />
              <BlogGrid />
            </div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  )
}

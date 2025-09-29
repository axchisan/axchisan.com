"use client"

import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

export function BlogHero() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold mb-6 text-balance"
        >
          Mi <span className="text-primary">Blog</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty"
        >
          Comparto mis experiencias, aprendizajes y reflexiones sobre desarrollo de software, tecnología y programación.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center space-x-8"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">50+</div>
            <div className="text-sm text-muted-foreground">Artículos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">30+</div>
            <div className="text-sm text-muted-foreground">Publicaciones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">15</div>
            <div className="text-sm text-muted-foreground">Categorías</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

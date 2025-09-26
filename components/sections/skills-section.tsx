"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useSkills } from "@/hooks/use-skills"
import { Skeleton } from "@/components/ui/skeleton"

export function SkillsSection() {
  const { skills, loading, error } = useSkills()

  // Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, typeof skills>,
  )

  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">Error al cargar las habilidades</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Mis <span className="text-primary">Habilidades</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tecnologías y herramientas que domino para crear soluciones excepcionales
          </p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-primary/20 bg-card/50 backdrop-blur-sm h-full">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-24 mx-auto mb-6" />
                  <div className="space-y-6">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(skillsByCategory).map(([category, categorySkills], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-primary/20 bg-card/50 backdrop-blur-sm h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-6 text-center capitalize">{category}</h3>

                    <div className="space-y-6">
                      {categorySkills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: categoryIndex * 0.1 + skillIndex * 0.1,
                          }}
                          viewport={{ once: true }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: skill.color || "#3b82f6" }}
                              />
                              <span className="font-medium">{skill.name}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {skill.level * 10}%
                            </Badge>
                          </div>

                          <Progress value={skill.level * 10} className="h-2" />
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Additional skills as badges - fallback for now */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-lg font-semibold mb-6">También trabajo con</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Docker",
              "Linux",
              "Figma",
              "Photoshop",
              "Firebase",
              "Vercel",
              "Netlify",
              "WordPress",
              "Laravel",
              "Vue.js",
            ].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Badge
                  variant="outline"
                  className="px-3 py-1 hover:bg-primary/10 hover:border-primary/30 transition-colors"
                >
                  {tech}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

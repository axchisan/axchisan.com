"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const skillCategories = [
  {
    name: "Frontend",
    skills: [
      { name: "JavaScript", level: 65, color: "#F7DF1E" },
      { name: "React", level: 60, color: "#61DAFB" },
      { name: "Next.js", level: 80, color: "#000000" },
      { name: "TypeScript", level: 50, color: "#3178C6" },
    ],
  },
  {
    name: "Backend",
    skills: [
      { name: "PHP", level: 75, color: "#777BB4" },
      { name: "Python", level: 80, color: "#3776AB" },
      { name: "PostgreSQL", level: 70, color: "#336791" },
    ],
  },
  {
    name: "Mobile & Tools",
    skills: [
      { name: "Flutter", level: 70, color: "#02569B" },
      { name: "Git", level: 90, color: "#F05032" },
      { name: "n8n", level: 60, color: "#EA4B71" },
    ],
  },
]

export function SkillsSection() {
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

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-primary/20 bg-card/50 backdrop-blur-sm h-full">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6 text-center">{category.name}</h3>

                  <div className="space-y-6">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
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
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: skill.color }} />
                            <span className="font-medium">{skill.name}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {skill.level}%
                          </Badge>
                        </div>

                        <Progress value={skill.level} className="h-2" />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional skills as badges */}
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
              "Coolify",
              "Firebase",
              "Vercel",
              "Notion",
              "N8N",
              "Servidores",
              "Flask",
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

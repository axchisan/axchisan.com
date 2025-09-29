"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, MapPin, Calendar, GraduationCap } from "lucide-react"

export function AboutHero() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-6">
              <Badge variant="secondary" className="mb-4">
                Desarrollador de Software
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">Duvan Yair Arciniegas</h1>
              <p className="text-xl text-primary font-semibold mb-6">Conocido como "Axchi"</p>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Soy un desarrollador de software apasionado por crear soluciones tecnológicas innovadoras. Mi enfoque se
              centra en transformar ideas complejas en aplicaciones funcionales y elegantes que realmente marquen la
              diferencia.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Colombia</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">3+ años de experiencia</span>
              </div>
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Estudiante SENA</span>
              </div>
            </div>
          </motion.div>

          {/* Profile image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden mb-6">
                  <img 
                    src="/axchi.jpg" 
                    alt="Duvan Yair Arciniegas (Axchi)" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Axchi</h3>
                  <p className="text-muted-foreground text-sm">
                    "La innovación nace de la pasión por resolver problemas complejos"
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
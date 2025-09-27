"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, FileText, Code, TestTube, Rocket, HeadphonesIcon } from "lucide-react"

const processSteps = [
  {
    id: 1,
    title: "Consulta Inicial",
    description: "Conversamos sobre tu proyecto, objetivos y requerimientos específicos.",
    icon: MessageSquare,
    duration: "1-2 días",
  },
  {
    id: 2,
    title: "Planificación",
    description: "Creamos un plan detallado con cronograma, tecnologías y presupuesto.",
    icon: FileText,
    duration: "2-3 días",
  },
  {
    id: 3,
    title: "Desarrollo",
    description: "Implementamos tu proyecto siguiendo las mejores prácticas de desarrollo.",
    icon: Code,
    duration: "1-8 semanas",
  },
  {
    id: 4,
    title: "Pruebas",
    description: "Realizamos pruebas exhaustivas para garantizar la calidad del producto.",
    icon: TestTube,
    duration: "3-5 días",
  },
  {
    id: 5,
    title: "Lanzamiento",
    description: "Desplegamos tu proyecto y lo ponemos en funcionamiento.",
    icon: Rocket,
    duration: "1-2 días",
  },
  {
    id: 6,
    title: "Soporte",
    description: "Brindamos soporte continuo y mantenimiento post-lanzamiento.",
    icon: HeadphonesIcon,
    duration: "Continuo",
  },
]

export function ServicesProcess() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Mi Proceso de Trabajo</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Un enfoque estructurado y transparente para llevar tu proyecto desde la idea hasta la realidad
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processSteps.map((step, index) => {
          const IconComponent = step.icon
          return (
            <Card
              key={step.id}
              className="border-primary/20 hover:border-primary/40 transition-all duration-300 relative"
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-full bg-primary/10 border-2 border-primary/20">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2">
                      Paso {step.id}
                    </Badge>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">{step.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {step.duration}
                  </Badge>
                </div>
              </CardContent>

              {/* Connection line to next step */}
              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 w-6 h-0.5 bg-primary/30 transform -translate-y-1/2" />
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

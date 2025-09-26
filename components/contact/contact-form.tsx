"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, CheckCircle } from "lucide-react"

const projectTypes = [
  "Página Web",
  "Aplicación Móvil",
  "E-commerce",
  "Sistema de Gestión",
  "Automatización",
  "API/Backend",
  "Consultoría",
  "Otro",
]

const budgetRanges = [
  "Menos de $500 USD",
  "$500 - $1,000 USD",
  "$1,000 - $2,500 USD",
  "$2,500 - $5,000 USD",
  "$5,000 - $10,000 USD",
  "Más de $10,000 USD",
]

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Error al enviar el mensaje")
      }

      setIsSubmitted(true)
      setFormData({
        name: "",
        email: "",
        company: "",
        projectType: "",
        budget: "",
        timeline: "",
        message: "",
      })
    } catch (error) {
      setError("Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-4">¡Mensaje Enviado!</h3>
            <p className="text-muted-foreground mb-6">
              Gracias por contactarme. He recibido tu mensaje y te responderé dentro de las próximas 24 horas.
            </p>
            <Button onClick={() => setIsSubmitted(false)} variant="outline" className="bg-transparent">
              Enviar otro mensaje
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Cuéntame sobre tu proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa (opcional)</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectType">Tipo de Proyecto</Label>
                <Select
                  value={formData.projectType}
                  onValueChange={(value) => handleChange("projectType", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Presupuesto Estimado</Label>
                <Select
                  value={formData.budget}
                  onValueChange={(value) => handleChange("budget", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rango" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline del Proyecto</Label>
              <Input
                id="timeline"
                placeholder="ej. 2-3 meses, Lo antes posible, Flexible"
                value={formData.timeline}
                onChange={(e) => handleChange("timeline", e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Descripción del Proyecto *</Label>
              <Textarea
                id="message"
                rows={5}
                placeholder="Describe tu proyecto, objetivos, funcionalidades requeridas, etc."
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <Button type="submit" className="w-full transition-neon hover:neon-glow" disabled={isSubmitting}>
              {isSubmitting ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensaje
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

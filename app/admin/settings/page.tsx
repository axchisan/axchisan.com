"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Save, Loader2, FolderKanban, Cpu, FileText, Tags } from "lucide-react"
import { toast } from "sonner"

interface PublicStats {
  projectsCount: number
  technologiesCount: number
  blogPostsCount: number
  categoriesCount: number
  yearsExperience: number
  clientsCount: number
}

export default function SettingsPage() {
  const [yearsExperience, setYearsExperience] = useState("")
  const [clientsCount, setClientsCount] = useState("")
  const [stats, setStats] = useState<PublicStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [settingsRes, statsRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/stats/public"),
        ])

        if (settingsRes.ok) {
          const data = await settingsRes.json()
          setYearsExperience(data.years_experience ?? "")
          setClientsCount(data.clients_count ?? "")
        }

        if (statsRes.ok) {
          const data: PublicStats = await statsRes.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Error loading settings:", error)
        toast.error("Error al cargar la configuración")
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          years_experience: yearsExperience,
          clients_count: clientsCount,
        }),
      })

      if (response.ok) {
        toast.success("Configuración guardada exitosamente")
      } else {
        const error = await response.json().catch(() => null)
        toast.error(error?.error || "Error al guardar la configuración")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Error al guardar la configuración")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando configuración...</span>
      </div>
    )
  }

  const autoStats = [
    { label: "Proyectos", value: stats?.projectsCount ?? 0, icon: FolderKanban },
    { label: "Tecnologías", value: stats?.technologiesCount ?? 0, icon: Cpu },
    { label: "Artículos", value: stats?.blogPostsCount ?? 0, icon: FileText },
    { label: "Categorías", value: stats?.categoriesCount ?? 0, icon: Tags },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">Gestiona las métricas del sitio</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Editable metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Métricas del Sitio
            </CardTitle>
            <CardDescription>
              Estas métricas no se pueden calcular automáticamente, así que las defines aquí.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="yearsExperience">Años de experiencia</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  min={0}
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientsCount">Número de clientes</Label>
                <Input
                  id="clientsCount"
                  type="number"
                  min={0}
                  value={clientsCount}
                  onChange={(e) => setClientsCount(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Auto-derived metrics (read-only) */}
        <Card>
          <CardHeader>
            <CardTitle>Métricas automáticas</CardTitle>
            <CardDescription>Se calculan automáticamente desde tu contenido.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {autoStats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 p-4 text-center"
                  >
                    <Icon className="h-6 w-6 text-muted-foreground mb-2" />
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

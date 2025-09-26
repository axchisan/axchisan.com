"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Save, Plus, X } from "lucide-react"

export function ProfileEditor() {
  const [profile, setProfile] = useState({
    name: "Duvan Yair Arciniegas - Axchi",
    title: "Desarrollador de Software",
    bio: "Soy un apasionado desarrollador de software, actualmente estudiante en el SENA. Me encanta la programación y creo soluciones tecnológicas innovadoras para diferentes negocios. En mis tiempos libres disfruto creando juegos y soy un gran apasionado por la música. Trabajo bajo el apodo Axchi, mi marca personal que representa innovación y creatividad en el desarrollo de software.",
    email: "contact@axchi.dev",
    phone: "3183038190",
    whatsapp: "3183038190",
    instagram: "@axchisan",
    github: "@axchisan",
    linkedin: "",
  })

  const [skills, setSkills] = useState([
    "JavaScript",
    "React",
    "PHP",
    "Python",
    "Flutter",
    "Next.js",
    "TypeScript",
    "PostgreSQL",
    "Git",
    "n8n",
  ])

  const [newSkill, setNewSkill] = useState("")

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prev) => [...prev, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove))
  }

  const handleSave = () => {
    // Here you would make an API call to save the profile
    console.log("Saving profile:", { profile, skills })
    // Show success message
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Personal Information */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input id="name" value={profile.name} onChange={(e) => handleProfileChange("name", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título Profesional</Label>
            <Input id="title" value={profile.title} onChange={(e) => handleProfileChange("title", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografía</Label>
            <Textarea
              id="bio"
              rows={6}
              value={profile.bio}
              onChange={(e) => handleProfileChange("bio", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => handleProfileChange("email", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" value={profile.phone} onChange={(e) => handleProfileChange("phone", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={profile.whatsapp}
              onChange={(e) => handleProfileChange("whatsapp", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={profile.instagram}
              onChange={(e) => handleProfileChange("instagram", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input id="github" value={profile.github} onChange={(e) => handleProfileChange("github", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={profile.linkedin}
              onChange={(e) => handleProfileChange("linkedin", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills Management */}
      <Card className="border-primary/20 lg:col-span-2">
        <CardHeader>
          <CardTitle>Habilidades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Agregar nueva habilidad..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
            />
            <Button onClick={addSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="flex items-center space-x-1 px-3 py-1">
                <span>{skill}</span>
                <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="lg:col-span-2">
        <Button onClick={handleSave} className="w-full transition-neon hover:neon-glow">
          <Save className="h-4 w-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Plus, Trash2, Edit, Save, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Profile {
  id?: string
  name: string
  title: string
  bio: string
  email: string
  phone?: string
  whatsapp?: string
  instagram?: string
  github?: string
  linkedin?: string
  avatar?: string
  resumeUrl?: string
}

interface Skill {
  id: string
  name: string
  category: string
  level: number
  icon?: string
  color?: string
  order: number
}

export function ProfileEditor() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    github: "",
    linkedin: "",
    avatar: "",
    resumeUrl: "",
  })

  const [skills, setSkills] = useState<Skill[]>([])
  const [editingSkill, setEditingSkill] = useState<string | null>(null)
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "",
    level: 5,
    icon: "",
    color: "#3b82f6",
    order: 0,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
    fetchSkills()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile({
          id: data.id,
          name: data.name || "",
          title: data.title || "",
          bio: data.bio || "",
          email: data.email || "",
          phone: data.phone || "",
          whatsapp: data.whatsapp || "",
          instagram: data.instagram || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          avatar: data.avatar || "",
          resumeUrl: data.resumeUrl || "",
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Error al cargar el perfil")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileChange = (field: keyof Profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        toast.success("Perfil guardado exitosamente")
      } else {
        const error = await response.json()
        toast.error(error.message || "Error al guardar el perfil")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error("Error al guardar el perfil")
    } finally {
      setIsSaving(false)
    }
  }

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/skills")
      if (response.ok) {
        const data = await response.json()
        setSkills(data)
      }
    } catch (error) {
      console.error("Error fetching skills:", error)
      toast.error("Error al cargar las habilidades")
    }
  }

  const handleCreateSkill = async () => {
    if (!newSkill.name || !newSkill.category) {
      toast.error("Nombre y categoría son requeridos")
      return
    }

    try {
      const response = await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSkill),
      })

      if (response.ok) {
        const skill = await response.json()
        setSkills([...skills, skill])
        setNewSkill({
          name: "",
          category: "",
          level: 5,
          icon: "",
          color: "#3b82f6",
          order: 0,
        })
        toast.success("Habilidad creada exitosamente")
      } else {
        toast.error("Error al crear la habilidad")
      }
    } catch (error) {
      console.error("Error creating skill:", error)
      toast.error("Error al crear la habilidad")
    }
  }

  const handleUpdateSkill = async (skillId: string, updatedData: Partial<Skill>) => {
    try {
      const response = await fetch(`/api/skills/${skillId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (response.ok) {
        const updatedSkill = await response.json()
        setSkills(skills.map((skill) => (skill.id === skillId ? updatedSkill : skill)))
        setEditingSkill(null)
        toast.success("Habilidad actualizada exitosamente")
      } else {
        toast.error("Error al actualizar la habilidad")
      }
    } catch (error) {
      console.error("Error updating skill:", error)
      toast.error("Error al actualizar la habilidad")
    }
  }

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta habilidad?")) {
      return
    }

    try {
      const response = await fetch(`/api/skills/${skillId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSkills(skills.filter((skill) => skill.id !== skillId))
        toast.success("Habilidad eliminada exitosamente")
      } else {
        toast.error("Error al eliminar la habilidad")
      }
    } catch (error) {
      console.error("Error deleting skill:", error)
      toast.error("Error al eliminar la habilidad")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando perfil...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Editor de Perfil</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
          <TabsTrigger value="social">Redes Sociales</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
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
                <Input
                  id="title"
                  value={profile.title}
                  onChange={(e) => handleProfileChange("title", e.target.value)}
                />
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
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
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
                <Input
                  id="phone"
                  value={profile.phone || ""}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={profile.whatsapp || ""}
                  onChange={(e) => handleProfileChange("whatsapp", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={profile.instagram || ""}
                  onChange={(e) => handleProfileChange("instagram", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={profile.github || ""}
                  onChange={(e) => handleProfileChange("github", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={profile.linkedin || ""}
                  onChange={(e) => handleProfileChange("linkedin", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Habilidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="skill-name">Nombre de la Habilidad</Label>
                  <Input
                    id="skill-name"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder="ej. React, Node.js, Python"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skill-category">Categoría</Label>
                  <Select
                    value={newSkill.category}
                    onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Frontend">Frontend</SelectItem>
                      <SelectItem value="Backend">Backend</SelectItem>
                      <SelectItem value="Database">Base de Datos</SelectItem>
                      <SelectItem value="DevOps">DevOps</SelectItem>
                      <SelectItem value="Mobile">Móvil</SelectItem>
                      <SelectItem value="Design">Diseño</SelectItem>
                      <SelectItem value="Other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skill-level">Nivel (1-10)</Label>
                  <Slider
                    value={[newSkill.level]}
                    onValueChange={(value) => setNewSkill({ ...newSkill, level: value[0] })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-muted-foreground">Nivel: {newSkill.level}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skill-color">Color</Label>
                  <Input
                    id="skill-color"
                    type="color"
                    value={newSkill.color}
                    onChange={(e) => setNewSkill({ ...newSkill, color: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleCreateSkill} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Habilidad
              </Button>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Habilidades Actuales</h3>
                <div className="grid gap-4">
                  {skills.map((skill) => (
                    <Card key={skill.id}>
                      <CardContent className="p-4">
                        {editingSkill === skill.id ? (
                          <SkillEditForm
                            skill={skill}
                            onSave={(updatedData) => handleUpdateSkill(skill.id, updatedData)}
                            onCancel={() => setEditingSkill(null)}
                          />
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: skill.color }} />
                              <div>
                                <h4 className="font-medium">{skill.name}</h4>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Badge variant="secondary">{skill.category}</Badge>
                                  <span>Nivel: {skill.level}/10</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" onClick={() => setEditingSkill(skill.id)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteSkill(skill.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Archivos y Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="avatar">URL del Avatar</Label>
                <Input
                  id="avatar"
                  value={profile.avatar || ""}
                  onChange={(e) => handleProfileChange("avatar", e.target.value)}
                  placeholder="https://ejemplo.com/avatar.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resumeUrl">URL del CV/Resume</Label>
                <Input
                  id="resumeUrl"
                  value={profile.resumeUrl || ""}
                  onChange={(e) => handleProfileChange("resumeUrl", e.target.value)}
                  placeholder="https://ejemplo.com/cv.pdf"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SkillEditForm({
  skill,
  onSave,
  onCancel,
}: {
  skill: Skill
  onSave: (data: Partial<Skill>) => void
  onCancel: () => void
}) {
  const [editData, setEditData] = useState({
    name: skill.name,
    category: skill.category,
    level: skill.level,
    color: skill.color || "#3b82f6",
  })

  const handleSave = () => {
    if (!editData.name || !editData.category) {
      toast.error("Nombre y categoría son requeridos")
      return
    }
    onSave(editData)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nombre</Label>
          <Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select value={editData.category} onValueChange={(value) => setEditData({ ...editData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Frontend">Frontend</SelectItem>
              <SelectItem value="Backend">Backend</SelectItem>
              <SelectItem value="Database">Base de Datos</SelectItem>
              <SelectItem value="DevOps">DevOps</SelectItem>
              <SelectItem value="Mobile">Móvil</SelectItem>
              <SelectItem value="Design">Diseño</SelectItem>
              <SelectItem value="Other">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Nivel (1-10)</Label>
          <Slider
            value={[editData.level]}
            onValueChange={(value) => setEditData({ ...editData, level: value[0] })}
            max={10}
            min={1}
            step={1}
          />
          <div className="text-center text-sm text-muted-foreground">Nivel: {editData.level}</div>
        </div>
        <div className="space-y-2">
          <Label>Color</Label>
          <Input
            type="color"
            value={editData.color}
            onChange={(e) => setEditData({ ...editData, color: e.target.value })}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Guardar
        </Button>
      </div>
    </div>
  )
}

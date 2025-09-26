import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Settings, Save, Database, Mail, Shield, Palette } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">Gestiona la configuración del sitio</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nombre del Sitio</Label>
                <Input id="siteName" placeholder="Mi Portfolio" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteUrl">URL del Sitio</Label>
                <Input id="siteUrl" placeholder="https://miportfolio.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Descripción del Sitio</Label>
              <Textarea
                id="siteDescription"
                placeholder="Descripción que aparecerá en los metadatos del sitio"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="maintenance" />
              <Label htmlFor="maintenance">Modo de mantenimiento</Label>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configuración de Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email de Contacto</Label>
                <Input id="contactEmail" type="email" placeholder="contacto@miportfolio.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="replyEmail">Email de Respuesta</Label>
                <Input id="replyEmail" type="email" placeholder="noreply@miportfolio.com" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="emailNotifications" />
              <Label htmlFor="emailNotifications">Notificaciones por email</Label>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Configuración de Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="twoFactor" />
              <Label htmlFor="twoFactor">Autenticación de dos factores</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="loginNotifications" />
              <Label htmlFor="loginNotifications">Notificaciones de inicio de sesión</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Tiempo de sesión (minutos)</Label>
              <Input id="sessionTimeout" type="number" placeholder="60" />
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Configuración de Tema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Color Primario</Label>
                <Input id="primaryColor" type="color" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Color Secundario</Label>
                <Input id="secondaryColor" type="color" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="darkMode" />
              <Label htmlFor="darkMode">Modo oscuro por defecto</Label>
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Configuración de Base de Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="autoBackup" />
              <Label htmlFor="autoBackup">Respaldo automático</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="backupFrequency">Frecuencia de respaldo</Label>
              <select className="w-full p-2 border rounded-md">
                <option>Diario</option>
                <option>Semanal</option>
                <option>Mensual</option>
              </select>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Crear Respaldo Manual
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Guardar Configuración
          </Button>
        </div>
      </div>
    </div>
  )
}

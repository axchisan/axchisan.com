"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Upload,
  File,
  ImageIcon,
  Video,
  FileText,
  Monitor,
  Smartphone,
  Archive,
  Code,
  Globe,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Copy,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { formatFileSize } from "@/lib/file-utils"

interface ProjectFile {
  id?: string
  filename: string
  originalName: string
  displayName?: string
  description?: string
  url: string
  size: number
  type: string
  category: string
  platform?: string
  version?: string
  isDownloadable: boolean
  downloadCount?: number
  order: number
}

interface AdvancedFileManagerProps {
  projectId?: string
  initialFiles?: ProjectFile[]
  onFilesChange?: (files: ProjectFile[]) => void
  maxFiles?: number
  className?: string
}

const PLATFORMS = [
  { value: "Android", label: "Android", icon: Smartphone },
  { value: "iOS", label: "iOS", icon: Smartphone },
  { value: "Windows", label: "Windows", icon: Monitor },
  { value: "macOS", label: "macOS", icon: Monitor },
  { value: "Linux", label: "Linux", icon: Monitor },
  { value: "Web", label: "Web", icon: Globe },
]

const CATEGORIES = [
  { value: "IMAGE", label: "Imagen", icon: ImageIcon, color: "bg-blue-500/20 text-blue-400" },
  { value: "VIDEO", label: "Video", icon: Video, color: "bg-purple-500/20 text-purple-400" },
  { value: "DOCUMENT", label: "Documento", icon: FileText, color: "bg-green-500/20 text-green-400" },
  { value: "EXECUTABLE", label: "Ejecutable", icon: Monitor, color: "bg-red-500/20 text-red-400" },
  { value: "MOBILE_APP", label: "App Móvil", icon: Smartphone, color: "bg-orange-500/20 text-orange-400" },
  { value: "ARCHIVE", label: "Archivo", icon: Archive, color: "bg-yellow-500/20 text-yellow-400" },
  { value: "SOURCE_CODE", label: "Código", icon: Code, color: "bg-cyan-500/20 text-cyan-400" },
  { value: "OTHER", label: "Otro", icon: File, color: "bg-gray-500/20 text-gray-400" },
]

export function AdvancedFileManager({
  projectId,
  initialFiles = [],
  onFilesChange,
  maxFiles = 20,
  className,
}: AdvancedFileManagerProps) {
  const [files, setFiles] = useState<ProjectFile[]>(initialFiles)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all")
  const [editingFile, setEditingFile] = useState<ProjectFile | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      setFiles(initialFiles)
    }
  }, [initialFiles])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      setUploading(true)
      setUploadProgress(0)

      try {
        const formData = new FormData()
        acceptedFiles.forEach((file) => {
          formData.append("files", file)
        })

        if (projectId) {
          formData.append("projectId", projectId)
        }

        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + 10
          })
        }, 200)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)
        setUploadProgress(100)

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const result = await response.json()
        const newFiles: ProjectFile[] = result.files.map((file: any, index: number) => ({
          id: `temp-${Date.now()}-${index}`,
          filename: file.filename,
          originalName: file.originalName,
          displayName: file.originalName,
          url: file.url,
          size: file.size,
          type: file.type,
          category: file.category || "OTHER",
          platform: file.platform,
          version: file.version,
          isDownloadable: file.isDownloadable !== undefined ? file.isDownloadable : true,
          downloadCount: 0,
          order: files.length + index,
        }))

        const updatedFiles = [...files, ...newFiles]
        setFiles(updatedFiles)
        onFilesChange?.(updatedFiles)

        toast({
          title: "Archivos subidos",
          description: `${acceptedFiles.length} archivo(s) subido(s) exitosamente.`,
        })

        setTimeout(() => {
          setUploadProgress(0)
        }, 1000)
      } catch (error) {
        console.error("Upload error:", error)
        toast({
          title: "Error",
          description: "Error al subir los archivos. Intenta de nuevo.",
          variant: "destructive",
        })
      } finally {
        setUploading(false)
      }
    },
    [files, projectId, onFilesChange, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
      "video/*": [".mp4", ".webm", ".ogg", ".avi", ".mov"],
      "application/pdf": [".pdf"],
      "application/zip": [".zip"],
      "application/x-rar-compressed": [".rar"],
      "application/x-7z-compressed": [".7z"],
      "application/vnd.android.package-archive": [".apk"],
      "application/octet-stream": [".ipa", ".exe", ".dmg"],
      "application/x-msdownload": [".exe"],
      "application/x-msi": [".msi"],
      "text/plain": [".txt"],
    },
  })

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter((f) => f.id !== fileId)
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
    toast({
      title: "Archivo eliminado",
      description: "El archivo ha sido eliminado de la lista.",
    })
  }

  const updateFile = (fileId: string, updates: Partial<ProjectFile>) => {
    const updatedFiles = files.map((f) => (f.id === fileId ? { ...f, ...updates } : f))
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
    toast({
      title: "Archivo actualizado",
      description: "Los cambios han sido guardados.",
    })
  }

  const handleEditClick = (file: ProjectFile, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setEditingFile(file)
  }

  const handleSaveEdit = () => {
    if (editingFile && editingFile.id) {
      updateFile(editingFile.id, editingFile)
      setEditingFile(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingFile(null)
  }

  const getFileIcon = (category: string) => {
    const categoryInfo = CATEGORIES.find((c) => c.value === category)
    return categoryInfo?.icon || File
  }

  const getCategoryColor = (category: string) => {
    const categoryInfo = CATEGORIES.find((c) => c.value === category)
    return categoryInfo?.color || "bg-gray-500/20 text-gray-400"
  }

  const filteredFiles = files.filter((file) => {
    const categoryMatch = selectedCategory === "all" || file.category === selectedCategory
    const platformMatch = selectedPlatform === "all" || file.platform === selectedPlatform
    return categoryMatch && platformMatch
  })

  const groupedFiles = filteredFiles.reduce(
    (acc, file) => {
      const platform = file.platform || "Sin plataforma"
      if (!acc[platform]) {
        acc[platform] = []
      }
      acc[platform].push(file)
      return acc
    },
    {} as Record<string, ProjectFile[]>,
  )

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Gestor Avanzado de Archivos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Zone */}
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
              uploading && "pointer-events-none opacity-50",
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">Suelta los archivos aquí...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium">Arrastra archivos aquí o haz clic para seleccionar</p>
                <p className="text-sm text-muted-foreground">
                  Soporta: APK, EXE, ZIP, imágenes, videos, documentos y más
                </p>
                <p className="text-xs text-muted-foreground">Máximo {maxFiles} archivos</p>
              </div>
            )}
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Subiendo archivos...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Filters */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <Label>Filtrar por categoría</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Filtrar por plataforma</Label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {PLATFORMS.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Files Display */}
      {Object.keys(groupedFiles).length > 0 && (
        <div className="space-y-6">
          {Object.entries(groupedFiles).map(([platform, platformFiles]) => (
            <Card key={platform} className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {platform !== "Sin plataforma" && (
                    <>
                      {(() => {
                        const platformInfo = PLATFORMS.find((p) => p.value === platform)
                        const Icon = platformInfo?.icon || Monitor
                        return <Icon className="h-5 w-5" />
                      })()}
                    </>
                  )}
                  {platform}
                  <Badge variant="secondary">{platformFiles.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {platformFiles.map((file) => {
                    const Icon = getFileIcon(file.category)
                    return (
                      <Card key={file.id} className="group hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Icon className="h-6 w-6 text-primary flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="font-medium truncate" title={file.displayName || file.originalName}>
                                  {file.displayName || file.originalName}
                                </p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <Badge className={getCategoryColor(file.category)}>
                              {CATEGORIES.find((c) => c.value === file.category)?.label}
                            </Badge>
                          </div>

                          {file.description && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{file.description}</p>
                          )}

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {file.version && (
                                <Badge variant="outline" className="text-xs">
                                  v{file.version}
                                </Badge>
                              )}
                              <div className="flex items-center gap-1">
                                {file.isDownloadable ? (
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-3 w-3 text-yellow-500" />
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {file.isDownloadable ? "Descargable" : "Solo vista"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigator.clipboard.writeText(file.url)}
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(file.url, "_blank")}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleEditClick(file, e)}
                              type="button"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFile(file.id!)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit File Dialog */}
      <Dialog open={!!editingFile} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Archivo</DialogTitle>
          </DialogHeader>
          {editingFile && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre para mostrar</Label>
                <Input
                  value={editingFile.displayName || ""}
                  onChange={(e) => setEditingFile({ ...editingFile, displayName: e.target.value })}
                  placeholder="Nombre personalizado"
                />
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  value={editingFile.description || ""}
                  onChange={(e) => setEditingFile({ ...editingFile, description: e.target.value })}
                  placeholder="Descripción del archivo"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plataforma</Label>
                  <Select
                    value={editingFile.platform || ""}
                    onValueChange={(value) => setEditingFile({ ...editingFile, platform: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Versión</Label>
                  <Input
                    value={editingFile.version || ""}
                    onChange={(e) => setEditingFile({ ...editingFile, version: e.target.value })}
                    placeholder="1.0.0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingFile.isDownloadable}
                  onCheckedChange={(checked) => setEditingFile({ ...editingFile, isDownloadable: checked })}
                />
                <Label>Permitir descarga</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" onClick={handleSaveEdit}>
                  Guardar cambios
                </Button>
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {files.length === 0 && !uploading && (
        <div className="text-center py-12">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No hay archivos subidos aún</p>
        </div>
      )}
    </div>
  )
}

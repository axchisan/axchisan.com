"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Download,
  Eye,
  Monitor,
  Smartphone,
  Globe,
  Archive,
  Code,
  FileText,
  ImageIcon,
  Video,
  File,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react"
import { formatFileSize } from "@/lib/file-utils"

interface ProjectFile {
  id: string
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
  downloadCount: number
  order: number
}

interface ProjectFilesDisplayProps {
  files: ProjectFile[]
  projectTitle: string
  className?: string
}

const PLATFORMS = [
  { value: "Android", label: "Android", icon: Smartphone, color: "bg-green-500/20 text-green-400" },
  { value: "iOS", label: "iOS", icon: Smartphone, color: "bg-blue-500/20 text-blue-400" },
  { value: "Windows", label: "Windows", icon: Monitor, color: "bg-blue-600/20 text-blue-300" },
  { value: "macOS", label: "macOS", icon: Monitor, color: "bg-gray-500/20 text-gray-400" },
  { value: "Linux", label: "Linux", icon: Monitor, color: "bg-orange-500/20 text-orange-400" },
  { value: "Web", label: "Web", icon: Globe, color: "bg-purple-500/20 text-purple-400" },
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

export function ProjectFilesDisplay({ files, projectTitle, className }: ProjectFilesDisplayProps) {
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null)

  if (!files || files.length === 0) {
    return null
  }

  const getFileIcon = (category: string) => {
    const categoryInfo = CATEGORIES.find((c) => c.value === category)
    return categoryInfo?.icon || File
  }

  const getCategoryColor = (category: string) => {
    const categoryInfo = CATEGORIES.find((c) => c.value === category)
    return categoryInfo?.color || "bg-gray-500/20 text-gray-400"
  }

  const getPlatformIcon = (platform?: string) => {
    if (!platform) return Monitor
    const platformInfo = PLATFORMS.find((p) => p.value === platform)
    return platformInfo?.icon || Monitor
  }

  const getPlatformColor = (platform?: string) => {
    if (!platform) return "bg-gray-500/20 text-gray-400"
    const platformInfo = PLATFORMS.find((p) => p.value === platform)
    return platformInfo?.color || "bg-gray-500/20 text-gray-400"
  }

  // Agrupar archivos por plataforma
  const groupedFiles = files.reduce(
    (acc, file) => {
      const platform = file.platform || "General"
      if (!acc[platform]) {
        acc[platform] = []
      }
      acc[platform].push(file)
      return acc
    },
    {} as Record<string, ProjectFile[]>,
  )

  // Ordenar archivos dentro de cada plataforma
  Object.keys(groupedFiles).forEach((platform) => {
    groupedFiles[platform].sort((a, b) => a.order - b.order)
  })

  const handleDownload = async (file: ProjectFile) => {
    if (!file.isDownloadable) return

    try {
      // Incrementar contador de descargas
      await fetch(`/api/projects/files/${file.id}/download`, {
        method: "POST",
      })

      // Iniciar descarga
      const link = document.createElement("a")
      link.href = file.url
      link.download = file.displayName || file.originalName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading file:", error)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Descargas Disponibles
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(groupedFiles).length === 1 ? (
          // Vista simple si solo hay una plataforma
          <div className="space-y-4">
            {Object.entries(groupedFiles).map(([platform, platformFiles]) => (
              <div key={platform} className="space-y-3">
                {platform !== "General" && (
                  <div className="flex items-center gap-2 mb-4">
                    {(() => {
                      const Icon = getPlatformIcon(platform)
                      return <Icon className="h-5 w-5" />
                    })()}
                    <h4 className="font-medium">{platform}</h4>
                    <Badge className={getPlatformColor(platform)}>
                      {platformFiles.length} archivo{platformFiles.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                )}

                <div className="grid gap-3">
                  {platformFiles.map((file) => {
                    const Icon = getFileIcon(file.category)
                    return (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Icon className="h-6 w-6 text-primary flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium truncate">{file.displayName || file.originalName}</p>
                              {file.version && (
                                <Badge variant="outline" className="text-xs">
                                  v{file.version}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{formatFileSize(file.size)}</span>
                              <Badge className={getCategoryColor(file.category)}>
                                {CATEGORIES.find((c) => c.value === file.category)?.label}
                              </Badge>
                              {file.isDownloadable ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span className="text-xs">Descargable</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3 text-yellow-500" />
                                  <span className="text-xs">Solo vista</span>
                                </div>
                              )}
                            </div>
                            {file.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{file.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button size="sm" variant="ghost" onClick={() => setSelectedFile(file)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {file.isDownloadable && (
                            <Button
                              size="sm"
                              onClick={() => handleDownload(file)}
                              className="bg-primary/10 hover:bg-primary/20 text-primary"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Descargar
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Vista con tabs si hay múltiples plataformas
          <Tabs defaultValue={Object.keys(groupedFiles)[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Object.entries(groupedFiles).map(([platform, platformFiles]) => {
                const Icon = getPlatformIcon(platform !== "General" ? platform : undefined)
                return (
                  <TabsTrigger key={platform} value={platform} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{platform}</span>
                    <Badge variant="secondary" className="ml-1">
                      {platformFiles.length}
                    </Badge>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {Object.entries(groupedFiles).map(([platform, platformFiles]) => (
              <TabsContent key={platform} value={platform} className="mt-6">
                <div className="grid gap-3">
                  {platformFiles.map((file) => {
                    const Icon = getFileIcon(file.category)
                    return (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Icon className="h-6 w-6 text-primary flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium truncate">{file.displayName || file.originalName}</p>
                              {file.version && (
                                <Badge variant="outline" className="text-xs">
                                  v{file.version}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{formatFileSize(file.size)}</span>
                              <Badge className={getCategoryColor(file.category)}>
                                {CATEGORIES.find((c) => c.value === file.category)?.label}
                              </Badge>
                              {file.downloadCount > 0 && (
                                <span className="text-xs">
                                  {file.downloadCount} descarga{file.downloadCount !== 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                            {file.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{file.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button size="sm" variant="ghost" onClick={() => setSelectedFile(file)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {file.isDownloadable && (
                            <Button
                              size="sm"
                              onClick={() => handleDownload(file)}
                              className="bg-primary/10 hover:bg-primary/20 text-primary"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Descargar
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Dialog para detalles del archivo */}
        <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalles del Archivo</DialogTitle>
            </DialogHeader>
            {selectedFile && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = getFileIcon(selectedFile.category)
                    return <Icon className="h-8 w-8 text-primary" />
                  })()}
                  <div>
                    <h3 className="font-medium text-lg">{selectedFile.displayName || selectedFile.originalName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type}
                    </p>
                  </div>
                </div>

                {selectedFile.description && (
                  <div>
                    <h4 className="font-medium mb-2">Descripción</h4>
                    <p className="text-muted-foreground">{selectedFile.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Categoría</h4>
                    <Badge className={getCategoryColor(selectedFile.category)}>
                      {CATEGORIES.find((c) => c.value === selectedFile.category)?.label}
                    </Badge>
                  </div>

                  {selectedFile.platform && (
                    <div>
                      <h4 className="font-medium mb-2">Plataforma</h4>
                      <Badge className={getPlatformColor(selectedFile.platform)}>{selectedFile.platform}</Badge>
                    </div>
                  )}

                  {selectedFile.version && (
                    <div>
                      <h4 className="font-medium mb-2">Versión</h4>
                      <Badge variant="outline">v{selectedFile.version}</Badge>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-2">Descargas</h4>
                    <span className="text-muted-foreground">{selectedFile.downloadCount}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  {selectedFile.isDownloadable && (
                    <Button onClick={() => handleDownload(selectedFile)}>
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => window.open(selectedFile.url, "_blank")}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver archivo
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

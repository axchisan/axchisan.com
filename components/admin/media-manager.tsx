"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileUpload } from "@/components/ui/file-upload"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Grid3X3, List, Trash2, Download, Copy, ImageIcon, Video, File, Plus } from "lucide-react"
import { toast } from "sonner"

interface MediaFile {
  id: string
  filename: string
  originalName: string
  size: number
  type: string
  url: string
  uploadedAt: string
}

interface UploadedFileResult {
  filename: string
  originalName: string
  size: number
  type: string
  url: string
}

export function MediaManager() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [filteredFiles, setFilteredFiles] = useState<MediaFile[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  useEffect(() => {
    fetchFiles()
  }, [])

  useEffect(() => {
    filterFiles()
  }, [files, searchTerm, filterType])

  const fetchFiles = async () => {
    try {
      // This would be an API call to get uploaded files
      // For now, we'll simulate with empty array
      setFiles([])
    } catch (error) {
      console.error("Error fetching files:", error)
      toast.error("Error al cargar los archivos")
    } finally {
      setIsLoading(false)
    }
  }

  const filterFiles = () => {
    let filtered = files

    if (searchTerm) {
      filtered = filtered.filter((file) => file.originalName.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (filterType !== "all") {
      filtered = filtered.filter((file) => {
        switch (filterType) {
          case "images":
            return file.type.startsWith("image/")
          case "videos":
            return file.type.startsWith("video/")
          case "documents":
            return file.type === "application/pdf" || file.type.startsWith("text/")
          default:
            return true
        }
      })
    }

    setFilteredFiles(filtered)
  }

  const handleUpload = (uploadedFiles: UploadedFileResult[]) => {
    const newFiles = uploadedFiles.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...file,
      uploadedAt: new Date().toISOString(),
    }))

    setFiles((prev) => [...newFiles, ...prev])
    toast.success(`${uploadedFiles.length} archivo(s) subido(s) exitosamente`)
  }

  const handleDelete = async (fileId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este archivo?")) {
      return
    }

    try {
      // This would be an API call to delete the file
      setFiles((prev) => prev.filter((file) => file.id !== fileId))
      setSelectedFiles((prev) => prev.filter((id) => id !== fileId))
      toast.success("Archivo eliminado exitosamente")
    } catch (error) {
      console.error("Error deleting file:", error)
      toast.error("Error al eliminar el archivo")
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success("URL copiada al portapapeles")
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon
    if (type.startsWith("video/")) return Video
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestor de Archivos</h1>
          <p className="text-muted-foreground">Administra tus archivos multimedia</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Subir Archivos
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Subir Archivos</DialogTitle>
            </DialogHeader>
            <FileUpload
              onUpload={handleUpload}
              maxFiles={10}
              maxSize={50 * 1024 * 1024} // 50MB
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar archivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={filterType} onValueChange={setFilterType} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="images">Imágenes</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando archivos...</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {files.length === 0 ? "No hay archivos subidos" : "No se encontraron archivos"}
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4" : "space-y-2"
          }
        >
          {filteredFiles.map((file) => {
            const Icon = getFileIcon(file.type)

            if (viewMode === "grid") {
              return (
                <Card key={file.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-3">
                    <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={file.url || "/placeholder.svg"}
                          alt={file.originalName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium truncate" title={file.originalName}>
                        {file.originalName}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>

                    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" onClick={() => handleCopyUrl(file.url)} className="h-6 w-6 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(file.url, "_blank")}
                        className="h-6 w-6 p-0"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(file.id)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            } else {
              return (
                <Card key={file.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium">{file.originalName}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{formatFileSize(file.size)}</span>
                            <Badge variant="secondary" className="text-xs">
                              {file.type.split("/")[0]}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleCopyUrl(file.url)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => window.open(file.url, "_blank")}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(file.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            }
          })}
        </div>
      )}
    </div>
  )
}

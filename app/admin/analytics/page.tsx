import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FolderOpen, BookOpen, Mail, Eye, TrendingUp } from "lucide-react"

export default async function AnalyticsPage() {
  const [projectsCount, blogPostsCount, messagesCount, recentMessages, publishedPosts] = await Promise.all([
    prisma.project.count(),
    prisma.blogPost.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  const stats = [
    {
      title: "Total Proyectos",
      value: projectsCount || 0,
      icon: FolderOpen,
      description: "Proyectos en el portfolio",
      color: "text-blue-500",
    },
    {
      title: "Posts del Blog",
      value: blogPostsCount || 0,
      icon: BookOpen,
      description: "Artículos publicados",
      color: "text-green-500",
    },
    {
      title: "Mensajes",
      value: messagesCount || 0,
      icon: Mail,
      description: "Mensajes de contacto",
      color: "text-purple-500",
    },
    {
      title: "Vistas Totales",
      value: publishedPosts?.reduce((acc, post) => acc + (post.views || 0), 0) || 0,
      icon: Eye,
      description: "Vistas en el blog",
      color: "text-orange-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Estadísticas</h1>
          <p className="text-muted-foreground">Resumen de la actividad del sitio</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Mensajes Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMessages && recentMessages.length > 0 ? (
              recentMessages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{message.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{message.email}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{message.message}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(message.createdAt).toLocaleDateString("es-ES")}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No hay mensajes recientes</p>
            )}
          </CardContent>
        </Card>

        {/* Popular Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Posts Populares
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {publishedPosts && publishedPosts.length > 0 ? (
              publishedPosts.map((post) => (
                <div key={post.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {post.views || 0} vistas • {new Date(post.createdAt).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No hay posts publicados</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const blogPosts = [
  {
    title: "Introducción a Next.js 14: App Router y Server Components",
    slug: "introduccion-nextjs-14-app-router",
    excerpt:
      "Descubre las nuevas características de Next.js 14 y cómo el App Router revoluciona el desarrollo web moderno.",
    content: `
# Introducción a Next.js 14: App Router y Server Components

Next.js 14 ha llegado con mejoras significativas que transforman la manera en que desarrollamos aplicaciones web modernas. En este artículo, exploraremos las características más importantes de esta versión.

## App Router: El Futuro del Routing

El App Router introduce un nuevo paradigma de routing basado en el sistema de archivos, pero con capacidades mucho más avanzadas:

- **Layouts anidados**: Permite crear layouts que se mantienen entre navegaciones
- **Loading states**: Estados de carga automáticos para mejorar la UX
- **Error boundaries**: Manejo de errores más granular

## Server Components: Rendizado en el Servidor

Los Server Components permiten renderizar componentes directamente en el servidor, ofreciendo:

- **Mejor rendimiento**: Menos JavaScript enviado al cliente
- **SEO mejorado**: Contenido renderizado en el servidor
- **Acceso directo a datos**: Sin necesidad de APIs intermedias

## Conclusión

Next.js 14 representa un salto significativo en el desarrollo web moderno, ofreciendo herramientas más potentes y eficientes para crear aplicaciones escalables.
    `,
    coverImage: "/nextjs-app-router.jpg",
    tags: ["Next.js", "React", "Web Development", "JavaScript"],
    published: true,
    featured: true,
    readTime: 5,
  },
  {
    title: "Flutter vs React Native: ¿Cuál elegir en 2024?",
    slug: "flutter-vs-react-native-2024",
    excerpt:
      "Comparación detallada entre Flutter y React Native para ayudarte a elegir la mejor opción para tu proyecto móvil.",
    content: `
# Flutter vs React Native: ¿Cuál elegir en 2024?

La elección entre Flutter y React Native sigue siendo una de las decisiones más importantes al desarrollar aplicaciones móviles. Analicemos ambas opciones.

## Flutter: La Propuesta de Google

Flutter ofrece:
- **Rendimiento nativo**: Compilación directa a código nativo
- **UI consistente**: Misma apariencia en todas las plataformas
- **Hot reload**: Desarrollo rápido e iterativo

## React Native: La Solución de Meta

React Native destaca por:
- **Ecosistema maduro**: Gran cantidad de librerías disponibles
- **Reutilización de código web**: Aprovecha conocimientos de React
- **Comunidad activa**: Amplio soporte de la comunidad

## ¿Cuál elegir?

La decisión depende de varios factores:
- **Equipo**: ¿Conocen React o Dart?
- **Proyecto**: ¿Necesitas UI personalizada o estándar?
- **Tiempo**: ¿Qué tan rápido necesitas lanzar?

## Conclusión

Ambas son excelentes opciones. Flutter para proyectos que requieren UI altamente personalizada, React Native para equipos con experiencia en React.
    `,
    coverImage: "/flutter-vs-react-native.jpg",
    tags: ["Flutter", "React Native", "Mobile Development", "Comparison"],
    published: true,
    featured: true,
    readTime: 8,
  },
  {
    title: "Automatización de Procesos con n8n: Guía Completa",
    slug: "automatizacion-procesos-n8n-guia",
    excerpt:
      "Aprende a automatizar tus procesos empresariales utilizando n8n, la herramienta de automatización de código abierto.",
    content: `
# Automatización de Procesos con n8n: Guía Completa

n8n es una herramienta de automatización de flujos de trabajo que permite conectar diferentes servicios y automatizar tareas repetitivas.

## ¿Qué es n8n?

n8n es una plataforma de automatización que permite:
- **Conectar servicios**: Integra más de 200 aplicaciones
- **Flujos visuales**: Interfaz drag-and-drop intuitiva
- **Código abierto**: Totalmente gratuito y personalizable

## Casos de Uso Comunes

### 1. Automatización de Marketing
- Sincronizar leads entre CRM y email marketing
- Generar reportes automáticos
- Notificaciones de nuevos clientes

### 2. Gestión de Datos
- Backup automático de bases de datos
- Sincronización entre sistemas
- Procesamiento de archivos

### 3. Comunicación
- Notificaciones automáticas en Slack
- Envío de emails personalizados
- Integración con sistemas de tickets

## Primeros Pasos

1. **Instalación**: Docker, npm o cloud
2. **Configuración**: Setup inicial y credenciales
3. **Primer flujo**: Crear un workflow simple
4. **Testing**: Probar y depurar

## Conclusión

n8n democratiza la automatización, permitiendo a cualquier persona crear flujos de trabajo complejos sin necesidad de programar.
    `,
    coverImage: "/n8n-automation-workflow.jpg",
    tags: ["Automation", "n8n", "Workflow", "Business Process"],
    published: true,
    featured: false,
    readTime: 12,
  },
  {
    title: "TypeScript: Mejores Prácticas para Desarrolladores",
    slug: "typescript-mejores-practicas",
    excerpt: "Consejos y mejores prácticas para escribir código TypeScript limpio, mantenible y escalable.",
    content: `
# TypeScript: Mejores Prácticas para Desarrolladores

TypeScript ha revolucionado el desarrollo JavaScript. Aquí te comparto las mejores prácticas que he aprendido en mis proyectos.

## Configuración Estricta

Siempre usa configuración estricta en tu \`tsconfig.json\`:

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
\`\`\`

## Tipos vs Interfaces

### Cuándo usar Types
- Para uniones y primitivos
- Para computed types
- Para aliases simples

### Cuándo usar Interfaces
- Para objetos y clases
- Cuando necesites extensión
- Para definir contratos

## Utility Types

Aprovecha los utility types de TypeScript:
- \`Partial<T>\`: Hace todas las propiedades opcionales
- \`Required<T>\`: Hace todas las propiedades requeridas
- \`Pick<T, K>\`: Selecciona propiedades específicas
- \`Omit<T, K>\`: Excluye propiedades específicas

## Conclusión

TypeScript no es solo JavaScript con tipos, es una herramienta que mejora la calidad y mantenibilidad del código.
    `,
    coverImage: "/typescript-best-practices.jpg",
    tags: ["TypeScript", "JavaScript", "Programming", "Best Practices"],
    published: true,
    featured: false,
    readTime: 6,
  },
]

async function seedBlogPosts() {
  console.log("🌱 Seeding blog posts...")

  try {
    // Clear existing blog posts
    await prisma.blogPost.deleteMany()
    console.log("🗑️  Cleared existing blog posts")

    // Create new blog posts
    for (const post of blogPosts) {
      await prisma.blogPost.create({
        data: {
          ...post,
          publishedAt: post.published ? new Date() : null,
        },
      })
      console.log(`✅ Created blog post: ${post.title}`)
    }

    console.log("🎉 Blog posts seeded successfully!")
  } catch (error) {
    console.error("❌ Error seeding blog posts:", error)
  } finally {
    await prisma.$disconnect()
  }
}

seedBlogPosts()

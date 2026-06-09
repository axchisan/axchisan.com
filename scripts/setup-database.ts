import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function setupDatabase() {
  try {
    console.log("🚀 Setting up database...")

    // Create admin user
    const hashedPassword = await bcrypt.hash("***REMOVED***", 12)

    const admin = await prisma.user.upsert({
      where: { email: "axchisan923@gmail.com" },
      update: {},
      create: {
        email: "axchisan923@gmail.com",
        name: "Duvan Yair Arciniegas",
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    console.log("✅ Admin user created:", admin.email)

    // Create profile
    const profile = await prisma.profile.upsert({
      where: { id: "profile-1" },
      update: {},
      create: {
        id: "profile-1",
        name: "Duvan Yair Arciniegas - Axchi",
        title: "Desarrollador de Software",
        bio: "Soy un apasionado desarrollador de software, actualmente estudiante en el SENA. Me encanta la programación y creo soluciones tecnológicas innovadoras para diferentes negocios. En mis tiempos libres disfruto creando juegos y soy un gran apasionado por la música. Trabajo bajo el apodo Axchi, mi marca personal que representa innovación y creatividad en el desarrollo de software.",
        email: "axchisan923@gmail.com",
        phone: "3183038190",
        whatsapp: "3183038190",
        instagram: "@axchisan",
        github: "@axchisan",
      },
    })

    console.log("✅ Profile created:", profile.name)

    // Create skills
    const skills = [
      { name: "JavaScript", category: "Frontend", level: 9, color: "#F7DF1E" },
      { name: "React", category: "Frontend", level: 8, color: "#61DAFB" },
      { name: "PHP", category: "Backend", level: 7, color: "#777BB4" },
      { name: "Python", category: "Backend", level: 8, color: "#3776AB" },
      { name: "Flutter", category: "Mobile", level: 7, color: "#02569B" },
      { name: "Next.js", category: "Frontend", level: 8, color: "#000000" },
      { name: "TypeScript", category: "Frontend", level: 8, color: "#3178C6" },
      { name: "PostgreSQL", category: "Database", level: 7, color: "#336791" },
      { name: "Git", category: "Tools", level: 9, color: "#F05032" },
      { name: "n8n", category: "Automation", level: 6, color: "#EA4B71" },
    ]

    for (const skill of skills) {
      await prisma.skill.upsert({
        where: { name: skill.name },
        update: {},
        create: skill,
      })
    }

    console.log("✅ Skills created:", skills.length)

    // Create services
    const services = [
      {
        title: "Páginas Web",
        description: "Desarrollo de sitios web modernos y responsivos utilizando las últimas tecnologías web.",
        features: ["Diseño Responsivo", "SEO Optimizado", "Carga Rápida", "Fácil Mantenimiento"],
        order: 1,
      },
      {
        title: "Apps Multiplataforma",
        description: "Aplicaciones móviles para iOS y Android con Flutter y React Native.",
        features: ["iOS y Android", "UI/UX Moderno", "Rendimiento Óptimo", "Integración API"],
        order: 2,
      },
      {
        title: "Automatización",
        description: "Servicios de automatización para optimizar procesos de negocio.",
        features: ["Workflows Personalizados", "Integración de APIs", "Ahorro de Tiempo", "Escalabilidad"],
        order: 3,
      },
      {
        title: "Software Personalizado",
        description: "Soluciones de software a medida para necesidades específicas de tu negocio.",
        features: ["Desarrollo a Medida", "Arquitectura Escalable", "Soporte Técnico", "Documentación"],
        order: 4,
      },
    ]

    for (const service of services) {
      await prisma.service.upsert({
        where: { title: service.title },
        update: {},
        create: service,
      })
    }

    console.log("✅ Services created:", services.length)

    // Create sample projects
    const projects = [
      {
        title: "Sistema de Gestión de Tareas",
        description:
          "Una aplicación web completa para la gestión de tareas y proyectos con funcionalidades avanzadas de colaboración.",
        shortDesc: "App de gestión de tareas con colaboración en tiempo real",
        technologies: ["React", "Node.js", "PostgreSQL", "Socket.io"],
        category: "Web Application",
        status: "COMPLETED",
        featured: true,
        order: 1,
        images: ["/task-management-app.png"],
      },
      {
        title: "Dashboard de Automatización",
        description: "Panel de control para workflows de automatización empresarial con integración de múltiples APIs.",
        shortDesc: "Dashboard para automatización de procesos empresariales",
        technologies: ["Next.js", "TypeScript", "n8n", "PostgreSQL"],
        category: "Automation",
        status: "COMPLETED",
        featured: true,
        order: 2,
        images: ["/automation-workflow-dashboard.png"],
      },
      {
        title: "Portfolio Website Showcase",
        description: "Sitio web portfolio moderno con diseño futurista y animaciones interactivas.",
        shortDesc: "Portfolio personal con diseño futurista",
        technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
        category: "Website",
        status: "COMPLETED",
        featured: false,
        order: 3,
        images: ["/portfolio-website-showcase.png"],
      },
    ]

    for (const project of projects) {
      await prisma.project.upsert({
        where: { title: project.title },
        update: {},
        create: project as any,
      })
    }

    console.log("✅ Projects created:", projects.length)

    console.log("🎉 Database setup completed successfully!")
  } catch (error) {
    console.error("❌ Database setup failed:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()

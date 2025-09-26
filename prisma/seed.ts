import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@axchi.dev" },
    update: {},
    create: {
      email: "admin@axchi.dev",
      name: "Duvan Yair Arciniegas",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  // Create profile
  await prisma.profile.upsert({
    where: { id: "profile-1" },
    update: {},
    create: {
      id: "profile-1",
      name: "Duvan Yair Arciniegas - Axchi",
      title: "Desarrollador de Software",
      bio: "Soy un apasionado desarrollador de software, actualmente estudiante en el SENA. Me encanta la programación y creo soluciones tecnológicas innovadoras para diferentes negocios. En mis tiempos libres disfruto creando juegos y soy un gran apasionado por la música. Trabajo bajo el apodo Axchi, mi marca personal que representa innovación y creatividad en el desarrollo de software.",
      email: "contact@axchi.dev",
      phone: "3183038190",
      whatsapp: "3183038190",
      instagram: "@axchisan",
      github: "@axchisan",
    },
  })

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

  // Create interests as skills
  const interests = [
    { name: "Desarrollo de Juegos", category: "Intereses", level: 8, color: "#FF6B6B" },
    { name: "Apasionado por la Música", category: "Intereses", level: 9, color: "#4ECDC4" },
    { name: "Programación Creativa", category: "Intereses", level: 8, color: "#45B7D1" },
  ]

  for (const interest of interests) {
    await prisma.skill.upsert({
      where: { name: interest.name },
      update: {},
      create: interest,
    })
  }

  // Create site settings
  const settings = [
    { key: "site_title", value: "Axchi - Desarrollador de Software", type: "TEXT" },
    {
      key: "site_description",
      value:
        "Portafolio personal de Duvan Yair Arciniegas (Axchi) - Desarrollador de Software especializado en soluciones web, móviles y automatización.",
      type: "TEXT",
    },
    { key: "hero_title", value: "Innovación y Creatividad en Desarrollo de Software", type: "TEXT" },
    {
      key: "hero_subtitle",
      value: "Creo soluciones tecnológicas que transforman ideas en realidad digital",
      type: "TEXT",
    },
    { key: "contact_email", value: "contact@axchi.dev", type: "TEXT" },
    { key: "whatsapp_number", value: "3183038190", type: "TEXT" },
    { key: "whatsapp_message", value: "Conversemos sobre tu proyecto", type: "TEXT" },
  ]

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { config as loadEnv } from "dotenv"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

loadEnv({ path: process.env.ENV_FILE ?? ".env.local" })
loadEnv({ path: ".env" })

/**
 * Perfil, herramientas y capacidades.
 *
 * El seed original venía del scaffold y listaba diez tecnologías genéricas.
 * Esta lista sale de revisar lo que realmente aparece en los repositorios: si
 * una herramienta está aquí es porque hay código suyo en algún proyecto
 * terminado. Un portafolio que enumera lo que ha visto en un tutorial se nota.
 *
 * Este seed SÍ sobrescribe: es contenido de referencia, no editorial.
 */

let prisma: PrismaClient

const BIO =
  "Axchi Software Solutions desarrolla aplicaciones web y multiplataforma, automatización de procesos, " +
  "integraciones de IA e infraestructura. El estudio trabaja sobre el ciclo completo del sistema: modelo " +
  "de datos, APIs, cliente, pruebas, despliegue y operación. Duvan Yair Arciniegas es su fundador y " +
  "responsable técnico, con experiencia en DevOps, pipelines de CI/CD y automatización de flujos de trabajo."

/** Categoría → herramientas con las que hay código publicado. */
const HERRAMIENTAS: Record<string, string[]> = {
  Lenguajes: ["TypeScript", "Python", "Dart", "Java", "PHP", "GDScript", "SQL"],
  "Web y frontend": ["Next.js", "React", "Tailwind CSS", "Phaser 3", "Vite"],
  "Backend y APIs": ["Spring Boot", "FastAPI", "Node.js", "Flask", "NextAuth", "REST"],
  Móvil: ["Flutter", "Android"],
  "Datos": ["PostgreSQL", "Prisma", "Supabase", "Neon", "SQLAlchemy", "Flyway"],
  "Infraestructura": ["AWS Lambda", "S3 y CloudFront", "Terraform", "Docker", "Vercel", "Cloudflare R2"],
  "Automatización e IA": ["n8n", "API de Claude", "Playwright", "FFmpeg", "Microsoft Graph", "Azure DevOps"],
  "Práctica": ["Git", "GitHub Actions", "CI/CD", "Pruebas E2E", "Accesibilidad WCAG"],
}

/** Lo que puedo tomar completo, descrito para quien evalúa un perfil. */
const CAPACIDADES = [
  {
    title: "Aplicaciones web completas",
    description:
      "Diseño e implementación de APIs, autenticación, paneles de administración, pruebas y despliegue " +
      "para productos y operaciones digitales.",
    features: ["Next.js y React", "PostgreSQL con Prisma", "Autenticación", "Pruebas E2E", "SEO técnico"],
    order: 1,
  },
  {
    title: "Aplicaciones multiplataforma",
    description:
      "Aplicaciones en Flutter para web, Android y escritorio, con backend propio, modo sin conexión, " +
      "sincronización e integración con sistemas existentes.",
    features: ["Flutter", "Modo sin conexión", "Sincronización", "Integración con sistemas existentes"],
    order: 2,
  },
  {
    title: "Automatización de procesos",
    description:
      "Orquestación de procesos, integración de APIs y uso acotado de IA para reducir tareas manuales, " +
      "con trazabilidad, control de estados y recuperación ante fallos.",
    features: ["n8n", "Integración de APIs", "Agentes de IA", "Máquinas de estado"],
    order: 3,
  },
  {
    title: "Infraestructura y costos",
    description:
      "Arquitecturas serverless, infraestructura como código, contenedores y pipelines de CI/CD con " +
      "atención a costos, mantenibilidad y operación.",
    features: ["AWS Lambda", "Terraform", "Docker", "GitHub Actions", "Análisis de costos"],
    order: 4,
  },
]

async function main() {
  prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })

  await prisma.profile.upsert({
    where: { id: "profile-1" },
    update: { bio: BIO, title: "Fundador y responsable técnico" },
    create: {
      id: "profile-1",
      name: "Duvan Yair Arciniegas",
      title: "Fundador y responsable técnico",
      bio: BIO,
      email: "axchisan923@gmail.com",
      phone: "3183038190",
      whatsapp: "3183038190",
      instagram: "@axchisan",
      github: "@axchisan",
    },
  })
  console.log("✓ perfil")

  // Se parte de cero: la lista anterior mezclaba tecnologías con aficiones
  // ("Apasionado por la Música" figuraba como una habilidad técnica).
  await prisma.skill.deleteMany({})
  let orden = 0
  for (const [categoria, lista] of Object.entries(HERRAMIENTAS)) {
    for (const name of lista) {
      await prisma.skill.create({ data: { name, category: categoria, level: 8, order: orden++ } })
    }
    console.log(`✓ ${categoria}: ${lista.length}`)
  }

  for (const c of CAPACIDADES) {
    await prisma.service.upsert({
      where: { title: c.title },
      update: { description: c.description, features: c.features, order: c.order, isActive: true },
      create: { ...c, isActive: true },
    })
  }
  // Las cuatro entradas genéricas del scaffold ("Páginas Web", "Software
  // Personalizado"…) describían un catálogo de agencia, no un perfil.
  const retiradas = await prisma.service.deleteMany({
    where: { title: { notIn: CAPACIDADES.map((c) => c.title) } },
  })
  console.log(`✓ capacidades: ${CAPACIDADES.length} (retiradas ${retiradas.count} genéricas)`)

  console.log(`\nHerramientas: ${await prisma.skill.count()} · Proyectos: ${await prisma.project.count()}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma?.$disconnect()
  })

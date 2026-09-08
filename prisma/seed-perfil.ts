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
  "Desarrollador de software en Bogotá. Me interesa el punto donde una decisión técnica se convierte " +
  "en una consecuencia medible: cuánto cuesta operar un sistema al mes, cuánto tarda en arrancar en " +
  "frío, qué pasa cuando falla a la mitad. Trabajo de punta a punta —modelo de datos, API, cliente, " +
  "despliegue— en Flutter, Spring Boot, Next.js y Python, y escribo la decisión de arquitectura antes " +
  "que el código. Vengo de un año en una empresa de desarrollo en Bogotá haciendo DevOps, pipelines " +
  "de CI/CD e integración de agentes de IA sobre proyectos con clientes reales."

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
      "Del modelo de datos al despliegue: API, autenticación, panel de administración, pruebas y la " +
      "factura mensual. Este mismo sitio es un ejemplo — el código está publicado.",
    features: ["Next.js y React", "PostgreSQL con Prisma", "Autenticación", "Pruebas E2E", "SEO técnico"],
    order: 1,
  },
  {
    title: "Aplicaciones multiplataforma",
    description:
      "Un solo código para web, Android y escritorio con Flutter, con backend propio. Incluye los casos " +
      "incómodos: modo sin conexión, sincronización entre dispositivos e integración con sistemas que ya " +
      "están en producción y no se pueden cambiar.",
    features: ["Flutter", "Modo sin conexión", "Sincronización", "Integración con sistemas existentes"],
    order: 2,
  },
  {
    title: "Automatización de procesos",
    description:
      "Encontrar dónde una persona está haciendo de traductor entre dos sistemas y quitar ese paso. " +
      "Orquestación con n8n, integración de APIs y agentes de IA donde aportan, con las máquinas de " +
      "estado que hacen falta para que un fallo a mitad no deje el proceso roto.",
    features: ["n8n", "Integración de APIs", "Agentes de IA", "Máquinas de estado"],
    order: 3,
  },
  {
    title: "Infraestructura y costos",
    description:
      "Elegir arquitectura mirando la factura. Serverless con AWS Lambda, infraestructura como código con " +
      "Terraform, contenedores y pipelines de CI/CD. Un proyecto mío opera por 0,01 USD al mes, y no por " +
      "casualidad.",
    features: ["AWS Lambda", "Terraform", "Docker", "GitHub Actions", "Análisis de costos"],
    order: 4,
  },
]

async function main() {
  prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })

  await prisma.profile.upsert({
    where: { id: "profile-1" },
    update: { bio: BIO, title: "Desarrollador de software" },
    create: {
      id: "profile-1",
      name: "Duvan Yair Arciniegas",
      title: "Desarrollador de software",
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

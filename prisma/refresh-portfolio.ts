import { config as loadEnv } from "dotenv"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

// Actualización editorial explícita. Solo modifica los campos visibles de los
// casos existentes; no elimina proyectos, archivos ni métricas del panel.
loadEnv({ path: process.env.ENV_FILE ?? ".env.local" })
loadEnv({ path: ".env" })

const PROYECTOS = [
  {
    title: "Tecnobichos",
    category: "Automatización de contenido",
    shortDesc: "Sistema de producción y publicación de contenido audiovisual con orquestación de workflows, trazabilidad por estados y aprobación humana.",
    description: "Automatización de extremo a extremo para investigación de temas, generación de guiones y recursos, montaje de video y publicación en YouTube e Instagram. Diez workflows coordinan el proceso sobre una máquina de estados y conservan una revisión humana antes de la salida pública.",
  },
  {
    title: "Calculadora de Gastos",
    category: "Aplicación multiplataforma",
    shortDesc: "Aplicación de planificación financiera para web, Android y macOS, respaldada por una API Spring Boot sobre infraestructura serverless.",
    description: "Aplicación para gestionar presupuesto, gastos recurrentes, deudas y metas de ahorro. Flutter entrega tres clientes desde una base de código; Spring Boot, PostgreSQL y AWS Lambda conforman el backend e infraestructura documentados con Terraform.",
  },
  {
    title: "Quanta",
    category: "Plataforma educativa",
    shortDesc: "Plataforma interactiva de física y química con contenido asistido por IA, multijugador autoritativo y herramientas para creación de retos.",
    description: "Proyecto educativo desarrollado como monorepo TypeScript. Integra una PWA en Next.js, un motor de juego con Phaser, partidas respaldadas por servidor autoritativo y un gateway que desacopla los proveedores de modelos, imagen y voz.",
  },
  {
    title: "Gestión de inventario para ambientes de formación",
    category: "Sistema institucional",
    shortDesc: "Sistema para registrar inventario, préstamos y movimientos de equipos en ambientes de formación, con cliente móvil y API propia.",
    description: "Solución institucional para centralizar inventario y trazabilidad de préstamos. La aplicación Flutter permite verificar equipos en campo; FastAPI y PostgreSQL gestionan reglas de negocio, validación y persistencia.",
  },
  {
    title: "Beat 'em up 3D para Android en Godot",
    category: "Desarrollo interactivo",
    shortDesc: "Prototipo móvil de acción 3D que explora rendimiento gráfico, controles táctiles accesibles y diseño de interacción para Android.",
    description: "Proyecto desarrollado con Godot 4 para experimentar con renderizado 3D móvil, cel shading y controles táctiles. El foco técnico está en equilibrar rendimiento, respuesta de interacción y legibilidad visual dentro de las restricciones de un dispositivo móvil.",
  },
  {
    title: "Bitácoras SENA",
    category: "Automatización con IA",
    shortDesc: "Automatización que transforma tareas cerradas en Azure DevOps en bitácoras institucionales y archivos de seguimiento listos para revisión.",
    description: "Aplicación web que consulta work items de Azure DevOps, estructura sus descripciones para el formato institucional y genera archivos Excel. Integra FastAPI, PostgreSQL, Microsoft Graph y un modelo de IA para reducir trabajo repetitivo sin sustituir la revisión final.",
  },
  {
    title: "Fudoshin Ryu",
    category: "Sitio web para cliente",
    shortDesc: "Sitio institucional para una escuela de Shotokan Karate-Do con información de su linaje, propuesta y tres sedes en Santander.",
    description: "Sitio desarrollado para Fudoshin Ryu, escuela afiliada a la Japan Karate Association. Organiza información institucional, filosofía, sedes y canales de contacto con una experiencia sobria y mantenible para públicos no técnicos.",
  },
  {
    title: "Carnets virtuales para el SENA",
    category: "Sistema institucional",
    shortDesc: "Aplicación móvil de credenciales digitales con código de barras, uso sin conexión e interoperabilidad con el sistema de control de acceso.",
    description: "Aplicación Flutter para que aprendices generen su carnet virtual, registren equipos y se validen en el acceso. Comparte datos con una aplicación de escritorio en Java y mantiene el carnet disponible sin conexión para su uso en portería.",
  },
  {
    title: "El Rincón de ADSO",
    category: "Proyecto colaborativo",
    shortDesc: "Biblioteca digital de recursos de programación desarrollada en equipo, con catálogo, búsqueda y un entorno reproducible con Docker.",
    description: "Plataforma web para centralizar recursos de aprendizaje de programación e informática. El proyecto combinó PHP, PostgreSQL y Docker, con prácticas de coordinación y convenciones compartidas para un equipo de nueve integrantes.",
  },
  {
    title: "AgroBot",
    category: "Asistente informativo",
    shortDesc: "Asistente conversacional orientado a consultas agrícolas sobre siembra, plagas y planificación, diseñado para comunicar límites y orientar decisiones.",
    description: "Prototipo en Python y Flask que explora interfaces conversacionales para orientar a pequeños agricultores. La solución prioriza respuestas claras, contexto de uso y reconocimiento de límites en un dominio donde las recomendaciones requieren criterio especializado.",
  },
] as const

const BIO =
  "Axchi Software Solutions desarrolla aplicaciones web y multiplataforma, automatización de procesos, " +
  "integraciones de IA e infraestructura. El estudio trabaja sobre el ciclo completo del sistema: modelo " +
  "de datos, APIs, cliente, pruebas, despliegue y operación. Duvan Yair Arciniegas es su fundador y " +
  "responsable técnico, con experiencia en DevOps, pipelines de CI/CD y automatización de flujos de trabajo."

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("Falta DATABASE_URL")

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })
  try {
    await prisma.profile.updateMany({
      where: { id: "profile-1" },
      data: { title: "Fundador y responsable técnico", bio: BIO },
    })
    console.log("✓ Perfil profesional")

    for (const project of PROYECTOS) {
      const { title, ...data } = project
      const updated = await prisma.project.updateMany({ where: { title }, data })
      console.log(`${updated.count ? "✓" : "—"} ${title}`)
    }
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

import { config as loadEnv } from "dotenv"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

loadEnv({ path: process.env.ENV_FILE ?? ".env.local" })
loadEnv({ path: ".env" })

/** Igual que `slugify` de lib/utils, sin importar código de la app en un script. */
function aSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70)
}

async function main() {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })

  const proyectos = await prisma.project.findMany({ select: { id: true, title: true, slug: true } })
  const usados = new Set(proyectos.map((p) => p.slug).filter(Boolean) as string[])

  for (const p of proyectos) {
    if (p.slug) continue

    let slug = aSlug(p.title)
    // Colisión: dos títulos distintos pueden producir el mismo slug.
    if (usados.has(slug)) {
      let n = 2
      while (usados.has(`${slug}-${n}`)) n++
      slug = `${slug}-${n}`
    }
    usados.add(slug)

    await prisma.project.update({ where: { id: p.id }, data: { slug } })
    console.log(`  ${slug.padEnd(46)} ← ${p.title}`)
  }

  const sinSlug = await prisma.project.count({ where: { slug: null } })
  console.log(`\nProyectos sin slug: ${sinSlug}`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

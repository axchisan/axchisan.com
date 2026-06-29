import { prisma } from "@/lib/prisma"
import { SkillsClient } from "@/components/admin/skills-client"

export const dynamic = "force-dynamic"

export default async function AdminSkillsPage() {
  const skills = await prisma.skill
    .findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] })
    .catch(() => [])

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-[-0.02em]">Skills</h1>
      <p className="mt-1 text-sm text-muted">Tecnologías y capacidades que aparecen en /sobre.</p>
      <div className="mt-7 max-w-3xl">
        <SkillsClient initial={skills} />
      </div>
    </div>
  )
}

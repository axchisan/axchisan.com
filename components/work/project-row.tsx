import Link from "next/link"

export interface ProjectRowData {
  id: string
  slug: string | null
  title: string
  shortDesc: string | null
  description: string
  category: string | null
  technologies: string[]
}

/**
 * Un proyecto ocupa una fila a todo el ancho, separada de la siguiente por una
 * línea. Tres tarjetas iguales con la misma sombra es el kit por defecto y
 * obliga a que todo pese lo mismo; una fila deja que cada proyecto tenga el
 * espacio que merece.
 */
export function ProjectRow({ project }: { project: ProjectRowData }) {
  return (
    <article className="group relative border-t border-line py-8 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-[1.375rem] font-semibold tracking-[-0.02em]">
          <Link
            href={`/trabajo/${project.slug ?? project.id}`}
            className="rounded-[4px] transition-colors group-hover:text-accent"
          >
            {project.title}
            {/* El enlace cubre toda la fila sin anidar interactivos dentro. */}
            <span className="absolute inset-0" aria-hidden />
          </Link>
        </h3>
        {project.category && (
          <span className="text-[0.9375rem] text-faint">{project.category}</span>
        )}
      </div>

      <p className="measure mt-2 text-[1.0625rem] leading-relaxed text-graphite">
        {project.shortDesc ?? project.description}
      </p>

      {project.technologies.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-2">
          {project.technologies.slice(0, 8).map((t) => (
            <li
              key={t}
              className="rounded-[5px] border border-line bg-raised px-2 py-0.5 text-[0.8125rem] text-graphite"
            >
              {t}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

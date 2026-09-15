import Link from "next/link"
import { Check } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface Servicio {
  id: string
  icono: LucideIcon
  titulo: string
  gancho: string
  descripcion: string
  incluye: string[]
  /** Un dato duro de un proyecto real. Sin número, la tarjeta no lo muestra. */
  prueba?: { texto: string; href: string }
}

/**
 * Tarjeta de servicio. La anatomía viene de arriba abajo: qué es, para qué
 * sirve, qué incluye y la prueba de que ya se hizo.
 *
 * El enlace del final no lleva flecha pegada al texto: "Ver el caso" ya dice
 * a dónde va, y la flecha es uno de los gestos que delatan una plantilla.
 */
export function ServiceCard({ servicio }: { servicio: Servicio }) {
  const { icono: Icono, titulo, gancho, descripcion, incluye, prueba } = servicio

  return (
    <article
      id={servicio.id}
      className="flex scroll-mt-24 flex-col rounded-[16px] border border-line bg-card p-6 shadow-card sm:p-7"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-accent-weak text-accent-ink">
        <Icono className="h-5 w-5" aria-hidden />
      </span>

      <h3 className="mt-5 text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">{titulo}</h3>
      <p className="mt-1 text-[0.9375rem] text-accent-ink">{gancho}</p>

      <p className="mt-4 text-[0.9375rem] leading-relaxed text-mid">{descripcion}</p>

      <div className="mt-6 border-t border-line pt-5">
        <h4 className="text-[0.9375rem] font-semibold text-ink">Qué incluye</h4>
        <ul className="mt-3 space-y-2.5">
          {incluye.map((i) => (
            <li key={i} className="flex gap-2.5 text-[0.9375rem] leading-snug text-mid">
              <Check className="mt-[3px] h-4 w-4 shrink-0 text-accent-ink" aria-hidden />
              <span>{i}</span>
            </li>
          ))}
        </ul>
      </div>

      {prueba && (
        <p className="mt-6 border-t border-line pt-5 text-[0.9375rem] text-mid">
          Hecho en{" "}
          <Link href={prueba.href} className="link font-medium">
            {prueba.texto}
          </Link>
        </p>
      )}
    </article>
  )
}

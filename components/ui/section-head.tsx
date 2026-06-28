import Link from "next/link"
import { Reveal } from "@/components/ui/reveal"

export function SectionHead({
  title,
  meta,
  href,
  hrefLabel,
}: {
  title: string
  meta?: string
  href?: string
  hrefLabel?: string
}) {
  return (
    <Reveal>
      <div className="mb-9 flex items-end justify-between gap-5 border-b border-border pb-4">
        <h2 className="font-display text-[clamp(26px,3.4vw,38px)] font-semibold tracking-[-0.02em]">
          {title}
        </h2>
        {href ? (
          <Link href={href} className="mono-label shrink-0 text-accent transition-colors hover:text-text">
            {hrefLabel ?? "Ver todo"} →
          </Link>
        ) : meta ? (
          <span className="mono-label shrink-0">{meta}</span>
        ) : null}
      </div>
    </Reveal>
  )
}

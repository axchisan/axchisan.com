import { Reveal } from "@/components/ui/reveal"

export function PageHero({
  kicker,
  title,
  description,
}: {
  kicker: string
  title: string
  description?: string
}) {
  return (
    <section className="hero-glow relative overflow-hidden border-b border-border px-7 pb-14 pt-28 md:pt-32">
      <div className="relative z-[1] mx-auto max-w-6xl">
        <Reveal>
          <span className="mono-label text-accent">{kicker}</span>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="mt-5 max-w-[18ch] font-display text-[clamp(34px,6vw,64px)] font-bold leading-[1.0] tracking-[-0.03em]">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-[58ch] text-lg text-muted">{description}</p>
          </Reveal>
        )}
      </div>
    </section>
  )
}

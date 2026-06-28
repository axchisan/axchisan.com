import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/ui/reveal"

type Stat = { n: string; label: string }

export function Hero({ stats }: { stats: Stat[] }) {
  return (
    <section className="hero-glow relative overflow-hidden px-7 pb-24 pt-28 md:pt-36">
      <div className="relative z-[1] mx-auto max-w-6xl">
        <Reveal>
          <span className="mono-label text-accent">Studio de software · Bogotá, CO</span>
        </Reveal>

        <Reveal delay={0.06}>
          <h1 className="mt-6 max-w-[15ch] font-display text-[clamp(40px,7vw,82px)] font-bold leading-[0.98] tracking-[-0.035em]">
            Construimos software que se siente{" "}
            <span className="text-accent">extraordinario.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-7 max-w-[52ch] text-lg text-muted md:text-xl">
            Diseñamos, construimos y automatizamos productos digitales para clientes
            reales — desarrollo web, aplicaciones multiplataforma e integración de IA.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <Button href="/trabajo" size="lg">
              Ver trabajo →
            </Button>
            <Button href="/blog" variant="outline" size="lg">
              Leer el blog
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <dl className="mt-14 flex flex-wrap gap-x-12 gap-y-6 border-t border-border pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl font-semibold">{s.n}</dt>
                <dd className="mono-label mt-1">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}

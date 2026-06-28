import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/ui/reveal"

export function CtaSection() {
  return (
    <section className="px-7 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="hero-glow relative overflow-hidden rounded-3xl border border-border bg-surface px-8 py-16 text-center md:py-20">
            <div className="relative z-[1] mx-auto max-w-2xl">
              <span className="mono-label text-accent">¿Tienes una idea?</span>
              <h2 className="mt-5 font-display text-[clamp(28px,4.4vw,46px)] font-bold tracking-[-0.02em]">
                Construyamos algo que valga la pena.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted">
                Cuéntanos qué quieres lograr. Respondemos personalmente y sin rodeos.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                <Button href="/contacto" size="lg">
                  Hablemos →
                </Button>
                <Button
                  href="https://wa.me/573183038190?text=Conversemos%20sobre%20tu%20proyecto"
                  variant="outline"
                  size="lg"
                  target="_blank"
                >
                  WhatsApp directo
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

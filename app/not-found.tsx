import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1} className="hero-glow relative flex min-h-[70vh] items-center overflow-hidden px-7">
        <div className="relative z-[1] mx-auto max-w-2xl text-center">
          <span className="mono-label text-accent">Error 404</span>
          <h1 className="mt-5 font-display text-[clamp(56px,12vw,120px)] font-bold leading-none tracking-[-0.04em]">
            4<span className="text-accent">0</span>4
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg text-muted">
            Esta página no existe o se movió. Volvamos a algo que sí construimos.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <Button href="/" size="lg">Ir al inicio →</Button>
            <Button href="/trabajo" variant="outline" size="lg">Ver el trabajo</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

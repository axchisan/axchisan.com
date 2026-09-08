import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <>
      <Header />

      <main id="contenido" className="mx-auto max-w-5xl px-5 sm:px-8">
        <section className="enter py-24 sm:py-32">
          <h1>Esta página no existe</h1>
          <p className="measure mt-4 text-[1.0625rem] leading-relaxed text-graphite">
            Puede que el enlace esté mal escrito o que la página se haya movido. Desde aquí se llega a
            todo lo demás.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/">Ir al inicio</Button>
            <Button href="/trabajo" variant="outline">
              Ver el trabajo
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

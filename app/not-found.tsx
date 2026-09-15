import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Band } from "@/components/site/band"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <>
      <Header />

      <main id="contenido">
        <Band>
          <div className="enter py-28 sm:py-36">
            <h1 className="max-w-[18ch]">Esta página no existe</h1>
            <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-on-band-mid">
              Puede que el enlace esté mal escrito o que la página se haya movido. Desde aquí se llega
              a todo lo demás.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/">Ir al inicio</Button>
              <Button href="/trabajo" variant="outline-band">
                Ver el trabajo
              </Button>
            </div>
          </div>
        </Band>
      </main>

      <Footer />
    </>
  )
}

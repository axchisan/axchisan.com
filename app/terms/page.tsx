import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuroraBackground } from "@/components/aurora-background"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos de uso del sitio y portafolio de Axchi.",
  alternates: { canonical: "/terms" },
}

export default function TermsPage() {
  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <Header />
      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <article className="max-w-3xl mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Términos y <span className="text-gradient">Condiciones</span>
          </h1>
          <p className="text-muted-foreground mb-10">Última actualización: junio de 2026</p>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:tracking-tight prose-a:text-primary">
            <h2>1. Aceptación</h2>
            <p>
              Al acceder y utilizar este sitio web, portafolio personal de Duvan Yair Arciniegas (Axchi), aceptas estos
              términos y condiciones. Si no estás de acuerdo, te pedimos que no lo utilices.
            </p>

            <h2>2. Uso del sitio</h2>
            <p>
              Este sitio se ofrece con fines informativos y de presentación profesional. Te comprometes a utilizarlo de
              forma lícita y a no:
            </p>
            <ul>
              <li>Publicar comentarios ofensivos, ilegales, spam o que infrinjan derechos de terceros.</li>
              <li>Intentar acceder sin autorización a áreas restringidas o a datos de otros usuarios.</li>
              <li>Interferir con el funcionamiento normal del sitio.</li>
            </ul>

            <h2>3. Propiedad intelectual</h2>
            <p>
              Los proyectos, textos, diseños, código y elementos gráficos mostrados son propiedad de Axchi, salvo que
              se indique lo contrario. No está permitida su reproducción con fines comerciales sin autorización previa.
              El contenido que tú publiques (comentarios) sigue siendo tuyo, pero nos concedes permiso para mostrarlo en
              el sitio.
            </p>

            <h2>4. Cuentas de usuario</h2>
            <p>
              Eres responsable de mantener la confidencialidad de tu cuenta y contraseña, y de toda actividad realizada
              desde ella. Podemos suspender cuentas que incumplan estos términos.
            </p>

            <h2>5. Contenido y servicios</h2>
            <p>
              La información sobre servicios es una descripción general; cualquier colaboración o proyecto se acordará
              de forma individual. Las métricas mostradas son orientativas.
            </p>

            <h2>6. Limitación de responsabilidad</h2>
            <p>
              El sitio se ofrece "tal cual". No garantizamos que esté libre de errores o interrupciones, y no nos
              hacemos responsables de daños derivados de su uso. Los enlaces a sitios externos son responsabilidad de
              sus respectivos propietarios.
            </p>

            <h2>7. Cambios</h2>
            <p>
              Podemos modificar estos términos en cualquier momento. El uso continuado del sitio tras los cambios
              implica su aceptación.
            </p>

            <h2>8. Contacto</h2>
            <p>
              Para cualquier consulta sobre estos términos, utiliza la{" "}
              <Link href="/contact">página de contacto</Link>.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}

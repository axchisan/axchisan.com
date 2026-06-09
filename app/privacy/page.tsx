import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuroraBackground } from "@/components/aurora-background"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Cómo se recopilan, usan y protegen tus datos en el sitio de Axchi.",
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
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
            Política de <span className="text-gradient">Privacidad</span>
          </h1>
          <p className="text-muted-foreground mb-10">Última actualización: junio de 2026</p>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:tracking-tight prose-a:text-primary">
            <h2>1. Información que recopilamos</h2>
            <p>
              Este sitio es el portafolio personal de Duvan Yair Arciniegas (Axchi). Recopilamos únicamente los datos
              que tú nos proporcionas de forma voluntaria:
            </p>
            <ul>
              <li>
                <strong>Formulario de contacto:</strong> nombre, correo electrónico y el mensaje que envías.
              </li>
              <li>
                <strong>Cuenta de usuario:</strong> si te registras, tu nombre y correo electrónico, junto con una
                contraseña cifrada.
              </li>
              <li>
                <strong>Interacciones:</strong> comentarios, "me gusta" y elementos que guardas como favoritos.
              </li>
              <li>
                <strong>Datos técnicos anónimos:</strong> conteo de visitas a proyectos y artículos, sin identificarte
                personalmente.
              </li>
            </ul>

            <h2>2. Cómo usamos tu información</h2>
            <p>Utilizamos tus datos exclusivamente para:</p>
            <ul>
              <li>Responder a tus mensajes y solicitudes de contacto.</li>
              <li>Permitir tu participación (comentarios, favoritos) si tienes una cuenta.</li>
              <li>Entender de forma agregada qué contenido es más visitado para mejorar el sitio.</li>
            </ul>
            <p>No vendemos, alquilamos ni compartimos tu información personal con terceros con fines comerciales.</p>

            <h2>3. Cookies y sesión</h2>
            <p>
              Usamos cookies estrictamente necesarias para mantener tu sesión iniciada y recordar tu preferencia de
              tema (claro/oscuro). No utilizamos cookies de publicidad ni de seguimiento de terceros.
            </p>

            <h2>4. Seguridad</h2>
            <p>
              Las contraseñas se almacenan cifradas y la comunicación viaja sobre conexiones seguras (HTTPS). Aun así,
              ningún sistema es 100% infalible; nos comprometemos a aplicar medidas razonables para proteger tus datos.
            </p>

            <h2>5. Tus derechos</h2>
            <p>
              Puedes solicitar el acceso, la corrección o la eliminación de tus datos personales en cualquier momento
              escribiendo a través del{" "}
              <Link href="/contact">formulario de contacto</Link>. Atenderemos tu solicitud lo antes posible.
            </p>

            <h2>6. Cambios en esta política</h2>
            <p>
              Podemos actualizar esta política ocasionalmente. La fecha de "última actualización" indicará la versión
              vigente.
            </p>

            <h2>7. Contacto</h2>
            <p>
              Si tienes dudas sobre esta política, contáctanos a través de la{" "}
              <Link href="/contact">página de contacto</Link>.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}

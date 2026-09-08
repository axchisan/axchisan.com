import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { PROFILE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Privacidad",
  description:
    "Qué datos recoge axchisan.com, para qué se usan y cómo ejercer tus derechos sobre ellos.",
  alternates: { canonical: "/privacidad" },
}

const ACTUALIZADO = "8 de septiembre de 2026"

export default function PrivacidadPage() {
  return (
    <>
      <Header />

      <main id="contenido" className="mx-auto max-w-5xl px-5 sm:px-8">
        <header className="enter py-14 sm:py-16">
          <h1>Privacidad</h1>
          <p className="mt-3 text-[0.9375rem] text-faint">Actualizado el {ACTUALIZADO}</p>
        </header>

        <div className="prose border-t border-line pt-10 pb-4">
          <p>
            Este sitio es un portafolio personal. No vende nada, no tiene cuentas de usuario y no
            comparte datos con terceros con fines publicitarios. Aun así recoge dos cosas, y conviene
            que sepas cuáles.
          </p>

          <h2>Lo que envías tú</h2>
          <p>
            Si usas el formulario de contacto, se guardan el <strong>nombre</strong>, el{" "}
            <strong>correo</strong>, el <strong>asunto</strong> y el <strong>mensaje</strong> que
            escribas. Se usan para una sola cosa: responderte. Además se envía una copia por correo a
            la dirección de contacto de este sitio para no tardar en verlo.
          </p>
          <p>
            No se usan para boletines, no se ceden y no alimentan ninguna herramienta de marketing.
            Se conservan mientras la conversación tenga sentido; puedes pedir que se borren cuando
            quieras.
          </p>

          <h2>Lo que se registra solo</h2>
          <p>
            Para saber qué contenido interesa, se cuenta cada visita a la página de un proyecto o de
            un artículo. De cada visita se guardan la ruta, el navegador declarado y un{" "}
            <strong>identificador derivado de la dirección IP</strong>.
          </p>
          <p>
            Ese identificador es un hash SHA-256 con sal: no es la IP ni permite reconstruirla. Sirve
            únicamente para no contar diez veces a la misma persona. No hay perfiles, ni seguimiento
            entre sitios, ni cookies de terceros.
          </p>

          <h2>Almacenamiento en tu navegador</h2>
          <p>Este sitio guarda dos cosas en tu navegador, ninguna de ellas identificativa:</p>
          <ul>
            <li>
              <strong>Tu preferencia de tema</strong> (claro u oscuro), para no volver a preguntarte.
            </li>
            <li>
              Una marca temporal que evita contar dos veces la misma visita mientras la pestaña sigue
              abierta.
            </li>
          </ul>
          <p>
            Hay además una cookie de sesión, pero solo se crea al entrar al panel de administración,
            al que solo tengo acceso yo.
          </p>

          <h2>Dónde viven los datos</h2>
          <p>
            La base de datos está en <strong>Neon</strong> (PostgreSQL, región Este de Estados
            Unidos), el sitio se sirve desde <strong>Vercel</strong>, los archivos desde{" "}
            <strong>Cloudflare R2</strong> y los avisos de contacto se envían con{" "}
            <strong>Resend</strong>. Todos actúan como proveedores de infraestructura: procesan los
            datos para que el sitio funcione, no para su propio uso.
          </p>

          <h2>Tus derechos</h2>
          <p>
            Puedes pedir en cualquier momento saber qué datos tuyos hay, corregirlos o eliminarlos.
            Escribe a{" "}
            <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a> y se resuelve. No hace falta
            justificar el motivo.
          </p>
          <p>
            Conforme a la Ley 1581 de 2012 de Colombia sobre protección de datos personales, el
            responsable del tratamiento es {PROFILE.name}, en {PROFILE.location}.
          </p>

          <h2>Cambios</h2>
          <p>
            Si esto cambia, cambia también la fecha del principio. El historial completo de
            modificaciones está en{" "}
            <a href="https://github.com/axchisan/axchisan.com" target="_blank" rel="noreferrer noopener">
              el repositorio del sitio
            </a>
            , que es público.
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}

import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Body, PageBand } from "@/components/site/band"
import { Footer } from "@/components/site/footer"
import { LEGAL_NAME, PROFILE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Privacidad",
  description:
    "Qué datos recoge axchisan.com, para qué se usan y cómo ejercer tus derechos sobre ellos.",
  alternates: { canonical: "/privacidad" },
}

const ACTUALIZADO = "24 de septiembre de 2026"

export default function PrivacidadPage() {
  return (
    <>
      <Header />

      <main id="contenido">
        <PageBand titulo="Privacidad" entradilla={`Actualizado el ${ACTUALIZADO}`} />

        <Body>
        <div className="prose">
          <p>
            Este sitio presenta servicios de desarrollo de software. No cobra en línea, no tiene
            cuentas de usuario, no usa cookies de seguimiento y no comparte datos con terceros con
            fines publicitarios. Aun así recoge dos cosas, y conviene que sepas cuáles.
          </p>

          <h2>Lo que envías tú</h2>
          <p>
            Si pides una cotización, se guardan tu <strong>nombre</strong>, tu{" "}
            <strong>WhatsApp</strong> o tu <strong>correo</strong>, el tipo de negocio, lo que
            necesitas, el presupuesto y el plazo que elijas, y el <strong>mensaje</strong> que
            escribas. Además se envía una copia por correo a la dirección de contacto de este sitio
            para no tardar en verlo. Si escribes por WhatsApp, la conversación queda en WhatsApp.
          </p>
          <p>
            Se usan para responderte y, si el proyecto avanza, para el intercambio propio de un
            encargo. No se usan para boletines, no se ceden y no alimentan ninguna herramienta de
            marketing. Se conservan mientras la relación tenga sentido; puedes pedir que se borren
            cuando quieras.
          </p>

          <h2>Lo que se registra solo</h2>
          <p>
            Para saber qué páginas y demos terminan en un contacto, se cuentan las visitas a cada
            página, las veces que se abre una demo y los toques en los botones de WhatsApp. De cada visita se guardan la ruta, el navegador declarado y un{" "}
            <strong>identificador derivado de la dirección IP</strong>.
          </p>
          <p>
            Ese identificador es un hash SHA-256 con sal: no es la IP ni permite reconstruirla. Sirve
            únicamente para no contar diez veces a la misma persona. No hay perfiles, ni seguimiento
            entre sitios, ni cookies de terceros.
          </p>

          <h2>Almacenamiento en tu navegador</h2>
          <p>Este sitio guarda en tu navegador, y solo ahí:</p>
          <ul>
            <li>
              Una marca que evita contar dos veces la misma página mientras la pestaña sigue abierta.
              Se borra sola al cerrarla.
            </li>
            <li>
              <strong>Lo que hagas en las demos.</strong> Las demos son negocios ficticios: las citas,
              mascotas o pedidos que registres se guardan únicamente en tu navegador para que la
              demo funcione, nunca se envían a ningún servidor, y se borran con el botón «Restablecer»
              o al limpiar los datos del sitio.
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
            responsable del tratamiento es {PROFILE.name}, que opera bajo el nombre comercial{" "}
            {LEGAL_NAME}, con domicilio en {PROFILE.location}.
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
        </Body>
      </main>

      <Footer />
    </>
  )
}

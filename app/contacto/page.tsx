import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Body, PageBand } from "@/components/site/band"
import { Footer } from "@/components/site/footer"
import { ContactForm } from "@/components/contact/contact-form"
import { getProfile } from "@/lib/data"
import { PROFILE, WHATSAPP, whatsappUrl } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacto profesional para proyectos de desarrollo de software, automatización, integraciones e infraestructura.",
  alternates: { canonical: "/contacto" },
}

export const dynamic = "force-dynamic"

export default async function ContactoPage() {
  const profile = await getProfile()
  const email = profile?.email ?? PROFILE.email

  return (
    <>
      <Header />

      <main id="contenido">
        <PageBand
          titulo="Contacto"
          entradilla="Comparte el contexto, los objetivos y las restricciones de tu proyecto. Axchi revisará la información y responderá con una primera orientación técnica."
        />

        <Body>
        <div id="agendar" className="grid scroll-mt-24 gap-12 lg:grid-cols-[1fr_19rem] lg:gap-16">
          <section>
            <h2 className="sr-only">Formulario de contacto</h2>
            <ContactForm />
          </section>

          {/* Raíl de metadatos: los canales directos, para quien prefiere no
              rellenar un formulario. */}
          <aside className="rounded-[16px] border border-line bg-card p-6 shadow-card">
            <h2 className="text-[1.0625rem] font-semibold text-ink">Contacto directo</h2>
            <dl className="mt-4 space-y-5 text-[0.9375rem]">
              <div>
                <dt className="text-faint">Correo</dt>
                <dd className="mt-0.5">
                  <a href={`mailto:${email}`} className="link break-all">
                    {email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-faint">WhatsApp</dt>
                <dd className="mt-0.5">
                  <a
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link"
                  >
                    {WHATSAPP.visible}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-faint">LinkedIn</dt>
                <dd className="mt-0.5">
                  <a href={PROFILE.linkedin} target="_blank" rel="noreferrer noopener" className="link">
                    Duvan Yair Arciniegas
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-faint">Ubicación</dt>
                <dd className="mt-0.5 text-mid">{PROFILE.location}</dd>
              </div>
            </dl>
          </aside>
        </div>
        </Body>
      </main>

      <Footer />
    </>
  )
}

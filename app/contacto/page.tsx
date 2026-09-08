import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { ContactForm } from "@/components/contact/contact-form"
import { getProfile } from "@/lib/data"
import { PROFILE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbeme si buscas a alguien que se haga cargo de un sistema completo. Respondo a todos los mensajes.",
  alternates: { canonical: "/contacto" },
}

export const dynamic = "force-dynamic"

export default async function ContactoPage() {
  const profile = await getProfile()
  const email = profile?.email ?? PROFILE.email
  const whatsapp = (profile?.whatsapp ?? "3183038190").replace(/\D/g, "")

  return (
    <>
      <Header />

      <main id="contenido" className="mx-auto max-w-5xl px-5 sm:px-8">
        <header className="enter py-14 sm:py-16">
          <h1>Contacto</h1>
          <p className="measure mt-4 text-[1.0625rem] leading-relaxed text-graphite">
            Estoy buscando equipo. Si tienes una vacante, un proyecto o simplemente quieres
            preguntarme algo sobre alguno de estos sistemas, escríbeme: respondo a todos los mensajes.
          </p>
        </header>

        <div className="grid gap-12 border-t border-line pt-10 lg:grid-cols-[1fr_18rem] lg:gap-16">
          <section>
            <h2 className="sr-only">Formulario de contacto</h2>
            <ContactForm />
          </section>

          {/* Raíl de metadatos: los canales directos, para quien prefiere no
              rellenar un formulario. */}
          <aside className="lg:border-l lg:border-line lg:pl-8">
            <h2 className="text-[0.9375rem] font-medium text-faint">Directo</h2>
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
                    href={`https://wa.me/57${whatsapp}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link"
                  >
                    +57 {whatsapp}
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
                <dd className="mt-0.5 text-graphite">{PROFILE.location}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  )
}

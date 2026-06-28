import type { Metadata } from "next"
import { Mail, MessageCircle, MapPin } from "lucide-react"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { PageHero } from "@/components/site/page-hero"
import { ContactForm } from "@/components/contact/contact-form"
import { getProfile } from "@/lib/data"

export const metadata: Metadata = {
  title: "Contacto",
  description: "Hablemos sobre tu proyecto. Escríbenos por el formulario, email o WhatsApp.",
}

export default async function ContactoPage() {
  const profile = await getProfile()
  const email = profile?.email ?? "axchisan923@gmail.com"
  const whatsapp = (profile?.whatsapp ?? "3183038190").replace(/\D/g, "")

  return (
    <>
      <Header />
      <main>
        <PageHero
          kicker="Contacto"
          title="Conversemos sobre tu proyecto"
          description="Cuéntanos qué quieres construir. Respondemos personalmente, normalmente el mismo día."
        />

        <section className="px-7 py-14">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div className="flex flex-col gap-4">
              <a href={`mailto:${email}`} className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-strong">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-accent"><Mail className="h-5 w-5" /></span>
                <span><span className="mono-label block">Email</span><span className="text-text">{email}</span></span>
              </a>
              <a href={`https://wa.me/57${whatsapp}?text=Conversemos%20sobre%20mi%20proyecto`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-strong">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-accent"><MessageCircle className="h-5 w-5" /></span>
                <span><span className="mono-label block">WhatsApp</span><span className="text-text">+57 {whatsapp}</span></span>
              </a>
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-accent"><MapPin className="h-5 w-5" /></span>
                <span><span className="mono-label block">Ubicación</span><span className="text-text">Bogotá, Colombia</span></span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-7">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

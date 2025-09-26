import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackgroundEffects } from "@/components/background-effects"
import { PageTransition } from "@/components/page-transition"
import { ContactHero } from "@/components/contact/contact-hero"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"

export const metadata = {
  title: "Contacto - Axchi",
  description: "Ponte en contacto conmigo para discutir tu próximo proyecto de desarrollo de software.",
}

export default function ContactPage() {
  return (
    <div className="relative min-h-screen">
      <BackgroundEffects />
      <Header />

      <PageTransition>
        <main className="relative z-10 pt-16">
          <ContactHero />
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                <ContactForm />
                <ContactInfo />
              </div>
            </div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  )
}

import type { Metadata, Viewport } from "next"
import { Instrument_Sans, JetBrains_Mono } from "next/font/google"
import { Toaster } from "sonner"
import { Medicion } from "@/components/medicion"
import "./globals.css"
import { LEGAL_NAME, PROFILE, SITE_NAME, SITE_URL, WHATSAPP } from "@/lib/site"

// Una sola familia para todo el sitio. Ver DESIGN.md.
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
})

// Solo donde hay código o un dato numérico real. Nunca como etiqueta decorativa.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
})

const DESCRIPTION =
  "Axchi desarrolla aplicaciones, automatizaciones e integraciones de IA para " +
  "operaciones y productos digitales. Casos de estudio y tecnología para revisar."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Soluciones de software`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  // Los iconos salen de `app/icon.svg`, `app/favicon.ico` y `app/apple-icon.png`,
  // que Next enlaza solo. Todos se generan desde el logo con `npm run iconos`.
  keywords: [
    "desarrollo de software a medida",
    "desarrollo de software Bogotá",
    "automatización de procesos",
    "integración de IA",
    "empresa de desarrollo de software Colombia",
    "desarrollador de software",
    "Bogotá",
    "Colombia",
    "Flutter",
    "Spring Boot",
    "Next.js",
    "Python",
    "AWS",
    "automatización",
    "Axchi Software Solutions",
  ],
  authors: [{ name: PROFILE.name, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Soluciones de software`,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${SITE_NAME} — páginas web, tiendas y sistemas para tu negocio` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Soluciones de software`,
    description: DESCRIPTION,
    images: ["/og.png"],
    creator: "@axchisan",
  },
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  // Un valor por esquema: la barra del navegador debe seguir al tema.
  themeColor: "#0b0f14",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      // Next 16 exige declararlo para no aplicar el scroll suave a los cambios
      // de ruta, donde produce un salto largo en lugar de una navegación.
      data-scroll-behavior="smooth"
      className={`${instrumentSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-paper text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              // El sitio ofrece servicios: ProfessionalService describe la
              // oferta, y el fundador queda enlazado dentro.
              "@type": "ProfessionalService",
              name: SITE_NAME,
              legalName: LEGAL_NAME,
              founder: { "@type": "Person", name: PROFILE.name },
              areaServed: ["CO", "Remoto"],
              priceRange: "$$",
              description: DESCRIPTION,
              url: SITE_URL,
              email: PROFILE.email,
              telephone: `+${WHATSAPP.e164}`,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bogotá",
                addressCountry: "CO",
              },
              knowsAbout: [
                "Desarrollo de software",
                "Flutter",
                "Spring Boot",
                "Next.js",
                "Python",
                "AWS",
                "DevOps",
                "Automatización de procesos",
              ],
              sameAs: [PROFILE.github, PROFILE.instagram, PROFILE.linkedin],
            }),
          }}
        />
        {children}
        <Medicion />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--card)",
              border: "1px solid var(--line)",
              color: "var(--ink)",
            },
          }}
        />
      </body>
    </html>
  )
}

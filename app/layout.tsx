import type { Metadata, Viewport } from "next"
import { Instrument_Sans, JetBrains_Mono } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"
import { PROFILE, SITE_NAME, SITE_URL } from "@/lib/site"

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
  "Desarrollo de software a medida, automatización e integración de IA para empresas en Bogotá y " +
  "en remoto. Aplicaciones web y multiplataforma, con alcance y precio cerrados antes de empezar."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Desarrollo de software a medida en Bogotá`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  // Iconos y tarjeta social como archivos estáticos en lugar de generarlos con
  // next/og en cada petición: son imágenes que nunca cambian, y su motor de
  // render en WASM costaba 0,6 MB del presupuesto del Worker.
  icons: {
    icon: [{ url: "/favicon-64.png", type: "image/png", sizes: "64x64" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  keywords: [
    "desarrollo de software a medida",
    "desarrollo de software Bogotá",
    "automatización de procesos",
    "integración de IA",
    "desarrollador freelance Colombia",
    "desarrollador de software",
    "Bogotá",
    "Colombia",
    "Flutter",
    "Spring Boot",
    "Next.js",
    "Python",
    "AWS",
    "automatización",
    "Duvan Yair Arciniegas",
    "Axchi",
  ],
  authors: [{ name: PROFILE.name, url: SITE_URL }],
  creator: PROFILE.name,
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Desarrollo de software a medida`,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${SITE_NAME} — software a medida para empresas` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Desarrollo de software a medida`,
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
              founder: { "@type": "Person", name: PROFILE.name },
              areaServed: ["CO", "Remoto"],
              priceRange: "$$",
              description: DESCRIPTION,
              url: SITE_URL,
              email: PROFILE.email,
              telephone: "+573183038190",
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

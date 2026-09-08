import type { Metadata, Viewport } from "next"
import { Instrument_Sans, JetBrains_Mono } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"
import { PROFILE, SITE_NAME, SITE_URL } from "@/lib/site"
import { ThemeProvider } from "@/components/theme-provider"

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
  "Desarrollador de software en Bogotá. Construyo sistemas completos: canales de contenido " +
  "automatizados, apps multiplataforma sobre infraestructura serverless y juegos con multijugador " +
  "autoritativo. Flutter, Spring Boot, Next.js, Python."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Desarrollador de software`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  keywords: [
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
    type: "profile",
    locale: "es_CO",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Desarrollador de software`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Desarrollador de software`,
    description: DESCRIPTION,
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfd" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1013" },
  ],
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
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-paper text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              // Persona, no empresa: el sitio es un portafolio profesional.
              "@type": "Person",
              name: PROFILE.name,
              alternateName: PROFILE.alias,
              jobTitle: PROFILE.role,
              description: DESCRIPTION,
              url: SITE_URL,
              email: PROFILE.email,
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
        <ThemeProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--raised)",
                border: "1px solid var(--line)",
                color: "var(--ink)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}

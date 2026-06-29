import type { Metadata, Viewport } from "next"
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"
import { SITE_URL } from "@/lib/site"

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Axchi Studio — Software que se siente extraordinario",
    template: "%s · Axchi Studio",
  },
  description:
    "Studio de ingeniería de software en Bogotá. Diseñamos, construimos y automatizamos productos digitales para clientes reales: web, multiplataforma e IA.",
  alternates: { canonical: "/" },
  keywords: [
    "studio de software",
    "desarrollo web",
    "apps multiplataforma",
    "automatización",
    "IA",
    "Next.js",
    "Flutter",
    "Bogotá",
    "Axchi",
  ],
  authors: [{ name: "Duvan Yair Arciniegas", url: SITE_URL }],
  creator: "Axchi Studio",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: "Axchi Studio",
    title: "Axchi Studio — Software que se siente extraordinario",
    description:
      "Studio de ingeniería de software en Bogotá. Web, multiplataforma, automatización e IA para clientes reales.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Axchi Studio",
    description:
      "Software que se siente extraordinario. Web · Multiplataforma · Automatización · IA.",
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
  themeColor: "#0A0B0D",
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-bg text-text">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Axchi Studio",
              description:
                "Studio de ingeniería de software en Bogotá: desarrollo web, aplicaciones multiplataforma, automatización e integración de IA.",
              url: SITE_URL,
              email: "axchisan923@gmail.com",
              telephone: "+573183038190",
              areaServed: "Worldwide",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bogotá",
                addressCountry: "CO",
              },
              founder: {
                "@type": "Person",
                name: "Duvan Yair Arciniegas",
                alternateName: "Axchi",
              },
              sameAs: [
                "https://github.com/axchisan",
                "https://www.instagram.com/axchisan",
                "https://www.linkedin.com/in/duvan-yair-arciniegas-gerena-535690339",
              ],
            }),
          }}
        />
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            },
          }}
        />
      </body>
    </html>
  )
}

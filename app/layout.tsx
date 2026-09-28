import type { Metadata, Viewport } from "next"
import { Instrument_Sans, JetBrains_Mono } from "next/font/google"
import { Toaster } from "sonner"
import { Medicion } from "@/components/medicion"
import "./globals.css"
import { PRECIO_ENTRADA, pesos } from "@/lib/catalogo/planes"
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

// Es lo que se lee al compartir el enlace: dice qué se vende, a quién y desde
// cuánto, y por qué creerlo (las demos).
const TITULO = `${SITE_NAME} | Páginas web, tiendas y sistemas para negocios en Colombia`
const DESCRIPTION =
  "Páginas web, tiendas en línea y sistemas de citas, pedidos e inventario para negocios en " +
  `Colombia. Prueba las demos funcionando por sector antes de contratar. Desde ${pesos(PRECIO_ENTRADA)}.`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITULO,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  // Los iconos salen de `app/icon.svg`, `app/favicon.ico` y `app/apple-icon.png`,
  // que Next enlaza solo. Todos se generan desde el logo con `npm run iconos`.
  keywords: [
    "página web para negocio",
    "cuánto cuesta una página web en Colombia",
    "tienda en línea Colombia",
    "sistema de citas en línea",
    "software de inventario para pymes",
    "página web por mensualidad",
    "desarrollo de software a medida",
    "Bogotá",
    "Colombia",
  ],
  authors: [{ name: PROFILE.name, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITULO,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Axchi: páginas web, tiendas y sistemas para tu negocio, desde $ 300.000" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPTION,
    images: ["/og.png"],
    creator: "@axchisan",
  },
  category: "business",
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
                "Páginas web para negocios",
                "Tiendas en línea",
                "Sistemas de citas y reservas",
                "Inventario y punto de venta",
                "Pedidos en línea para restaurantes",
                "Desarrollo de software a medida",
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

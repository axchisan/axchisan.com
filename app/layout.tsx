import type { Metadata } from "next"
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google"
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
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-bg text-text">{children}</body>
    </html>
  )
}

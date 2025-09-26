import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "Cascadia Code", "Source Code Pro", "Menlo", "Consolas", "DejaVu Sans Mono", "monospace"],
})

export const metadata: Metadata = {
  title: "Axchi - Desarrollador de Software",
  description:
    "Portafolio personal de Duvan Yair Arciniegas (Axchi) - Desarrollador de Software especializado en soluciones web, móviles y automatización.",
  keywords: ["desarrollador", "software", "web", "móvil", "automatización", "axchi", "programador"],
  authors: [{ name: "Duvan Yair Arciniegas", url: "https://axchi.dev" }],
  creator: "Axchi",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://axchi.dev",
    title: "Axchi - Desarrollador de Software",
    description:
      "Portafolio personal de Duvan Yair Arciniegas (Axchi) - Desarrollador de Software especializado en soluciones web, móviles y automatización.",
    siteName: "Axchi Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Axchi - Desarrollador de Software",
    description:
      "Portafolio personal de Duvan Yair Arciniegas (Axchi) - Desarrollador de Software especializado en soluciones web, móviles y automatización.",
    creator: "@axchisan",
  },
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
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">{children}</div>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

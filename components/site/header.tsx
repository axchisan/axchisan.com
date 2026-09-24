"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, MessageCircle, X } from "lucide-react"
import { MENSAJE_WHATSAPP, whatsappUrl } from "@/lib/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "./logo"

const RUTAS = [
  { href: "/soluciones", label: "Soluciones" },
  { href: "/planes", label: "Planes y precios" },
  { href: "/proceso", label: "Proceso" },
  { href: "/a-medida", label: "A medida" },
  { href: "/empresa", label: "Sobre Axchi" },
]

/**
 * La cabecera vive siempre sobre la banda oscura, también en las páginas cuyo
 * encabezado es corto. Mantenerla constante evita que el logo cambie de color
 * al hacer scroll, que es donde este patrón suele romperse.
 */
export function Header() {
  const pathname = usePathname()
  // El menú recuerda en qué ruta se abrió: al navegar deja de coincidir y se
  // cierra solo, sin un efecto que lo sincronice.
  const [abiertoEn, setAbiertoEn] = useState<string | null>(null)
  const abierto = abiertoEn === pathname

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [abierto])

  const activa = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 bg-band/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="rounded-[4px] text-on-band" aria-label="Axchi, ir al inicio">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {RUTAS.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              aria-current={activa(r.href) ? "page" : undefined}
              className={cn(
                "rounded-[6px] px-3 py-2 text-[0.9375rem] transition-colors",
                activa(r.href) ? "text-accent" : "text-on-band-mid hover:text-on-band",
              )}
            >
              {r.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Button href={whatsappUrl(MENSAJE_WHATSAPP)} variant="outline-band" size="sm" target="_blank" rel="noreferrer noopener">
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </Button>
          <Button href="/cotizar" size="sm">
            Cotizar
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setAbiertoEn(abierto ? null : pathname)}
          className="flex h-10 w-10 items-center justify-center rounded-[8px] text-on-band-mid transition-colors hover:bg-band-2 hover:text-on-band lg:hidden"
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        >
          {abierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {abierto && (
        <nav
          id="menu-movil"
          aria-label="Principal"
          className="border-t border-band-line bg-band px-5 pb-6 pt-3 lg:hidden"
        >
          {RUTAS.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              aria-current={activa(r.href) ? "page" : undefined}
              className={cn(
                "block rounded-[6px] px-2 py-3 text-base transition-colors",
                activa(r.href) ? "text-accent" : "text-on-band-mid",
              )}
            >
              {r.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2.5">
            <Button href="/cotizar">Cotizar</Button>
            <Button href={whatsappUrl(MENSAJE_WHATSAPP)} variant="outline-band" target="_blank" rel="noreferrer noopener">
              <MessageCircle className="h-4 w-4" aria-hidden />
              Escribir por WhatsApp
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}

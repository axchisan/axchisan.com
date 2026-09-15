"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "./logo"

const RUTAS = [
  { href: "/servicios", label: "Servicios" },
  { href: "/trabajo", label: "Trabajo" },
  { href: "/proceso", label: "Cómo trabajo" },
  { href: "/blog", label: "Ideas" },
  { href: "/sobre", label: "Quién está detrás" },
]

/**
 * La cabecera vive siempre sobre la banda oscura, también en las páginas cuyo
 * encabezado es corto. Mantenerla constante evita que el logo cambie de color
 * al hacer scroll, que es donde este patrón suele romperse.
 */
export function Header() {
  const pathname = usePathname()
  const [abierto, setAbierto] = useState(false)

  useEffect(() => setAbierto(false), [pathname])

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
          <Button href="/contacto" variant="outline-band" size="sm">
            Escríbeme
          </Button>
          <Button href="/contacto#agendar" size="sm">
            Hablemos de tu proyecto
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
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
            <Button href="/contacto#agendar">Hablemos de tu proyecto</Button>
            <Button href="/contacto" variant="outline-band">
              Escríbeme
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}

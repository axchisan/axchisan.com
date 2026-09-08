"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"

const RUTAS = [
  { href: "/trabajo", label: "Trabajo" },
  { href: "/blog", label: "Escritos" },
  { href: "/servicios", label: "Qué hago" },
  { href: "/sobre", label: "Sobre mí" },
  { href: "/contacto", label: "Contacto" },
]

export function Header() {
  const pathname = usePathname()
  const [abierto, setAbierto] = useState(false)

  // Navegar cierra el menú: si no, la ruta cambia detrás de un panel abierto.
  useEffect(() => setAbierto(false), [pathname])

  // Con el menú desplegado el fondo no debe desplazarse.
  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [abierto])

  const activa = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="rounded-[4px] text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink"
        >
          Duvan Arciniegas
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {RUTAS.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              aria-current={activa(r.href) ? "page" : undefined}
              className={cn(
                "rounded-[6px] px-2.5 py-1.5 text-[0.9375rem] transition-colors",
                activa(r.href) ? "text-ink" : "text-graphite hover:text-ink",
              )}
            >
              {r.label}
            </Link>
          ))}
          <span className="mx-1 h-4 w-px bg-line" />
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-[8px] text-graphite transition-colors hover:bg-raised hover:text-ink"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          >
            {abierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {abierto && (
        <nav
          id="menu-movil"
          aria-label="Principal"
          className="border-t border-line bg-paper px-5 pb-4 pt-2 md:hidden"
        >
          {RUTAS.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              aria-current={activa(r.href) ? "page" : undefined}
              className={cn(
                "block rounded-[6px] px-2 py-2.5 text-base transition-colors",
                activa(r.href) ? "text-ink" : "text-graphite",
              )}
            >
              {r.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}

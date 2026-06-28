"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/servicios", label: "Servicios" },
  { href: "/trabajo", label: "Trabajo" },
  { href: "/blog", label: "Blog" },
  { href: "/sobre", label: "Studio" },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/72 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-7">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-[-0.02em]">
          <span className="inline-block h-[9px] w-[9px] rounded-[2px] bg-accent" />
          axchi<span className="font-normal text-muted">/studio</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="/contacto" size="sm">
            Hablemos
          </Button>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menú móvil */}
      <div
        className={cn(
          "overflow-hidden border-t border-border transition-[max-height] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] md:hidden",
          open ? "max-h-80" : "max-h-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-7 py-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base text-muted transition-colors hover:bg-surface-2 hover:text-text"
            >
              {item.label}
            </Link>
          ))}
          <Button href="/contacto" className="mt-2" onClick={() => setOpen(false)}>
            Hablemos
          </Button>
        </nav>
      </div>
    </header>
  )
}

import Link from "next/link"
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/site/social-icons"

const NAV = [
  { href: "/servicios", label: "Servicios" },
  { href: "/trabajo", label: "Trabajo" },
  { href: "/blog", label: "Blog" },
  { href: "/sobre", label: "Studio" },
  { href: "/contacto", label: "Contacto" },
]

export function Footer() {
  return (
    <footer className="mt-10 border-t border-border">
      <div className="mx-auto max-w-6xl px-7 py-14">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-[-0.02em]">
              <span className="inline-block h-[9px] w-[9px] rounded-[2px] bg-accent" />
              axchi<span className="font-normal text-muted">/studio</span>
            </Link>
            <p className="mt-4 text-sm text-muted">
              Studio de ingeniería de software en Bogotá. Construimos productos digitales
              que se sienten extraordinarios.
            </p>
          </div>

          <nav className="flex flex-col gap-2.5">
            <span className="mono-label mb-1">Navegación</span>
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-muted transition-colors hover:text-text">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2.5">
            <span className="mono-label mb-1">Conecta</span>
            <div className="flex gap-3">
              <a href="https://github.com/axchisan" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-border-strong hover:text-text">
                <GithubIcon className="h-4.5 w-4.5" />
              </a>
              <a href="https://www.instagram.com/axchisan" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-border-strong hover:text-text">
                <InstagramIcon className="h-4.5 w-4.5" />
              </a>
              <a href="https://www.linkedin.com/in/duvan-yair-arciniegas-gerena-535690339" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-border-strong hover:text-text">
                <LinkedinIcon className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <span className="mono-label">© 2026 · Duvan Yair Arciniegas · Bogotá, CO</span>
          <span className="mono-label">Hecho con criterio</span>
        </div>
      </div>
    </footer>
  )
}

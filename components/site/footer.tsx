import Link from "next/link"
import { Mail, MessageCircle } from "lucide-react"
import { PRECIO_ENTRADA, pesos } from "@/lib/catalogo/planes"
import { SOLUCIONES } from "@/lib/catalogo/soluciones"
import { LEGAL_NAME, MENSAJE_WHATSAPP, PROFILE, WHATSAPP, whatsappUrl } from "@/lib/site"
import { Logo } from "./logo"
import { GithubIcon, InstagramIcon, LinkedinIcon } from "./social-icons"

const COLUMNAS = [
  {
    titulo: "Soluciones",
    enlaces: [
      ...SOLUCIONES.map((x) => ({ href: `/soluciones/${x.slug}`, label: x.sector })),
      { href: "/soluciones", label: "Todas las soluciones" },
      { href: "/a-medida", label: "Desarrollo a medida" },
    ],
  },
  {
    titulo: "Contratar",
    enlaces: [
      { href: "/planes", label: "Planes y precios" },
      { href: "/proceso", label: "Proceso" },
      { href: "/cotizar", label: "Cotizar" },
    ],
  },
  {
    titulo: "Axchi",
    enlaces: [
      { href: "/empresa", label: "Sobre Axchi" },
      { href: "/privacidad", label: "Privacidad" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-band text-on-band-mid">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,0.85fr)_1.45fr] lg:gap-10">
          <div>
            <span className="text-on-band">
              <Logo />
            </span>
            <p className="mt-4 max-w-[34ch] text-[0.9375rem] leading-relaxed">
              Páginas web, tiendas y sistemas para negocios en Colombia, desde {pesos(PRECIO_ENTRADA)}.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { href: PROFILE.github, label: "GitHub", Icon: GithubIcon },
                { href: PROFILE.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
                { href: PROFILE.instagram, label: "Instagram", Icon: InstagramIcon },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-band-2 text-on-band-mid transition-colors hover:text-accent"
                >
                  <Icon className="h-[17px] w-[17px]" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNAS.map((c) => (
            <nav key={c.titulo} aria-label={c.titulo}>
              <h2 className="text-[0.9375rem] font-semibold text-on-band">{c.titulo}</h2>
              <ul className="mt-4 space-y-2.5">
                {c.enlaces.map((e) => (
                  <li key={e.href}>
                    <Link
                      href={e.href}
                      className="text-[0.9375rem] transition-colors hover:text-accent"
                    >
                      {e.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="text-[0.9375rem] font-semibold text-on-band">Contacto</h2>
            <ul className="mt-4 space-y-3">
              {[
                { href: `mailto:${PROFILE.email}`, Icon: Mail, texto: PROFILE.email, externo: false },
                { href: whatsappUrl(MENSAJE_WHATSAPP), Icon: MessageCircle, texto: WHATSAPP.visible, externo: true },
              ].map(({ href, Icon, texto, externo }) => (
                <li key={texto}>
                  <a
                    href={href}
                    {...(externo ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                    className="group flex items-center gap-3 text-[0.9375rem] transition-colors hover:text-accent"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-band-2">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="break-words">{texto}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-band-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-[0.875rem] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {LEGAL_NAME}, Bogotá, Colombia
          </p>
          <Link href="/privacidad" className="transition-colors hover:text-accent">
            Política de privacidad
          </Link>
        </div>
      </div>

      {/* En el celular, WhatsApp siempre a un toque: es el canal que ya usa
          quien tiene un negocio pequeño en Colombia. */}
      <a
        href={whatsappUrl(MENSAJE_WHATSAPP)}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Escribir por WhatsApp"
        className="fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-on-accent shadow-lg lg:hidden"
      >
        <MessageCircle className="h-6 w-6" aria-hidden />
      </a>
    </footer>
  )
}

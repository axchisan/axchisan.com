import Link from "next/link"
import { PROFILE } from "@/lib/site"
import { GithubIcon, InstagramIcon, LinkedinIcon } from "./social-icons"

const REDES = [
  { href: PROFILE.github, label: "GitHub", Icon: GithubIcon },
  { href: PROFILE.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  { href: PROFILE.instagram, label: "Instagram", Icon: InstagramIcon },
]

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[0.9375rem] text-ink">{PROFILE.name}</p>
          <p className="mt-0.5 text-[0.9375rem] text-graphite">
            {PROFILE.role} en {PROFILE.location}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {REDES.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-[8px] text-graphite transition-colors hover:bg-raised hover:text-ink"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 pb-10 text-[0.875rem] text-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} {PROFILE.name}</p>
        <a href={`mailto:${PROFILE.email}`} className="link">
          {PROFILE.email}
        </a>
      </div>
    </footer>
  )
}

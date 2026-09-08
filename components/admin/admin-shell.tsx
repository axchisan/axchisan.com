"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { LayoutDashboard, FolderGit2, FileText, Cpu, Images, Mail, User, Settings, LogOut, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Proyectos", icon: FolderGit2 },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/skills", label: "Skills", icon: Cpu },
  { href: "/admin/media", label: "Media", icon: Images },
  { href: "/admin/messages", label: "Mensajes", icon: Mail },
  { href: "/admin/profile", label: "Perfil", icon: User },
  { href: "/admin/settings", label: "Ajustes", icon: Settings },
]

export function AdminShell({ children, userName }: { children: React.ReactNode; userName: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)

  return (
    <div className="min-h-screen bg-paper">
      {/* Topbar móvil */}
      <div className="flex items-center justify-between border-b border-line px-5 py-3 lg:hidden">
        <Link href="/admin" className="font-semibold tracking-[-0.015em]">Duvan Arciniegas<span className="ml-1.5 font-normal text-graphite">admin</span></Link>
        <button onClick={() => setOpen((v) => !v)} aria-label="Menú" className="flex h-9 w-9 items-center justify-center rounded-lg border border-line">
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-60 -translate-x-full border-r border-line bg-raised transition-transform lg:static lg:translate-x-0",
            open && "translate-x-0",
          )}
        >
          <div className="flex h-full flex-col p-4">
            <Link href="/" className="mb-6 flex items-center gap-2 px-2 text-lg font-bold tracking-[-0.02em]">
              <span className="inline-block h-[9px] w-[9px] rounded-[2px] bg-accent" />
              axchi<span className="font-normal text-graphite">/admin</span>
            </Link>
            <nav className="flex flex-1 flex-col gap-1">
              {NAV.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      isActive(item.href)
                        ? "bg-accent-weak text-accent"
                        : "text-graphite hover:bg-raised hover:text-ink",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="mt-4 border-t border-line pt-4">
              <p className="px-3 pb-2 text-xs text-faint">{userName}</p>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-graphite transition-colors hover:bg-raised hover:text-ink"
              >
                <LogOut className="h-4 w-4" /> Cerrar sesión
              </button>
            </div>
          </div>
        </aside>

        {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

        <main className="min-w-0 flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

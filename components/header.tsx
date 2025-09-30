"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  X,
  Home,
  User,
  Briefcase,
  FolderOpen,
  BookOpen,
  Mail,
  Settings,
  LogOut,
  LogIn,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Sobre Mí", href: "/about", icon: User },
  { name: "Servicios", href: "/services", icon: Briefcase },
  { name: "Proyectos", href: "/projects", icon: FolderOpen },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "Contacto", href: "/contact", icon: Mail },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (session && session.user.role !== "ADMIN") {
      fetchUnreadCount()
      // Poll every 30 seconds for new messages
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [session])

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("/api/user/messages/unread-count")
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.count || 0)
      }
    } catch (error) {
      console.error("Error fetching unread count:", error)
    }
  }

  const closeMenu = () => setIsOpen(false)

  const showAuthContent = status !== "loading"

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50" : "bg-transparent",
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center transition-neon group-hover:neon-glow">
                <span className="text-primary-foreground font-mono font-bold text-sm">A</span>
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Axchi
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-all duration-200 hover:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-md bg-primary/10 border border-primary/20"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {showAuthContent && (
              <>
                {session ? (
                  <div className="hidden md:flex items-center space-x-2">
                    {session.user.role !== "ADMIN" && (
                      <Button variant="outline" size="sm" asChild className="relative bg-transparent">
                        <Link href="/messages">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Mensajes
                          {unreadCount > 0 && (
                            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
                              {unreadCount}
                            </Badge>
                          )}
                        </Link>
                      </Button>
                    )}
                    {session.user.role === "ADMIN" && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/admin">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => signOut()}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Salir
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" asChild className="hidden md:flex bg-transparent">
                    <Link href="/auth/signin">
                      <LogIn className="h-4 w-4 mr-2" />
                      Iniciar Sesión
                    </Link>
                  </Button>
                )}
              </>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent",
                      )}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  )
                })}

                {showAuthContent && (
                  <div className="border-t border-border/50 pt-3 mt-3">
                    {session ? (
                      <>
                        {session.user.role !== "ADMIN" && (
                          <Link
                            href="/messages"
                            onClick={closeMenu}
                            className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                          >
                            <div className="flex items-center">
                              <MessageSquare className="h-5 w-5 mr-3" />
                              Mis Mensajes
                            </div>
                            {unreadCount > 0 && (
                              <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
                                {unreadCount}
                              </Badge>
                            )}
                          </Link>
                        )}
                        {session.user.role === "ADMIN" && (
                          <Link
                            href="/admin"
                            onClick={closeMenu}
                            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                          >
                            <Settings className="h-5 w-5 mr-3" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            signOut()
                            closeMenu()
                          }}
                          className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                        >
                          <LogOut className="h-5 w-5 mr-3" />
                          Cerrar Sesión
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/auth/signin"
                        onClick={closeMenu}
                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                      >
                        <LogIn className="h-5 w-5 mr-3" />
                        Iniciar Sesión
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

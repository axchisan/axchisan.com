import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { AuthProvider } from "@/components/auth-provider"
import { SigninForm } from "@/components/auth/signin-form"

export const metadata: Metadata = {
  title: "Iniciar sesión",
  robots: { index: false, follow: false },
}

export default function SigninPage() {
  return (
    <main className="hero-glow relative flex min-h-screen items-center justify-center overflow-hidden px-7">
      <div className="relative z-[1] w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 font-display text-lg font-bold tracking-[-0.02em]">
          <span className="inline-block h-[9px] w-[9px] rounded-[2px] bg-accent" />
          axchi<span className="font-normal text-muted">/studio</span>
        </Link>
        <div className="mt-8 rounded-2xl border border-border bg-surface p-7">
          <h1 className="font-display text-xl font-semibold">Panel de administración</h1>
          <p className="mt-1 text-sm text-muted">Acceso solo para el equipo.</p>
          <div className="mt-6">
            <AuthProvider>
              <Suspense>
                <SigninForm />
              </Suspense>
            </AuthProvider>
          </div>
        </div>
        <Link href="/" className="mono-label mt-6 block text-center text-muted transition-colors hover:text-text">
          ← Volver al sitio
        </Link>
      </div>
    </main>
  )
}

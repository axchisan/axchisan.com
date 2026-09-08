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
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center text-[1.0625rem] font-semibold tracking-[-0.015em]">
          Duvan Arciniegas
        </Link>
        <div className="mt-8 rounded-[12px] border border-line bg-raised p-7">
          <h1 className="text-xl font-semibold">Panel de administración</h1>
          <p className="mt-1 text-[0.9375rem] text-graphite">Acceso restringido.</p>
          <div className="mt-6">
            <AuthProvider>
              <Suspense>
                <SigninForm />
              </Suspense>
            </AuthProvider>
          </div>
        </div>
        <Link href="/" className="text-[0.875rem] text-faint mt-6 block text-center text-graphite transition-colors hover:text-ink">
          ← Volver al sitio
        </Link>
      </div>
    </main>
  )
}

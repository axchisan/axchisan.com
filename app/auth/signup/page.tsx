import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { SignUpForm } from "@/components/auth/signup-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuroraBackground } from "@/components/aurora-background"

export const metadata = {
  title: "Crear Cuenta - Axchi",
  description: "Crea tu cuenta para acceder al panel de administración.",
}

export default async function SignUpPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/admin")
  }

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <Header />

      <main className="relative z-10 pt-16">
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <SignUpForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}

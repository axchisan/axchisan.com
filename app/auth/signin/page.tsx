import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { SignInForm } from "@/components/auth/signin-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackgroundEffects } from "@/components/background-effects"

export const metadata = {
  title: "Iniciar Sesión - Axchi",
  description: "Inicia sesión en tu cuenta para acceder a funciones adicionales.",
}

export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const session = await getServerSession(authOptions)
  const searchParams = await props.searchParams

  if (session) {
    const callbackUrl = searchParams?.callbackUrl

    if (callbackUrl) {
      redirect(callbackUrl)
    } else if (session.user.role === "ADMIN") {
      redirect("/admin")
    } else {
      redirect("/")
    }
  }

  return (
    <div className="relative min-h-screen">
      <BackgroundEffects />
      <Header />

      <main className="relative z-10 pt-16">
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <SignInForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}

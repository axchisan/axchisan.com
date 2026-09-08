"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

const field =
  "w-full rounded-lg border border-line bg-paper px-4 py-3 text-[15px] text-ink placeholder:text-faint transition-colors focus:border-accent focus:outline-none"

export function SigninForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params.get("callbackUrl") || "/admin"

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const data = new FormData(e.currentTarget)
    const res = await signIn("credentials", {
      email: String(data.get("email")),
      password: String(data.get("password")),
      redirect: false,
    })
    setLoading(false)
    if (res?.error) {
      toast.error("Credenciales inválidas")
      return
    }
    toast.success("Sesión iniciada")
    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-[0.875rem] text-faint mb-2 block">Email</label>
        <input name="email" type="email" required placeholder="tu@email.com" className={field} />
      </div>
      <div>
        <label className="text-[0.875rem] text-faint mb-2 block">Contraseña</label>
        <input name="password" type="password" required placeholder="••••••••" className={field} />
      </div>
      <Button type="submit" size="lg" disabled={loading} className="mt-2">
        {loading ? "Entrando…" : "Iniciar sesión"}
      </Button>
    </form>
  )
}

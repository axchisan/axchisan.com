import type { DefaultSession } from "next-auth"

// Al importar un tipo, este archivo es un MÓDULO y `declare module` AUMENTA
// los tipos de next-auth (no los reemplaza). Sin el import, TS lo trataría
// como declaración ambient y ocultaría los exports reales (getServerSession,
// NextAuthOptions, NextAuth, etc.).

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role?: string
    } & DefaultSession["user"]
  }

  interface User {
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
  }
}

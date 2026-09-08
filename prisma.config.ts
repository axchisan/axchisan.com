import { config as loadEnv } from "dotenv"
import { defineConfig, env } from "prisma/config"

// Next.js carga .env.local por su cuenta; la CLI de Prisma no. Se cargan en el
// mismo orden de precedencia que usa Next: .env.local gana sobre .env.
// ENV_FILE permite apuntar a la rama de pruebas sin tocar el entorno local.
loadEnv({ path: process.env.ENV_FILE ?? ".env.local" })
loadEnv({ path: ".env" })

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // La CLI (migrate, db pull/push, studio) necesita una conexión directa:
    // el pooler de Neon corre en modo transacción y rompe las migraciones.
    // El cliente en runtime usa el adapter pg con la URL agrupada.
    url: env("DIRECT_DATABASE_URL") ?? env("DATABASE_URL"),
  },
})

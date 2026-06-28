import "dotenv/config"
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Usado por la CLI de Prisma (migrate, db pull/push, studio).
    // El cliente en runtime usa el adapter pg en lib/prisma.ts.
    url: env("DATABASE_URL"),
  },
})

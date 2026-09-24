import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

/**
 * Cliente de Prisma sobre el driver serverless de Neon.
 *
 * El driver de Neon habla con la base por HTTP en lugar de mantener conexiones
 * TCP. En serverless cada invocación puede ser un proceso nuevo, y abrir y
 * cerrar conexiones TCP por petición agota el pool del servidor mucho antes que
 * las peticiones HTTP. Los seeds, que corren en local, siguen con
 * `@prisma/adapter-pg`.
 */

const globalParaPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function crearCliente() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("Falta DATABASE_URL")
  }
  return new PrismaClient({ adapter: new PrismaNeon({ connectionString }) })
}

export const prisma = globalParaPrisma.prisma ?? crearCliente()

// En desarrollo se reutiliza entre recargas para no agotar conexiones con cada
// cambio de archivo. En producción cada invocación es aislada y no aplica.
if (process.env.NODE_ENV !== "production") globalParaPrisma.prisma = prisma

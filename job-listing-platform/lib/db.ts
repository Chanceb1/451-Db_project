import { PrismaClient } from "@prisma/client"
import { Pool } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Check if we're in edge runtime
const isEdge = typeof process === 'undefined' || !process.version

let prisma: PrismaClient

if (process.env.NODE_ENV === "production" || isEdge) {
  // Configure with Neon serverless adapter
  const connectionString = process.env.DATABASE_URL!
  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool)
  prisma = new PrismaClient({ adapter })
} else {
  if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL!
    const pool = new Pool({ connectionString })
    const adapter = new PrismaNeon(pool)
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: ["query"],
    })
  }
  prisma = globalForPrisma.prisma
}

export { prisma }


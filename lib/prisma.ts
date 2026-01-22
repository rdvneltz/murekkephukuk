import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Only log errors in production, add query logs in development
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  })

// Always use singleton pattern to prevent connection pool exhaustion
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

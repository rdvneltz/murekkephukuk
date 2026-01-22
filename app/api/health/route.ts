import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database_url_exists: !!process.env.DATABASE_URL,
    database_url_preview: process.env.DATABASE_URL
      ? process.env.DATABASE_URL.substring(0, 30) + '...'
      : 'NOT SET',
    nextauth_url: process.env.NEXTAUTH_URL || 'NOT SET',
    nextauth_secret_exists: !!process.env.NEXTAUTH_SECRET,
    database_connection: 'checking...',
    error: null as string | null
  }

  try {
    // Test database connection
    await prisma.$connect()

    // Try a simple query
    const heroCount = await prisma.heroSection.count()

    checks.database_connection = 'SUCCESS'

    return NextResponse.json({
      status: 'healthy',
      checks,
      heroCount
    })
  } catch (error: any) {
    checks.database_connection = 'FAILED'
    checks.error = error?.message || String(error)

    return NextResponse.json({
      status: 'unhealthy',
      checks
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

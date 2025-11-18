import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // Sadece development veya ilk kurulumda çalışsın
    const userCount = await prisma.user.count()

    if (userCount > 0) {
      return NextResponse.json({
        message: 'Database zaten dolu. Seed işlemi yapılmadı.'
      }, { status: 400 })
    }

    // Admin kullanıcı oluştur
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12)

    await prisma.user.create({
      data: {
        email: process.env.ADMIN_EMAIL || 'admin@murekkephukuk.com',
        password: hashedPassword,
        name: 'Admin',
      },
    })

    // Hero section
    await prisma.heroSection.create({
      data: {
        title: 'MÜREKKEP HUKUK',
        subtitle: 'Adaletin Kalemi',
        description: 'Hukuki haklarınız için güvenilir, profesyonel ve etkili çözümler sunuyoruz',
        buttonText: 'Ücretsiz Danışmanlık',
        buttonLink: '#contact',
        active: true,
      },
    })

    // İletişim bilgileri
    await prisma.contactInfo.create({
      data: {
        address: 'İstanbul, Türkiye',
        phone: '+90 212 XXX XX XX',
        email: 'info@murekkephukuk.com',
        workingHours: 'Pazartesi - Cuma: 09:00 - 18:00',
      },
    })

    // Site ayarları
    await prisma.siteSettings.create({
      data: {
        siteName: 'Mürekkep Hukuk',
        siteTitle: 'Mürekkep Hukuk Bürosu | Profesyonel Hukuki Danışmanlık',
        description: 'İstanbul merkezli profesyonel hukuki danışmanlık ve avukatlık hizmetleri',
        logo: '/assets/murekkep-logo-saydam.png',
        footerText: '© 2024 Mürekkep Hukuk Bürosu. Tüm hakları saklıdır.',
      },
    })

    return NextResponse.json({
      message: 'Database başarıyla seed edildi!',
      admin: {
        email: process.env.ADMIN_EMAIL || 'admin@murekkephukuk.com',
        password: 'admin123'
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      error: 'Seed işlemi başarısız',
      details: error.message
    }, { status: 500 })
  }
}

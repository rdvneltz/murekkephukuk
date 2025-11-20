'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import Link from 'next/link'
import { ArrowLeft, Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function SeedTriggerPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    data?: any
    error?: string
  } | null>(null)

  const handleSeed = async () => {
    if (!confirm('⚠️ DİKKAT: Bu işlem veritabanındaki TÜM VERİLERİ silip yeniden oluşturacak!\n\nDevam etmek istediğinizden emin misiniz?')) {
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await axios.post('/api/admin/seed', {
        secret: 'murekkep-hukuk-seed-2025'
      })

      setResult({
        success: true,
        message: response.data.message,
        data: response.data.data
      })
    } catch (error: any) {
      setResult({
        success: false,
        message: 'Veritabanı doldurma işlemi başarısız oldu',
        error: error.response?.data?.error || error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Admin Panel
            </Link>
            <div className="w-px h-6 bg-white/20" />
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Database className="w-8 h-8 text-gold-400" />
              Veritabanını Doldur
            </h1>
          </div>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-navy-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
            {/* Warning */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-2">
                    ⚠️ Dikkat
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Bu işlem veritabanındaki <strong>TÜM VERİLERİ</strong> silecek ve profesyonel içeriklerle yeniden dolduracaktır:
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-white/70">
                    <li>• Tüm randevular silinecek</li>
                    <li>• Mevcut blog yazıları silinecek</li>
                    <li>• Ekip üyeleri ve hizmetler sıfırlanacak</li>
                    <li>• Site ayarları varsayılana dönecek</li>
                  </ul>
                  <p className="mt-3 text-xs text-white/60">
                    💡 İşleme başlamadan önce önemli verilerin yedeğini aldığınızdan emin olun.
                  </p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gold-400 mb-3">
                📦 Oluşturulacak İçerikler
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold-400" />
                  8 Hukuk Hizmeti
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold-400" />
                  7 Ekip Üyesi
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold-400" />
                  4 Blog Yazısı
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold-400" />
                  5 Müvekkil Görüşü
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold-400" />
                  21 Hero Videosu
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold-400" />
                  Site Ayarları
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold-400" />
                  Hero Bölümü
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold-400" />
                  Hakkımızda & İletişim
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleSeed}
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-navy-900 font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Veritabanı Dolduruluyor...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5" />
                  Veritabanını Profesyonel İçeriklerle Doldur
                </>
              )}
            </button>

            {/* Result */}
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mt-6 rounded-xl p-6 ${
                  result.success
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-red-500/10 border border-red-500/20'
                }`}
              >
                <div className="flex items-start gap-4">
                  {result.success ? (
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold mb-2 ${
                        result.success ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {result.success ? '✅ Başarılı!' : '❌ Hata'}
                    </h3>
                    <p className="text-white/80 text-sm mb-3">{result.message}</p>

                    {result.success && result.data && (
                      <div className="bg-white/5 rounded-lg p-4 text-xs text-white/70 space-y-1">
                        <div>✅ {result.data.siteSettings} Site Ayarı</div>
                        <div>✅ {result.data.heroSection} Hero Bölümü</div>
                        <div>✅ {result.data.heroVideos} Hero Videosu</div>
                        <div>✅ {result.data.services} Hizmet</div>
                        <div>✅ {result.data.aboutSection} Hakkımızda Bölümü</div>
                        <div>✅ {result.data.teamMembers} Ekip Üyesi</div>
                        <div>✅ {result.data.blogPosts} Blog Yazısı</div>
                        <div>✅ {result.data.testimonials} Müvekkil Görüşü</div>
                        <div>✅ {result.data.contactInfo} İletişim Bilgisi</div>
                      </div>
                    )}

                    {result.error && (
                      <div className="bg-white/5 rounded-lg p-4 text-xs text-red-300 font-mono">
                        {result.error}
                      </div>
                    )}

                    {result.success && (
                      <div className="mt-4 flex gap-3">
                        <Link
                          href="/"
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white text-center py-2 px-4 rounded-lg text-sm transition-colors"
                        >
                          Anasayfayı Görüntüle
                        </Link>
                        <Link
                          href="/admin"
                          className="flex-1 bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 text-center py-2 px-4 rounded-lg text-sm transition-colors"
                        >
                          Admin Panel
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-navy-800/30 rounded-xl border border-white/5 p-6">
            <h3 className="text-sm font-semibold text-white/80 mb-3">
              📝 İşlem Sonrası
            </h3>
            <ul className="space-y-2 text-xs text-white/60">
              <li>• Anasayfayı ziyaret ederek içeriklerin yüklendiğini kontrol edin</li>
              <li>• Admin panelden dilediğiniz içeriği düzenleyebilirsiniz</li>
              <li>• Ekip fotoğrafları stock fotolarla gelir, kendi fotoğraflarınızı yükleyin</li>
              <li>• Uygun saatler bölümünü manuel olarak doldurun</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

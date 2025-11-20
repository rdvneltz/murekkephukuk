'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { Video, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'

declare global {
  interface Window {
    JitsiMeetExternalAPI: any
  }
}

export default function VideoCallPage() {
  const params = useParams()
  const appointmentId = params.id as string
  const [appointment, setAppointment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [jitsiLoaded, setJitsiLoaded] = useState(false)

  useEffect(() => {
    fetchAppointment()
  }, [])

  useEffect(() => {
    // Load Jitsi Meet script from public free server
    const script = document.createElement('script')
    script.src = 'https://meet.jit.si/external_api.js'
    script.async = true
    script.onload = () => {
      setJitsiLoaded(true)
    }
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (jitsiLoaded && appointment) {
      initJitsi()
    }
  }, [jitsiLoaded, appointment])

  const fetchAppointment = async () => {
    try {
      const { data } = await axios.get(`/api/appointments?id=${appointmentId}`)

      if (!data || data.length === 0) {
        setError('Randevu bulunamadı')
        setLoading(false)
        return
      }

      const apt = data[0]

      if (apt.status !== 'approved') {
        setError('Bu randevu henüz onaylanmamış')
        setLoading(false)
        return
      }

      if (apt.meetingPlatform !== 'site') {
        setError('Bu randevu site üzerinden görüşme için ayarlanmamış')
        setLoading(false)
        return
      }

      setAppointment(apt)
      setLoading(false)
    } catch (error) {
      console.error('Randevu yüklenemedi:', error)
      setError('Randevu bilgileri alınamadı')
      setLoading(false)
    }
  }

  const initJitsi = () => {
    const domain = 'meet.jit.si'
    const options = {
      roomName: `MurekkepHukuk_${appointmentId}`,
      width: '100%',
      height: '100%',
      parentNode: document.querySelector('#jitsi-container'),
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        disableDeepLinking: true,
        prejoinPageEnabled: true,
        enableWelcomePage: false,
        enableClosePage: false,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: true,
        SHOW_WATERMARK_FOR_GUESTS: true,
        TOOLBAR_ALWAYS_VISIBLE: false,
        DEFAULT_REMOTE_DISPLAY_NAME: 'Avukat',
        DEFAULT_LOCAL_DISPLAY_NAME: appointment?.name || 'Danışan',
        MOBILE_APP_PROMO: false,
        SHOW_CHROME_EXTENSION_BANNER: false,
      },
      userInfo: {
        displayName: appointment?.name || 'Danışan',
      },
    }

    const api = new window.JitsiMeetExternalAPI(domain, options)

    // Clean up on unmount
    return () => {
      api.dispose()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <Video className="w-16 h-16 text-gold-400 mx-auto mb-4 animate-pulse" />
          <div className="text-white text-xl">Görüşme hazırlanıyor...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-navy-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Görüşme Başlatılamadı</h1>
          <p className="text-white/70 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Anasayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      {/* Header */}
      <div className="bg-navy-800 border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Video className="w-6 h-6 text-gold-400" />
            <div>
              <h1 className="text-lg font-semibold text-white">
                Mürekkep Hukuk - Online Görüşme
              </h1>
              <p className="text-sm text-white/60">
                Randevu: {appointment?.name} - {new Date(appointment?.date).toLocaleDateString('tr-TR')} {appointment?.time}
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="text-white/60 hover:text-white transition-colors text-sm"
          >
            Çıkış
          </Link>
        </div>
      </div>

      {/* Jitsi Container */}
      <div className="flex-1 relative">
        <div id="jitsi-container" className="absolute inset-0" />
      </div>

      {/* Footer Info */}
      <div className="bg-navy-800 border-t border-white/10 px-6 py-3">
        <div className="max-w-7xl mx-auto text-center text-white/50 text-sm">
          <p>Güvenli ve şifreli görüşme - Mürekkep Hukuk © 2024</p>
        </div>
      </div>
    </div>
  )
}

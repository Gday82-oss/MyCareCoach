import { useState, useEffect } from 'react'
import { X, Share } from 'lucide-react'

export default function InstallPWABanner() {
  const [show, setShow] = useState(false)
  const [showGuide, setShowGuide] = useState(false)

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const dismissedForever = localStorage.getItem('pwa-dismissed-forever')
    const dismissed = localStorage.getItem('pwa-install-dismissed')

    if (!isIOS || isStandalone || dismissedForever) return

    if (dismissed) {
      const daysSince = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24)
      if (daysSince < 7) return
    }

    setShow(true)
  }, [])

  const handleLater = () => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
    setShow(false)
  }

  const handleDismissForever = () => {
    localStorage.setItem('pwa-dismissed-forever', '1')
    setShow(false)
  }

  const handleInstall = () => {
    setShowGuide(true)
  }

  if (!show) return null

  return (
    <div className="block md:hidden px-4 pt-3">
      <div
        style={{
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          padding: '10px 12px',
          position: 'relative',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        {/* Bouton X */}
        <button
          onClick={handleDismissForever}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#9CA3AF',
            padding: 2,
          }}
          aria-label="Fermer définitivement"
        >
          <X size={16} />
        </button>

        {!showGuide ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Icône */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#00C896',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 18 }}>💚</span>
            </div>

            {/* Texte */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 500,
                  color: '#1A2B4A',
                  fontSize: 14,
                  lineHeight: 1.3,
                }}
              >
                Installer MyCareCoach
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 1 }}>
                Accès rapide, mode hors ligne
              </div>
            </div>

            {/* Boutons */}
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button
                onClick={handleLater}
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: 8,
                  background: 'none',
                  color: '#6B7280',
                  fontSize: 12,
                  padding: '5px 10px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Plus tard
              </button>
              <button
                onClick={handleInstall}
                style={{
                  background: '#00C896',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 12,
                  padding: '5px 10px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontWeight: 500,
                }}
              >
                Installer
              </button>
            </div>
          </div>
        ) : (
          <div style={{ paddingRight: 20 }}>
            <div
              style={{
                fontWeight: 500,
                color: '#1A2B4A',
                fontSize: 13,
                marginBottom: 6,
              }}
            >
              Pour installer l'application :
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: '#374151',
                fontSize: 13,
              }}
            >
              <span>Appuyez sur</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#F3F4F6',
                  borderRadius: 6,
                  padding: '2px 6px',
                  gap: 3,
                }}
              >
                <Share size={13} color="#3B82F6" />
                <span style={{ fontSize: 12, color: '#3B82F6' }}>Partager</span>
              </span>
              <span>puis</span>
            </div>
            <div
              style={{
                color: '#374151',
                fontSize: 13,
                marginTop: 3,
              }}
            >
              <strong>"Sur l'écran d'accueil"</strong>
            </div>
            {/* Flèche vers le bas (vers la barre Safari) */}
            <div
              style={{
                textAlign: 'center',
                marginTop: 6,
                fontSize: 18,
                color: '#00C896',
              }}
            >
              ↓
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

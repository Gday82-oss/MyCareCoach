import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share } from 'lucide-react';

const DISMISS_KEY = 'mycarecoach-client-install-dismissed';
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

type BrowserType = 'ios' | 'android-chrome' | 'other';

function detectBrowser(): BrowserType {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return 'ios';
  if (/Android/.test(ua) && /Chrome/.test(ua) && !/EdgA|OPR|Firefox/.test(ua)) return 'android-chrome';
  return 'other';
}

export default function InstallBannerClient() {
  const location = useLocation();
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showBanner, setShowBanner]       = useState(false);
  const [browser, setBrowser]             = useState<BrowserType>('other');
  const [showGuide, setShowGuide]         = useState(false);

  useEffect(() => {
    // Déjà installé → ne rien afficher
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Fermé récemment → ne rien afficher
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed && Date.now() - parseInt(dismissed) < DISMISS_DURATION_MS) return;

    const b = detectBrowser();
    setBrowser(b);

    // Toujours afficher la bannière (on adapte le contenu selon le navigateur)
    setShowBanner(true);

    // Écouter beforeinstallprompt si disponible (Android Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      // Chrome natif : déclencher la dialog d'installation
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') setShowBanner(false);
    } else {
      // Pas de prompt natif → afficher les instructions manuelles
      setShowGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  // Contenu du guide manuel selon le navigateur
  const renderGuide = () => {
    if (browser === 'ios') {
      return (
        <div style={{ paddingRight: 32 }}>
          <p style={{ color: 'white', fontWeight: 700, fontSize: 14, margin: '0 0 10px' }}>
            Pour installer l'app Client :
          </p>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>
            <span>1. Appuyez sur</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: '2px 8px' }}>
              <Share size={13} color="white" />
              <span style={{ color: 'white', fontSize: 12 }}>Partager</span>
            </span>
            <span>en bas de Safari</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 6 }}>
            2. Puis <strong style={{ color: 'white' }}>"Sur l'écran d'accueil"</strong>
          </p>
          <p style={{ textAlign: 'center', fontSize: 22, marginTop: 8, color: 'white', marginBottom: 0 }}>↓</p>
        </div>
      );
    }
    return (
      <div style={{ paddingRight: 32 }}>
        <p style={{ color: 'white', fontWeight: 700, fontSize: 14, margin: '0 0 10px' }}>
          Pour installer l'app Client :
        </p>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: '0 0 6px' }}>
          1. Appuyez sur <strong style={{ color: 'white' }}>⋮</strong> (menu en haut à droite)
        </p>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: 0 }}>
          2. Puis <strong style={{ color: 'white' }}>"Ajouter à l'écran d'accueil"</strong>
        </p>
      </div>
    );
  };

  // N'afficher que sur l'interface client (/client/*)
  if (!location.pathname.startsWith('/client')) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring' as const, damping: 25, stiffness: 200 }}
          style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, padding: 16 }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #6C5CE7, #00CEC9)',
              borderRadius: 20,
              padding: 16,
              boxShadow: '0 -4px 32px rgba(108,92,231,0.35)',
              position: 'relative',
            }}
          >
            {/* Bouton fermer */}
            <button
              onClick={handleDismiss}
              aria-label="Fermer"
              style={{
                position: 'absolute', top: 10, right: 10,
                background: 'rgba(255,255,255,0.15)', border: 'none',
                borderRadius: 8, padding: 5, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={15} color="white" />
            </button>

            {/* Affichage guide ou bannière principale */}
            {(showGuide || browser === 'ios') ? renderGuide() : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingRight: 32 }}>
                {/* Icône cœur */}
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                    <path
                      d="M16 28C16 28 4 20 4 12C4 8 7 5 11 5C13.5 5 15.5 6.5 16 8C16.5 6.5 18.5 5 21 5C25 5 28 8 28 12C28 20 16 28 16 28Z"
                      fill="white"
                    />
                  </svg>
                </div>

                {/* Texte */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: 14, lineHeight: 1.3, margin: 0 }}>
                    Installez l'app Client
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 3, marginBottom: 0 }}>
                    Accédez à votre suivi en un tap
                  </p>
                </div>

                {/* Bouton */}
                <button
                  onClick={handleInstall}
                  style={{
                    background: 'white', border: 'none', borderRadius: 12,
                    padding: '8px 14px', fontSize: 13, fontWeight: 700,
                    color: '#6C5CE7', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
                  }}
                >
                  Installer
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

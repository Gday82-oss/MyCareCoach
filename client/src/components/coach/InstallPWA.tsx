import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';

const DISMISS_KEY = 'pwa-coach-dismissed';
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

export default function InstallPWA() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Ne pas afficher sur desktop (≥ 768px)
    if (window.innerWidth >= 768) return;

    // Ne pas afficher si déjà fermé récemment
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed && Date.now() - parseInt(dismissed) < DISMISS_DURATION_MS) return;

    // Ne pas afficher si déjà installé en standalone
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring' as const, damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden"
        >
          <div
            className="rounded-2xl p-4 shadow-2xl flex items-center gap-3"
            style={{ background: '#1A2B4A' }}
          >
            {/* Icône */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#00C896' }}
            >
              <Download size={22} className="text-white" />
            </div>

            {/* Texte */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">
                Installez MyCareCoach sur votre téléphone
              </p>
              <p className="text-white/60 text-xs mt-0.5">
                Accédez à vos clients même sans connexion
              </p>
            </div>

            {/* Bouton Installer */}
            <button
              onClick={handleInstall}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-white flex-shrink-0"
              style={{ background: '#00C896' }}
            >
              Installer
            </button>

            {/* Bouton Fermer */}
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <X size={16} className="text-white/60" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

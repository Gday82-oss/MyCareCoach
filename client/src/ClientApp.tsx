import { useEffect, useRef, useState, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { supabaseClient } from './lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import './client-theme.css';

import ClientSidebar from './components/ClientSidebar';
import ClientTopbar from './components/ClientTopbar';
import InstallBannerClient from './components/InstallBannerClient';

import ClientAccueil from './pages/client-mobile/ClientAccueil';
import ClientSeances from './pages/client-mobile/ClientSeances';
import ClientProgramme from './pages/client-mobile/ClientProgramme';
import ClientMetriquesPage from './pages/client-mobile/ClientMetriquesPage';
import ClientMessagerie from './pages/client-mobile/ClientMessagerie';
import ClientProfilPage from './pages/client-mobile/ClientProfilPage';

interface ClientData {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  coach_id: string;
  telephone?: string;
  date_naissance?: string;
  objectifs?: string | string[];
  taille?: number;
}

export default function ClientApp() {
  const [client, setClient]           = useState<ClientData | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode]       = useState(() =>
    localStorage.getItem('mycarecoach-client-dark-mode') === 'true'
  );

  const swipeStartX   = useRef(0);
  const swipeStartY   = useRef(0);
  const isDragging    = useRef(false);
  const isVertical    = useRef(false);
  const dragProgress  = useRef<number | null>(null); // 0=fermée, 1=ouverte, null=pas de drag
  const sidebarOpenRef = useRef(sidebarOpen);
  const [, forceUpdate] = useState(0); // déclencheur de re-render pendant le drag

  const SIDEBAR_WIDTH = 280;

  // Synchronise le ref avec l'état (pour accès dans les handlers)
  useEffect(() => { sidebarOpenRef.current = sidebarOpen; }, [sidebarOpen]);

  const location = useLocation();

  // ── Applique la classe dark sur <html> ────────
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  function toggleDarkMode(val: boolean) {
    setDarkMode(val);
    localStorage.setItem('mycarecoach-client-dark-mode', String(val));
  }

  // ── Swipe tactile avec suivi du doigt ─────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    swipeStartX.current  = e.touches[0].clientX;
    swipeStartY.current  = e.touches[0].clientY;
    isDragging.current   = false;
    isVertical.current   = false;
    dragProgress.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isVertical.current) return;

    const dx = e.touches[0].clientX - swipeStartX.current;
    const dy = e.touches[0].clientY - swipeStartY.current;

    // Détermination direction au premier mouvement significatif
    if (!isDragging.current && Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
    if (!isDragging.current) {
      if (Math.abs(dy) > Math.abs(dx)) { isVertical.current = true; return; }
    }

    const open = sidebarOpenRef.current;

    if (!open) {
      // Ouverture : uniquement depuis le bord gauche (<40px)
      if (swipeStartX.current > 40) return;
      if (dx <= 0) return;
      isDragging.current   = true;
      dragProgress.current = Math.min(dx / SIDEBAR_WIDTH, 1);
    } else {
      // Fermeture : swipe gauche depuis n'importe où
      if (dx >= 0) return;
      isDragging.current   = true;
      dragProgress.current = Math.max(1 + dx / SIDEBAR_WIDTH, 0);
    }

    forceUpdate(n => n + 1);
  }, [SIDEBAR_WIDTH]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) {
      dragProgress.current = null;
      return;
    }

    const progress = dragProgress.current ?? (sidebarOpenRef.current ? 1 : 0);
    dragProgress.current = null;
    isDragging.current   = false;

    // Seuil : >40% pour ouvrir, <60% pour fermer
    if (!sidebarOpenRef.current) {
      setSidebarOpen(progress > 0.4);
    } else {
      setSidebarOpen(progress >= 0.6);
    }

    forceUpdate(n => n + 1);
  }, []);

  // ── Auth + profil ─────────────────────────────
  useEffect(() => {
    console.log('[ClientApp] Montage — inscription onAuthStateChange');

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[ClientApp] Auth event:', event, '| Session:', !!session);

        if (!session) {
          console.log('[ClientApp] Pas de session → redirect /client/login');
          window.location.href = '/client/login';
          return;
        }

        // Vérification du rôle : seuls les comptes "client" sont autorisés ici
        const role = session.user.user_metadata?.role;
        console.log('[ClientApp] Rôle détecté:', role);
        if (role !== 'client') {
          console.warn('[ClientApp] Rôle non-client détecté (' + role + ') → déconnexion + redirect');
          await supabaseClient.auth.signOut();
          window.location.href = '/client/login';
          return;
        }

        try {
          console.log('[ClientApp] Appel /api/client/profil avec token...');
          const response = await fetch('/api/client/profil', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
          });

          console.log('[ClientApp] /api/client/profil status:', response.status);

          if (response.status === 401) {
            console.log('[ClientApp] 401 → redirect /client/login');
            window.location.href = '/client/login';
            return;
          }

          if (response.status === 404) {
            console.warn('[ClientApp] 404 → compte non trouvé en base');
            setError('compte_non_client');
            setLoading(false);
            return;
          }

          if (!response.ok) {
            console.warn('[ClientApp] Réponse non-OK:', response.status);
            setError('Erreur de chargement');
            setLoading(false);
            return;
          }

          const data = await response.json();
          console.log('[ClientApp] Données reçues:', data?.client?.id ?? 'absent');

          if (data && (data.client || data.id || data.prenom)) {
            setClient(data.client || data);
            setLoading(false);
          } else {
            console.warn('[ClientApp] Réponse 200 mais client absent en base');
            setError('Profil introuvable');
            setLoading(false);
          }
        } catch (err) {
          console.error('[ClientApp] Erreur fetch:', err);
          setError('Erreur de connexion au serveur');
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fermer sidebar au changement de route
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const rootClass = darkMode ? 'dark' : '';

  // ── Chargement ───────────────────────────────
  if (loading) {
    return (
      <div className={rootClass} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--mcc-bg)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6C5CE7, #00CEC9)' }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M16 28C16 28 4 20 4 12C4 8 7 5 11 5C13.5 5 15.5 6.5 16 8C16.5 6.5 18.5 5 21 5C25 5 28 8 28 12C28 20 16 28 16 28Z" fill="white"/>
            </svg>
          </div>
          <div style={{ width: 112, height: 4, borderRadius: 2, overflow: 'hidden', backgroundColor: 'rgba(108,92,231,0.15)' }}>
            <motion.div
              style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #6C5CE7, #00CEC9)' }}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Erreur ────────────────────────────────────
  if (error) {
    return (
      <div className={rootClass} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'var(--mcc-bg)' }}>
        <div style={{ backgroundColor: 'var(--mcc-card)', borderRadius: 16, padding: 32, maxWidth: 360, width: '100%', textAlign: 'center', boxShadow: 'var(--mcc-shadow)' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(225,112,85,0.1)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E17055" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          {error === 'compte_non_client' ? (
            <>
              <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--mcc-text)' }}>Accès non autorisé</p>
              <p style={{ fontSize: 13, marginBottom: 24, color: 'var(--mcc-text-sec)' }}>
                Ce compte n'est pas un compte client.<br/>Veuillez vous connecter avec votre compte client.
              </p>
              <button
                onClick={() => { supabaseClient.auth.signOut(); window.location.href = '/client/login'; }}
                style={{ width: '100%', padding: '12px', borderRadius: 16, border: 'none', color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer', background: 'linear-gradient(135deg, #6C5CE7, #00CEC9)' }}
              >Se connecter</button>
            </>
          ) : (
            <>
              <p style={{ fontWeight: 600, marginBottom: 4, color: 'var(--mcc-text)' }}>{error}</p>
              {error === 'Profil introuvable' ? (
                <p style={{ fontSize: 13, marginBottom: 24, color: 'var(--mcc-text-sec)' }}>Contactez votre coach pour configurer votre accès.</p>
              ) : (
                <p style={{ fontSize: 13, marginBottom: 24, color: 'var(--mcc-text-sec)' }}>Une erreur est survenue. Veuillez réessayer.</p>
              )}
              <button
                onClick={() => { supabaseClient.auth.signOut(); window.location.href = '/client/login'; }}
                style={{ width: '100%', padding: '12px', borderRadius: 16, border: 'none', color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer', background: 'linear-gradient(135deg, #6C5CE7, #00CEC9)' }}
              >Se déconnecter</button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── App principale ────────────────────────────
  // Calcul du rendu sidebar/overlay en fonction du drag en cours
  const activeDrag    = dragProgress.current !== null;
  const progress      = activeDrag ? dragProgress.current! : (sidebarOpen ? 1 : 0);
  const overlayAlpha  = progress * 0.5;
  const sidebarTransX = (progress - 1) * SIDEBAR_WIDTH;

  return (
    <div
      className={rootClass}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--mcc-bg)' }}
    >
      {/* Overlay mobile — toujours présent, opacité animée */}
      <div
        className="md:hidden"
        onClick={() => !activeDrag && setSidebarOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          backgroundColor: `rgba(0,0,0,${overlayAlpha.toFixed(3)})`,
          pointerEvents: progress > 0 ? 'auto' : 'none',
          transition: activeDrag ? 'none' : 'background-color 0.3s ease',
        }}
      />

      {/* Sidebar : fixed sur mobile (slide-in), statique sur desktop */}
      <div
        className="fixed inset-y-0 left-0 z-50 md:static md:z-0"
        style={{
          transform: activeDrag
            ? `translateX(${sidebarTransX}px)`
            : undefined,
          transition: activeDrag ? 'none' : 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          // Sur desktop : toujours visible
          ...(activeDrag ? {} : {
            transform: window.innerWidth >= 768
              ? undefined
              : sidebarOpen ? 'translateX(0)' : `translateX(-${SIDEBAR_WIDTH}px)`,
          }),
        }}
      >
        <ClientSidebar client={client} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Contenu principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Topbar mobile uniquement */}
        <div className="md:hidden" style={{ flexShrink: 0 }}>
          <ClientTopbar onHamburger={() => setSidebarOpen(true)} />
        </div>

        {/* Zone scrollable */}
        <main style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--mcc-bg)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <Routes location={location}>
                <Route path="/"            element={<ClientAccueil       client={client!} />} />
                <Route path="/seances"     element={<ClientSeances       client={client!} />} />
                <Route path="/programme"   element={<ClientProgramme     client={client!} />} />
                <Route path="/metriques"   element={<ClientMetriquesPage client={client!} />} />
                <Route path="/messagerie"  element={<ClientMessagerie />} />
                <Route path="/profil"      element={<ClientProfilPage    client={client!} darkMode={darkMode} onToggleDark={toggleDarkMode} />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      {/* Bannière d'installation PWA */}
      <InstallBannerClient />
    </div>
  );
}

import { useLocation } from 'react-router-dom';

interface ClientTopbarProps {
  onHamburger: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  '/client':            'Accueil',
  '/client/seances':    'Séances',
  '/client/programme':  'Programme',
  '/client/metriques':  'Métriques',
  '/client/messagerie': 'Messagerie',
  '/client/profil':     'Profil',
};

export default function ClientTopbar({ onHamburger }: ClientTopbarProps) {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? 'MyCareCoach';

  return (
    <header
      style={{
        height: 56,
        backgroundColor: '#1E1245',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 16,
        gap: 14,
        flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Bouton hamburger — 44×44 min, 3 barres égales */}
      <button
        onClick={onHamburger}
        aria-label="Ouvrir le menu"
        style={{
          width: 44, height: 44, borderRadius: 8, border: 'none',
          background: 'rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0, gap: 0, padding: 0,
        }}
      >
        <span style={{ display: 'block', width: 20, height: 2, backgroundColor: 'white', borderRadius: 1, margin: '3px auto' }} />
        <span style={{ display: 'block', width: 20, height: 2, backgroundColor: 'white', borderRadius: 1, margin: '3px auto' }} />
        <span style={{ display: 'block', width: 20, height: 2, backgroundColor: 'white', borderRadius: 1, margin: '3px auto' }} />
      </button>

      {/* Titre page */}
      <p style={{ color: 'white', fontSize: 16, fontWeight: 500 }}>{title}</p>

      {/* Logo à droite */}
      <div style={{ marginLeft: 'auto' }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'linear-gradient(135deg, #6C5CE7, #00CEC9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="15" height="15" viewBox="0 0 32 32" fill="none">
            <path d="M16 28C16 28 4 20 4 12C4 8 7 5 11 5C13.5 5 15.5 6.5 16 8C16.5 6.5 18.5 5 21 5C25 5 28 8 28 12C28 20 16 28 16 28Z" fill="white"/>
          </svg>
        </div>
      </div>
    </header>
  );
}

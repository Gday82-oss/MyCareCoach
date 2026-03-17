import { NavLink, useLocation } from 'react-router-dom';
import { supabaseClient } from '../lib/supabase';
import '../client-theme.css';

interface ClientSidebarProps {
  client: { prenom: string; nom: string; email: string } | null;
  onClose?: () => void;
}

// ── Icônes SVG stroke ────────────────────────────
const IconAccueil = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,12 12,3 21,12"/>
    <polyline points="9,21 9,12 15,12 15,21"/>
  </svg>
);
const IconSeances = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconProgramme = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="8" height="8" rx="1.5"/>
    <rect x="13" y="3" width="8" height="8" rx="1.5"/>
    <rect x="3" y="13" width="8" height="8" rx="1.5"/>
    <rect x="13" y="13" width="8" height="8" rx="1.5"/>
  </svg>
);
const IconMetriques = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
  </svg>
);
const IconMessagerie = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconProfil = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const IconLogout = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16,17 21,12 16,7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const NAV_ITEMS = [
  { path: '/client',            label: 'Accueil',    Icon: IconAccueil    },
  { path: '/client/seances',    label: 'Séances',    Icon: IconSeances    },
  { path: '/client/programme',  label: 'Programme',  Icon: IconProgramme  },
  { path: '/client/metriques',  label: 'Métriques',  Icon: IconMetriques  },
  { path: '/client/messagerie', label: 'Messagerie', Icon: IconMessagerie },
  { path: '/client/profil',     label: 'Profil',     Icon: IconProfil     },
];

export default function ClientSidebar({ client, onClose }: ClientSidebarProps) {
  const location = useLocation();

  const initiales = client
    ? `${client.prenom?.[0] ?? ''}${client.nom?.[0] ?? ''}`.toUpperCase()
    : '?';

  async function handleLogout() {
    await supabaseClient.auth.signOut();
    window.location.href = '/client/login';
  }

  return (
    <aside
      style={{
        width: 240,
        height: '100vh',
        backgroundColor: '#1E1245',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
      }}
    >
      {/* ── Logo ── */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #6C5CE7, #00CEC9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path d="M16 28C16 28 4 20 4 12C4 8 7 5 11 5C13.5 5 15.5 6.5 16 8C16.5 6.5 18.5 5 21 5C25 5 28 8 28 12C28 20 16 28 16 28Z" fill="white"/>
            </svg>
          </div>
          <div>
            <p style={{ color: 'white', fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>MyCareCoach</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 1 }}>Espace client</p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ padding: '14px 12px', flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(({ path, label, Icon }) => {
            const isActive = path === '/client'
              ? location.pathname === '/client' || location.pathname === '/client/'
              : location.pathname.startsWith(path);
            return (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className={() => `mcc-nav-link${isActive ? ' active' : ''}`}
              >
                <Icon />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Déconnexion */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={handleLogout}
            className="mcc-nav-link mcc-nav-link-logout"
            style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}
          >
            <IconLogout />
            <span>Déconnexion</span>
          </button>
        </div>
      </nav>

      {/* ── Utilisateur en bas ── */}
      {client && (
        <div style={{
          padding: '14px 16px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #6C5CE7, #00CEC9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 13, fontWeight: 600,
          }}>
            {initiales}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: 'white', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {client.prenom} {client.nom}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>
              {client.email}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}

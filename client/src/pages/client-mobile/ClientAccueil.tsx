import { useClientData } from '../../hooks/useClientData';
import { motion } from 'framer-motion';

interface Props {
  client: { id: string; prenom: string; nom: string; email: string; coach_id: string; taille?: number };
}

const TYPE_COLORS: Record<string, { bg: string; icon: string; label: string }> = {
  renforcement: { bg: 'rgba(108,92,231,0.12)', icon: '#6C5CE7', label: 'Renforcement' },
  cardio:       { bg: 'rgba(0,206,201,0.12)',  icon: '#00CEC9', label: 'Cardio' },
  mobilite:     { bg: 'rgba(253,203,110,0.2)', icon: '#FDCB6E', label: 'Mobilité' },
  recuperation: { bg: 'rgba(162,155,254,0.15)',icon: '#A29BFE', label: 'Récupération' },
  mixte:        { bg: 'rgba(0,184,148,0.12)',  icon: '#00B894', label: 'Mixte' },
};

function formatDateFr(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function formatHeure(h: string) {
  return h?.slice(0, 5).replace(':', 'h') ?? '';
}

export default function ClientAccueil({ client }: Props) {
  const { seances, loading } = useClientData(client.id);
  const today = new Date().toISOString().split('T')[0];

  const prochaine = seances
    .filter(s => !s.fait && s.date >= today)
    .sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure))[0] ?? null;

  const thisWeek = (() => {
    const now = new Date();
    const mon = new Date(now); mon.setDate(now.getDate() - now.getDay() + 1);
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
    const ms = mon.toISOString().split('T')[0];
    const ss = sun.toISOString().split('T')[0];
    return seances.filter(s => s.date >= ms && s.date <= ss);
  })();

  const faitesSemaine = thisWeek.filter(s => s.fait).length;
  const totalSemaine  = thisWeek.length;
  const aVenir        = seances.filter(s => !s.fait && s.date >= today);
  const recentes      = [...seances].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return (
    <div style={{ padding: '24px 32px', backgroundColor: 'var(--mcc-bg)', minHeight: '100%' }}
      className="!p-5 md:!p-8">

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: 'var(--mcc-text-sec)' }}>Bonjour</p>
        <p style={{ fontSize: 22, fontWeight: 500, color: 'var(--mcc-text)', marginTop: 2 }}>{client.prenom}</p>
        <p style={{ fontSize: 13, color: 'var(--mcc-text-sec)', marginTop: 2 }}>Voici le résumé de votre suivi</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Hero Card — prochaine séance */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #6C5CE7, #00CEC9)',
            borderRadius: 18,
            padding: '22px 24px',
            color: 'white',
          }}
        >
          <div style={{ position: 'absolute', top: -30, right: -20, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 20, right: 40, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          <p style={{ fontSize: 11, opacity: 0.75, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Prochaine séance</p>
          {prochaine ? (
            <>
              <p style={{ fontSize: 22, fontWeight: 600, marginTop: 6, textTransform: 'capitalize' }}>{formatDateFr(prochaine.date)}</p>
              <p style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                {TYPE_COLORS[prochaine.type]?.label ?? prochaine.type}
                {prochaine.heure ? ` · ${formatHeure(prochaine.heure)}` : ''}
                {prochaine.duree ? ` · ${prochaine.duree} min` : ''}
              </p>
            </>
          ) : (
            <p style={{ fontSize: 18, fontWeight: 500, marginTop: 6, opacity: 0.9 }}>Aucune séance planifiée</p>
          )}
        </motion.div>

        {/* Stats (grille 2 colonnes) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {/* Séances semaine */}
          <div style={{ backgroundColor: 'var(--mcc-card)', borderRadius: 14, padding: '16px 18px', border: '0.5px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: 11, color: 'var(--mcc-text-sec)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cette semaine</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: 'var(--mcc-text)', marginTop: 6, lineHeight: 1 }}>
              {faitesSemaine}<span style={{ fontSize: 14, fontWeight: 400, color: 'var(--mcc-text-sec)' }}>/{totalSemaine}</span>
            </p>
            <p style={{ fontSize: 11, color: 'var(--mcc-text-sec)', marginTop: 4 }}>séances faites</p>
            {totalSemaine > 0 && (
              <div style={{ marginTop: 10, height: 6, borderRadius: 3, backgroundColor: 'rgba(108,92,231,0.12)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.round((faitesSemaine / totalSemaine) * 100)}%`, background: 'linear-gradient(135deg, #6C5CE7, #00CEC9)', borderRadius: 3 }} />
              </div>
            )}
          </div>

          {/* À venir */}
          <div style={{ backgroundColor: 'var(--mcc-card)', borderRadius: 14, padding: '16px 18px', border: '0.5px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: 11, color: 'var(--mcc-text-sec)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>À venir</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: 'var(--mcc-text)', marginTop: 6, lineHeight: 1 }}>{aVenir.length}</p>
            <p style={{ fontSize: 11, color: 'var(--mcc-text-sec)', marginTop: 4 }}>séance{aVenir.length > 1 ? 's' : ''} prévue{aVenir.length > 1 ? 's' : ''}</p>
            <div style={{ marginTop: 10 }}>
              <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: 'rgba(0,206,201,0.12)', color: '#00CEC9', fontWeight: 500 }}>
                {seances.filter(s => s.fait).length} réalisées
              </span>
            </div>
          </div>
        </div>

        {/* Séances récentes */}
        {recentes.length > 0 && !loading && (
          <div>
            <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--mcc-text)', marginBottom: 12 }}>Séances récentes</p>
            <div style={{ backgroundColor: 'var(--mcc-card)', borderRadius: 14, border: '0.5px solid rgba(0,0,0,0.06)', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              {recentes.map((s, idx) => {
                const tc = TYPE_COLORS[s.type] ?? TYPE_COLORS.mixte;
                return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: idx < recentes.length - 1 ? '0.5px solid rgba(0,0,0,0.06)' : 'none' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={tc.icon} strokeWidth="2" strokeLinecap="round">
                        {s.type === 'cardio'       ? <path d="M22 12h-4l-3 9L9 3l-3 9H2"/> :
                         s.type === 'renforcement' ? <path d="M6 4v6a6 6 0 0012 0V4M4 20h16"/> :
                         s.type === 'mobilite'     ? <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></> :
                         s.type === 'recuperation' ? <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/> :
                         <><circle cx="13" cy="19" r="3"/><path d="M13 16V8l-5 3"/><path d="M13 8l5 3"/></>}
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--mcc-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tc.label}</p>
                      <p style={{ fontSize: 12, color: 'var(--mcc-text-sec)', marginTop: 2 }}>
                        {new Date(s.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        {s.duree ? ` · ${s.duree} min` : ''}
                      </p>
                    </div>
                    <span style={{
                      fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 500, flexShrink: 0,
                      background: s.fait ? 'rgba(0,184,148,0.12)' : 'rgba(253,203,110,0.15)',
                      color: s.fait ? '#00B894' : '#E17055',
                    }}>
                      {s.fait ? 'Fait' : 'À venir'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2.5px solid #6C5CE7', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          </div>
        )}

      </div>
    </div>
  );
}

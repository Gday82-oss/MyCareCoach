import { useState } from 'react';
import { useClientData, getStatutSeance } from '../../hooks/useClientData';
import { motion } from 'framer-motion';

interface Props {
  client: { id: string; prenom: string; nom: string };
}

interface SeanceDisplay {
  id: string;
  date: string;
  heure: string;
  duree: number;
  type: string;
  notes?: string;
  statut: 'a_venir' | 'faite' | 'passee';
  lieu?: string;
  coach?: { prenom: string; nom: string };
}

type FilterKey = 'toutes' | 'semaine' | 'avenir' | 'passees';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'toutes',   label: 'Toutes'       },
  { key: 'semaine',  label: 'Cette semaine' },
  { key: 'avenir',   label: 'À venir'       },
  { key: 'passees',  label: 'Terminées'     },
];

const TYPE_LABELS: Record<string, string> = {
  renforcement: 'Renforcement',
  cardio:       'Cardio',
  mobilite:     'Mobilité',
  recuperation: 'Récupération',
  mixte:        'Mixte',
};

function startOfWeek(d: Date) {
  const copy = new Date(d);
  const day = copy.getDay();
  copy.setDate(copy.getDate() - day + (day === 0 ? -6 : 1));
  return copy.toISOString().split('T')[0];
}

const itemVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 350, damping: 25 } },
};

export default function ClientSeances({ client }: Props) {
  const { seances: rawSeances, loading } = useClientData(client.id);
  const [filter, setFilter] = useState<FilterKey>('toutes');

  const today     = new Date().toISOString().split('T')[0];
  const weekStart = startOfWeek(new Date());
  const weekEnd   = new Date(new Date(weekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const seances: SeanceDisplay[] = rawSeances.map(s => ({
    id: s.id, date: s.date, heure: s.heure, duree: s.duree ?? 0,
    type: s.type, notes: s.notes, statut: getStatutSeance(s), lieu: s.lieu, coach: s.coach,
  }));

  const aVenir = seances.filter(s => s.statut === 'a_venir').length;
  const faites = seances.filter(s => s.statut === 'faite').length;

  const filtered = seances.filter(s => {
    if (filter === 'avenir')  return s.statut === 'a_venir';
    if (filter === 'passees') return s.statut === 'faite' || s.statut === 'passee';
    if (filter === 'semaine') return s.date >= weekStart && s.date <= weekEnd;
    return true;
  });

  const groupByMonth = (list: SeanceDisplay[]) => {
    const grouped: Record<string, SeanceDisplay[]> = {};
    list.forEach(s => {
      const key = new Date(s.date + 'T00:00:00').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      grouped[key] = grouped[key] ? [...grouped[key], s] : [s];
    });
    return grouped;
  };

  const grouped = groupByMonth(filtered);

  function getBadgeStyle(statut: string, isToday: boolean): { bg: string; color: string; label: string } {
    if (isToday && statut === 'a_venir') return { bg: 'rgba(253,203,110,0.15)', color: '#E17055', label: "Aujourd'hui" };
    if (statut === 'faite')  return { bg: 'rgba(0,184,148,0.12)',   color: '#00B894', label: 'Réalisée' };
    if (statut === 'passee') return { bg: 'rgba(0,0,0,0.05)',        color: '#B2BEC3', label: 'Manquée' };
    return { bg: 'rgba(253,203,110,0.15)', color: '#E17055', label: 'À venir' };
  }

  function getBorderColor(statut: string, isToday: boolean): string {
    if (isToday && statut === 'a_venir') return '#FDCB6E';
    if (statut === 'faite')  return '#00B894';
    if (statut === 'passee') return '#B2BEC3';
    return '#A29BFE';
  }

  return (
    <div style={{ padding: '24px 32px', backgroundColor: 'var(--mcc-bg)', minHeight: '100%' }}
      className="!p-5 md:!p-8">

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 22, fontWeight: 500, color: 'var(--mcc-text)' }}>Mes séances</p>
        <p style={{ fontSize: 13, color: 'var(--mcc-text-sec)', marginTop: 4 }}>Historique complet de vos séances</p>
        {!loading && (
          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            <span style={{ fontSize: 13, color: 'var(--mcc-text-sec)' }}><strong style={{ color: 'var(--mcc-text)' }}>{aVenir}</strong> à venir</span>
            <span style={{ fontSize: 13, color: 'var(--mcc-text-sec)' }}><strong style={{ color: 'var(--mcc-text)' }}>{faites}</strong> réalisées</span>
            <span style={{ fontSize: 13, color: 'var(--mcc-text-sec)' }}><strong style={{ color: 'var(--mcc-text)' }}>{seances.length}</strong> au total</span>
          </div>
        )}
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }} className="mcc-scroll-hide">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              flexShrink: 0,
              padding: '8px 16px',
              borderRadius: 20,
              border: 'none',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              backgroundColor: filter === f.key ? '#6C5CE7' : '#FFFFFF',
              color: filter === f.key ? 'white' : '#636E72',
              boxShadow: filter === f.key ? '0 4px 14px rgba(108,92,231,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2.5px solid #6C5CE7', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        </div>
      )}

      {/* Vide */}
      {!loading && Object.keys(grouped).length === 0 && (
        <div style={{ backgroundColor: 'var(--mcc-card)', borderRadius: 14, padding: '48px 24px', textAlign: 'center', border: '0.5px solid rgba(0,0,0,0.06)' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(108,92,231,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B2BEC3" strokeWidth="1.8" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <p style={{ fontWeight: 500, color: 'var(--mcc-text)' }}>Aucune séance</p>
          <p style={{ fontSize: 13, color: 'var(--mcc-text-sec)', marginTop: 4 }}>
            {filter === 'avenir' ? "Pas de séance à venir pour l'instant" : 'Aucune séance dans cette catégorie'}
          </p>
        </div>
      )}

      {/* Groupes par mois */}
      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {Object.entries(grouped).map(([month, monthSeances]) => (
            <div key={month}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--mcc-text-sec)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                {month}
              </p>
              {/* Tableau desktop / cartes mobile */}
              <div className="hidden md:block" style={{ backgroundColor: 'var(--mcc-card)', borderRadius: 14, border: '0.5px solid rgba(0,0,0,0.06)', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--mcc-bg)' }}>
                      {['Date', 'Type', 'Durée', 'Heure', 'Statut'].map(col => (
                        <th key={col} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--mcc-text-sec)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {monthSeances.map((s, idx) => {
                      const isToday = s.date === today;
                      const badge = getBadgeStyle(s.statut, isToday);
                      const dateObj = new Date(s.date + 'T00:00:00');
                      return (
                        <tr key={s.id} style={{ borderBottom: idx < monthSeances.length - 1 ? '0.5px solid rgba(0,0,0,0.06)' : 'none' }}>
                          <td style={{ padding: '14px 16px', fontSize: 13.5, color: 'var(--mcc-text)', fontWeight: 500 }}>
                            {dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 13.5, color: 'var(--mcc-text)' }}>
                            {TYPE_LABELS[s.type] ?? s.type}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 13.5, color: 'var(--mcc-text-sec)' }}>
                            {s.duree > 0 ? `${s.duree} min` : '—'}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 13.5, color: 'var(--mcc-text-sec)' }}>
                            {s.heure?.slice(0, 5) ?? '—'}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 500, backgroundColor: badge.bg, color: badge.color }}>
                              {badge.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Cartes mobile */}
              <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {monthSeances.map((s) => {
                  const isToday = s.date === today;
                  const badge = getBadgeStyle(s.statut, isToday);
                  const borderColor = getBorderColor(s.statut, isToday);
                  const dateObj = new Date(s.date + 'T00:00:00');
                  return (
                    <motion.div
                      key={s.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      style={{
                        backgroundColor: 'var(--mcc-card)', borderRadius: 14, padding: '14px 16px',
                        border: '0.5px solid rgba(0,0,0,0.06)',
                        borderLeft: `4px solid ${borderColor}`,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                        display: 'flex', alignItems: 'center', gap: 12,
                      }}
                    >
                      {/* Badge date */}
                      <div style={{ flexShrink: 0, width: 46, textAlign: 'center' }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--mcc-text-sec)', textTransform: 'uppercase' }}>
                          {dateObj.toLocaleDateString('fr-FR', { month: 'short' })}
                        </p>
                        <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--mcc-text)', lineHeight: 1 }}>
                          {dateObj.getDate()}
                        </p>
                      </div>
                      {/* Infos */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--mcc-text)' }}>
                          {TYPE_LABELS[s.type] ?? s.type}
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--mcc-text-sec)', marginTop: 2 }}>
                          {s.heure?.slice(0, 5)}
                          {s.duree > 0 ? ` · ${s.duree} min` : ''}
                          {s.lieu ? ` · ${s.lieu}` : ''}
                        </p>
                        {s.notes && <p style={{ fontSize: 11, color: '#B2BEC3', marginTop: 2 }}>{s.notes}</p>}
                      </div>
                      {/* Badge statut */}
                      <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 500, flexShrink: 0, backgroundColor: badge.bg, color: badge.color }}>
                        {badge.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

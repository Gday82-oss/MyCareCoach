import { useState, useEffect } from 'react';
import { supabaseClient as supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

interface Props {
  client: { id: string; prenom: string; nom: string; email: string; coach_id: string; taille?: number };
}

interface Metrique {
  id: string;
  date: string;
  poids?: number;
  tour_de_taille?: number;
  tour_de_hanches?: number;
  energie?: number;
  sommeil?: number;
  note?: string;
}

function calcIMC(poids: number, tailleCm: number) {
  const m = tailleCm / 100;
  return parseFloat((poids / (m * m)).toFixed(1));
}

function imcLabel(imc: number): { label: string; color: string } {
  if (imc < 18.5) return { label: 'Sous-poids', color: '#A29BFE' };
  if (imc < 25)   return { label: 'Normal',     color: '#00B894' };
  if (imc < 30)   return { label: 'Surpoids',   color: '#FDCB6E' };
  return             { label: 'Obésité',         color: '#E17055' };
}

const TODAY = new Date().toISOString().split('T')[0];

export default function ClientMetriquesPage({ client }: Props) {
  const [metriques, setMetriques] = useState<Metrique[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [formPoids, setFormPoids] = useState('');
  const [formTaille, setFormTaille] = useState(client.taille ? String(client.taille) : '');
  const [formTDT, setFormTDT]     = useState('');
  const [formTDH, setFormTDH]     = useState('');
  const [formEnergie, setFormEnergie] = useState('');
  const [formSommeil, setFormSommeil] = useState('');
  const [formNote, setFormNote]   = useState('');
  const [formDate, setFormDate]   = useState(TODAY);
  const [submitting, setSubmitting] = useState(false);
  const [erreur, setErreur]       = useState('');
  const [success, setSuccess]     = useState(false);

  useEffect(() => { fetchMetriques(); }, []);

  async function fetchMetriques() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/client/metriques`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) { const json = await res.json(); setMetriques(json.metriques ?? []); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formPoids.trim()) { setErreur('Le poids est obligatoire.'); return; }
    setErreur(''); setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const body: Record<string, string> = { date: formDate, poids: formPoids };
      if (formTaille) {
        body.taille = formTaille;
        await fetch(`${import.meta.env.VITE_API_URL}/client/profil`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ taille: parseFloat(formTaille) }),
        });
      }
      if (formTDT)     body.tour_de_taille  = formTDT;
      if (formTDH)     body.tour_de_hanches = formTDH;
      if (formEnergie) body.energie         = formEnergie;
      if (formSommeil) body.sommeil         = formSommeil;
      if (formNote)    body.note            = formNote;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/client/metriques`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSuccess(true);
        setFormPoids(''); setFormTDT(''); setFormTDH(''); setFormEnergie(''); setFormSommeil(''); setFormNote(''); setFormDate(TODAY);
        await fetchMetriques();
        setTimeout(() => { setSuccess(false); setShowForm(false); }, 1800);
      } else {
        const json = await res.json();
        setErreur(json.error ?? "Erreur lors de l'enregistrement.");
      }
    } catch { setErreur('Erreur réseau.'); }
    finally { setSubmitting(false); }
  }

  const last = metriques[0] ?? null;
  const imc = (last?.poids && client.taille) ? calcIMC(last.poids, client.taille) : null;
  const imcInfo = imc ? imcLabel(imc) : null;

  const statCards: { label: string; value: string; extra?: string; color?: string }[] = [
    { label: 'POIDS',           value: last?.poids != null           ? `${last.poids} kg`           : '—' },
    { label: 'IMC',             value: imc != null                   ? `${imc}`                     : '—', extra: imcInfo?.label, color: imcInfo?.color },
    { label: 'TOUR DE TAILLE',  value: last?.tour_de_taille != null  ? `${last.tour_de_taille} cm`  : '—' },
    { label: 'TOUR DE HANCHES', value: last?.tour_de_hanches != null ? `${last.tour_de_hanches} cm` : '—' },
  ];

  const inputStyle: React.CSSProperties = {
    width: '100%', marginTop: 4, padding: '10px 12px',
    borderRadius: 10, border: '0.5px solid var(--mcc-border)',
    backgroundColor: 'var(--mcc-bg)', color: 'var(--mcc-text)', fontSize: 14,
    outline: 'none',
  };

  return (
    <div style={{ padding: '24px 32px', backgroundColor: 'var(--mcc-bg)', minHeight: '100%' }}
      className="!p-5 md:!p-8">

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 22, fontWeight: 500, color: 'var(--mcc-text)' }}>Mes métriques</p>
        <p style={{ fontSize: 13, color: 'var(--mcc-text-sec)', marginTop: 4 }}>Suivez l'évolution de vos mesures</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Mesures actuelles — grille 2×2 */}
        {last && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {statCards.map(({ label, value, extra, color }) => (
              <div key={label} style={{ backgroundColor: 'var(--mcc-card)', borderRadius: 14, padding: '14px 16px', border: '0.5px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: 11, color: 'var(--mcc-text-sec)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                <p style={{ fontSize: 22, fontWeight: 700, color: color ?? '#2D3436', marginTop: 6 }}>{value}</p>
                {extra && <p style={{ fontSize: 11, color: color ?? '#636E72', marginTop: 2, fontWeight: 500 }}>{extra}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Bouton saisir */}
        <button
          onClick={() => setShowForm(v => !v)}
          style={{ width: '100%', padding: '13px 24px', background: 'linear-gradient(135deg, #6C5CE7, #00CEC9)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: 'pointer' }}
        >
          {showForm ? 'Fermer' : '+ Saisir mes mesures du jour'}
        </button>

        {/* Formulaire */}
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ backgroundColor: 'var(--mcc-card)', borderRadius: 14, padding: '18px 18px', border: '0.5px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--mcc-text-sec)', fontWeight: 500 }}>Date</label>
                <input type="date" value={formDate} max={TODAY} onChange={e => setFormDate(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--mcc-text-sec)', fontWeight: 500 }}>Poids (kg) *</label>
                  <input type="number" step="0.1" min="20" max="300" placeholder="74.5" value={formPoids} onChange={e => setFormPoids(e.target.value)}
                    style={{ ...inputStyle, border: `1.5px solid ${formPoids ? '#6C5CE7' : 'rgba(0,0,0,0.1)'}` }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--mcc-text-sec)', fontWeight: 500 }}>Taille (cm)</label>
                  <input type="number" step="1" min="100" max="250" placeholder="175" value={formTaille} onChange={e => setFormTaille(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--mcc-text-sec)', fontWeight: 500 }}>Tour de taille (cm)</label>
                  <input type="number" step="0.5" placeholder="82" value={formTDT} onChange={e => setFormTDT(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--mcc-text-sec)', fontWeight: 500 }}>Tour de hanches (cm)</label>
                  <input type="number" step="0.5" placeholder="96" value={formTDH} onChange={e => setFormTDH(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--mcc-text-sec)', fontWeight: 500 }}>Énergie (1-10)</label>
                  <input type="number" min="1" max="10" placeholder="7" value={formEnergie} onChange={e => setFormEnergie(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--mcc-text-sec)', fontWeight: 500 }}>Sommeil (1-10)</label>
                  <input type="number" min="1" max="10" placeholder="8" value={formSommeil} onChange={e => setFormSommeil(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--mcc-text-sec)', fontWeight: 500 }}>Notes (optionnel)</label>
                <textarea rows={2} placeholder="Comment tu te sens ?" value={formNote} onChange={e => setFormNote(e.target.value)}
                  style={{ ...inputStyle, resize: 'none' }} />
              </div>
              {erreur && <p style={{ fontSize: 13, color: '#E17055', padding: '8px 12px', borderRadius: 8, background: 'rgba(225,112,85,0.08)' }}>{erreur}</p>}
              <button type="submit" disabled={submitting || success}
                style={{ width: '100%', padding: '13px', background: success ? '#00B894' : 'linear-gradient(135deg, #6C5CE7, #00CEC9)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                {success ? '✓ Enregistré !' : submitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </motion.form>
        )}

        {/* Historique */}
        {!loading && metriques.length > 0 && (
          <div>
            <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--mcc-text)', marginBottom: 12 }}>Historique</p>
            <div style={{ backgroundColor: 'var(--mcc-card)', borderRadius: 14, border: '0.5px solid rgba(0,0,0,0.06)', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              {metriques.slice(0, 8).map((m, idx) => {
                const prev = metriques[idx + 1];
                const diff = (prev?.poids != null && m.poids != null) ? +(m.poids - prev.poids).toFixed(1) : null;
                return (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: idx < Math.min(metriques.length, 8) - 1 ? '0.5px solid rgba(0,0,0,0.06)' : 'none', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, color: 'var(--mcc-text-sec)' }}>{new Date(m.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      {m.poids != null && (
                        <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--mcc-text)', marginTop: 2, lineHeight: 1 }}>
                          {m.poids} <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--mcc-text-sec)' }}>kg</span>
                        </p>
                      )}
                      {(m.energie != null || m.sommeil != null) && (
                        <p style={{ fontSize: 11, color: 'var(--mcc-text-sec)', marginTop: 2 }}>
                          {m.energie != null && `⚡ ${m.energie}/10`}
                          {m.energie != null && m.sommeil != null && ' · '}
                          {m.sommeil != null && `🌙 ${m.sommeil}/10`}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {diff !== null && (
                        <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
                          color: diff < 0 ? '#00B894' : diff > 0 ? '#E17055' : '#636E72',
                          background: diff < 0 ? 'rgba(0,184,148,0.1)' : diff > 0 ? 'rgba(225,112,85,0.1)' : 'rgba(0,0,0,0.04)' }}>
                          {diff > 0 ? '+' : ''}{diff} kg
                        </span>
                      )}
                      {idx === 0 && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: 'rgba(108,92,231,0.12)', color: '#6C5CE7' }}>Dernier</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && metriques.length === 0 && (
          <div style={{ backgroundColor: 'var(--mcc-card)', borderRadius: 14, padding: '40px 24px', textAlign: 'center', border: '0.5px solid rgba(0,0,0,0.06)' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(108,92,231,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="1.8" strokeLinecap="round">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
              </svg>
            </div>
            <p style={{ fontWeight: 500, color: 'var(--mcc-text)' }}>Aucune mesure enregistrée</p>
            <p style={{ fontSize: 13, color: 'var(--mcc-text-sec)', marginTop: 4 }}>Commence par saisir tes mesures du jour.</p>
          </div>
        )}

      </div>
    </div>
  );
}

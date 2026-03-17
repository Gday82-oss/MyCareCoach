import { useState, useEffect } from 'react';
import { supabaseClient as supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

interface Props {
  client: { id: string; prenom: string; nom: string; email: string; coach_id: string };
}

interface Programme {
  id: string;
  nom: string;
  description: string;
  duree_semaines?: number;
  statut?: string;
}

function stripMarkdown(text: string) {
  return text
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '• ')
    .trim();
}

export default function ClientProgramme({ client: _client }: Props) {
  const [programme, setProgramme] = useState<Programme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const res = await fetch(`${import.meta.env.VITE_API_URL}/client/programme`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const json = await res.json();
          setProgramme(json.programme ?? null);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div style={{ padding: '24px 32px', backgroundColor: 'var(--mcc-bg)', minHeight: '100%' }}
      className="!p-5 md:!p-8">

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 22, fontWeight: 500, color: 'var(--mcc-text)' }}>Mon programme</p>
        <p style={{ fontSize: 13, color: 'var(--mcc-text-sec)', marginTop: 4 }}>Votre programme d'entraînement personnalisé</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2.5px solid #6C5CE7', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : !programme ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ backgroundColor: 'var(--mcc-card)', borderRadius: 14, padding: '40px 24px', textAlign: 'center', border: '0.5px solid rgba(0,0,0,0.06)' }}
        >
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(108,92,231,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="1.8" strokeLinecap="round">
              <rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/>
              <rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>
            </svg>
          </div>
          <p style={{ fontWeight: 500, color: 'var(--mcc-text)', marginBottom: 6 }}>Aucun programme actif</p>
          <p style={{ fontSize: 13, color: 'var(--mcc-text-sec)' }}>Votre coach n'a pas encore créé de programme pour vous.</p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #6C5CE7, #00CEC9)', borderRadius: 18, padding: '22px 24px', color: 'white' }}
          >
            <div style={{ position: 'absolute', top: -30, right: -20, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
            <p style={{ fontSize: 11, opacity: 0.75, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Programme en cours</p>
            <p style={{ fontSize: 20, fontWeight: 600, marginTop: 6 }}>{programme.nom}</p>
            {programme.duree_semaines && (
              <p style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{programme.duree_semaines} semaines · {programme.statut ?? 'actif'}</p>
            )}
          </motion.div>

          {/* Contenu */}
          <div style={{ backgroundColor: 'var(--mcc-card)', borderRadius: 14, padding: '16px 18px', border: '0.5px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--mcc-text)', marginBottom: 10 }}>Détail du programme</p>
            <p style={{ fontSize: 13.5, color: 'var(--mcc-text-sec)', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
              {stripMarkdown(programme.description ?? '')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

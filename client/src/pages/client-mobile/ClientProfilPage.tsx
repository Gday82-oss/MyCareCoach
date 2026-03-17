import { useState, useEffect } from 'react';
import { supabaseClient as supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

interface Props {
  client: {
    id: string;
    prenom: string;
    nom: string;
    email: string;
    coach_id: string;
    telephone?: string;
    date_naissance?: string;
    objectifs?: string | string[];
    taille?: number;
  };
  darkMode: boolean;
  onToggleDark: (val: boolean) => void;
}

export default function ClientProfilPage({ client, darkMode, onToggleDark }: Props) {
  const [coachNom, setCoachNom] = useState('');

  const initiales = `${client.prenom[0] ?? ''}${client.nom[0] ?? ''}`.toUpperCase();

  const objectifsArr: string[] = Array.isArray(client.objectifs)
    ? client.objectifs
    : typeof client.objectifs === 'string' && client.objectifs ? [client.objectifs] : [];

  const age = client.date_naissance
    ? Math.floor((Date.now() - new Date(client.date_naissance).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null;

  useEffect(() => {
    if (!client.coach_id) return;
    (async () => {
      const { data } = await supabase.from('coachs').select('prenom, nom').eq('id', client.coach_id).maybeSingle();
      if (data) setCoachNom(`${data.prenom ?? ''} ${data.nom ?? ''}`.trim());
    })();
  }, [client.coach_id]);

  const infoRows = [
    age ? { label: 'Âge', value: `${age} ans` } : null,
    client.taille ? { label: 'Taille', value: `${client.taille} cm` } : null,
    objectifsArr.length > 0 ? { label: 'Objectif', value: objectifsArr[0] } : null,
    client.telephone ? { label: 'Téléphone', value: client.telephone } : null,
  ].filter((row): row is { label: string; value: string } => row !== null);

  return (
    <div style={{ padding: '24px 32px', backgroundColor: 'var(--mcc-bg)', minHeight: '100%' }}
      className="!p-5 md:!p-8">

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 22, fontWeight: 500, color: 'var(--mcc-text)' }}>Mon profil</p>
        <p style={{ fontSize: 13, color: 'var(--mcc-text-sec)', marginTop: 4 }}>Vos informations personnelles</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Avatar + nom */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ backgroundColor: 'var(--mcc-card)', borderRadius: 14, padding: '28px 18px', textAlign: 'center', border: '0.5px solid var(--mcc-border)', boxShadow: 'var(--mcc-shadow)' }}
        >
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6C5CE7, #00CEC9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', color: 'white', fontSize: 26, fontWeight: 700,
          }}>
            {initiales}
          </div>
          <p style={{ fontSize: 18, fontWeight: 500, color: 'var(--mcc-text)' }}>{client.prenom} {client.nom}</p>
          <p style={{ fontSize: 13, color: 'var(--mcc-text-sec)', marginTop: 4 }}>{client.email}</p>
        </motion.div>

        {/* Mon coach */}
        {coachNom && (
          <div style={{ backgroundColor: 'var(--mcc-card)', borderRadius: 14, padding: '14px 16px', border: '0.5px solid var(--mcc-border)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'var(--mcc-shadow)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(108,92,231,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="1.8" strokeLinecap="round">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 11, color: 'var(--mcc-text-sec)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mon coach</p>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--mcc-text)', marginTop: 2 }}>{coachNom}</p>
              <p style={{ fontSize: 12, color: 'var(--mcc-text-sec)' }}>Coaching santé & sport</p>
            </div>
          </div>
        )}

        {/* Informations */}
        {infoRows.length > 0 && (
          <div style={{ backgroundColor: 'var(--mcc-card)', borderRadius: 14, border: '0.5px solid var(--mcc-border)', overflow: 'hidden', boxShadow: 'var(--mcc-shadow)' }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--mcc-text-sec)', padding: '14px 16px 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Informations</p>
            {infoRows.map((row) => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '0.5px solid var(--mcc-border)' }}>
                <span style={{ fontSize: 14, color: 'var(--mcc-text-sec)' }}>{row.label}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--mcc-text)' }}>{row.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Préférences */}
        <div style={{ backgroundColor: 'var(--mcc-card)', borderRadius: 14, border: '0.5px solid var(--mcc-border)', overflow: 'hidden', boxShadow: 'var(--mcc-shadow)' }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--mcc-text-sec)', padding: '14px 16px 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Préférences</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderTop: '0.5px solid var(--mcc-border)' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--mcc-text)' }}>Mode sombre</p>
              <p style={{ fontSize: 12, color: 'var(--mcc-text-sec)', marginTop: 2 }}>Apparence sombre de l'interface</p>
            </div>
            {/* Toggle switch */}
            <button
              onClick={() => onToggleDark(!darkMode)}
              aria-label="Activer/désactiver le mode sombre"
              style={{
                width: 50, height: 28, borderRadius: 14, border: 'none',
                background: darkMode ? '#00CEC9' : 'rgba(0,0,0,0.18)',
                cursor: 'pointer', position: 'relative', flexShrink: 0,
                transition: 'background 0.2s',
              }}
            >
              <span style={{
                position: 'absolute', top: 4,
                left: darkMode ? 26 : 4,
                width: 20, height: 20, borderRadius: '50%',
                backgroundColor: 'white',
                transition: 'left 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>
        </div>

        {/* Déconnexion */}
        <button
          onClick={async () => { await supabase.auth.signOut(); window.location.href = '/client/login'; }}
          style={{ width: '100%', padding: '14px', background: 'transparent', border: '0.5px solid #E17055', color: '#E17055', borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: 'pointer', marginBottom: 8 }}
        >
          Se déconnecter
        </button>

      </div>
    </div>
  );
}

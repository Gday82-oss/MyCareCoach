import { useEffect, useState } from 'react';
import { supabaseClient as supabase } from '../../lib/supabase';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  cardio:       { bg: 'rgba(255,140,66,0.12)',  color: '#FF8C42' },
  renforcement: { bg: 'rgba(26,43,74,0.10)',    color: '#1A2B4A' },
  mobilite:     { bg: 'rgba(0,200,150,0.12)',   color: '#00C896' },
  recuperation: { bg: 'rgba(0,229,255,0.12)',   color: '#00B4CC' },
  mixte:        { bg: 'rgba(124,58,237,0.10)',  color: '#7C3AED' },
};

interface ClientSeancesProps {
  client: {
    id: string;
    prenom: string;
    nom: string;
  };
}

interface Seance {
  id: string;
  date: string;
  heure: string;
  duree: number;
  type: string;
  notes: string;
  fait: boolean;
  coach?: {
    prenom: string;
    nom: string;
  };
}

export default function ClientSeances({ client }: ClientSeancesProps) {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeances();
  }, [client.id]);

  async function fetchSeances() {
    try {
      const { data } = await supabase
        .from('seances_coach')
        .select('*, coach:coachs(prenom, nom)')
        .eq('client_id', client.id)
        .order('date', { ascending: true });

      setSeances(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }

  const seancesAFaire = seances.filter(s => !s.fait && new Date(s.date) >= new Date());
  const seancesPassees = seances.filter(s => s.fait || new Date(s.date) < new Date());

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mes séances</h1>
        <p className="text-gray-600 mt-2">Historique de vos séances sport-santé</p>
      </div>

      {/* À venir */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">À venir</h2>
        
        {seancesAFaire.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
            Aucune séance planifiée
          </div>
        ) : (
          <div className="space-y-4">
            {seancesAFaire.map((seance, idx) => (
              <motion.div
                key={seance.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-sm border-l-4 p-5"
                style={{ borderLeftColor: '#00C896', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 flex-shrink-0 rounded-xl flex flex-col items-center justify-center py-2 bg-emerald-50">
                    <span className="text-[11px] font-semibold text-emerald-600 uppercase">
                      {new Date(seance.date + 'T00:00:00').toLocaleDateString('fr-FR', { month: 'short' })}
                    </span>
                    <span className="text-xl font-bold text-emerald-600 leading-none">
                      {new Date(seance.date + 'T00:00:00').getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold capitalize"
                        style={{ backgroundColor: (TYPE_COLORS[seance.type] ?? TYPE_COLORS.mixte).bg, color: (TYPE_COLORS[seance.type] ?? TYPE_COLORS.mixte).color }}
                      >
                        {seance.type}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(0,200,150,0.12)', color: '#00C896' }}>
                        À venir
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-orange-400" />
                        {seance.heure?.slice(0, 5).replace(':', 'h')} · {seance.duree} min
                      </span>
                      {seance.coach && (
                        <span className="text-gray-400">Coach {seance.coach.prenom} {seance.coach.nom}</span>
                      )}
                    </div>
                    {seance.notes && (
                      <p className="text-xs text-gray-500 mt-1.5 italic">{seance.notes}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Historique */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Historique</h2>
        
        {seancesPassees.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
            Aucune séance passée
          </div>
        ) : (
          <div className="space-y-4">
            {seancesPassees.map((seance, idx) => (
              <motion.div
                key={seance.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl border border-gray-100 p-5"
                style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 flex-shrink-0 rounded-xl flex flex-col items-center justify-center py-2 bg-gray-100">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase">
                      {new Date(seance.date + 'T00:00:00').toLocaleDateString('fr-FR', { month: 'short' })}
                    </span>
                    <span className="text-xl font-bold text-gray-500 leading-none">
                      {new Date(seance.date + 'T00:00:00').getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold capitalize"
                        style={{ backgroundColor: (TYPE_COLORS[seance.type] ?? TYPE_COLORS.mixte).bg, color: (TYPE_COLORS[seance.type] ?? TYPE_COLORS.mixte).color }}
                      >
                        {seance.type}
                      </span>
                      {seance.fait
                        ? <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-gray-100 text-gray-500">Réalisée</span>
                        : <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-gray-100 text-gray-400">Manquée</span>
                      }
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock size={13} />{seance.heure?.slice(0, 5).replace(':', 'h')} · {seance.duree} min
                      </span>
                      {seance.coach && (
                        <span>Coach {seance.coach.prenom} {seance.coach.nom}</span>
                      )}
                    </div>
                    {seance.notes && (
                      <p className="text-xs text-gray-400 mt-1.5 italic">{seance.notes}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
